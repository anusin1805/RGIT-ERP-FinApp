# Product Requirements Document (MVP)

## 1. Problem Statement
Construction SMBs lose money due to untracked labor, lost material receipts, and lack of real-time financial visibility. Existing tools are too expensive or complex.

## 2. Solution
A SaaS-based Construction ERP allowing site managers to log data instantly and owners to view financial health in real-time.

## 3. Users
- **Owner (Admin):** Views dashboards, manages budget, invites site managers.
- **Site Manager:** Logs daily labor, expenses, and materials.

## 4. MVP Scope
- **Multi-tenancy:** Secure isolation of data per company.
- **Financials:** Advance tracking, Expense logging.
- **Labor:** Daily count (skilled/unskilled).
- **Uploads:** Basic photo proof for expenses (stored in S3).
- **Real-time:** Auto-refreshing dashboard for Owners.

## 5. Success Metrics
- < 2 seconds to load Dashboard.
- Zero data leaks between tenants.
- 100% uptime on "Add Expense" feature.
