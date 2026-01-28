# AMDIR Web Factory - Directory Structure & File Locations

## Project Root Structure

```
/Users/user/generative-web-factory/
├── app/                          # Next.js App Router pages
├── src/                          # Source code (React components, types, hooks, utilities)
├── supabase/                     # Supabase configuration and edge functions
├── api/                          # API route handlers (legacy, partial)
├── public/                       # Static assets (favicons, images)
├── .planning/                    # Documentation and planning
├── .claude/                      # Claude IDE configuration
├── .git/                         # Git repository
├── middleware.ts                 # Next.js middleware (custom domain routing)
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript root config
├── tsconfig.app.json             # TypeScript app config
├── tailwind.config.ts            # Tailwind CSS config
├── package.json                  # Dependencies and scripts
├── vitest.config.ts              # Vitest testing config
├── eslint.config.js              # ESLint configuration
├── components.json               # Shadcn/UI configuration
└── .env.example                  # Environment variable template
```

---

## `/app` - Next.js App Router (Pages & Layouts)

```
/app/
├── layout.tsx                    # Root layout (metadata, providers, globals.css)
├── page.tsx                      # Home page (landing page, '/')
├── not-found.tsx                 # 404 error page
├── providers.tsx                 # Providers setup (QueryClient, Theme, Auth, Toast)
├── globals.css                   # Global styles
│
├── dashboard/                    # Dashboard routes (/dashboard/*)
│   ├── layout.tsx                # Dashboard layout wrapper
│   ├── page.tsx                  # Dashboard home (/dashboard) → Dashboard.tsx view
│   ├── loading.tsx               # Loading state for dashboard
│   ├── error.tsx                 # Error boundary
│   ├── sites/                    # Sites management (/dashboard/sites/*)
│   │   ├── page.tsx              # Sites list (/dashboard/sites) → Sites.tsx view
│   │   ├── loading.tsx           # Loading state
│   │   ├── new/
│   │   │   └── page.tsx          # Create new site (/dashboard/sites/new) → NewSite.tsx
│   │   └── [siteId]/
│   │       ├── page.tsx          # Edit site (/dashboard/sites/[siteId]) → SiteEditor.tsx
│   │       └── loading.tsx       # Loading state
│   └── settings/
│       └── page.tsx              # User settings (/dashboard/settings) → Settings.tsx
│
├── s/[slug]/                     # Short URL preview route (/s/[slug]/*)
│   ├── page.tsx                  # Short link preview
│   ├── [...pageSlug]/page.tsx    # Nested page preview
│   ├── loading.tsx               # Loading state
│   └── error.tsx                 # Error boundary
│
└── sites/[domain]/               # Custom domain routes (/sites/[domain]/*)
    ├── page.tsx                  # Site root (/) → PublicSite.tsx
    └── [...slug]/page.tsx        # Nested site pages (/path/to/page)
```

**Key Naming Conventions:**
- `[param]` - Dynamic route segment (single parameter)
- `[...slug]` - Catch-all segment (multiple path segments)
- `layout.tsx` - Shared layout for directory and children
- `page.tsx` - Route handler (becomes URL endpoint)
- `loading.tsx` - Suspense fallback shown during async operations
- `error.tsx` - Error boundary for this route segment

**Example Route Mappings:**
- `/` → `app/page.tsx`
- `/dashboard` → `app/dashboard/page.tsx`
- `/dashboard/sites/123` → `app/dashboard/sites/[siteId]/page.tsx`
- `/s/my-site` → `app/s/[slug]/page.tsx`
- `custom-domain.com/` → `app/sites/[domain]/page.tsx`

---

## `/src` - Application Source Code

### Root Structure
```
/src/
├── api/                  # API service layer (data fetching)
├── assets/               # Images and static resources
├── components/           # React components (organized by feature)
├── constants/            # Constants (landing page content, etc.)
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── integrations/         # External service clients (Supabase)
├── lib/                  # Utility functions and helpers
├── test/                 # Test utilities and mocks
├── types/                # TypeScript type definitions
├── views/                # High-level page components
├── index.css             # Global CSS
├── App.css               # Application CSS
└── vite-env.d.ts         # Vite environment type definitions
```

---

### `/src/api` - API Service Layer

Functions to fetch and mutate data from Supabase.

