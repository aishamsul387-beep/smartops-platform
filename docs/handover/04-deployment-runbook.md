# 04 — Deployment Runbook

## Deployment Targets
- Frontend platform: Vercel
- Backend platform: Render

## Frontend Repository
- Repo name: smartops-platform
- Production branch: milestone/release-readiness-20260521

## Backend Repository
- Repo name: smartops-platform-backend
- Production branch: milestone/backend-foundation-20260521

## Public URLs
- Frontend: https://smartops-platform.vercel.app
- Backend API: https://smartops-platform-backend.onrender.com/api
- Backend Health: https://smartops-platform-backend.onrender.com/api/health
- Backend Demo Accounts: https://smartops-platform-backend.onrender.com/api/auth/demo-accounts

## Frontend Deployment on Vercel
1. Import GitHub repo `smartops-platform` into Vercel.
2. Confirm framework preset is `Next.js`.
3. Keep install command as `npm ci`.
4. Keep build command as `npm run build`.
5. Set production branch to `milestone/release-readiness-20260521`.
6. Add environment variables before deploy.
7. Deploy and wait until status is `Ready`.

## Frontend Environment Variables
- NEXT_PUBLIC_APP_NAME = SmartOps WMS AI
- NEXT_PUBLIC_APP_URL = https://smartops-platform.vercel.app
- NEXT_PUBLIC_API_BASE_URL = https://smartops-platform-backend.onrender.com/api
- NEXT_PUBLIC_DEFAULT_PAGE_SIZE = 20
- NEXT_PUBLIC_ENABLE_AI = true
- NEXT_PUBLIC_ENABLE_REPORT_EXPORT = false
- NEXT_PUBLIC_AUTH_STORAGE_KEY = smartops.session
- NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS = 300000
- NEXT_PUBLIC_SENTRY_DSN = disabled

## Backend Deployment on Render
1. Create a Render Web Service.
2. Connect GitHub repo `smartops-platform-backend`.
3. Choose branch `milestone/backend-foundation-20260521`.
4. Runtime = Node.
5. Build command = `npm ci && npm run build`.
6. Start command = `npm run start`.
7. Save environment variables.
8. Deploy and wait until status is `Live`.

## Backend Environment Variables
- API_PREFIX = /api
- NODE_ENV = production
- FRONTEND_URL = https://smartops-platform.vercel.app
- FRONTEND_URLS = https://smartops-platform.vercel.app,https://smartops-platform-git-mileston-c15877-ai-kee-shamsul-s-projects.vercel.app,https://smartops-platform-bbr6ulami-ai-kee-shamsul-s-projects.vercel.app
- ALLOW_VERCEL_PREVIEW_DOMAINS = true

## Important Render Note
- Do not manually set PORT on Render.
- Render provides PORT automatically.

## Safe Redeploy Process
### Frontend changes
1. Update Vercel environment variables if needed.
2. Redeploy latest frontend deployment.
3. Verify login and protected routes.

### Backend changes
1. Update Render environment variables if needed.
2. Manual Deploy -> Deploy latest commit.
3. Verify /api/health and /api/auth/demo-accounts.
4. Verify invalid route returns JSON error.

## Public Verification Checklist
- Frontend login page loads
- Demo login works
- Dashboard loads after login
- Inventory page loads
- Warehouse page loads
- Tasks page loads
- Orders page loads
- Reports page loads
- AI Assistant page loads
- Backend health endpoint returns JSON
- Backend demo accounts endpoint returns JSON
- Invalid backend route returns JSON error

## Demo Login
- Email: admin@smartops.local
- Password: password123

## Rollback Guidance
- Keep previous working deployment in Vercel history
- Keep previous working deployment in Render history
- If deploy breaks, rollback environment variables first
- Then redeploy previous known-good commit if needed
