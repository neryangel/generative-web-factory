# Architecture Review - Generative Web Factory

**Review Date:** January 2026
**Scope:** Foundation & Infrastructure Assessment
**Focus:** Scalability, Best Practices, Modularity, Security & Performance

---

## Executive Summary

The codebase demonstrates a solid architectural foundation for a multi-tenant SaaS application. The database schema with RLS policies, React Query data layer, and component organization are well-structured. However, I've identified **7 critical issues** and **12 improvements** that should be addressed before scaling to enterprise size.

---

## CRITICAL ISSUES (Must Fix)

### 1. TypeScript Strict Mode Disabled - HIGH PRIORITY

**Location:** `tsconfig.json:14`, `tsconfig.app.json:19-23`

```json
{
  "strict": false,
  "strictNullChecks": false,
  "noImplicitAny": false
}
```

**Problem:** Disabled strict mode eliminates TypeScript's most valuable safety guarantees. This will:
- Allow `null` and `undefined` to flow unchecked through the codebase
- Permit implicit `any` types that bypass type checking entirely
- Accumulate hidden type errors that surface as runtime bugs at scale

**Fix:** Enable strict mode incrementally:
```json
{
  "strict": true,
  "strictNullChecks": true,
  "noImplicitAny": true
}
```

**Migration Strategy:**
1. Enable `strictNullChecks` first - this catches the most bugs
2. Run `tsc --noEmit` to find all violations
3. Fix violations or add explicit type annotations
4. Enable `noImplicitAny` second
5. Enable full `strict` mode last

---

### 2. Edge Functions Have `verify_jwt = false` - SECURITY RISK

**Location:** `supabase/config.toml:3-13`

```toml
[functions.generate-site]
verify_jwt = false

[functions.get-published-site]
verify_jwt = false

[functions.verify-domain]
verify_jwt = false

[functions.manage-vercel-domain]
verify_jwt = false
```

**Problem:** All edge functions bypass JWT verification. While `get-published-site` may legitimately need public access, `manage-vercel-domain` and `verify-domain` should require authentication.

**Fix:** Enable JWT verification for sensitive functions:
```toml
[functions.generate-site]
verify_jwt = true

[functions.verify-domain]
verify_jwt = true

[functions.manage-vercel-domain]
verify_jwt = true

# Only public-facing function
[functions.get-published-site]
verify_jwt = false
```

---

### 3. Wildcard CORS in Edge Functions - SECURITY RISK

**Location:** `supabase/functions/get-published-site/index.ts:4-7`

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

**Problem:** Wildcard CORS (`*`) allows any origin to access these endpoints, which can be exploited for:
- CSRF attacks
- Data exfiltration from authenticated sessions
- API abuse

**Fix:** Restrict to known origins:
```typescript
const ALLOWED_ORIGINS = [
  'https://amdir.app',
  'https://www.amdir.app',
  process.env.NODE_ENV === 'development' && 'http://localhost:3000',
].filter(Boolean);

const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Credentials": "true",
});
```

---

### 4. Package Name is Generic - MAINTENANCE ISSUE

**Location:** `package.json:2`

```json
{
  "name": "vite_react_shadcn_ts"
}
```

**Problem:** This looks like a template/starter name. It will cause conflicts in npm workspaces and makes it harder to identify in logs/monitoring.

**Fix:**
```json
{
  "name": "@amdir/web-factory",
  "version": "0.1.0"
}
```

---

### 5. Missing Environment Variable Validation

**Location:** `src/integrations/supabase/client.ts:6-16`

```typescript
const getEnvVar = (viteKey: string, nextKey: string): string => {
  // ... returns empty string if not found
  return '';
};
```

**Problem:** If environment variables are missing, the app silently fails with an empty Supabase URL, leading to confusing runtime errors.

**Fix:** Add explicit validation:
```typescript
const getEnvVar = (viteKey: string, nextKey: string): string => {
  const value = /* existing logic */;

  if (!value) {
    throw new Error(
      `Missing environment variable: ${viteKey} or ${nextKey}. ` +
      `Ensure your .env file is configured correctly.`
    );
  }
  return value;
};
```

---

### 6. Dual Toast System - REDUNDANT

**Location:** `app/providers.tsx:5-6, 16-17`

