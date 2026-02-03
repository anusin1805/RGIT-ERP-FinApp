# AWS SaaS Architecture (Free Tier)

## Diagram
[React Client] -> [CloudFront/Amplify]
      |
      v
[API Gateway] -> [Lambda (Express App)] -> [RDS PostgreSQL]
                                     |-> [S3 (Images)]
                                     |-> [Cognito (Auth)]

## Component Details
1. **Compute:** AWS Lambda running Node.js 20. Wraps the Express app using `serverless-http`.
   - *Reason:* Zero cost when idle. Scales automatically.
2. **Database:** Amazon RDS (Postgres).
   - *Config:* db.t3.micro, Public Access = No.
   - *SaaS Pattern:* Shared Database, Shared Schema. Column `tenant_id` enforces isolation.
3. **Storage:** S3 Bucket `rgit-erp-uploads`.
   - *Rules:* Block public access. Use Pre-signed URLs for secure uploads.
4. **Auth:** Cognito User Pool.
   - *Custom Attribute:* `custom:tenant_id` stored in the JWT token.

## Cost Hazards
- **RDS:** Must stop/terminate after 12 months or migrate to DynamoDB to remain free.
- **NAT Gateway:** Do NOT use a VPC NAT Gateway (costs $30/mo). Place Lambda in VPC only if strictly necessary, otherwise keep Lambda outside VPC and secure RDS via Security Groups.
