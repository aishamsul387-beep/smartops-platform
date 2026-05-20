# Backend Cleanup Backlog

## Known architectural debt
- manual table creation happened during development
- migration chain needs verification from scratch
- tenant_id vs business_id inconsistency exists
- some transaction totals may still need response harmonization
- auth is still header-based dev auth
- tests are not yet sufficient
- swagger/api docs not yet added

## Priority order
1. migration reproducibility
2. schema naming consistency plan
3. automated tests
4. auth/permission hardening
5. OpenAPI / Swagger