```
/src/api/
├── index.ts                      # Barrel export of all API services
├── sites.api.ts                  # Site CRUD operations
│   ├── getAll(tenantId)
│   ├── getById(siteId, tenantId)
│   ├── getBySlug(slug)
│   ├── create(site)
│   ├── update(siteId, tenantId, updates)
│   ├── updateSettings(siteId, tenantId, settings)
│   ├── delete(siteId, tenantId)
│   └── isSlugAvailable(slug, excludeSiteId)
│
├── pages.api.ts                  # Page management within sites
│   ├── getAll(siteId)
│   ├── getById(pageId)
│   ├── getBySlug(siteId, slug)
│   ├── create(page)
│   ├── update(pageId, updates)
│   └── delete(pageId)
│
├── sections.api.ts               # Section content management
│   ├── getAll(pageId)
│   ├── getById(sectionId)
│   ├── create(section)
│   ├── update(sectionId, updates)
│   ├── delete(sectionId)
│   └── reorder(pageId, sectionIds)
│
├── templates.api.ts              # Template library
│   ├── getAll(category?, page?)
│   ├── getById(templateId)
│   ├── getBySlug(slug)
│   └── getCategories()
│
├── domains.api.ts                # Custom domain management
│   ├── getAll(siteId)
│   ├── getById(domainId)
│   ├── getByDomain(domain)
│   ├── add(siteId, domain)
│   ├── verify(domainId)
│   ├── remove(siteId, domainId)
│   └── setPrimary(siteId, domainId)
│
├── publishes.api.ts              # Publishing operations
│   ├── getAll(siteId)
│   ├── getCurrent(siteId)
│   ├── publish(siteId)
│   └── unpublish(siteId)
│
└── tenants.api.ts                # Multi-tenant operations
    ├── getAll(userId)
    ├── getById(tenantId)
    ├── create(name, slug)
    └── getMembership(tenantId)
```

**Pattern - Input Validation & Error Handling:**
```typescript
// Every API function validates inputs with Zod
const validTenantId = uuidSchema.parse(tenantId);

// Calls Supabase client
const { data, error } = await supabase
  .from('sites')
  .select('*')
  .eq('tenant_id', validTenantId);

// Parses errors into consistent format
if (error) throw parseSupabaseError(error);
return data || [];
```

---

### `/src/components` - React Components

Components organized by feature domain. Each feature may have sub-components, tests, and utilities.

