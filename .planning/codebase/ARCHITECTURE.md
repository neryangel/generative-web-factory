# AMDIR Web Factory - Architecture Documentation

## Overview

AMDIR Web Factory is a full-stack web application for building professional websites with AI assistance. It's built as a Next.js 16 application using TypeScript, React 18, Supabase, and modern UI libraries.

**Key Project Goals:**
- Enable users to create professional websites quickly
- Multi-tenant SaaS architecture with tenant isolation
- Real-time site editing and publishing
- Custom domain support with automatic Vercel integration
- Accessibility-first design with WCAG compliance
- RTL (Hebrew) language support

---

## Architecture Layers

### 1. Presentation Layer (React Components)

**Location:** `/src/components/`, `/app/`

The UI is organized into logical feature domains:

#### Landing & Marketing Components
- **`/src/components/landing/`** - Marketing pages
  - `Navbar.tsx`, `HeroSection.tsx`, `Footer.tsx`
  - Portfolio, features, testimonials, FAQ sections
  - Built with performance optimizations (lazy loading, code splitting)

#### Editor Components
- **`/src/components/editor/`** - Site editing interface
  - `SectionRenderer.tsx` - Renders different section types
  - Section components: `HeroSection.tsx`, `FeaturesSection.tsx`, etc.
  - `EditableText.tsx`, `ImagePickerDialog.tsx` - Content editing tools
  - `ThemeCustomizer.tsx` - Style customization
  - `SortableSectionList.tsx` - Drag-and-drop section reordering (dnd-kit)

#### Dashboard Components
- **`/src/components/layout/`** - Dashboard layout shell
- **`/src/components/domain/`** - Domain management
- **`/src/components/site/`** - Site rendering and settings
- **`/src/components/templates/`** - Template browsing and preview

#### Accessibility
- **`/src/components/accessibility/`** - WCAG-compliant widget
  - Admin panel for managing settings
  - Profiles for different accessibility needs
  - Color blindness, reading masks, dyslexia support

#### Common UI Components
- **`/src/components/ui/`** - Shadcn/UI component library (Radix UI primitives)
- **`/src/components/common/`** - Reusable patterns
  - `ErrorBoundary.tsx` - Global error handling
  - `ConfirmDialog.tsx`, `EmptyState.tsx`, `LoadingSpinner.tsx`

---

### 2. Data Management Layer

#### State Management Architecture

**Global State:**
- **Auth Context** (`/src/hooks/useAuth.tsx`) - User authentication state
  - Managed by Supabase Auth
  - Handles session persistence and auto-refresh

- **Tenant Context** (`/src/hooks/useTenant.tsx`) - Multi-tenant selection
  - Persists current tenant to localStorage
  - Provides context to all child components

- **Editor Context** (`/src/contexts/EditorContext.tsx`) - Site editor state
  - Selected section tracking
  - Preview/edit mode toggle
  - View mode (desktop/mobile/tablet)

**Local State:**
- Component-level state via React hooks (`useState`)
- Form state via React Hook Form with Zod validation

#### React Query (TanStack Query)

**Location:** `/src/hooks/queries/`, `/src/api/`

Query caching with automatic invalidation:

```
User Action → Mutation (Create/Update/Delete)
                    ↓
            Invalidate Query Cache
                    ↓
            Re-fetch from API
                    ↓
            Update Component State
```

**Query Key Pattern** (`/src/lib/query-keys.ts`):
- Hierarchical: `['domain', 'scope', ...identifiers]`
- Example: `['sites', 'detail', 'site-123']`
- Prevents cache collisions and enables precise invalidation

---

### 3. API Layer

**Location:** `/src/api/`

Service-based architecture with Zod validation:

```
sites.api.ts      → CRUD operations for sites
pages.api.ts      → Page management
sections.api.ts   → Section content management
templates.api.ts  → Template library
domains.api.ts    → Custom domain handling
publishes.api.ts  → Publishing operations
tenants.api.ts    → Multi-tenant management
```

**Pattern:**
```typescript
// Input validation with Zod
const validTenantId = uuidSchema.parse(tenantId);

// API call via Supabase client
const { data, error } = await supabase
  .from('sites')
  .select('*')
  .eq('tenant_id', validTenantId);

// Error handling with parseSupabaseError
if (error) throw parseSupabaseError(error);
```

**Key Files:**
- `/src/api/index.ts` - Barrel export
- `/src/lib/api-error.ts` - Error normalization
- `/src/lib/query-keys.ts` - Query cache keys

---

### 4. Backend Integration

#### Supabase Client
**Location:** `/src/integrations/supabase/client.ts`

- Initialized with NEXT_PUBLIC_* environment variables
- Automatic session persistence with localStorage
- Auto token refresh on expiry
- Real-time subscriptions support (not currently used)

