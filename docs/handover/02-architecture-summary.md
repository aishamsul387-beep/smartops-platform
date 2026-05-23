# 02 — Architecture Summary

## Architecture Style
Feature-based frontend architecture with a separate backend API service.

## Frontend Stack
- Next.js App Router
- React
- TypeScript
- Vercel deployment

## Backend Stack
- Express
- TypeScript
- Render deployment

## Frontend Structure
- src/app -> routing layer only
- src/features -> business/domain logic
- src/components -> shared UI/layout
- src/services -> shared infrastructure
- src/lib -> routes, permissions, config
- src/store -> global shared state
- src/types -> shared type contracts
- src/styles -> global styles
- docs -> release/handover/runbook docs
- scripts -> smoke, snapshot, validation, release helpers

## Backend Structure
- src/config -> environment loading
- src/common/errors -> error classes
- src/common/middleware -> request ID, request logging, auth guard, security, 404, error handling
- src/common/http -> response helpers
- src/common/auth -> bearer token extraction
- src/common/validators -> reusable validation rules and request validators
- src/lib -> mock auth/session engine
- src/types -> auth and Express request typings
- docs -> runbook/checklists
- scripts -> validation, smoke, milestone helpers

## Auth Model
- frontend stores auth session locally
- frontend route protection uses protected layout
- frontend session bootstrap hydrates session on load
- backend issues mock access token + refresh token
- backend exposes login / me / refresh / logout endpoints

## Core Design Rules
- no business logic in route page files
- no direct API calls in UI rendering components
- feature-owned business logic stays inside src/features
- shared infrastructure stays inside services or backend common layers
- validation is centralized per module
- response shapes should stay consistent across local and deployed environments

## Current Deployment Model
- frontend and backend are separate repositories
- frontend consumes backend through NEXT_PUBLIC_API_BASE_URL
- backend CORS is configured to allow deployed frontend domains
