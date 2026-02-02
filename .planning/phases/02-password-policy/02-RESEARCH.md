# Phase 02: Password Policy - Research

**Researched:** 2026-02-03
**Domain:** React form validation with real-time password strength feedback
**Confidence:** HIGH

## Summary

Password validation with real-time visual feedback in React requires combining controlled component patterns with performance-optimized validation logic. The established approach uses `useState` for password input state, `useMemo` for expensive validation calculations, and separate presentational components for strength indicators and checklists.

The CONTEXT.md decisions lock in a simple rule-count scoring system (3 segments: weak/medium/strong based on 4 rules), Hebrew RTL UI, real-time checklist validation with checkmark/cross icons, and a confirmation field with match checking. This is a standard, well-established pattern in React applications with no controversial technical decisions.

Current security best practices (NIST SP 800-63B, 2026 guidelines) emphasize minimum length requirements over complex character class rules, but the decided requirements (8+ chars, upper, lower, number) remain a widely-accepted baseline. The main implementation risks are: premature optimization, inconsistent validation state management, and accessibility gaps (screen reader announcements, keyboard navigation).

**Primary recommendation:** Use controlled inputs with `onChange` handlers, `useMemo` for validation calculation, and lucide-react icons (Check, CircleX) for visual feedback. Extract validation logic to `/src/lib/validation-patterns.ts` following the existing pattern, and Hebrew messages to follow `/src/lib/auth-errors.ts` pattern.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (useState, useMemo) | 18.3.1 | State management + optimization | Built-in hooks, no external dependency needed |
| TypeScript | 5.8.3 | Type-safe validation logic | Already in project, prevents runtime errors |
| lucide-react | 0.462.0 | Check/X icons for validation feedback | Already in project, tree-shakeable, 1600+ icons |
| Shadcn/UI (Input, Label) | — | Form components | Already in use, consistent with existing AuthForm |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx / tailwind-merge | 2.6.0 | Conditional CSS classes | For dynamic styling (red/yellow/green strength bar) |
| Regex patterns | — | Character class validation | Simple requirements, no library needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain useState + inline validation | zxcvbn library | zxcvbn is 800KB, overkill for simple 4-rule validation. User decided rule-count only. |
| Custom validation | react-hook-form + zod | Unnecessary for single form. Current AuthForm uses simple controlled inputs. |
| react-password-checklist | Custom components | Pre-built library doesn't support Hebrew RTL, simple custom build is better |

**Installation:**
No new packages required. All dependencies already installed:
```bash
# Already in package.json:
# - react 18.3.1
# - lucide-react 0.462.0
# - clsx 2.1.1
# - tailwind-merge 2.6.0
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── auth/
│       ├── AuthForm.tsx                      # Main form (modify)
│       └── PasswordStrengthIndicator.tsx     # New component
├── lib/
│   ├── validation-patterns.ts                # Add password regex (modify)
│   └── auth-errors.ts                        # Hebrew messages pattern (reference)
```

### Pattern 1: Controlled Input with useMemo Validation
**What:** Password state managed by `useState`, validation logic memoized with `useMemo`
**When to use:** Real-time validation that involves multiple calculations (our use case)
**Example:**
```typescript
// Source: https://coreui.io/answers/how-to-validate-password-strength-in-react/
// Pattern: Controlled input + useMemo optimization

const [password, setPassword] = useState('');

// Memoize validation to avoid recalculating on every render
const validation = useMemo(() => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    score, // 0-4
    strength: score <= 2 ? 'weak' : score === 3 ? 'medium' : 'strong'
  };
}, [password]);

<Input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onFocus={() => setShowChecklist(true)} // Show checklist on focus
/>
```

### Pattern 2: Separate Presentational Component
**What:** Extract strength indicator to its own component with props interface
**When to use:** When validation UI is reusable or complex enough to separate concerns
**Example:**
```typescript
// Source: React component composition best practices
// Pattern: Props-driven presentational component

interface PasswordStrengthIndicatorProps {
  strength: 'weak' | 'medium' | 'strong';
  score: number; // 0-4
}

function PasswordStrengthIndicator({ strength, score }: PasswordStrengthIndicatorProps) {
  const colors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500'
  };

  const labels = {
    weak: 'חלשה',
    medium: 'בינונית',
    strong: 'חזקה'
  };

  return (
    <div className="space-y-2" dir="rtl">
      {/* Segmented bar: 3 segments */}
      <div className="flex gap-1">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={`h-2 flex-1 rounded transition-colors ${
              score >= segment + 1 ? colors[strength] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <span className="text-sm">{labels[strength]}</span>
    </div>
  );
}
```

### Pattern 3: Validation Checklist with Icons
**What:** Show requirements list with checkmark/cross icons, update in real-time
**When to use:** When user needs to see specific requirements being met (our use case)
**Example:**
```typescript
// Source: lucide-react documentation + form validation patterns
// Pattern: Requirements list with conditional icons