#### Database Types
**Location:** `/src/integrations/supabase/types.ts`

Generated from Supabase schema using `supabase gen types typescript`.

#### Data Models
**Location:** `/src/types/`

Core type definitions:
- `site.types.ts` - Site, Page, Section models
- `section.types.ts` - Section type variants
- `theme.types.ts` - Theme and styling
- `api.types.ts` - API-specific types
- `schemas.ts` - Zod schemas for validation

---

### 5. Routing & Navigation

#### App Router (Next.js 13+)
**Location:** `/app/`

```
/app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout (metadata, providers)
├── dashboard/
│   ├── page.tsx                # Dashboard home
│   ├── sites/
│   │   ├── page.tsx            # Sites list
│   │   ├── new/page.tsx        # Create new site
│   │   └── [siteId]/page.tsx   # Edit site
│   └── settings/page.tsx       # User settings
├── s/[slug]/                   # Preview routes (short URLs)
├── sites/[domain]/             # Custom domain routes
└── not-found.tsx               # 404 page
```

#### Middleware
**Location:** `/middleware.ts`

Custom domain routing:
1. Extract hostname from request
2. Validate domain against regex (RFC 1123)
3. Check if domain is app domain (localhost, amdir.app, etc.)
4. If custom domain: rewrite to `/sites/[domain]` route
5. Database lookup for domain→site mapping

---

### 6. Hooks & Custom Logic

**Location:** `/src/hooks/`

#### Query Hooks
- `useSites()` - Fetch sites for current tenant
- `useSite(siteId)` - Fetch single site with auto-enable
- `usePages()`, `useSections()` - Content hierarchy
- `useTemplates()` - Template browsing
- `useTenants()` - Tenant list

#### Mutation Hooks
- `useCreateSite()`, `useUpdateSite()`, `useDeleteSite()`
- Cache invalidation on success
- Auto-update query data

#### Custom Hooks
- `useAuth()` - Authentication state & methods
- `useTenant()` - Tenant context provider
- `useAutoSave()` - Debounced auto-saving
- `useNavigation()` - URL-based navigation
- `useScrollAnimation()`, `useParallax()` - Animation helpers

---

### 7. View/Page Components

**Location:** `/src/views/`

High-level page compositions that orchestrate data fetching:

- `Dashboard.tsx` - Main dashboard UI with sites list
- `SiteEditor.tsx` - Full-featured site editor
  - Manages sections, theme, publishing
  - Coordinates between context and API layers
- `NewSite.tsx` - New site creation wizard
  - Template selection
  - AI prompt generation
  - Initial content generation
- `PublicSite.tsx` - Public site display
  - Renders published content
  - No editing capabilities
- `Settings.tsx` - User preferences
- `Sites.tsx` - Sites management list

---

## Data Flow Examples

### Create New Site

```
User Input (NewSite.tsx)
    ↓
useCreateSite() mutation
    ↓
sitesApi.create(siteData)  [Zod validation]
    ↓
supabase.from('sites').insert()
    ↓
Server response with new site
    ↓
React Query invalidates [sites] cache
    ↓
useSites() re-fetches
    ↓
Component re-renders with new site
```

### Edit Site Content

```
User edits section (SectionRenderer.tsx)
    ↓
EditorContext updates selectedSectionId
    ↓
useAutoSave() debounces (1s default)
    ↓
useUpdateSection() mutation
    ↓
sectionsApi.update(sectionId, content)  [Zod validation]
    ↓
React Query updates cache optimistically
    ↓
useSection() hook receives updated data
    ↓
Section component re-renders
```

### Publish Site

```
User clicks Publish (SiteEditor.tsx)
    ↓
usePublishSite() mutation
    ↓
publishesApi.publish(siteId)
    ↓
Supabase Edge Function: /generate-site
    ↓
- Fetch all content
    - Render HTML/CSS
    - Upload to Vercel
    ↓
Server response with public URL
    ↓
React Query cache updated
    ↓
Redirect to public site
```

---

## Key Abstractions & Patterns

### 1. Query Key Factory Pattern
Prevents cache collisions with hierarchical keys:
```typescript
queryKeys.sites.detail(siteId)  // ['sites', 'detail', 'site-123']
queryKeys.pages.list(siteId)    // ['pages', 'list', 'site-123']
```

### 2. Conditional Query Enabling
```typescript
enabled: !!siteId && !!currentTenant
// Only runs query when dependencies are available
```

### 3. Barrel Exports
- `/src/api/index.ts` - All API services
- `/src/types/index.ts` - All types
- Clean imports: `import { sitesApi } from '@/api'`

### 4. Zod Schema Validation
- Runtime input validation before API calls
- Automatic type inference: `type Site = z.infer<typeof siteSchema>`
- Prevents invalid data from reaching database

