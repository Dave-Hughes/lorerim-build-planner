ALTER TABLE "build" ADD COLUMN "drafted_by" text;--> statement-breakpoint
ALTER TABLE "build" ADD COLUMN "show_drafted" boolean DEFAULT true NOT NULL;