import { Check, CircleX } from 'lucide-react';

const requirements = [
  { key: 'minLength', label: 'לפחות 8 תווים', met: validation.hasMinLength },
  { key: 'uppercase', label: 'אות גדולה', met: validation.hasUppercase },
  { key: 'lowercase', label: 'אות קטנה', met: validation.hasLowercase },
  { key: 'number', label: 'ספרה', met: validation.hasNumber },
];

{showChecklist && (
  <ul className="space-y-1 text-sm" dir="rtl">
    {requirements.map(req => (
      <li key={req.key} className="flex items-center gap-2">
        {req.met ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <CircleX className="w-4 h-4 text-red-500" />
        )}
        <span className={req.met ? 'text-green-700' : 'text-muted-foreground'}>
          {req.label}
        </span>
      </li>
    ))}
  </ul>
)}
```

### Pattern 4: Confirmation Field Real-Time Match Checking
**What:** Second password field that validates match on every keystroke
**When to use:** Signup forms requiring password confirmation (our use case)
**Example:**
```typescript
// Source: https://cluemediator.com/password-and-confirm-password-validation-in-react
// Pattern: Real-time match validation

const [confirmPassword, setConfirmPassword] = useState('');

const passwordsMatch = useMemo(() => {
  if (confirmPassword === '') return null; // Don't show error on empty
  return password === confirmPassword;
}, [password, confirmPassword]);

<Input
  type="password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
/>

{confirmPassword !== '' && (
  <div className="text-sm" dir="rtl">
    {passwordsMatch ? (
      <span className="text-green-600 flex items-center gap-1">
        <Check className="w-4 h-4" /> הסיסמאות תואמות
      </span>
    ) : (
      <span className="text-red-600">הסיסמאות אינן תואמות</span>
    )}
  </div>
)}
```

### Pattern 5: Conditional Rendering Based on Mode
**What:** Show validation only in signup mode, skip in signin mode
**When to use:** When same form handles multiple modes (our use case)
**Example:**
```typescript
// Source: Existing AuthForm.tsx pattern
// Pattern: Mode-conditional rendering

type Mode = 'signin' | 'signup';
const [mode, setMode] = useState<Mode>('signin');

// Only validate in signup mode
const shouldValidate = mode === 'signup';

<Input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onFocus={() => shouldValidate && setShowChecklist(true)}
  minLength={shouldValidate ? 8 : undefined} // HTML5 validation only in signup
/>

