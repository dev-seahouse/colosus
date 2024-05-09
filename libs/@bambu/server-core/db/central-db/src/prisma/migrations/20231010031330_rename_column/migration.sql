ALTER TABLE public.investors
    RENAME COLUMN "leadReviewStatus" TO lead_review_status;
ALTER TABLE public.investors
    ALTER COLUMN lead_review_status SET DEFAULT 'NEW';
ALTER TABLE public.investors
    ALTER COLUMN lead_review_status SET NOT NULL;

