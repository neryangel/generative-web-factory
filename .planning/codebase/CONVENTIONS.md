# Codebase Conventions

## Code Style & Formatting

### TypeScript Configuration
- **Strict Mode**: Enterprise-grade strict type checking enabled
  - `strict: true`
  - `strictNullChecks: true`
  - `noImplicitAny: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`

### ESLint Rules
Configuration: `/Users/user/generative-web-factory/eslint.config.js`

**Key Rules:**
- React Hooks rules enforced
- Type imports preferred: `import type { X } from 'module'`
- Unused variables with underscore prefix allowed: `const _unused = ...`
- Type imports use separate-type-imports style: `import { type User } from '@/types'`
- No floating promises: All async operations must be awaited or explicitly ignore with `void`
- Promise return values must be handled: `await promise` or `promise.catch(...)`

**Sort Imports:**
- Allow logical grouping (ignoreDeclarationSort: true)
- Members must be sorted alphabetically
- Separate type imports from value imports

## File Naming Conventions

### API Files
- Pattern: `<domain>.api.ts`
- Examples: `/Users/user/generative-web-factory/src/api/domains.api.ts`, `sites.api.ts`, `pages.api.ts`
- Structure: Single object export with async methods

### Components
- Pattern: PascalCase, `.tsx` extension
- UI Components: `/src/components/ui/` (Radix UI primitives)
- Feature Components: `/src/components/<feature>/`
- Example: `/Users/user/generative-web-factory/src/components/tenant/CreateTenantDialog.tsx`

### Custom Hooks
- Pattern: `use<Feature>.tsx` or `use<Feature>.ts`
- Location: `/src/hooks/`
- Query hooks: `/src/hooks/queries/`
- Examples: `useAuth.tsx`, `useTenant.tsx`, `useAutoSave.tsx`, `useSites.ts`

### Types
- Pattern: `<domain>.types.ts`
- Location: `/src/types/`
- Examples: `/src/types/api.types.ts`, `site.types.ts`, `section.types.ts`
- Generated types: `/src/integrations/supabase/types.ts` (from Supabase schema)

### Tests
- Pattern: `<filename>.test.ts` or `<filename>.test.tsx`
- Location: Co-located with source files OR `__tests__/` subdirectory
- Examples:
  - `/src/api/domains.api.test.ts` (same directory)
  - `/src/components/accessibility/__tests__/ReadingMask.test.tsx` (subdirectory)

### Library Files
- Pattern: `<utility>.ts` (no "utils" prefix, use specific names)
- Examples: `helpers.ts`, `logger.ts`, `api-error.ts`, `utils.ts`

## Naming Patterns

### Functions
- Async functions: Verb-first pattern
  - `getBySiteId(siteId: string)`
  - `create(data: Domain)`
  - `verify(domainId: string)`
  - `formatDate(date: Date)`

### Variables & Constants
- React state: `const [name, setName] = useState(...)`
- Map/Set types: Plural when appropriate
  - `entityVersions = new Map<string, number>()`
  - `pendingOperations = useRef<Map<string, SaveOperation>>(new Map())`

### Component Props
- Interface pattern: `<ComponentName>Props`
- Example: `/src/components/tenant/CreateTenantDialog.tsx`
```typescript
interface CreateTenantDialogProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}
```

## Import Organization

### Order of Imports
1. **External libraries**: React, third-party packages
   ```typescript
   import { useState, useEffect, ReactNode } from 'react';
   import { useQuery } from '@tanstack/react-query';
   ```

2. **Type imports**: Typed values
   ```typescript
   import type { User, Session } from '@supabase/supabase-js';
   import type { Domain } from '@/types/api.types';
   ```

3. **Internal imports**: Path alias `@/`
   ```typescript
   import { supabase } from '@/integrations/supabase/client';
   import { domainsApi } from '@/api/domains.api';
   import { Button } from '@/components/ui/button';
   ```

4. **CSS/Assets**: Last
   ```typescript
   import './style.css';
   ```

### Path Aliases
- `@/` resolves to `./src/`
- Configured in: `/src/tsconfig.app.json`, `/src/vitest.config.ts`

### Type Imports
- Always use `import type { X }` for types
- Prevents tree-shaking issues
- Enforced by ESLint rule `@typescript-eslint/consistent-type-imports`

## Error Handling

### Error Classification
Custom error class: `/src/lib/api-error.ts`