```
/src/components/
│
├── ui/                           # Shadcn/UI components (Radix primitives)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── form.tsx
│   ├── card.tsx
│   ├── tabs.tsx
│   ├── accordion.tsx
│   ├── select.tsx
│   ├── toast.tsx
│   ├── sonner.tsx                # Toast notification library
│   └── [40+ other UI components]
│
├── common/                       # Reusable UI patterns
│   ├── index.ts                  # Barrel export
│   ├── ErrorBoundary.tsx         # Error boundary for non-fatal errors
│   ├── PageErrorBoundary.tsx     # Page-level error boundary
│   ├── AuthLoadingBoundary.tsx   # Loading state while fetching auth
│   ├── LoadingSpinner.tsx        # Loading indicator component
│   ├── EmptyState.tsx            # Empty state placeholder
│   ├── EmptyState.test.tsx       # Test file
│   ├── ConfirmDialog.tsx         # Confirmation dialog
│   └── ConfirmDialog.test.tsx
│
├── auth/
│   └── AuthForm.tsx              # Login/signup form
│
├── landing/                      # Landing page components
│   ├── Navbar.tsx                # Navigation bar (home page)
│   ├── Navbar.test.tsx           # Test file
│   ├── HeroSection.tsx           # Hero section (tagline, CTA)
│   ├── PortfolioSection.tsx      # Portfolio examples
│   ├── FeaturesSection.tsx       # Product features
│   ├── HowItWorksSection.tsx     # Feature walkthrough
│   ├── TestimonialsSection.tsx   # Customer testimonials
│   ├── StatsSection.tsx          # Stats/metrics
│   ├── FAQSection.tsx            # Frequently asked questions
│   ├── ContactSection.tsx        # Contact form
│   ├── ClientLogosMarquee.tsx    # Client logos carousel
│   ├── LogosSection.tsx
│   └── Footer.tsx
│
├── editor/                       # Site editor components
│   ├── index.ts                  # Barrel export
│   ├── SectionRenderer.tsx       # Routes section.type to component
│   ├── SectionRenderer.test.tsx  # Test file
│   ├── SortableSectionList.tsx   # Drag-and-drop section list (dnd-kit)
│   ├── SortableSectionItem.tsx   # Individual draggable item
│   ├── SortablePreviewSection.tsx # Preview of section in list
│   ├── AddSectionButton.tsx      # Button to add sections
│   ├── AddSectionButton.test.tsx
│   ├── AddSectionDialog.tsx      # Dialog for section type selection
│   ├── DeleteSectionDialog.tsx   # Confirm deletion dialog
│   ├── DeleteSectionDialog.test.tsx
│   ├── EditableText.tsx          # Editable text component
│   ├── EditableText.test.tsx
│   ├── ImagePickerDialog.tsx     # Image selection/upload
│   ├── ImageUploader.tsx         # Image upload handler
│   ├── ThemeCustomizer.tsx       # Theme/color selector
│   │
│   └── sections/                 # Section type implementations
│       ├── HeroSection.tsx       # Hero section (title, subtitle, image)
│       ├── FeaturesSection.tsx   # Features list with icons
│       ├── GallerySection.tsx    # Image gallery
│       ├── TestimonialsSection.tsx # Testimonials carousel
│       ├── CTASection.tsx        # Call-to-action buttons
│       ├── ContactSection.tsx    # Contact form
│       ├── AboutSection.tsx      # About/description
│       ├── FooterSection.tsx     # Footer content
│       ├── PricingSection.tsx    # Pricing table
│       ├── TeamSection.tsx       # Team member profiles
│       ├── FAQSection.tsx        # FAQ accordion
│       └── StatsSection.tsx      # Statistics display
│
├── site/                         # Public site display
│   ├── SiteRenderer.tsx          # Main site renderer
│   └── SiteSettingsDialog.tsx    # Site metadata settings
│
├── layout/
│   └── DashboardLayout.tsx       # Dashboard page wrapper
│
├── domain/
│   └── DomainManager.tsx         # Domain management interface
│
├── templates/                    # Template browsing
│   ├── TemplateCard.tsx          # Single template preview card
│   ├── TemplateCategoryFilter.tsx # Category filter UI
│   └── TemplatePreviewDialog.tsx # Full template preview modal
│
├── tenant/
│   └── CreateTenantDialog.tsx    # Create new tenant dialog
│
├── effects/                      # Animation and visual effects
│   ├── index.ts                  # Barrel export
│   ├── MagneticCursor.tsx        # Cursor tracking animation
│   ├── Marquee.tsx               # Infinite marquee scrolling
│   ├── Preloader.tsx             # Page preloader animation
│   ├── SmoothScroll.tsx          # Smooth scroll provider
│   └── SplitText.tsx             # Text split animation
│
├── accessibility/                # WCAG-compliant accessibility widget
│   ├── index.ts                  # Barrel export
│   ├── AccessibilityWidget.tsx   # Main widget component
│   ├── constants.ts              # Widget constants
│   ├── profiles.ts               # Accessibility profiles (dyslexia, etc.)
│   ├── types.ts                  # TypeScript types
│   │
│   ├── components/               # Sub-components
│   │   ├── AccessibilityButton.tsx
│   │   ├── AccessibilityDialog.tsx
│   │   ├── ToggleButton.tsx
│   │   ├── MinimizedButton.tsx
│   │   ├── ProfilesSelector.tsx
│   │   ├── ReadingMask.tsx
│   │   ├── HideOptionsDialog.tsx
│   │   └── WidgetErrorBoundary.tsx
│   │
│   ├── admin/                    # Admin panel for widget
│   │   ├── index.ts
│   │   ├── AccessibilityAdmin.tsx
│   │   ├── styles.ts
│   │   ├── types.ts
│   │   ├── translations.ts
│   │   └── useAdminSettings.ts
│   │
│   ├── hooks/                    # Widget-specific hooks
│   │   ├── useAccessibilitySettings.ts
│   │   ├── useAccessibilityEffects.ts
│   │   ├── useAdminSettingsSync.ts
│   │   ├── useDraggablePosition.ts
│   │   ├── useFocusTrap.ts
│   │   └── useHideWidget.ts
│   │
│   ├── i18n/                     # Internationalization
│   │   ├── index.ts
│   │   ├── translations.ts
│   │   └── useAccessibilityI18n.ts
│   │
│   ├── lib/                      # Utilities
│   │   ├── keyboardUtils.ts
│   │   └── utils.ts
│   │
│   ├── icons/
│   │   └── index.tsx             # Icon components
│   │
│   ├── styles/                   # CSS styling
│   │   ├── accessibility.css
│   │   └── colors.css
│   │
│   └── __tests__/                # Tests
│       ├── AccessibilityWidget.test.tsx
│       ├── useAccessibilitySettings.test.ts
│       ├── profiles.test.ts
│       ├── ToggleButton.test.tsx
│       ├── ReadingMask.test.tsx
│       └── WidgetErrorBoundary.test.tsx
│
└── NavLink.tsx                   # Navigation link component
```