```tsx
import { Toaster } from '@/components/ui/sonner';
import { Toaster as ToasterUI } from '@/components/ui/toaster';
// ...
<Toaster />
<ToasterUI />
```

**Problem:** Two different toast systems are mounted. This:
- Increases bundle size
- Can cause inconsistent UX
- May cause z-index conflicts

**Fix:** Choose one (Sonner is more modern) and remove the other:
```tsx
import { Toaster } from '@/components/ui/sonner';
// Remove ToasterUI
```

---

### 7. BrowserRouter Inside Next.js - ARCHITECTURAL CONFLICT

**Location:** `app/dashboard/layout.tsx:44`

```tsx
return <BrowserRouter>{children}</BrowserRouter>;
```

**Problem:** Using React Router's BrowserRouter inside Next.js App Router creates:
- Two competing routing systems
- Hydration mismatches (hence the `mounted` workaround)
- Inability to use Next.js features (middleware, layouts, server components) for dashboard routes
- SEO and deep-linking issues

**Impact:** This is the most significant architectural decision to reconsider. The current workaround (`ClientOnlyRouter`) adds complexity and latency.

**Recommendation:** Either:
1. **Migrate dashboard to Next.js App Router** (recommended for new projects)
2. **Keep separate React app for dashboard** via subdomain (e.g., `app.amdir.app`)

---

## RECOMMENDED IMPROVEMENTS

### 8. Add Query Client Configuration

**Location:** `app/providers.tsx:10`

```tsx
const [queryClient] = useState(() => new QueryClient());
```

**Problem:** Using default React Query settings. For production SaaS, you need:
- Appropriate stale times
- Error retry logic
- Global error handling

**Fix:**
```typescript
const [queryClient] = useState(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // Prevent excessive refetches
    },
    mutations: {
      retry: false,
    },
  },
}));
```

---

### 9. Add Error Boundaries

**Problem:** No React error boundaries exist. A single component crash takes down the entire app.

**Fix:** Add error boundaries at strategic points:
- Root level (catch-all)
- Dashboard level (protect editor from auth issues)
- Editor level (protect preview from section rendering bugs)

---

### 10. Tenant Fetch Has N+1 Query Pattern

**Location:** `src/hooks/useTenant.tsx:40-61`

```typescript
// Query 1: Get memberships
const { data: memberships } = await supabase
  .from('tenant_members')
  .select('tenant_id, role')
  .eq('user_id', user.id);

// Query 2: Get tenants
const { data: tenantData } = await supabase
  .from('tenants')
  .select('*')
  .in('id', tenantIds);
```

**Fix:** Use a single query with joins:
```typescript
const { data } = await supabase
  .from('tenant_members')
  .select(`
    role,
    tenant:tenants(*)
  `)
  .eq('user_id', user.id);
```

---

### 11. Missing Index on Sites Slug (Global Lookup)

**Location:** Database schema

The `sitesApi.getBySlug()` queries sites by slug without tenant filter, but there's no global unique constraint or index on `slug` alone.

**Fix:** Add migration:
```sql
CREATE UNIQUE INDEX idx_sites_slug_global ON sites(slug);
```

---

### 12. Add Rate Limiting to Edge Functions

**Location:** All edge functions

**Problem:** No rate limiting means endpoints are vulnerable to:
- Brute force attacks
- Resource exhaustion
- Cost spikes from abuse

**Fix:** Add rate limiting via Supabase or Vercel edge config.

---

### 13. Missing Optimistic Updates

**Location:** `src/hooks/queries/useSites.ts:62-73`

```typescript
onSuccess: (data) => {
  queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY });
  queryClient.setQueryData([...SITES_QUERY_KEY, data.id], data);
},
```

**Problem:** Updates wait for server response before reflecting in UI.

**Fix:** Add optimistic updates for better UX:
```typescript
onMutate: async (variables) => {
  await queryClient.cancelQueries({ queryKey: SITES_QUERY_KEY });
  const previous = queryClient.getQueryData([...SITES_QUERY_KEY, variables.siteId]);
  queryClient.setQueryData([...SITES_QUERY_KEY, variables.siteId], old => ({
    ...old,
    ...variables.updates,
  }));
  return { previous };
},
onError: (err, variables, context) => {
  queryClient.setQueryData([...SITES_QUERY_KEY, variables.siteId], context?.previous);
},
```

