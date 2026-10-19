ALTER TABLE "rate_event" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rate_event" ADD COLUMN "subject" text;--> statement-breakpoint
CREATE INDEX "rate_event_subject_idx" ON "rate_event" USING btree ("subject","kind","at");