**Component Organization Principles:**
1. Organize by feature domain first
2. Group related components together
3. Place tests next to component (`Component.test.tsx`)
4. Use barrel exports (`index.ts`) for clean imports
5. Shared UI in `/components/ui/` (Shadcn)
6. Reusable patterns in `/components/common/`

---

### `/src/hooks` - Custom React Hooks

```
/src/hooks/
├── index.ts                      # Barrel export (not used, import directly)
│
├── useAuth.tsx                   # Authentication state & methods
│   └── useAuth.test.tsx          # Test file
│
├── useTenant.tsx                 # Multi-tenant context management
│   └── useTenant.test.tsx
│
├── use-mobile.tsx                # Mobile responsive detection
│   └── use-mobile.test.tsx
│
├── useAutoSave.tsx               # Debounced auto-save hook
│   └── useAutoSave.test.tsx
│
├── useNavigation.ts              # URL-based navigation utility
│
├── useParallax.ts                # Parallax scroll animation
│
├── useScrollAnimation.tsx         # Scroll trigger animations
│
├── use-toast.ts                  # Toast notification hook (sonner)
│
└── queries/                      # React Query hooks (data fetching)
    ├── index.ts                  # Barrel export
    ├── useSites.ts               # Fetch sites for tenant
    │   └── useSites.test.tsx
    ├── useSite.ts                # Fetch single site
    ├── usePages.ts               # Fetch pages for site
    │   └── usePages.test.tsx
    ├── useSections.ts            # Fetch sections for page
    │   └── useSections.test.tsx
    ├── useTemplates.ts           # Fetch templates
    │   └── useTemplates.test.tsx
    ├── useTenants.ts             # Fetch tenants for user
    │   └── useTenants.test.tsx
    └── [Additional query hooks]
```

**Hook Patterns:**

1. **Query Hooks** - Fetch data with React Query
   ```typescript
   export function useSites(tenantId?: string) {
     return useQuery({
       queryKey: queryKeys.sites.list(effectiveTenantId),
       queryFn: () => sitesApi.getAll(effectiveTenantId),
       enabled: !!effectiveTenantId,
     });
   }
   ```

2. **Mutation Hooks** - Mutate data with React Query
   ```typescript
   export function useUpdateSite() {
     return useMutation({
       mutationFn: ({ siteId, updates }) =>
         sitesApi.update(siteId, currentTenant.id, updates),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
       },
     });
   }
   ```

3. **Context Hooks** - Provide context values
   ```typescript
   export function useAuth() {
     const context = useContext(AuthContext);
     if (!context) throw new Error('useAuth must be used within AuthProvider');
     return context;
   }
   ```

---

### `/src/types` - TypeScript Type Definitions

```
/src/types/
├── index.ts                      # Barrel export of all types
├── site.types.ts                 # Site, Page data models
├── section.types.ts              # Section type variants
├── theme.types.ts                # Theme and color models
├── api.types.ts                  # API-specific types
├── schemas.ts                    # Zod validation schemas
├── landing.ts                    # Landing page content types
├── published-site.ts             # Published site types
│
├── Examples:
│   - Site, SiteInsert, SiteUpdate
│   - Page, PageInsert, PageUpdate
│   - Section, SectionInsert, SectionUpdate
│   - Template, TemplateCategory
│   - Theme, ThemeColor, Palette
│   - User, Tenant, TenantRole
```

**Key Pattern - Zod Schema Inference:**
```typescript
// Define schema
const siteSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  slug: z.string(),
  // ...
});

// Export schema for validation
export const siteInsertSchema = siteSchema.omit({ id: true });

// Infer TypeScript type from schema
export type Site = z.infer<typeof siteSchema>;
export type SiteInsert = z.infer<typeof siteInsertSchema>;
```

---

### `/src/lib` - Utility Functions