---

### 14. Add Database Connection Pooling Config

**Location:** Supabase configuration

For high-traffic scenarios, ensure connection pooling is configured appropriately in Supabase dashboard.

---

### 15. Helper Functions Should Be Pure

**Location:** `src/lib/helpers.ts:148`

```typescript
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
```

**Problem:** Uses `Math.random()` which is not cryptographically secure and can produce collisions.

**Fix:**
```typescript
export function generateId(): string {
  return crypto.randomUUID();
}
```

---

### 16. Missing Security Headers

**Location:** `next.config.mjs`

**Fix:** Add security headers:
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ];
},
```

---

### 17. ESLint Has Disabled Rules

**Location:** `eslint.config.js:23`

```javascript
"@typescript-eslint/no-unused-vars": "off",
```

**Problem:** Unused variables indicate dead code and potential bugs.

**Fix:** Enable the rule:
```javascript
"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
```

---

### 18. Missing Loading States for Mutations

**Location:** Various mutation hooks

**Problem:** Mutations don't expose loading states to prevent double-submissions.

**Fix:** Use `isPending` from mutation hooks:
```tsx
const { mutate, isPending } = useCreateSite();
<Button disabled={isPending}>
  {isPending ? 'Creating...' : 'Create Site'}
</Button>
```

---

### 19. Add API Layer Index Export

**Location:** `src/api/index.ts`

Consider adding a barrel export for cleaner imports:
```typescript
export { sitesApi } from './sites.api';
export { pagesApi } from './pages.api';
// etc.
```

---

## WHAT'S DONE WELL

### Database Architecture
- Proper multi-tenant schema with `tenant_id` on all tables
- Row-Level Security (RLS) enabled and properly configured
- Helper functions (`is_tenant_member`, `has_tenant_role`) reduce policy duplication
- Appropriate indexes on frequently queried columns
- Triggers for `updated_at` timestamps and auto-membership on tenant creation

### Code Organization
- Clear separation: `api/` → `hooks/queries/` → `components/`
- Types derived from Supabase schema ensure DB-code alignment
- Context providers properly scoped (Auth, Tenant, Editor)
- Components organized by domain (editor, landing, site, common)

### Security Baseline
- `poweredByHeader: false` in Next.js config
- RLS policies enforce tenant isolation at the database level
- RBAC with owner/admin/editor/viewer roles
- Auth state properly managed with Supabase listeners

### Developer Experience
- Testing infrastructure in place (Vitest + React Testing Library)
- TypeScript throughout
- shadcn/ui provides consistent, accessible components
- React Query for server state management

---

## SCALABILITY ASSESSMENT

| Aspect | Current State | At 10K Users | At 100K Users |
|--------|--------------|--------------|---------------|
| Database | ✅ RLS + indexes | ✅ Should scale | ⚠️ May need read replicas |
| API Layer | ✅ Supabase handles pooling | ✅ Fine | ⚠️ Consider edge caching |
| Frontend | ⚠️ No code splitting visible | ⚠️ Add lazy loading | ⚠️ CDN + aggressive caching |
| Auth | ✅ Supabase Auth scales | ✅ Fine | ✅ Fine |
| Multi-tenancy | ✅ Proper isolation | ✅ Fine | ⚠️ Consider tenant sharding |

---

## PRIORITY ORDER

1. **Enable TypeScript strict mode** - Prevents bug accumulation
2. **Fix Edge Function security** - JWT verification + CORS
3. **Add environment validation** - Better DX and debugging
4. **Resolve React Router conflict** - Long-term architecture decision
5. **Add error boundaries** - Prevent cascading failures
6. **Add security headers** - Quick win for security posture

---

## CONCLUSION

The foundation is **solid** with proper multi-tenancy, RLS, and modern tooling. The critical issues identified are primarily around TypeScript strictness, security configurations, and the routing architecture decision. Addressing these before scaling will prevent accumulation of technical debt.

The codebase follows industry patterns for a Supabase-backed SaaS application. The recommended improvements are optimizations rather than fundamental changes (except for the BrowserRouter consideration).
