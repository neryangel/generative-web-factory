# AMDIR Web Factory

## What This Is

A full-stack web application for building professional websites with AI assistance. Built as a Next.js 16 SaaS platform with multi-tenant architecture, enabling users to create, edit, and publish websites with custom domain support.

## Core Value

Users can create professional websites quickly without coding knowledge, with enterprise-grade security and accessibility.

## Current Milestone: v1.0 Auth Security Hardening

**Goal:** Fix critical security vulnerabilities and improve UX in authentication flows.

**Target features:**
- Fix race condition in auth initialization
- Implement strong password policy
- Add XSS protection for user-supplied content
- Improve error handling and user feedback
- Add rate limiting for auth endpoints

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- [x] User authentication with Supabase (email/password)
- [x] Multi-tenant architecture with tenant isolation
- [x] Site creation and editing
- [x] Custom domain support
- [x] Accessibility widget (WCAG compliance)
- [x] RTL/Hebrew language support

### Active

<!-- Current scope. Building toward these. -->

- [ ] Auth race condition fix
- [ ] Strong password validation
- [ ] XSS sanitization for user content
- [ ] User-friendly error messages
- [ ] Email verification enforcement
- [ ] Rate limiting for auth

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- OAuth login (Google, GitHub) — Focus on core auth security first
- Two-factor authentication — Future milestone
- Account deletion — Needs GDPR compliance review

## Context

**Current state:**
- Auth system uses Supabase Auth (client-side)
- 25 issues identified in auth flow audit (3 critical, 6 high, 9 medium, 5 low)
- Credentials were previously exposed in git history (need rotation)
- Password policy is weak (only 6 chars minimum)
- No email verification enforcement

**Technical environment:**
- Next.js 16, React 18, TypeScript
- Supabase for auth, database, storage
- Tailwind CSS, Shadcn/UI
- Deployed on Vercel

## Constraints

- **Stack**: Must use existing Supabase Auth (no migration)
- **Compatibility**: Must maintain backward compatibility with existing users
- **Security**: All changes must pass security review

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Supabase Auth | Already integrated, managed service | ✓ Good |
| Client-side auth only | Simpler architecture | ⚠️ Revisit (consider SSR) |

---
*Last updated: 2026-01-28 after auth audit*
