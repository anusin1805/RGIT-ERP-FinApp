# Product Requirements Document (MVP)

## 1. Problem Statement
Construction SMBs lose money due to untracked labor, lost material receipts, and lack of real-time financial visibility.

## 2. Solution
A SaaS-based Construction ERP. Site managers log data instantly; Owners view real-time financial health.

## 3. MVP Scope (Free Tier Optimized)
- **Multi-tenancy:** Secure data isolation per company using `tenant_id`.
- **Financials:** Advance tracking, Expense logging.
- **Labor:** Daily count (skilled/unskilled).
- **Uploads:** Basic photo proof for expenses (stored in S3).
- **Real-time:** Auto-refreshing dashboard.

## 4. Success Metrics
- Build Success on AWS CodeBuild.
- < 2 seconds to load Dashboard.
