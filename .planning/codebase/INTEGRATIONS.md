# External Integrations & APIs

## Primary Backend Service: Supabase

### Supabase Overview
- **Purpose**: Complete backend-as-a-service platform
- **SDK**: `@supabase/supabase-js` v2.91.1
- **Authentication**: Built-in Supabase Auth
- **Database**: PostgreSQL 14.1

### Database Tables & Schema

#### Core Entity Tables
- **tenants**: Multi-tenant workspace management
  - Fields: id, name, slug, plan, settings, created_at, updated_at
  - Relationships: Owns sites, members, and other tenant-scoped data

- **tenant_members**: User-to-tenant role assignments
  - Fields: id, tenant_id, user_id, role, created_at
  - Roles: owner, admin, editor, viewer
  - Relationships: Links users to tenants with specific permissions

- **profiles**: User profile information
  - Fields: id, user_id, full_name, email, avatar_url, created_at, updated_at
  - Relationships: Extended auth.users data

- **sites**: Website projects within tenants
  - Fields: id, name, slug, status, template_id, settings, tenant_id, created_at, updated_at
  - Status: draft, published, archived
  - Relationships: Belongs to tenant, has pages, sections, domains, and publishes

- **pages**: Website pages within sites
  - Fields: id, site_id, slug, title, is_homepage, seo, sort_order, tenant_id, created_at, updated_at
  - Relationships: Belongs to site, contains sections

- **sections**: Page content sections
  - Fields: id, page_id, type, content (JSON), settings (JSON), variant, sort_order, tenant_id, created_at, updated_at
  - Relationships: Belongs to page
  - Types: hero, features, gallery, testimonials, cta, contact, about, footer

- **section_registry**: Available section types and defaults
  - Fields: id, type, name, description, schema (JSON), default_content (JSON), supported_variants, icon, is_active, created_at
  - Stores metadata for all available section components

#### Publishing & Domains
- **publishes**: Version history and published snapshots
  - Fields: id, site_id, version, snapshot (JSON), changelog, published_by, published_at, is_current, tenant_id
  - Stores complete site snapshots for each published version

- **domains**: Custom domain management
  - Fields: id, domain, site_id, status, verified_at, ssl_status, cf_hostname_id, tenant_id, created_at
  - Status: pending, verifying, active, failed
  - Relationships: Belongs to site

#### Assets & Media
- **assets**: File storage metadata
  - Fields: id, filename, storage_path, mime_type, size_bytes, alt_text, metadata (JSON), site_id, tenant_id, created_at
  - Relationships: Belongs to site and tenant

#### Audit & Logging
- **audit_log**: Activity tracking
  - Fields: id, action, entity_type, entity_id, payload (JSON), user_id, site_id, tenant_id, created_at
  - Tracks user actions for compliance and debugging

#### Templates
- **templates**: Pre-built site templates
  - Fields: id, name, slug, category, description, blueprint_schema (JSON), thumbnail_url, is_active, created_at, updated_at
  - Allows users to start sites from templates

### Supabase Functions (Edge Functions - Deno Runtime)

#### Location
`/Users/user/generative-web-factory/supabase/functions/`

#### verify-domain
- **Purpose**: Verify custom domain DNS configuration
- **Endpoint**: Supabase Functions `verify-domain`
- **External APIs Used**:
  - **Cloudflare DoH (DNS over HTTPS)**: `https://cloudflare-dns.com/dns-query`
    - Queries A records to check if domain points to hosting IP
    - Queries TXT records for verification (`_lovable` subdomain)
    - Expected hosting IP: configurable via `HOSTING_IP` environment variable (default: 185.158.133.1)
- **Authentication**: Bearer token validation via Supabase Auth
- **CORS**: Whitelist includes localhost, Vercel preview deployments, and production domains
- **Database Operations**: Updates domain status in `domains` table

#### manage-vercel-domain
- **Purpose**: Manage domain lifecycle on Vercel
- **Endpoint**: Supabase Functions `manage-vercel-domain`
- **External APIs Used**:
  - **Vercel API**: `https://api.vercel.com`
    - `POST /v10/projects/{projectId}/domains` - Add domain
    - `DELETE /v9/projects/{projectId}/domains/{domain}` - Remove domain
    - `POST /v9/projects/{projectId}/domains/{domain}/verify` - Verify domain
    - `GET /v9/projects/{projectId}/domains/{domain}` - Get domain status
    - `GET /v6/domains/{domain}/config` - Check domain configuration
