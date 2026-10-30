CREATE TABLE "page_screenshot" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"key" text NOT NULL,
	"original_url" text NOT NULL,
	"url" text NOT NULL,
	"thumb_url" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'review' NOT NULL,
	"lead" boolean DEFAULT false NOT NULL,
	"check" text DEFAULT 'unchecked' NOT NULL,
	"scores" jsonb,
	"report_note" text,
	"reported_by" text,
	"reported_at" timestamp with time zone,
	"decided_by" text,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_tip" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"key" text NOT NULL,
	"type" text DEFAULT 'know' NOT NULL,
	"field" text DEFAULT '' NOT NULL,
	"words" text NOT NULL,
	"how" text DEFAULT 'game' NOT NULL,
	"link" text,
	"screenshot_url" text,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"reading" jsonb,
	"shown" text,
	"decided_by" text,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_view" (
	"kind" text NOT NULL,
	"key" text NOT NULL,
	"day" text NOT NULL,
	"n" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "page_view_kind_key_day_pk" PRIMARY KEY("kind","key","day")
);
--> statement-breakpoint
CREATE TABLE "trusted_player" (
	"user_id" text PRIMARY KEY NOT NULL,
	"added_by" text,
	"source" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "page_screenshot" ADD CONSTRAINT "page_screenshot_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_screenshot" ADD CONSTRAINT "page_screenshot_reported_by_user_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_screenshot" ADD CONSTRAINT "page_screenshot_decided_by_user_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_tip" ADD CONSTRAINT "page_tip_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_tip" ADD CONSTRAINT "page_tip_decided_by_user_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trusted_player" ADD CONSTRAINT "trusted_player_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trusted_player" ADD CONSTRAINT "trusted_player_added_by_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "page_screenshot_page_idx" ON "page_screenshot" USING btree ("kind","key","status");--> statement-breakpoint
CREATE INDEX "page_screenshot_user_idx" ON "page_screenshot" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "page_tip_page_idx" ON "page_tip" USING btree ("kind","key","status");--> statement-breakpoint
CREATE INDEX "page_tip_user_idx" ON "page_tip" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "page_tip_status_idx" ON "page_tip" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "page_view_day_idx" ON "page_view" USING btree ("day");