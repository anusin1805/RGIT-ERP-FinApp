# AWS SaaS Architecture (Free Tier)

## Infrastructure
[React Client] -> [AWS Amplify / S3 Hosting]
      |
      v
[API Gateway] -> [Lambda (Express App)] -> [RDS PostgreSQL]
                                     |-> [S3 (Images)]
                                     |-> [Cognito (Auth)]

## Critical Configurations
- **Build System:** AWS CodeBuild running Node.js 20.
- **Frontend Config:** `vite.config.ts` must have `base: '/RGIT-ERP-FinApp/'` for GitHub Pages support.
- **File Structure:** Flat structure (`index.html` at root) to ensure Vite can resolve imports correctly.

## Data Model (SaaS)
- **Tenant Isolation:** All tables (`users`, `financial_records`, `labor`) MUST include `tenant_id`.
- **RLS (Row Level Security):** Application-level filtering required in API layer.
