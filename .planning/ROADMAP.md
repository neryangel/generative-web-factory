# Roadmap: Auth Security Hardening v1.0

**Created:** 2026-01-28
**Milestone:** v1.0 Auth Security Hardening
**Phases:** 4
**Requirements covered:** 19/19 (100%)

## Overview

| Phase | Name | Goal | Requirements | Effort |
|-------|------|------|--------------|--------|
| 01 | Critical Security Fixes | Eliminate security vulnerabilities | SEC-01, SEC-02, SEC-03 | 1 day |
| 02 | Password Policy | Implement strong password requirements | PWD-01 to PWD-06 | 1 day |
| 03 | Auth UX Improvements | Improve user experience | UX-01 to UX-06 | 1 day |
| 04 | Profile & Rate Limiting | Harden profile and prevent abuse | PROF-01, PROF-02, RATE-01, RATE-02 | 1 day |

---

## Phase 01: Critical Security Fixes

**Goal:** Eliminate the 3 critical security vulnerabilities identified in audit

**Requirements:**
- SEC-01: Auth initialization race condition fix
- SEC-02: XSS protection for user content
- SEC-03: Safe error messages

**Success Criteria:**
1. User can refresh page without auth state flickering
2. Malicious input in full_name field is sanitized on display
3. Failed auth shows user-friendly message, not raw error

**Files to modify:**
- `/src/hooks/useAuth.tsx` — race condition fix
- `/src/views/Settings.tsx` — sanitize full_name display
- `/src/components/auth/AuthForm.tsx` — error message handling

**Dependencies:** None (can start immediately)

---

## Phase 02: Password Policy

**Goal:** Implement strong password requirements with visual feedback

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

## Phase 03: Auth UX Improvements

**Goal:** Improve authentication user experience

**Requirements:**
- UX-01: Loading states
- UX-02: Hebrew error messages
- UX-03: Forgot password link
- UX-04: Password visibility toggle
- UX-05: Form clearing on mode switch
- UX-06: Autocomplete attributes

**Success Criteria:**
1. User sees loading spinner during auth operations
2. All error messages display in Hebrew
3. User can toggle password visibility
4. User can navigate to password reset from login

**Files to modify:**
- `/src/components/auth/AuthForm.tsx` — all UX improvements
- New: `/src/lib/error-messages.ts` — Hebrew error mapping

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