```
/src/lib/
├── api-error.ts                  # Error parsing & normalization
├── constants.ts                  # Application constants
├── fetch-published-site.ts       # Fetch published site content
├── helpers.ts                    # General helper functions
│   └── helpers.test.ts
├── logger.ts                     # Logging utility
├── navigation.ts                 # Navigation utilities
├── query-client.ts               # React Query client factory
├── query-keys.ts                 # Query key factory (cache keys)
├── rate-limit.ts                 # Rate limiting helper
├── sanitize.ts                   # HTML sanitization
├── utils.ts                      # Miscellaneous utilities
│   └── utils.test.ts
├── validation-patterns.ts        # Regex patterns for validation
│
└── Examples:
    - parseSupabaseError(error) → ApiError
    - cn(...classes) → tailwind class merging
    - formatDate(), slugify()
    - isValidEmail(), isValidDomain()
```

---

### `/src/contexts` - React Context Providers

```
/src/contexts/
├── EditorContext.tsx             # Site editor UI state
│   ├── selectedSectionId
│   ├── isPreviewMode
│   ├── viewMode (desktop/mobile/tablet)
│   ├── activeTab (sections/theme)
│   ├── deletingSectionId
│   └── activeDragId
│
└── ThemeContext.tsx              # Theme management (colors, fonts)
    ├── currentTheme
    ├── updateTheme()
    ├── resetTheme()
    └── availableThemes
```

**Context Provider Pattern:**
```typescript
export function EditorProvider({ children }) {
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  // ... more state ...

  return (
    <EditorContext.Provider value={{ selectedSectionId, setSelectedSectionId, ... }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
}
```

---

### `/src/views` - High-Level Page Components

Page-level components that orchestrate data fetching and layout.

```
/src/views/
├── Index.tsx                     # Landing page (home.tsx)
├── Dashboard.tsx                 # Dashboard home page
├── Sites.tsx                     # Sites list page (/dashboard/sites)
├── NewSite.tsx                   # Create new site wizard
├── SiteEditor.tsx                # Full-featured site editor
├── Settings.tsx                  # User settings page
├── PublicSite.tsx                # Public site display
└── NotFound.tsx                  # 404 page
```

**View Responsibilities:**
1. Data fetching (useQuery/useMutation)
2. State management (useEditor, useTenant)
3. Error handling (error boundaries)
4. Layout composition
5. Side effects (subscriptions, analytics)

**Example - SiteEditor.tsx:**
```typescript
export default function SiteEditor({ siteId }) {
  const { data: site } = useSite(siteId);
  const { data: pages } = usePages(siteId);
  const { selectedSectionId } = useEditor();

  return (
    <div className="flex">
      <EditorPanel />
      <PreviewPanel site={site} pages={pages} />
      <ThemePanel />
    </div>
  );
}
```

---

### `/src/integrations` - External Service Integration

```
/src/integrations/
└── supabase/
    ├── client.ts                 # Supabase client initialization
    └── types.ts                  # Generated Supabase types (Database interface)
```

**Supabase Client Setup:**
```typescript
export const supabase = createClient<Database>(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

---

### `/src/constants` - Application Constants

```
/src/constants/
└── landing.ts                    # Landing page content (testimonials, features, etc.)
```

---

### `/src/test` - Testing Utilities

```
/src/test/
├── setup.ts                      # Vitest configuration
├── test-utils.tsx                # Render with providers
│
└── mocks/
    └── supabase.mock.ts          # Supabase client mock
```

---

## `/supabase` - Backend Configuration

```
/supabase/
└── functions/                    # Edge functions (Deno runtime)
    ├── generate-site/            # Generate HTML/CSS and deploy
    │   └── index.ts
    ├── manage-vercel-domain/     # Manage custom domains
    │   └── index.ts
    ├── get-published-site/       # Fetch published site content
    │   └── index.ts
    ├── verify-domain/            # Verify domain ownership
    │   └── index.ts
    └── _shared/
        └── validation.ts         # Shared validation
```

**Function Pattern:**
```typescript
// Deno runtime
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') return new Response('ok');

  // Validate input
  const { siteId } = await req.json();

  // Process
  const result = await generateSiteHTML(siteId);

  // Return response
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

## `/api` - Legacy API Routes (Partial)

```
/api/
└── domains/
    ├── add.ts                    # Add custom domain
    ├── remove.ts                 # Remove domain
    └── verify.ts                 # Verify domain
```

**Note:** Most API operations are in `/src/api/` with Supabase client.

---

## Configuration Files