{shouldValidate && <PasswordStrengthIndicator {...} />}
{shouldValidate && password && <ValidationChecklist {...} />}
{shouldValidate && <Input /* confirmation field */ />}
```

### Anti-Patterns to Avoid
- **Validating on every render:** Use `useMemo` to avoid recalculating validation when password hasn't changed. Expensive regex tests running on every component update degrades performance.
- **Showing all validation errors immediately:** User decides checklist appears on focus, not on mount. Don't overwhelm user before they start typing.
- **Not memoizing confirmation match:** `password === confirmPassword` seems cheap, but re-running on every render is wasteful. Use `useMemo`.
- **Client-side only validation:** Phase focuses on UI, but planner must include note that server-side validation is required (outside phase scope). Attackers bypass client checks.
- **Ignoring accessibility:** Missing `aria-live` regions for screen readers, no keyboard navigation. Planner should flag accessibility review.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password strength scoring algorithm | Custom heuristics (length + bonus points + dictionary checks) | Simple rule-count (decided) OR zxcvbn library (if complex needed) | User decided simple rule-count. If changing mind later, zxcvbn is industry standard (used by Dropbox, 1Password). Custom algorithms miss edge cases (l33t speak, keyboard patterns, common substitutions). |
| Icon library | Custom SVG components | lucide-react (already installed) | 1600+ icons, tree-shakeable, TypeScript types, actively maintained. Already in package.json. |
| Regex patterns for password rules | Inline regex in components | Extract to `/src/lib/validation-patterns.ts` | Existing project pattern (see DOMAIN_REGEX). DRY principle. Easier to test and modify. Single source of truth. |
| Hebrew error messages | Inline strings | Follow `/src/lib/auth-errors.ts` pattern | Existing project pattern. Centralized translations. Easier to maintain/update. |
| RTL layout | Custom CSS direction handling | Use `dir="rtl"` attribute (already in use) | Existing AuthForm pattern. Browser-native support. Works with Shadcn/UI. |

**Key insight:** Password validation UI is well-trodden territory. The project already has established patterns (validation-patterns.ts, auth-errors.ts, RTL with dir attribute, Shadcn/UI components). Follow existing conventions rather than inventing new ones. The only "new" code is the validation logic itself and the PasswordStrengthIndicator component.

## Common Pitfalls

### Pitfall 1: Performance Degradation from Excessive Re-renders
**What goes wrong:** Every keystroke triggers full component re-render with expensive validation calculations. With large component trees, UI becomes sluggish.
**Why it happens:** Controlled inputs call `onChange` on every keystroke. If validation logic runs inline without memoization, React recalculates even when dependencies haven't changed.
**How to avoid:**
- Use `useMemo` to memoize validation results with `[password]` dependency
- Consider extracting password input state to separate component if AuthForm grows
- Use React DevTools Profiler to measure render performance
**Warning signs:** Typing lag in password field, high render counts in DevTools, fans spinning up during typing.

### Pitfall 2: Inconsistent Validation State During Rapid Typing
**What goes wrong:** User types fast, validation state lags behind, showing stale results. Or confirmation field shows "match" for one frame then "no match."
**Why it happens:** React batches state updates, but multiple `useState` calls can create timing inconsistencies. Password and confirmPassword update separately.
**How to avoid:**
- Use single `useMemo` that depends on both `password` and `confirmPassword` for match check
- Don't split validation logic across multiple state setters
- Test with rapid typing (hold down key, paste long string)
**Warning signs:** Flickering icons, validation state doesn't match visible password, "match" shown when passwords differ.

### Pitfall 3: Password Field Exposes Value in DevTools
**What goes wrong:** Password visible in React DevTools component inspector, browser autofill debugging, or console.logs left in production.
**Why it happens:** Developers debug with React DevTools showing all state, forget to remove console.logs, or browser extensions scrape page data.
**How to avoid:**
- Never `console.log(password)` even during development
- Ensure `type="password"` attribute is set (obscures input)
- Review code for leftover debug statements before commit
- Note: This is a minor concern; real security is server-side
**Warning signs:** Console.logs in code, password visible in DevTools during development (normal, but indicates exposure risk).

### Pitfall 4: RTL Layout Breaks Icon Alignment
**What goes wrong:** Checkmark/cross icons appear on wrong side of text, or strength bar segments render left-to-right in RTL context, creating visual confusion.
**Why it happens:** Mixing `dir="rtl"` with flex layouts that don't respect direction, or forgetting `dir="rtl"` on nested components.
**How to avoid:**
- Apply `dir="rtl"` to validation UI containers, not just root
- Use `flex-row-reverse` if needed for icon placement
- Test with Hebrew text to verify visual alignment
- Follow existing AuthForm RTL patterns
**Warning signs:** Icons on wrong side, text flows right-to-left but layout flows left-to-right, asymmetric spacing.

### Pitfall 5: Confirmation Field Doesn't Clear When Password Changes
**What goes wrong:** User types password, types confirmation (match), then edits original password. Confirmation still shows "match" or doesn't update error state.
**Why it happens:** Confirmation validation only checks on `confirmPassword` change, not `password` change. Missing `password` in `useMemo` dependencies.
**How to avoid:**
- Include BOTH `password` and `confirmPassword` in `useMemo` dependencies
- Test: type password, type confirmation (match), edit original password, verify "no match" appears
**Warning signs:** Editing password doesn't update confirmation validation, user can submit with mismatched passwords.

### Pitfall 6: Submit Button Enabled Before All Rules Pass
**What goes wrong:** User submits form with weak password (e.g., only 2 rules satisfied), or with mismatched confirmation, because submit button isn't properly disabled.
**Why it happens:** Disabled logic checks `password.length >= 8` but not all 4 rules, or forgets to check `passwordsMatch`, or logic only applies in signup mode but mode check is wrong.
**How to avoid:**
- Disabled condition: `mode === 'signup' && (!allRulesPass || !passwordsMatch || loading)`
- Where `allRulesPass = validation.score === 4`
- Test boundary cases: 7 chars (too short), 8 chars but no number, etc.
**Warning signs:** Form submits with red X icons still visible, form submits with "passwords don't match" message showing.

### Pitfall 7: Regex Patterns Don't Match Edge Cases
**What goes wrong:** Password with accented character (Café123) fails uppercase check, or emoji (Pass🔒123) breaks validation, or Unicode number (٣ instead of 3) doesn't count as digit.
**Why it happens:** Simple regex like `/[A-Z]/` only matches ASCII uppercase, not Unicode uppercase. `/\d/` might or might not match Unicode digits depending on regex engine.
**How to avoid:**
- For this project: decided requirements are ASCII-focused (English uppercase/lowercase/digits), so simple regex is correct
- Document assumption: "ASCII characters only" in validation-patterns.ts comments
- If future internationalization needed: use Unicode-aware regex (`/\p{Lu}/u` for uppercase) but adds complexity
**Warning signs:** Users report passwords with non-English characters fail validation, confusion about what "number" means.

### Pitfall 8: Accessibility - Screen Readers Don't Announce Validation State
**What goes wrong:** Visually impaired users see checkmarks change color but screen reader doesn't announce "uppercase requirement met" or "passwords don't match."
**Why it happens:** Visual-only feedback (color, icons) without ARIA live regions or status announcements.
**How to avoid:**
- Add `aria-live="polite"` to validation checklist container
- Add `role="status"` to confirmation match message
- Ensure icon changes are accompanied by text changes (not just color)
- Test with screen reader (macOS VoiceOver, NVDA on Windows)
- Note: Planner should flag this as verification step
**Warning signs:** Screen reader doesn't announce validation changes, only reads initial state.

## Code Examples

Verified patterns from official sources:

### Password Regex Patterns (validation-patterns.ts)
```typescript
// Source: https://dev.to/rasaf_ibrahim/write-regex-password-validation-like-a-pro-5175
// NIST SP 800-63B guidelines: minimum length + character classes

