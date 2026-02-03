# Agent Task List

## Active Phase: Deployment Troubleshooting

- [x] **Fix Build Script:** Restore `script/build.ts` to support backend bundling.
- [x] **Fix Path Resolution:** Move `index.html` to root and update `vite.config.ts`.
- [ ] **Fix Extension Mismatch:** Update `index.html` to load `/src/main.jsx` instead of `.tsx`.

## Next Steps: Backend Integration
- [ ] **Database Setup:** Create RDS Postgres instance (Free Tier: db.t3.micro).
- [ ] **Env Vars:** Configure `DATABASE_URL` in Lambda environment variables.
- [ ] **API Adapter:** Wrap Express app with `serverless-http` for Lambda execution.
