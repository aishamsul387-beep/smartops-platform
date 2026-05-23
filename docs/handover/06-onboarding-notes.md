# 06 — Onboarding Notes

## Audience
This document is for developers who need to continue, maintain, or review the SmartOps WMS AI system.

## Repositories
### Frontend Repository
- Name: smartops-platform
- Platform: Vercel
- Purpose: Next.js application for UI, routing, protected pages, and feature modules

### Backend Repository
- Name: smartops-platform-backend
- Platform: Render
- Purpose: Express API for auth and future business APIs

## Current Public URLs
- Frontend: https://smartops-platform.vercel.app
- Backend API: https://smartops-platform-backend.onrender.com/api

## Current Local URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

## Demo Login
- Admin email: admin@smartops.local
- Admin password: password123

## Other Demo Accounts
- manager@smartops.local / password123
- operator@smartops.local / password123
- viewer@smartops.local / password123

## Frontend Working Rules
- Keep route files thin inside src/app
- Put business logic inside src/features
- Keep shared UI inside src/components
- Keep shared infra inside src/services
- Do not put business logic directly inside page.tsx files
- Do not call fetch directly inside shared UI components

## Backend Working Rules
- Keep shared middleware inside src/common/middleware
- Keep validation helpers inside src/common/validators
- Keep API response helpers centralized
- Preserve API response shape consistency
- Do not change public endpoint contracts casually once frontend depends on them

## Daily Local Startup
1. Start backend
2. Start frontend
3. Open login page
4. Sign in with demo admin account
5. Verify key routes before coding

## Before Changing Code
- create a backup or milestone snapshot if the change is structural
- avoid random edits across many files at once
- prefer controlled small packs or focused commits
- test typecheck/build after meaningful changes

## Common Mistakes to Avoid
- editing deployed environment variables without recording changes
- changing backend response shapes without frontend alignment
- mixing old backup/archive files into active work
- pushing large unrelated changes in a single commit
- using preview URLs in CORS config without intention

## Minimum Verification Before Handover or PR
- frontend typecheck passes
- frontend build passes
- backend typecheck passes
- backend build passes
- public login works
- invalid backend route returns JSON error
- key deployed routes load successfully

## Safe Next Work Areas
- backend production hardening continuation
- real inventory backend APIs
- deeper procurement workflow logic
- reports export
- AI backend integration