/**
 * Password validation patterns for signup.
 * Requirements: 8+ characters, uppercase, lowercase, number.
 * Note: ASCII characters only (A-Z, a-z, 0-9).
 */

export const PASSWORD_MIN_LENGTH = 8;

// Individual requirement checks (for checklist)
export const PASSWORD_HAS_UPPERCASE = /[A-Z]/;
export const PASSWORD_HAS_LOWERCASE = /[a-z]/;
export const PASSWORD_HAS_NUMBER = /\d/;

// Combined check (for submit validation if needed)
export const PASSWORD_STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Validates password meets all requirements.
 */
export function validatePassword(password: string): {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  score: number; // 0-4
  isValid: boolean; // All 4 rules pass
} {
  const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasUppercase = PASSWORD_HAS_UPPERCASE.test(password);
  const hasLowercase = PASSWORD_HAS_LOWERCASE.test(password);
  const hasNumber = PASSWORD_HAS_NUMBER.test(password);

  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber]
    .filter(Boolean).length;

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    score,
    isValid: score === 4
  };
}
```

### Hebrew Validation Messages Pattern
```typescript
// Source: Existing /src/lib/auth-errors.ts pattern
// Add to new file or extend auth-errors.ts

/**
 * Password validation requirement labels in Hebrew.
 * Used in validation checklist.
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 'לפחות 8 תווים',
  uppercase: 'אות גדולה באנגלית',
  lowercase: 'אות קטנה באנגלית',
  number: 'ספרה',
};

export const PASSWORD_STRENGTH_LABELS = {
  weak: 'חלשה',
  medium: 'בינונית',
  strong: 'חזקה',
};

export const PASSWORD_CONFIRMATION_MESSAGES = {
  match: 'הסיסמאות תואמות',
  noMatch: 'הסיסמאות אינן תואמות',
};
```

### lucide-react Icon Usage
```typescript
// Source: https://lucide.dev/guide/packages/lucide-react
// Usage: Import specific icons, render as React components

import { Check, CircleX, Eye, EyeOff } from 'lucide-react';

// Checkmark for met requirements
<Check className="w-4 h-4 text-green-500" />

// X for unmet requirements
<CircleX className="w-4 h-4 text-red-500" />

// Optional: Show/hide password toggle (out of scope for this phase, but common pattern)
<Eye className="w-4 h-4" />
<EyeOff className="w-4 h-4" />
```

### Controlled Input Pattern (AuthForm integration)
```typescript
// Source: Existing AuthForm.tsx pattern
// Modify password field in signup mode

const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showChecklist, setShowChecklist] = useState(false);

// Only calculate validation in signup mode for performance
const validation = useMemo(() => {
  if (mode === 'signin') return null;
  return validatePassword(password);
}, [mode, password]);

const passwordsMatch = useMemo(() => {
  if (mode === 'signin' || confirmPassword === '') return null;
  return password === confirmPassword;
}, [mode, password, confirmPassword]);

const isSubmitDisabled =
  loading ||
  (mode === 'signup' && (
    !validation?.isValid ||
    passwordsMatch === false
  ));

<div className="space-y-2">
  <Label htmlFor="password">סיסמה</Label>
  <Input
    id="password"
    type="password"
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    onFocus={() => mode === 'signup' && setShowChecklist(true)}
    required
    dir="ltr"
    className="text-left"
  />

  {mode === 'signup' && validation && (
    <PasswordStrengthIndicator
      score={validation.score}
      strength={validation.score <= 2 ? 'weak' : validation.score === 3 ? 'medium' : 'strong'}
    />
  )}

  {mode === 'signup' && showChecklist && (
    <ValidationChecklist validation={validation} />
  )}
</div>

{mode === 'signup' && (
  <div className="space-y-2">
    <Label htmlFor="confirmPassword">אימות סיסמה</Label>
    <Input
      id="confirmPassword"
      type="password"
      placeholder="••••••••"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
      dir="ltr"
      className="text-left"
    />
    {confirmPassword && (
      <div className="text-sm" dir="rtl">
        {passwordsMatch ? (
          <span className="text-green-600 flex items-center gap-1">
            <Check className="w-4 h-4" /> {PASSWORD_CONFIRMATION_MESSAGES.match}
          </span>
        ) : (
          <span className="text-red-600">{PASSWORD_CONFIRMATION_MESSAGES.noMatch}</span>
        )}
      </div>
    )}
  </div>
)}

<Button type="submit" disabled={isSubmitDisabled}>
  {/* ... */}