- **Environment Variables Required**:
  - `VERCEL_TOKEN`: API token for authentication
  - `VERCEL_PROJECT_ID`: Target project identifier
  - `VERCEL_TEAM_ID`: Optional team identifier for team projects
- **Actions Supported**:
  - add: Register domain with Vercel and get verification instructions
  - remove: Unregister domain from Vercel
  - verify: Check and verify domain DNS configuration
  - status: Get current domain verification status
- **Database Operations**: Updates domain status, verified_at, and ssl_status in `domains` table
- **Authentication**: Bearer token validation via Supabase Auth

#### generate-site
- **Purpose**: AI-powered website generation from business description
- **External APIs Used**:
  - **OpenAI API** (implied from system prompt and JSON generation pattern)
    - Generates website structure and content from brief
    - Creates site name, settings (colors, fonts, direction), and page structures
    - Generates 8 section types: hero, features, gallery, testimonials, cta, contact, about, footer
- **CORS**: Whitelist includes localhost, Vercel preview deployments, and production domains
- **Output Format**: Structured JSON with site blueprint including:
  - siteName
  - settings (primaryColor, secondaryColor, fontFamily, direction)
  - pages array with sections
- **Language Support**: Hebrew (RTL) preferred for descriptions in Hebrew
- **Database Operations**: Creates site, pages, and sections in database

#### get-published-site
- **Purpose**: Retrieve published site content by slug or custom domain
- **Endpoint**: Supabase Functions `get-published-site`
- **Query Parameters**:
  - `slug`: Site slug for lookup
  - `domain`: Custom domain for lookup
- **Database Operations**:
  - Looks up site by domain (from `domains` table with status="active")
  - Falls back to slug lookup (from `sites` table with status="published")
  - Retrieves current published snapshot from `publishes` table
- **CORS**: Allows all origins (`*`) - intentional for custom domain support
- **Authentication**: None required - read-only public endpoint using service role internally

### Supabase Functions Shared Utilities
- **Location**: `supabase/functions/_shared/validation.ts`
- **Utilities**:
  - `isValidUuid()`: UUID format validation
  - `isValidDomain()`: RFC-compliant domain validation
  - `validateBrief()`: Website generation brief validation
  - `errorResponse()`: Standardized error response formatting
  - `successResponse()`: Standardized success response formatting

### Supabase Auth Configuration
- **Client Configuration** (`src/integrations/supabase/client.ts`):
  - Session persistence: localStorage (browser)
  - Auto-refresh tokens: enabled
  - Detect session in URL: enabled (supports password reset links)
  - Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase Security Features
- **Row Level Security (RLS)**: Policies on all tables for tenant isolation
- **Database Functions**:
  - `get_user_tenants(p_user_id)`: Returns array of tenant IDs for a user
  - `has_tenant_role(p_user_id, p_tenant_id, p_roles)`: Check if user has specific role in tenant
  - `is_tenant_member(p_user_id, p_tenant_id)`: Verify tenant membership
- **Storage Buckets**: Likely configured for asset management (images, files)

### Supabase Migrations
- **Location**: `supabase/migrations/`
- **Migration Files**: 8+ migration files tracking database schema evolution
  - Domain management setup
  - Public site access configuration
  - Architectural fixes and optimizations
  - Template system implementation

## Deployment Integration: Vercel

### Vercel Configuration
- **File**: `vercel.json`
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Vercel API Integration
- **Token Management**: Via `VERCEL_TOKEN` environment variable
- **Project Configuration**: `VERCEL_PROJECT_ID` and `VERCEL_TEAM_ID`
- **Domain Management**: Handled by `manage-vercel-domain` edge function
- **Deployment**: Automatic via git integration
- **Preview Deployments**: CORS whitelist includes `*.vercel.app` for preview URLs

## DNS Service: Cloudflare

### DNS Over HTTPS (DoH)
- **Service**: Cloudflare public DNS resolver
- **Endpoint**: `https://cloudflare-dns.com/dns-query`
- **Usage**: Domain verification via DNS record lookup
- **Queries**:
  - A records: Check if domain points to hosting IP
  - TXT records: Verify domain ownership via `_lovable` subdomain
- **Benefit**: No API key required for read-only DNS queries