```
Root Directory:
├── next.config.mjs               # Next.js settings
│   ├── Image remote patterns
│   ├── Security headers (CSP, HSTS)
│   └── 404 handler
│
├── middleware.ts                 # Custom domain routing
│   ├── Domain validation
│   ├── App domain detection
│   └── Path rewriting
│
├── tsconfig.json                 # TypeScript root config
├── tsconfig.app.json             # TypeScript app config (strict mode)
├── tsconfig.node.json            # TypeScript for build files
│
├── tailwind.config.ts            # Tailwind CSS config
│   ├── Color palette
│   ├── Font family (Heebo for Hebrew)
│   ├── Theme extensions
│   └── Plugin configuration
│
├── vitest.config.ts              # Vitest test runner config
├── eslint.config.js              # ESLint rules
├── components.json               # Shadcn/UI config (component paths)
│
├── package.json                  # Dependencies and scripts
└── .env.example                  # Required environment variables
```

---

## Environment Variables

```
.env.local (required for development):

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...

# App Configuration
APP_DOMAINS=localhost,vercel.app,amdir.app

# Vercel Integration (for domain management)
VERCEL_TOKEN=xxx
VERCEL_TEAM_ID=xxx
```

---

## Naming Conventions

### Files
- **Components:** PascalCase (e.g., `SiteEditor.tsx`)
- **Utilities:** camelCase (e.g., `query-keys.ts`)
- **Tests:** `Component.test.tsx`
- **Hooks:** `use[Name].tsx` (e.g., `useSites.ts`)

### Directories
- **Feature-based:** kebab-case (e.g., `/dashboard/sites/[siteId]`)
- **Caution:** Don't create deeply nested structures

### Variables & Functions
- **camelCase** for variables and functions
- **PascalCase** for React components and classes
- **UPPERCASE** for constants (`export const MAX_FILE_SIZE = ...`)

---

## Key Locations Reference

| What | Where |
|------|-------|
| Add new page | `/app/[route]/page.tsx` |
| Add new component | `/src/components/[feature]/[Component].tsx` |
| Add new API service | `/src/api/[domain].api.ts` |
| Add new hook | `/src/hooks/use[Name].tsx` |
| Add new type | `/src/types/[domain].ts` |
| Add global constant | `/src/lib/constants.ts` |
| Add utility function | `/src/lib/utils.ts` |
| Add test | `[Original].test.tsx` next to file |
| Configure Tailwind | `/tailwind.config.ts` |
| Configure ESLint | `/eslint.config.js` |
| Add dependency | `package.json` |
| Environment setup | `.env.local` (from `.env.example`) |
| Update security headers | `/next.config.mjs` |

---

## Common Tasks & Locations

### Create a New Page
1. Create `/app/[feature]/page.tsx` - Client component wrapper
2. Create `/src/views/[FeatureName].tsx` - Implementation

### Add a New Section Type
1. Create `/src/components/editor/sections/[Type]Section.tsx`
2. Register in `SectionRenderer.tsx`'s `sectionComponents` map
3. Add type definition in `/src/types/section.types.ts`
4. Create Zod schema in `/src/types/schemas.ts`

### Create a New Feature with Data
1. Create API service: `/src/api/[domain].api.ts`
2. Create hooks: `/src/hooks/queries/use[Domain].ts`
3. Create components: `/src/components/[domain]/`
4. Add types: `/src/types/[domain].types.ts`
5. Create views as needed

### Modify Database Schema
1. Update Supabase database directly
2. Regenerate types: `supabase gen types typescript --project-id xxx`
3. Update `/src/integrations/supabase/types.ts`
4. Update Zod schemas if needed

### Add a Global Provider
1. Create provider in `/src/contexts/` or hook
2. Add to `/app/providers.tsx` wrapping chain
3. Import in relevant components

---

## Import Path Aliases

TypeScript `tsconfig.json` defines path aliases:
- `@/` → `/src/`
- Allows: `import Component from '@/components/...'`
- Avoid relative imports in large projects

---

## Testing Locations & Patterns

```
Test files are colocated with source:
├── /src/components/Editor.tsx
├── /src/components/Editor.test.tsx         # Component test
├── /src/hooks/useAuth.tsx
└── /src/hooks/useAuth.test.tsx             # Hook test

Run with: npm run test
Watch mode: npm run test:watch
Coverage: npm run test:coverage
```

---

## Build & Deployment

```
Development: npm run dev
Build: npm run build → .next directory
Start: npm start (production)
Lint: npm run lint
Type check: npm run type-check
Test: npm run test
```

Deployment targets:
- Vercel (primary - auto-deploys from git)
- Published sites deployed to Vercel projects
- Edge functions on Supabase