</Button>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Complex password rules (special chars, mixed case, numbers, rotation) | Minimum length (12-16 chars) + breach database check | NIST SP 800-63B (2017, reaffirmed 2024-2025) | User-decided rules (8+ chars, 4 requirements) are baseline acceptable but not cutting-edge. Modern approach prioritizes length over complexity. |
| Password strength libraries (zxcvbn 800KB) | Simple rule-count or lightweight algorithms | 2020-2026 | For simple requirements, custom validation is preferred. zxcvbn still gold standard for complex scoring. |
| Class components with this.state | Functional components with useState/useMemo | React 16.8+ (2019), standard by 2026 | Project already uses functional components. No migration needed. |
| Uncontrolled inputs with refs | Controlled inputs for validation | Ongoing, depends on use case | For real-time validation, controlled is standard. For performance-critical forms, react-hook-form uses uncontrolled. |
| CSS-in-JS (styled-components) | Utility-first CSS (Tailwind) | 2020-2026 trend | Project uses Tailwind. Follow existing pattern. |

**Deprecated/outdated:**
- **zxcvbn for simple rules**: 800KB library is overkill for 4-rule validation. Use for complex scoring only.
- **react-password-strength (last update 2019)**: Unmaintained. Build custom or use modern alternatives.
- **Class components for forms**: Functional components with hooks are standard in 2026.
- **Password rotation requirements**: NIST explicitly recommends against forced rotation (leads to weaker passwords). Don't implement auto-expiry.

## Open Questions

Things that couldn't be fully resolved:

1. **Should validation regex patterns be in validation-patterns.ts or inline in AuthForm?**
   - What we know: User marked "Claude's discretion" for whether to extract patterns
   - What's unclear: Project preference for file organization (existing validation-patterns.ts has domain validation, but no form validation yet)
   - Recommendation: Extract to validation-patterns.ts. Follows DRY principle, easier to test, matches existing pattern. If validation is reused (e.g., password reset form in future phase), single source of truth.

