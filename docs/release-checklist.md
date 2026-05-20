# Release Checklist

## Pre-Release
- [ ] Main branch is green
- [ ] CI passed
- [ ] Build passed
- [ ] Required env vars verified
- [ ] Staging deployment successful
- [ ] Release notes prepared

## Functional Validation
- [ ] Login works
- [ ] Session persists after refresh
- [ ] Protected routes work
- [ ] Dashboard loads
- [ ] Inventory routes work
- [ ] Warehouse routes work
- [ ] Orders routes work
- [ ] Reports route works
- [ ] AI assistant route works

## Data / Workflow Validation
- [ ] Inventory list/create/detail reviewed
- [ ] Warehouse tasks transition flow reviewed
- [ ] Purchase order create/detail reviewed
- [ ] GRN create/detail reviewed

## Production Readiness
- [ ] Error monitoring enabled
- [ ] Logging strategy confirmed
- [ ] Rollback plan confirmed
- [ ] Stakeholder/UAT signoff complete

## Release
- [ ] Production deploy executed
- [ ] Smoke test completed
- [ ] Team notified
- [ ] Post-release monitoring active