-- CreateTable
CREATE TABLE "goal_type" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(2047) NOT NULL,
    "sort_key" INTEGER NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connect_tenant_goal_type" (
    "id" VARCHAR(36) NOT NULL,
    "tenant_id" VARCHAR(36) NOT NULL,
    "goal_type_id" VARCHAR(36) NOT NULL,
    "sort_key" INTEGER NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "connect_tenant_goal_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "goal_type_name_key" ON "goal_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "goal_type_sort_key_key" ON "goal_type"("sort_key");

-- CreateIndex
CREATE UNIQUE INDEX "connect_tenant_goal_type_tenant_id_goal_type_id_key" ON "connect_tenant_goal_type"("tenant_id", "goal_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "connect_tenant_goal_type_tenant_id_sort_key_key" ON "connect_tenant_goal_type"("tenant_id", "sort_key");

-- AddForeignKey
ALTER TABLE "connect_tenant_goal_type" ADD CONSTRAINT "connect_tenant_goal_type_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connect_tenant_goal_type" ADD CONSTRAINT "connect_tenant_goal_type_goal_type_id_fkey" FOREIGN KEY ("goal_type_id") REFERENCES "goal_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
