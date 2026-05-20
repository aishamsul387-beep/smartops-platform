# SmartOps Pre-Release Verification

## Objective
Use this checklist before staging or production promotion.

## 1. Runtime Services
- [ ] Frontend starts successfully on `http://localhost:3000`
- [ ] Backend starts successfully on `http://localhost:4000/api`
- [ ] Smoke test script passes

## 2. Authentication
- [ ] Login page loads
- [ ] Demo login works with `admin@smartops.local / password123`
- [ ] Logout works
- [ ] Protected route redirects work
- [ ] Session persists after refresh

## 3. Core Routes
- [ ] Dashboard loads
- [ ] Inventory list works
- [ ] Inventory create works
- [ ] Inventory detail works
- [ ] Warehouse overview works
- [ ] Warehouse locations works
- [ ] Warehouse tasks works
- [ ] Task detail and transitions work
- [ ] Orders overview works
- [ ] Quotations works
- [ ] Purchase orders list/create/detail works
- [ ] GRN list/create/detail works
- [ ] Reports page works
- [ ] AI assistant page works

## 4. Configuration
- [ ] `.env.local` is valid
- [ ] `npm run validate-env` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes

## 5. Release Readiness
- [ ] PR checklist reviewed
- [ ] Release checklist reviewed
- [ ] Final milestone snapshot created
- [ ] Rollback plan confirmed