### 5. Section Component Registry
```typescript
const sectionComponents: Record<string, React.ComponentType<SectionProps>> = {
  hero: HeroSection,
  features: FeaturesSection,
  // ...
};

function SectionRenderer(props) {
  const Component = sectionComponents[props.type];
  return <Component {...props} />;
}
```

Allows dynamic rendering of section types without hardcoded conditionals.

### 6. Error Boundary Pattern
Three-tier error handling:
1. Global `ErrorBoundary` in root layout
2. Page-level `PageErrorBoundary`
3. Component-level error states

### 7. Multi-Tenant Context Pattern
```typescript
// Auth → Tenant selection → Scoped queries
const { user } = useAuth();
const { currentTenant } = useTenant();
const { data } = useSites(currentTenant?.id);
```

---

## Entry Points

### 1. Browser Entry Point
- `/app/layout.tsx` → `/app/providers.tsx` → Component tree
- Providers setup: QueryClient, Theme, Auth, Toast

### 2. API Entry Points
- `/src/api/*.ts` - Each file exports public service methods
- Accessed via hooks in components

### 3. Server Entry Points
- `/supabase/functions/` - Edge functions for heavy operations
- `generate-site/` - HTML/CSS generation
- `manage-vercel-domain/` - Domain registration
- `get-published-site/` - Content retrieval

### 4. Middleware Entry Point
- `/middleware.ts` - Custom domain routing

---

## Security Architecture

### 1. Authentication
- Supabase Auth (email/password, OAuth)
- Session persistence with auto-refresh
- User state managed in React context

### 2. Authorization
- Tenant isolation: queries filtered by `tenant_id`
- RLS (Row Level Security) on Supabase tables
- Tenant context used in all mutations

### 3. Input Validation
- Zod schemas validate all API inputs
- Domain validation in middleware
- Sanitization with dompurify for user content

### 4. Content Security Policy
- Strict CSP headers in `next.config.mjs`
- `unsafe-inline` only for styles (Tailwind requirement)
- External resources whitelisted: fonts, Supabase CDN

### 5. Headers
- HSTS, X-Frame-Options, X-Content-Type-Options
- Referrer policy, Permissions policy
- Prevent MIME sniffing and XSS

---

## Performance Optimizations

### 1. Code Splitting
- Lazy-loaded components with React.lazy()
- Suspense boundaries with skeleton fallbacks
- Landing page: Hero eager, rest lazy-loaded

### 2. Image Optimization
- Next.js Image component where applicable
- Remote pattern allows Supabase and Unsplash
- Optimized responsive images

### 3. Query Caching
- React Query default stale time: 5 minutes
- Manual cache invalidation on mutations
- Optimistic updates for better UX

### 4. Bundle Optimization
- Tree-shaking enabled (ES modules)
- Tailwind CSS purging
- Dynamic imports for heavy components

### 5. Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Color contrast compliance

---

## Development Patterns

### Testing
- Unit tests: Vitest + React Testing Library
- Location: `__tests__` directories next to components
- API mocks: `/src/test/mocks/supabase.mock.ts`
- Setup: `/src/test/setup.ts`

### Type Safety
- Strict TypeScript (`tsconfig.json`: `strict: true`)
- Zod schema inference: `z.infer<typeof schema>`
- Generated Supabase types: `Database` interface

### Code Organization
- Feature-based: components grouped by domain
- Barrel exports reduce import paths
- Utilities separated into `/src/lib/`
- Hooks isolated in `/src/hooks/`

### Configuration
- Environment variables: `.env.example` documented
- Next.js config: `next.config.mjs`
- TypeScript: `tsconfig.json` + `tsconfig.app.json`
- Tailwind: `tailwind.config.ts`

---

## Dependency Graph Summary

```
App Providers (Root)
├── ErrorBoundary
├── QueryClientProvider
│   ├── Auth Provider (Supabase)
│   │   └── Tenant Provider (Context)
│   │       └── Theme Provider
│   │           └── UI Components
│   └── React Query
│       └── API Layer (sites.api, pages.api, etc.)
│           └── Supabase Client
└── ToastProvider
    └── AccessibilityWidget
```

---

## Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI rendering |
| Framework | Next.js 16 | App router, SSR, API routes |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| UI Components | Shadcn/UI | Accessible component library |
| State | React Context | Global state (Auth, Tenant) |
| Data Fetching | React Query | Server state caching |
| Forms | React Hook Form | Form state management |
| Validation | Zod | Schema validation |
| Backend | Supabase | Database, Auth, Storage |
| Drag & Drop | dnd-kit | Section reordering |
| Animation | Framer Motion | Smooth animations |
| Icons | Lucide React | Icon library |
