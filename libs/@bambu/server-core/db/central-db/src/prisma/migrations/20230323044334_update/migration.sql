-- CreateTable
CREATE TABLE "connect_advisor" (
    "userId" VARCHAR(36) NOT NULL,
    "tenantId" VARCHAR(36) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "jobTitle" VARCHAR(255) NOT NULL,
    "countryOfResidence" CHAR(3) NOT NULL,
    "finra" VARCHAR(255) NOT NULL,
    "businessName" VARCHAR(255) NOT NULL,
    "businessType" VARCHAR(255) NOT NULL,
    "teamSize" VARCHAR(255) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "connect_advisor_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "connect_advisor" ADD CONSTRAINT "connect_advisor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connect_advisor" ADD CONSTRAINT "connect_advisor_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
