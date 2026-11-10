CREATE TABLE "challenge_run" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"character_name" text NOT NULL,
	"race" text NOT NULL,
	"level" integer NOT NULL,
	"mode" text NOT NULL,
	"days_passed_x100" integer NOT NULL,
	"items_made" integer NOT NULL,
	"rules_broken" integer NOT NULL,
	"kills" integer NOT NULL,
	"console_opened" integer NOT NULL,
	"run" jsonb NOT NULL,
	"seal" text NOT NULL,
	"written_at" timestamp with time zone NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "challenge_run" ADD CONSTRAINT "challenge_run_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "challenge_run_user_character_idx" ON "challenge_run" USING btree ("user_id","character_name");--> statement-breakpoint
CREATE INDEX "challenge_run_board_idx" ON "challenge_run" USING btree ("mode","rules_broken","days_passed_x100");