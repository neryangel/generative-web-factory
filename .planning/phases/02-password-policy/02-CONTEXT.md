# Phase 02: Password Policy - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement strong password validation with real-time visual feedback in the signup form. Covers: minimum length, character class requirements, strength indicator, and confirmation field. Sign-in mode is unaffected — validation is signup-only. Password change/reset flows are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Strength indicator
- Segmented bar with 3 segments: weak / medium / strong
- Colors: red / yellow / green
- Hebrew text label shown alongside the bar: חלשה / בינונית / חזקה
- Positioned directly below the password input field

### Validation feedback
- Real-time checklist updates on every keystroke
- Checklist shows all 4 requirements with checkmark/cross icons: 8+ chars, uppercase, lowercase, number
- Checklist appears on focus of the password field (hidden before focus)
- Submit button disabled until all 4 requirements pass AND confirmation matches

### Confirmation field
- Only shown in signup mode (not login)
- Real-time match checking as user types in confirmation field
- Match status shown as inline text below the field: red "הסיסמאות אינן תואמות" or green checkmark
- Confirmation must match for submit to be enabled

### Strength scoring
- Rule-count only: score = number of 4 rules satisfied
  - 1-2 rules = weak (חלשה)
  - 3 rules = medium (בינונית)
  - 4 rules = strong (חזקה)
- No special character bonus — keep it simple, only the 4 stated rules
- All 4 rules must pass to allow signup (strength indicator is informational; the gate is the 4 rules)
- Sign-in mode skips all password validation — existing users with weak passwords can still log in

### Claude's Discretion
- Exact component structure (how PasswordStrengthIndicator is composed)
- Animation/transitions on the strength bar
- Checklist icon styling (using lucide-react or custom)
- Exact spacing and positioning within the RTL form layout
- Whether to extract validation patterns to a separate file or keep inline

</decisions>

<specifics>
## Specific Ideas

- The app is Hebrew/RTL — all labels and feedback must be in Hebrew
- Existing AuthForm uses Shadcn/UI components (Button, Input, Label, Card) — new components should match
- Phase 01 established auth-errors.ts pattern for Hebrew error messages — follow same pattern for validation messages

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-password-policy*
*Context gathered: 2026-02-03*