2. **Should PasswordStrengthIndicator be a separate file or inline in AuthForm?**
   - What we know: User marked "exact component structure" as Claude's discretion
   - What's unclear: How large AuthForm.tsx should grow before extracting components
   - Recommendation: Separate file (`PasswordStrengthIndicator.tsx`). Component is 40-60 lines with props interface, reusable for future password change flows, cleaner imports. AuthForm.tsx is already 140 lines; adding 60+ more is unwieldy.

3. **Should animation/transitions be added to strength bar?**
   - What we know: User marked "animation/transitions" as Claude's discretion
   - What's unclear: Project design philosophy on animations (existing app has some animations per glassmorphism theme)
   - Recommendation: YES, add simple `transition-colors` to strength bar segments (already in example code). Matches existing Button/Card animations. Don't add complex keyframe animations (out of scope, slows development). LOW confidence - depends on designer feedback if project had one.

4. **Accessibility: Should ARIA live regions be included in this phase?**
   - What we know: Phase requirements don't mention accessibility, but it's critical for production
   - What's unclear: Whether accessibility is a separate phase or expected in every phase
   - Recommendation: Include basic ARIA (`aria-live="polite"` on checklist, `role="status"` on confirmation message). Minimal effort, large accessibility impact. Flag for manual testing with screen reader. MEDIUM confidence - depends on project accessibility standards.

5. **Server-side validation: Should phase include API changes?**
   - What we know: Phase description says "Files to modify: AuthForm.tsx, validation-patterns.ts, new: PasswordStrengthIndicator.tsx" - no API files listed
   - What's unclear: Whether server-side validation is separate phase or assumed
   - Recommendation: OUT OF SCOPE for this phase (UI-only). Add TODO comment in code and note in phase completion that server-side validation is required. The current Supabase auth already enforces 6-char minimum; 8-char minimum needs backend update but that's not this phase's job. HIGH confidence - phase scope is clear.

## Sources

### Primary (HIGH confidence)
- React official documentation: https://react.dev/reference/react-dom/components/input - Controlled inputs, onChange patterns
- lucide-react official docs: https://lucide.dev/guide/packages/lucide-react - Icon usage, tree-shaking
- Existing codebase: `/src/components/auth/AuthForm.tsx`, `/src/lib/validation-patterns.ts`, `/src/lib/auth-errors.ts` - Project conventions

### Secondary (MEDIUM confidence)
- CoreUI: [How to validate password strength in React](https://coreui.io/answers/how-to-validate-password-strength-in-react/) - useMemo pattern, Dec 2025
- DEV.to: [Write Regex Pattern for Password Validation Like a Pro](https://dev.to/rasaf_ibrahim/write-regex-password-validation-like-a-pro-5175) - Regex patterns, best practices
- Clue Mediator: [Password and Confirm Password validation in React](https://cluemediator.com/password-and-confirm-password-validation-in-react) - Confirmation field pattern
- Copy Programming: [Password and Confirm Password Validation in Node.js: Complete Guide for 2026](https://copyprogramming.com/howto/password-and-confirm-password-validation-in-node-js) - NIST guidelines, 2026 standards
- LeanCode Blog: [Right-to-left in React: The Developer's Guide](https://leancode.co/blog/right-to-left-in-react) - RTL patterns

### Tertiary (LOW confidence)
- Multiple WebSearch results on password validation patterns - General ecosystem knowledge, not authoritative
- Medium articles on password security statistics (2026) - Informational context, not technical guidance
- Stack Overflow discussions (via search results) - Community patterns, not verified official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies already in package.json, React hooks are standard, no controversial choices
- Architecture patterns: HIGH - Controlled inputs + useMemo is well-established React pattern, verified with official docs and recent articles
- Pitfalls: MEDIUM-HIGH - Common pitfalls documented from web search (performance, RTL, accessibility), some inferred from general React knowledge
- Code examples: HIGH - Patterns verified with official docs (React, lucide-react) and existing codebase, adapted for Hebrew/RTL context

**Research date:** 2026-02-03
**Valid until:** 2026-03-03 (30 days) - React patterns are stable, password validation is mature domain, unlikely to change significantly
