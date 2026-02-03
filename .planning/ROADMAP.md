# Roadmap: Auth Security Hardening v1.0

**Created:** 2026-01-28
**Milestone:** v1.0 Auth Security Hardening
**Phases:** 5
**Requirements covered:** 19/19 + 5 foundation (100%)

## Overview

| Phase | Name | Goal | Requirements | Effort | Status |
|-------|------|------|--------------|--------|--------|
| 05 | Foundation Fixes | CSP, XSS protection, CORS dedup, phone validation | FND-01 to FND-05 | 1 day | **Complete** |
| 01 | Critical Security Fixes | Eliminate security vulnerabilities | SEC-01, SEC-02, SEC-03 | 1 day | **Complete** |
| 02 | Password Policy | Implement strong password requirements | PWD-01 to PWD-06 | 1 day | Planned |
| 03 | Auth UX Improvements | Improve user experience | UX-01 to UX-06 | 1 day | **Complete** |
| 04 | Profile & Rate Limiting | Harden profile and prevent abuse | PROF-01, PROF-02, RATE-01, RATE-02 | 1 day | Pending |

---

## Phase 05: Foundation Fixes ✅

**Goal:** Harden infrastructure security: CSP, XSS protection, CORS consistency, input validation

**Requirements:**
- FND-01: CSP migrated to Report-Only for safe monitoring
- FND-02: escapeHtml utility available for HTML template safety
- FND-03: Edge Functions do not expose raw error messages
- FND-04: CORS configuration deduplicated into shared module
- FND-05: Israeli phone validation utility with tests

**Success Criteria:**
1. CSP Report-Only header in both next.config.mjs and vercel.json
2. escapeHtml function in backend (_shared/validation.ts) and frontend (src/lib/escapeHtml.ts)
3. All 4 Edge Functions return generic error messages (no error.message exposure)
4. All 4 Edge Functions import CORS from _shared/cors.ts
5. Phone validation passes 31 tests

**Completed:** 2026-02-02

**Files modified:**
- `next.config.mjs` — CSP header key changed to Report-Only
- `vercel.json` — CSP Report-Only header added
- `supabase/functions/_shared/cors.ts` — new shared CORS module
- `supabase/functions/_shared/validation.ts` — escapeHtml + phone validation added
- `supabase/functions/generate-site/index.ts` — shared CORS import
- `supabase/functions/get-published-site/index.ts` — shared CORS + generic errors
- `supabase/functions/manage-vercel-domain/index.ts` — shared CORS + generic errors
- `supabase/functions/verify-domain/index.ts` — shared CORS + generic errors
- `src/lib/escapeHtml.ts` — new frontend HTML escaping utility
- `src/lib/escapeHtml.test.ts` — 15 tests
- `src/lib/sanitize.test.ts` — 16 tests for DOMPurify functions
- `src/lib/phone-validation.ts` — new frontend phone validation
- `src/lib/phone-validation.test.ts` — 31 tests

**Dependencies:** None (foundation phase, no upstream dependencies)

---

## Phase 01: Critical Security Fixes ✅

**Goal:** Eliminate the 3 critical security vulnerabilities identified in audit

**Requirements:**
- SEC-01: Auth initialization race condition fix
- SEC-02: XSS protection for user content
- SEC-03: Safe error messages

**Success Criteria:**
1. User can refresh page without auth state flickering
2. Malicious input in full_name field is sanitized on display
3. Failed auth shows user-friendly message, not raw error

**Completed:** 2026-02-03

**Files modified:**
- `src/hooks/useAuth.tsx` — race condition fix (removed redundant getSession() call; onAuthStateChange handles INITIAL_SESSION)
- `src/hooks/useAuth.test.tsx` — race condition tests
- `src/views/Settings.tsx` — sanitizeText() defense-in-depth for full_name
- `src/lib/auth-errors.ts` — new Hebrew error message mapping
- `src/lib/auth-errors.test.ts` — new error mapping tests
- `src/components/auth/AuthForm.tsx` — safe Hebrew error messages via auth-errors.ts

**Dependencies:** None (can start immediately)

---

## Phase 02: Password Policy

**Goal:** Implement strong password requirements with visual feedback

**Plans:** 2 plans

Plans:
- [ ] 02-01-PLAN.md — TDD password validation logic (validatePassword function + tests)
- [ ] 02-02-PLAN.md — PasswordStrengthIndicator component + AuthForm integration + confirmation field

**Requirements:**
- PWD-01: Minimum 8 characters
- PWD-02: Uppercase letter required
- PWD-03: Lowercase letter required
- PWD-04: Number required
- PWD-05: Strength indicator
- PWD-06: Confirmation field

**Success Criteria:**
1. User cannot submit password shorter than 8 characters
2. User sees real-time password strength indicator
3. User must confirm password matches before signup

**Files to modify:**
- `/src/components/auth/AuthForm.tsx` — validation logic, UI
- `/src/lib/validation-patterns.ts` — password regex patterns
- New: `/src/components/auth/PasswordStrengthIndicator.tsx`

**Dependencies:** Phase 01 (error handling patterns)

---

## Phase 03: Auth UX Improvements ✅

**Goal:** Improve authentication user experience with password toggles, autocomplete, form clearing, and forgot password flow

**Requirements:**
- UX-01: Loading states (already implemented)
- UX-02: Hebrew error messages (already implemented in Phase 01)
- UX-03: Forgot password link
- UX-04: Password visibility toggle
- UX-05: Form clearing on mode switch
- UX-06: Autocomplete attributes

**Success Criteria:**
1. User sees loading spinner during auth operations (already working)
2. All error messages display in Hebrew (already working)
3. User can toggle password visibility on password field
4. User can navigate to password reset from login via "שכחתי סיסמה" link

**Completed:** 2026-02-03

**Files modified:**
- `src/components/auth/AuthForm.tsx` — password visibility toggle, autocomplete attributes, form clearing, forgot password link
- `src/lib/auth-errors.ts` — password reset error mappings

**Dependencies:** Phase 02 (password field changes)

---

## Phase 04: Profile & Rate Limiting

**Goal:** Secure profile updates and prevent brute force attacks

**Requirements:**
- PROF-01: Atomic profile updates
- PROF-02: Full name validation
- RATE-01: Rate limiting (5/min)
- RATE-02: Progressive delays

**Success Criteria:**
1. Profile update either fully succeeds or fully fails (no partial state)
2. Full name field rejects invalid characters
3. After 5 failed login attempts, user must wait before retrying
4. Delay increases with each failed attempt

**Files to modify:**
- `/src/views/Settings.tsx` — atomic updates, name validation
- `/src/hooks/useAuth.tsx` — rate limiting logic
- New: `/src/lib/rate-limiter.ts` — rate limiting utility

**Dependencies:** Phase 03 (error handling for rate limit messages)

---

## Milestone Completion

**Definition of Done:**
- [ ] All 19 requirements implemented and verified
- [ ] All tests pass
- [ ] No new security warnings in audit
- [ ] Code reviewed and merged

**External Actions Required (before milestone):**
- [ ] Rotate Supabase API keys (credentials exposed in git history)
- [ ] Rotate Vercel tokens

---
*Roadmap created: 2026-01-28*
