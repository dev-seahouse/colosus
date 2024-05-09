-- AlterTable
ALTER TABLE connect_advisor RENAME COLUMN "businessName" TO business_name;
ALTER TABLE connect_advisor RENAME COLUMN "businessType" TO business_type;
ALTER TABLE connect_advisor RENAME COLUMN "countryOfResidence" TO country_of_residence;
ALTER TABLE connect_advisor RENAME COLUMN "firstName" TO first_name;
ALTER TABLE connect_advisor RENAME COLUMN "jobTitle" TO job_title;
ALTER TABLE connect_advisor RENAME COLUMN "lastName" TO last_name;
ALTER TABLE connect_advisor RENAME COLUMN "teamSize" TO team_size;
ALTER TABLE connect_advisor RENAME COLUMN "tenantId" TO tenant_id;


-- AlterTable
ALTER TABLE otp RENAME COLUMN "expiresAt" TO expires_at;
ALTER TABLE otp RENAME COLUMN "otpState" TO otp_state;
ALTER TABLE otp RENAME COLUMN "tenantId" TO tenant_id;
ALTER TABLE otp RENAME COLUMN "userId" TO user_id;

-- AlterTable
ALTER TABLE tenant_http_urls RENAME COLUMN "tenantId" TO tenant_id;

-- AlterTable
ALTER TABLE "user" RENAME COLUMN "tenantId" TO tenant_id;
