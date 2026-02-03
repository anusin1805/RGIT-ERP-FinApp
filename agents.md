# Agent Task List

## Phase 1: SaaS Refactor
- [ ] **Schema Update:** Modify `shared/schema.ts`. Add `tenant_id: text("tenant_id").notNull()` to `users`, `financialRecords`, `laborRecords`.
- [ ] **Auth Middleware:** Create `server/middleware/auth.ts`. Extract `tenant_id` from the user session/token and attach it to `req`.
- [ ] **Query Update:** Update ALL Drizzle queries in `server/storage.ts` to include `.where(eq(table.tenantId, req.user.tenantId))`.

## Phase 2: AWS Prep
- [ ] **Adapter:** Install `serverless-http`. Create `server/lambda.ts` exporting the wrapped Express app.
- [ ] **Environment:** Move `DATABASE_URL` to AWS Secrets Manager (or Lambda Env Vars for MVP).
- [ ] **Build Script:** Ensure `script/build.ts` is committed and working.

## Phase 3: Deployment
- [ ] **Frontend:** Connect Repo to AWS Amplify Console.
- [ ] **Backend:** Deploy Lambda via CDK or simple ZIP upload for MVP.