## Frontend API Integration

### Supabase Client Usage
- **Location**: `src/integrations/supabase/client.ts`
- **Exports**: `supabase` client instance for use throughout app
- **Usage Pattern**: Imported in API layer files (`src/api/*.ts`)

### API Layer Architecture
- **Location**: `src/api/` directory
- **Files**:
  - `sites.api.ts`: Site CRUD operations with pagination and validation
  - `pages.api.ts`: Page management within sites
  - `sections.api.ts`: Section (content block) management
  - `templates.api.ts`: Template browsing and selection
  - `tenants.api.ts`: Tenant and membership management
  - `domains.api.ts`: Domain management with Vercel/Cloudflare integration
  - `publishes.api.ts`: Version history and publishing operations

### React Query Integration
- **Location**: `src/hooks/queries/`
- **Query Hooks**:
  - `useSites()`: Fetch tenant sites
  - `useSite()`: Fetch specific site
  - `useSiteBySlug()`: Fetch site by slug
  - `usePages()`: Fetch site pages
  - `useSections()`: Fetch section data
  - `useTemplates()`: Fetch available templates
  - `useTenants()`: Fetch user's tenants

### Query Cache Management
- **Location**: `src/lib/query-keys.ts`
- **Pattern**: Hierarchical query key factory
- **Cache Invalidation**: Automatic on mutations

### Form & Input Validation
- **Zod Schemas**: `src/types/schemas.ts`
- **Schemas Defined**:
  - `siteInsertSchema`: Validation for new site creation
  - `siteUpdateSchema`: Validation for site updates
  - `siteSettingsSchema`: Validation for site configuration
  - `slugSchema`: URL-safe slug validation
  - `uuidSchema`: UUID format validation
  - `tenantInsertSchema`: Tenant creation validation

### Error Handling
- **Location**: `src/lib/api-error.ts`
- **Standardized Error Codes**:
  - NETWORK_ERROR, AUTH_ERROR, FORBIDDEN, NOT_FOUND
  - VALIDATION_ERROR, CONFLICT, RATE_LIMITED, SERVER_ERROR, UNKNOWN
- **Supabase Error Parsing**: Maps PostgreSQL and Supabase-specific errors
- **User Messages**: Localized Hebrew messages for common errors

### State & Authentication Management
- **Auth Context**: `src/hooks/useAuth.tsx`
- **Operations**: Sign up, sign in, sign out, session management
- **Uses**: Supabase Auth built-in functionality
- **Tenant Context**: `src/hooks/useTenant.tsx`
- **Operations**: Current tenant selection and management

## Content Delivery

### Published Site Retrieval
- **Function**: `get-published-site` edge function
- **Method**: Read-only endpoint serving published snapshots
- **Access Control**: No authentication (public read)
- **Domain Support**: Custom domains and site slugs

### Custom Domain Routing
- **Middleware**: `middleware.ts`
- **Function**: Route custom domains to site content
- **Validation**: Domain sanitization and RFC 1123 compliance
- **Rewrites**: Custom domains rewritten to `/sites/{domain}` routes
- **Configuration**: `APP_DOMAINS` environment variable for app domains

## External Service Integration Summary

### Critical External Services
1. **Supabase** (PostgreSQL database, auth, edge functions)
2. **Vercel** (hosting and domain management API)
3. **Cloudflare** (DNS verification)
4. **OpenAI** (site generation from descriptions - implied)

### API Communication Patterns
- All client-side API calls go through Supabase client SDK
- Edge functions act as middleware for external APIs (Vercel, Cloudflare, OpenAI)
- Environment-based configuration for API keys and endpoints
- CORS-protected endpoints with whitelist for Vercel preview deployments

### Environment Variable Dependencies
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# Vercel (edge functions)
VERCEL_TOKEN
VERCEL_PROJECT_ID
VERCEL_TEAM_ID

# Domain verification
HOSTING_IP (optional, defaults to 185.158.133.1)

# Application
APP_DOMAINS (default: localhost,vercel.app,amdir.app,www.amdir.app)
```

### Security Considerations
- All external API calls require authentication (Bearer tokens for Supabase/Vercel)
- Service role key only used server-side in edge functions
- Public endpoints (like get-published-site) use CORS wisely
- Input validation before any external API calls
- Rate limiting and error handling implemented for resilience
