CREATE TABLE "quest_report" (
	"id" serial PRIMARY KEY NOT NULL,
	"line_id" text NOT NULL,
	"quest" text,
	"what" text NOT NULL,
	"text" text NOT NULL,
	"said" text DEFAULT '' NOT NULL,
	"user_id" text NOT NULL,
	"source" text DEFAULT 'site' NOT NULL,
	"client" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quest_report" ADD CONSTRAINT "quest_report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quest_report_user_idx" ON "quest_report" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "quest_report_at_idx" ON "quest_report" USING btree ("created_at");