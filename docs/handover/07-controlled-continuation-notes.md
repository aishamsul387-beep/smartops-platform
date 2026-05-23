# 07 — Controlled Continuation Notes

## Purpose
This document defines how SmartOps WMS AI should be continued safely after the current deployed stable milestone.

## Current Stable Baseline
- frontend deployed on Vercel
- backend deployed on Render
- public login works
- protected routes work
- inventory / warehouse / tasks / orders / reports / AI foundations work
- backend health, demo accounts, and JSON error handling work

## Main Continuation Rule
Do not introduce random large changes directly on the currently stable deployed branch/repo state.

## Required Working Discipline
- work in controlled small packs only
- typecheck before build-sensitive changes are considered complete
- create snapshots before structural refactors
- keep frontend and backend contracts aligned
- prefer one focused objective per session

## Do Not Do
- do not rename routes casually
- do not change API response shapes without checking frontend usage
- do not mix legacy backup/archive code into active code
- do not push unrelated frontend and backend changes in one milestone commit
- do not bypass deployment environment verification

## Safe Next Priorities
1. backend production hardening continuation
2. release/main branch workflow cleanup
3. professional documentation completion
4. real inventory backend APIs
5. deeper procurement workflow logic
6. reports export and reporting backend integration
7. AI backend integration with safety guardrails

## Recommended Next Technical Track
### Backend
- replace mock auth/session storage with persistent storage
- add rate limiting
- add schema validation library
- add audit/event persistence
- add real module endpoints gradually

### Frontend
- keep route files thin
- extend features using existing feature structure
- preserve protected layout and app shell pattern
- continue with real API integration module by module

## Safe Module Expansion Order
1. inventory real backend APIs
2. warehouse and task real backend APIs
3. procurement workflow real APIs
4. reports real backend queries/export
5. AI assistant real backend integration

## Before Any New Milestone
- confirm local frontend starts
- confirm local backend starts
- confirm public health endpoint works
- confirm public login still works
- save a snapshot if the change is structural

## Definition of a Safe Commit
- focused scope
- clear message
- no accidental backup/archive files included
- frontend and backend changes separated when practical
- build/typecheck already verified

## When to Stop and Re-check
Stop and verify again if any of these happen:
- login breaks
- refresh redirects unexpectedly
- invalid route stops returning JSON
- Vercel or Render env vars are changed
- route structure changes
- auth/session storage logic changes