**ApiErrorCode Types:**
- `NETWORK_ERROR`: Connection issues
- `AUTH_ERROR`: Authentication/JWT issues
- `FORBIDDEN`: Permission denied (403)
- `NOT_FOUND`: Resource not found (404)
- `VALIDATION_ERROR`: Data validation failure
- `CONFLICT`: Duplicate/constraint violation (409)
- `RATE_LIMITED`: Too many requests (429)
- `SERVER_ERROR`: Server-side errors (5xx)
- `UNKNOWN`: Unclassified errors

### Error Structure
```typescript
interface ApiErrorDetails {
  code: ApiErrorCode;
  message: string;
  originalError?: unknown;
  hint?: string;
  retryable: boolean;
}

// Usage
throw new ApiError({
  code: 'NOT_FOUND',
  message: 'Domain not found',
  retryable: false,
});
```

### User Messages
- Errors include `getUserMessage()` method returning Hebrew messages
- Example from `/src/lib/api-error.ts`:
  ```typescript
  case 'NETWORK_ERROR':
    return 'בעיית חיבור לרשת. אנא בדוק את החיבור לאינטרנט ונסה שוב.';
  case 'VALIDATION_ERROR':
    return 'הנתונים שהוזנו אינם תקינים. אנא בדוק ונסה שוב.';
  ```

### Async/Await Patterns
- All async operations must be awaited
- Errors are thrown and caught with try/catch
- Example from `/src/api/domains.api.ts`:
  ```typescript
  async getBySiteId(siteId: string): Promise<Domain[]> {
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  }
  ```

### Error Handling in Components
- Try/finally blocks to manage loading state
- Toast notifications for user feedback
- Example from `/src/components/tenant/CreateTenantDialog.tsx`:
  ```typescript
  try {
    const { data, error } = await createTenant(name.trim(), slug.trim());

    if (error) {
      if (error.message?.includes('duplicate')) {
        toast.error('שם הארגון כבר קיים, נסה שם אחר');
      }
    }
  } finally {
    setLoading(false);
  }
  ```

## Logging

### Logger Strategy
File: `/src/lib/logger.ts`

- **Development**: Log everything (log, warn, debug)
- **Production**: Only errors logged
- `logger.error()` always logged (both environments)

```typescript
logger.log('Debug info only in development');
logger.warn('Warning only in development');
logger.error('Always logged - indicates real problems');
```

## Comments & Documentation

### Comment Style
- JSDoc for public functions and API methods
- Inline comments for complex logic
- Example from `/src/api/domains.api.ts`:
  ```typescript
  /**
   * Get all domains for a site
   */
  async getBySiteId(siteId: string): Promise<Domain[]>

  /**
   * Verify a domain (triggers edge function)
   */
  async verify(domainId: string): Promise<Domain>
  ```

### Inline Comments
- Explain "why", not "what"
- Example from `/src/hooks/useAuth.tsx`:
  ```typescript
  // Set up auth state listener FIRST
  const { data: { subscription } } = supabase.auth.onAuthStateChange(...)

  // THEN check for existing session
  supabase.auth.getSession().then(...)
  ```

## Internationalization (i18n)

- Hebrew (RTL) support throughout
- Text content in Hebrew in UI components
- HTML `dir` attributes for RTL: `<div dir="rtl">`
- Example: `/src/components/tenant/CreateTenantDialog.tsx` line 86

## Code Patterns

### Data Transformation
- Slug generation: `toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')`
- Color conversion: `hexToHsl()`, `hexToHslString()`
- File operations: `getFileExtension()`, `formatFileSize()`
- Time formatting: `formatDate()`, `formatDateTime()`, `formatRelativeTime()`

### Utility Functions
- Centralized in `/src/lib/helpers.ts` and `/src/lib/utils.ts`
- Pure functions without side effects
- Comprehensive test coverage
- Example: `/src/lib/utils.ts` - `cn()` for class name merging using `clsx` and `tailwind-merge`

### State Management Patterns
- React Context for global state (e.g., AuthProvider, TenantProvider)
- React Query for server state (TanStack Query v5)
- Local state with `useState` for component-level UI state
- Refs for non-rendering state with `useRef`

### API Client Pattern
- Supabase client: `/src/integrations/supabase/client.ts`
- Mocked in tests with `vi.mock()`
- Consistent error handling with `if (error) throw error;`
