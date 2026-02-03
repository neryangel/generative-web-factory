# Requirements: Auth Security Hardening

**Defined:** 2026-01-28
**Core Value:** Users can authenticate securely with clear feedback and protection against common attacks

## v1.0 Requirements

Requirements derived from auth flow audit (25 issues identified).

### Foundation Fixes (FND)

- [x] **FND-01**: CSP migrated to Report-Only for safe monitoring
- [x] **FND-02**: escapeHtml utility available for HTML template safety
- [x] **FND-03**: Edge Functions do not expose raw error messages
- [x] **FND-04**: CORS configuration deduplicated into shared module
- [x] **FND-05**: Israeli phone validation utility with tests

### Critical Security (SEC)

- [x] **SEC-01**: Auth initialization handles race condition correctly (no state flickering)
- [x] **SEC-02**: User-supplied content (full_name) is sanitized before display (XSS protection)
- [x] **SEC-03**: Error messages do not expose internal system details

### Password Policy (PWD)

- [ ] **PWD-01**: Password requires minimum 8 characters
- [ ] **PWD-02**: Password requires at least one uppercase letter
- [ ] **PWD-03**: Password requires at least one lowercase letter
- [ ] **PWD-04**: Password requires at least one number
- [ ] **PWD-05**: Password strength indicator shows visual feedback
- [ ] **PWD-06**: Password confirmation field on signup

### Authentication UX (UX)

- [x] **UX-01**: Form shows loading state during authentication
- [x] **UX-02**: Error messages are user-friendly (Hebrew)
- [x] **UX-03**: "Forgot password" link visible on login form
- [x] **UX-04**: Password visibility toggle available
- [x] **UX-05**: Form clears when switching between signin/signup modes
- [x] **UX-06**: Autocomplete attributes set correctly on form fields

### Profile Security (PROF)

- [ ] **PROF-01**: Profile updates are atomic (metadata + profiles table)
- [ ] **PROF-02**: Full name field validates input length and characters

### Rate Limiting (RATE)

- [ ] **RATE-01**: Client-side rate limiting on login attempts (max 5 per minute)
- [ ] **RATE-02**: Progressive delay after failed attempts

## v2 Requirements

Deferred to future milestone.

### Email Verification

- **EMAIL-01**: User must verify email before accessing dashboard
- **EMAIL-02**: Resend verification email option available
- **EMAIL-03**: Custom email verification redirect page

### Advanced Security

- **ADV-01**: "Remember me" option with sessionStorage
- **ADV-02**: Session timeout configuration
- **ADV-03**: Account deletion with data cleanup (GDPR)

## Out of Scope

| Feature | Reason |
|---------|--------|
| OAuth providers (Google, GitHub) | Adds complexity, core auth security first |
| Two-factor authentication | Future milestone, requires additional infrastructure |
| CAPTCHA | Evaluate after rate limiting implemented |
| Biometric authentication | Web API support limited |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 5 | **Complete** |
| FND-02 | Phase 5 | **Complete** |
| FND-03 | Phase 5 | **Complete** |
| FND-04 | Phase 5 | **Complete** |
| FND-05 | Phase 5 | **Complete** |
| SEC-01 | Phase 1 | **Complete** |
| SEC-02 | Phase 1 | **Complete** |
| SEC-03 | Phase 1 | **Complete** |
| PWD-01 | Phase 2 | Pending |
| PWD-02 | Phase 2 | Pending |
| PWD-03 | Phase 2 | Pending |
| PWD-04 | Phase 2 | Pending |
| PWD-05 | Phase 2 | Pending |
| PWD-06 | Phase 2 | Pending |
| UX-01 | Phase 3 | **Complete** |
| UX-02 | Phase 3 | **Complete** |
| UX-03 | Phase 3 | **Complete** |
| UX-04 | Phase 3 | **Complete** |
| UX-05 | Phase 3 | **Complete** |
| UX-06 | Phase 3 | **Complete** |
| PROF-01 | Phase 4 | Pending |
| PROF-02 | Phase 4 | Pending |
| RATE-01 | Phase 4 | Pending |
| RATE-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 24 total (19 auth + 5 foundation)
- Mapped to phases: 24
- Complete: 14 (Phase 5 + Phase 1 + Phase 3)
- Remaining: 10
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-02-03 — Phase 1 (SEC) and Phase 3 (UX) requirements marked complete*
