---
phase: 05
plan: 01
type: fix
subsystem: security
tags: [csp, security-headers, next.js, vercel, monitoring]

# Dependency graph
requires: []
provides:
  - CSP violation monitoring without enforcement
  - Dual-layer CSP headers (Next.js + Vercel)
affects:
  - Future CSP policy refinement based on violation reports
  - Production deployment monitoring

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Report-Only CSP for safe policy testing
    - Belt-and-suspenders header configuration (Next.js + Vercel)

# File tracking
key-files:
  created: []
  modified:
    - next.config.mjs
    - vercel.json

# Decisions
decisions:
  - id: csp-report-only
    what: Migrate from enforcing CSP to Report-Only mode
    why: Allow monitoring violations without breaking site functionality
    alternatives: Keep enforcing, remove CSP entirely
    rationale: Report-Only provides safety net to identify violations before enforcement

# Metadata
metrics:
  duration: 3 minutes
  completed: 2026-02-02
---

# Phase 05 Plan 01: CSP Migration to Report-Only Header Summary

**One-liner:** Migrated Content-Security-Policy to Report-Only mode in both Next.js config and Vercel headers for safe violation monitoring

## What Was Done

Migrated the Content Security Policy from enforcement mode to report-only mode across both Next.js configuration and Vercel deployment settings.

**Changes made:**

1. **next.config.mjs (line 76):**
   - Changed header key from `Content-Security-Policy` to `Content-Security-Policy-Report-Only`
   - Preserved all existing CSP directives unchanged
   - Maintains environment-specific script-src configuration (dev vs production)

2. **vercel.json:**
   - Added new `headers` array configuration
   - Included `Content-Security-Policy-Report-Only` header for `/:path*` routes
   - Matches production CSP policy from next.config.mjs

**CSP Policy retained (now in report-only mode):**
- `default-src 'self'`
- `script-src 'self' 'unsafe-inline'` (production)
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
- `font-src 'self' https://fonts.gstatic.com data:`
- `img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://images.unsplash.com`
- `connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co`
- `media-src 'self' https://*.supabase.co`
- `object-src 'none'`
- `frame-ancestors 'self'`
- `base-uri 'self'`
- `form-action 'self'`
- `upgrade-insecure-requests`

## Why Report-Only Mode

Report-Only CSP allows monitoring policy violations without blocking resources. This provides:
- **Safety:** Site continues functioning even if CSP would block legitimate resources
- **Visibility:** Browser reports violations to console for monitoring
- **Testing:** Validates policy effectiveness before enforcement
- **Gradual rollout:** Can refine policy based on real violation data

## Technical Implementation

### Dual-layer approach
Both Next.js and Vercel headers configured to ensure coverage:
- **Next.js headers():** Applies to server-rendered and API routes
- **Vercel headers:** Applies to static assets and edge cases

### Belt-and-suspenders strategy
Having CSP in both configs ensures:
- Static routes get CSP from Vercel edge
- Dynamic routes get CSP from Next.js server
- No gaps in CSP coverage

## Verification Results

✓ next.config.mjs JavaScript syntax valid
✓ vercel.json JSON syntax valid
✓ CSP policy identical between both files (production mode)
✓ Header key correctly changed to Report-Only in both locations

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Use Report-Only instead of removing CSP | Maintains security monitoring without risk of breaking site |
| Configure CSP in both Next.js and Vercel | Ensures comprehensive coverage across all route types |
| Keep identical policy directives | Provides consistent baseline for violation monitoring |

## Deviations from Plan

None - plan executed exactly as written.

## Files Modified

| File | Changes | Lines |
|------|---------|-------|
| next.config.mjs | Changed CSP header key to Report-Only | 76 |
| vercel.json | Added headers array with CSP Report-Only | 6-16 |

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Migrate CSP to Report-Only mode | 8864a8f | next.config.mjs, vercel.json |

## Next Phase Readiness

**Status:** ✓ Ready to proceed

This change is isolated and backward-compatible. The site will continue functioning identically to before, but now with CSP violation monitoring enabled.

**Recommended next steps:**
1. Monitor browser console for CSP violations in development
2. Review violation reports to identify legitimate vs. malicious activity
3. Refine CSP policy based on violation data
4. Consider re-enabling enforcement mode once policy is validated

**No blockers or concerns.**

## Testing Notes

**Manual verification completed:**
- Syntax validation for both configuration files passed
- CSP policy directives match between Next.js and Vercel configs
- No breaking changes to site functionality expected

**Deployment verification needed:**
After deploying to Vercel:
1. Open browser DevTools Console
2. Visit site pages
3. Check for CSP violation reports
4. Verify `Content-Security-Policy-Report-Only` header present in network tab

---

*Generated: 2026-02-02*
*Execution time: 3 minutes*
