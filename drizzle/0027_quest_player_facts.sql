CREATE TABLE "quest_player_fact" (
	"id" serial PRIMARY KEY NOT NULL,
	"line_id" text NOT NULL,
	"quest" text NOT NULL,
	"replaces" text,
	"way" jsonb NOT NULL,
	"source" text NOT NULL,
	"report_id" integer,
	"user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quest_report" ADD COLUMN "kind" text DEFAULT 'wrong' NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_report" ADD COLUMN "fields" jsonb;--> statement-breakpoint
ALTER TABLE "quest_report" ADD COLUMN "proposal" jsonb;--> statement-breakpoint
ALTER TABLE "quest_report" ADD COLUMN "decision" jsonb;--> statement-breakpoint
ALTER TABLE "quest_player_fact" ADD CONSTRAINT "quest_player_fact_report_id_quest_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."quest_report"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_player_fact" ADD CONSTRAINT "quest_player_fact_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quest_player_fact_quest_idx" ON "quest_player_fact" USING btree ("quest");