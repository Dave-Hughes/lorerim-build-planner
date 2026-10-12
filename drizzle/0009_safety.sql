CREATE TABLE "build_report" (
	"id" serial PRIMARY KEY NOT NULL,
	"build_id" text NOT NULL,
	"reporter_id" text NOT NULL,
	"reason" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cleared_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "hidden_image" (
	"url" text PRIMARY KEY NOT NULL,
	"hidden_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image_check" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text,
	"uploader_id" text,
	"build_id" text,
	"kind" text NOT NULL,
	"scores" jsonb,
	"outcome" text NOT NULL,
	"review" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "build_report" ADD CONSTRAINT "build_report_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_report" ADD CONSTRAINT "build_report_reporter_id_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_check" ADD CONSTRAINT "image_check_uploader_id_user_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_check" ADD CONSTRAINT "image_check_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_event" ADD CONSTRAINT "rate_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "build_report_once_idx" ON "build_report" USING btree ("build_id","reporter_id");--> statement-breakpoint
CREATE INDEX "build_report_reporter_idx" ON "build_report" USING btree ("reporter_id","created_at");--> statement-breakpoint
CREATE INDEX "image_check_review_idx" ON "image_check" USING btree ("review","created_at");--> statement-breakpoint
CREATE INDEX "image_check_url_idx" ON "image_check" USING btree ("url");--> statement-breakpoint
CREATE INDEX "rate_event_user_idx" ON "rate_event" USING btree ("user_id","kind","at");