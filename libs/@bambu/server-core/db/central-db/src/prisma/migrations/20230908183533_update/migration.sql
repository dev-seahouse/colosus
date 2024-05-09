-- CreateTable
CREATE TABLE "questionnaires" (
    "id" VARCHAR(36) NOT NULL,
    "questionnaire_type" VARCHAR(36) NOT NULL,
    "questionnaire_name" VARCHAR(36) NOT NULL,
    "questionnaire_description" VARCHAR(255) NOT NULL,
    "active_version" BIGINT NOT NULL,
    "tenant_id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionnaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_versions" (
    "id" VARCHAR(36) NOT NULL,
    "version_number" BIGINT NOT NULL,
    "version_description" VARCHAR(255) NOT NULL,
    "version_notes" VARCHAR(255) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "questionnaire_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "questionnaire_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_groupings" (
    "id" VARCHAR(36) NOT NULL,
    "grouping_type" VARCHAR(36) NOT NULL,
    "grouping_name" VARCHAR(36) NOT NULL,
    "questionnaire_groupings" DECIMAL(10,8) NOT NULL,
    "scoring_rules" VARCHAR(36) NOT NULL,
    "sort_key" INTEGER NOT NULL,
    "additional_configuration" JSONB NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "questionnaire_version_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "questionnaire_groupings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_questions" (
    "id" VARCHAR(36) NOT NULL,
    "question" VARCHAR(255) NOT NULL,
    "question_type" VARCHAR(36) NOT NULL,
    "question_format" VARCHAR(36) NOT NULL,
    "question_weight" DECIMAL(10,8) NOT NULL,
    "sort_key" INTEGER NOT NULL,
    "additional_configuration" JSONB NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "questionnaire_question_groupings_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "questionnaire_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_answers" (
    "id" VARCHAR(36) NOT NULL,
    "answer" VARCHAR(255) NOT NULL,
    "score" DECIMAL(10,8) NOT NULL,
    "sort_key" INTEGER NOT NULL,
    "additional_configuration" JSONB NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "risk_profile_question_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "questionnaire_answers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_versions" ADD CONSTRAINT "questionnaire_versions_questionnaire_id_fkey" FOREIGN KEY ("questionnaire_id") REFERENCES "questionnaires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_groupings" ADD CONSTRAINT "questionnaire_groupings_questionnaire_version_id_fkey" FOREIGN KEY ("questionnaire_version_id") REFERENCES "questionnaire_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_questions" ADD CONSTRAINT "questionnaire_questions_questionnaire_question_groupings_i_fkey" FOREIGN KEY ("questionnaire_question_groupings_id") REFERENCES "questionnaire_groupings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_answers" ADD CONSTRAINT "questionnaire_answers_risk_profile_question_id_fkey" FOREIGN KEY ("risk_profile_question_id") REFERENCES "questionnaire_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
