# Technology Stack

## Runtime & Framework

- **Runtime**: Node.js (ES Module support via `"type": "module"`)
- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5.8.3 (strict mode, enterprise-grade type checking)
- **Package Manager**: npm (package-lock.json present)

## Frontend

### Core Libraries
- **React**: 18.3.1
- **React DOM**: 18.3.1

### UI Framework & Components
- **Radix UI**: Comprehensive set of headless UI primitives
  - `@radix-ui/react-accordion`
  - `@radix-ui/react-alert-dialog`
  - `@radix-ui/react-aspect-ratio`
  - `@radix-ui/react-avatar`
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-collapsible`
  - `@radix-ui/react-context-menu`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-hover-card`
  - `@radix-ui/react-label`
  - `@radix-ui/react-menubar`
  - `@radix-ui/react-navigation-menu`
  - `@radix-ui/react-popover`
  - `@radix-ui/react-progress`
  - `@radix-ui/react-radio-group`
  - `@radix-ui/react-scroll-area`
  - `@radix-ui/react-select`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-slider`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-switch`
  - `@radix-ui/react-tabs`
  - `@radix-ui/react-toast`
  - `@radix-ui/react-toggle`
  - `@radix-ui/react-toggle-group`
  - `@radix-ui/react-tooltip`

### Styling & CSS
- **Tailwind CSS**: 3.4.17 (utility-first CSS framework)
- **PostCSS**: 8.5.6 (CSS processing)
- **Autoprefixer**: 10.4.21 (vendor prefixes)
- **tailwindcss-animate**: 1.0.7 (animation utilities)
- **tailwind-merge**: 2.6.0 (utility class merging)
- **class-variance-authority**: 0.7.1 (variant management)
- **clsx**: 2.1.1 (conditional CSS classes)

### Form & Validation
- **React Hook Form**: 7.61.1 (performant form state)
- **@hookform/resolvers**: 3.10.0 (schema validation integration)
- **Zod**: 3.25.76 (TypeScript-first schema validation)

### State Management & Data Fetching
- **TanStack React Query**: 5.83.0 (server state management)
- **next-themes**: 0.3.0 (theme management)

### UI Components & Effects
- **lucide-react**: 0.462.0 (icon library)
- **sonner**: 1.7.4 (toast notifications)
- **framer-motion**: 12.29.0 (animation library)
- **embla-carousel-react**: 8.6.0 (carousel component)
- **react-resizable-panels**: 2.1.9 (resizable panel layouts)
- **lenis**: 1.3.17 (smooth scrolling)
- **react-day-picker**: 8.10.1 (date picker)
- **input-otp**: 1.4.2 (OTP input component)
- **vaul**: 0.9.9 (drawer component)
- **react-helmet-async**: 2.0.5 (document head management)
- **dompurify**: 3.3.1 (HTML sanitization)

### Charts & Visualization
- **recharts**: 2.15.4 (composable charting library)

### Date/Time
- **date-fns**: 3.6.0 (date utility functions)

## Backend

### Database
- **Supabase**: PostgreSQL-based backend
  - `@supabase/supabase-js`: 2.91.1 (JavaScript client SDK)
  - Database: PostgreSQL 14.1 (via Supabase)
  - Authentication: Supabase Auth (built-in)

### Edge Functions/Serverless
- **Deno**: Edge function runtime (Supabase Functions)
  - Functions deployed at `supabase/functions/`
  - Includes domain verification, Vercel domain management, site generation, and published site delivery

## Build & Development

### Build Tools
- **Vite**: 5.4.19 (build tool)
- **@vitejs/plugin-react-swc**: 3.11.0 (React plugin with SWC)

### Type Checking
- **TypeScript**: 5.8.3
- Compiled with strict mode enabled
- Path aliases configured in `tsconfig.json` (`@/*` maps to `./src/*`)

### Testing
- **Vitest**: 3.2.4 (unit test framework)
- **@testing-library/react**: 16.0.0 (React testing utilities)
- **@testing-library/jest-dom**: 6.6.0 (custom matchers)
- **@testing-library/user-event**: 14.6.1 (user interaction simulation)
- **jsdom**: 20.0.3 (DOM implementation for testing)

### Linting & Code Quality
- **ESLint**: 9.32.0
- **@eslint/js**: 9.32.0
- **typescript-eslint**: 8.38.0
- **eslint-plugin-react-hooks**: 5.2.0
- **eslint-plugin-react-refresh**: 0.4.20

### Development Dependencies
- **@types/node**: 22.16.5
- **@types/react**: 18.3.23
- **@types/react-dom**: 18.3.7
- **@types/dompurify**: 3.0.5
- **globals**: 15.15.0
- **@vercel/node**: 5.5.27

## Deployment

### Hosting
- **Vercel**: Deployment platform
  - Configuration in `vercel.json`
  - Build command: `npm run build`
  - Output directory: `.next`
  - Framework: Next.js

## Configuration Files

### TypeScript Configuration
- **tsconfig.json**: Root configuration with base compiler options
- **tsconfig.app.json**: Application-specific configuration with ES2020 target
- **tsconfig.node.json**: Build tool configuration with ES2022 target

### Next.js Configuration
- **next.config.mjs**: Security headers (HSTS, CSP), Supabase image remotePatterns

### Component Configuration
- **components.json**: shadcn/ui configuration
  - Style: default
  - Tailwind CSS integration
  - Path aliases for components, utils, and hooks

## Environment Variables

### Configuration Sources
- `.env.local`: Development secrets (not in version control)
- `.env.example`: Template for environment variables

### Key Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Supabase anonymous key
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_PROJECT_ID`: Vercel project identifier
- `VERCEL_TEAM_ID`: Vercel team identifier
- `APP_DOMAINS`: Comma-separated list of app domains
- Supabase edge function environment variables (HOSTING_IP, etc.)

## Project Structure

### Source Organization
- **src/**: Main source code directory
  - `api/`: API layer with Supabase integration (`sites.api`, `pages.api`, `sections.api`, etc.)
  - `components/`: React components (ui, layout, editor, site, auth, etc.)
  - `contexts/`: React context providers (ThemeContext, EditorContext)
  - `hooks/`: Custom React hooks (useAuth, useTenant, queries)
  - `lib/`: Utility libraries (query-client, api-error, logger, helpers)
  - `types/`: TypeScript type definitions
  - `integrations/`: External service integrations (Supabase)

- **app/**: Next.js App Router pages
  - Dashboard routes
  - Site editor routes
  - Published site routes

- **supabase/**: Supabase configuration
  - `functions/`: Edge functions (Deno runtime)
  - `migrations/`: Database migrations

## Security Features

### TypeScript Strict Mode
- `strictNullChecks`: true
- `strictFunctionTypes`: true
- `strictBindCallApply`: true
- `strictPropertyInitialization`: true
- `noImplicitAny`: true
- `noImplicitThis`: true
- `useUnknownInCatchVariables`: true

### Security Headers (Next.js)
- HSTS (HTTP Strict Transport Security)
- CSP (Content Security Policy)
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection
- Referrer-Policy

### Input Validation
- Zod schema validation for all API operations
- DOMPurify for HTML sanitization
- UUID validation for IDs
- Domain regex validation

### Database Security
- Supabase Row Level Security (RLS) policies
- Tenant isolation via `tenant_id` foreign keys
- Defense-in-depth validation alongside RLS
