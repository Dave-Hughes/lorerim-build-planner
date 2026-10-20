CREATE TABLE "playthrough_act" (
	"id" serial PRIMARY KEY NOT NULL,
	"playthrough_id" text NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"level_from" integer NOT NULL,
	"level_to" integer,
	"place" text DEFAULT '' NOT NULL,
	"goal" text DEFAULT '' NOT NULL,
	"standing_rule" text
);
--> statement-breakpoint
CREATE TABLE "playthrough_chapter" (
	"id" serial PRIMARY KEY NOT NULL,
	"playthrough_id" text NOT NULL,
	"act_id" integer,
	"kind" text NOT NULL,
	"position" integer NOT NULL,
	"title" text NOT NULL,
	"opens_after" integer,
	"from_save" text,
	"written_by" text,
	"read_at" timestamp with time zone,
	"doc" jsonb NOT NULL,
	"text_length" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playthrough_objective" (
	"id" serial PRIMARY KEY NOT NULL,
	"act_id" integer NOT NULL,
	"position" integer NOT NULL,
	"text" text NOT NULL,
	"kind" text NOT NULL,
	"link" jsonb,
	"done_by" text NOT NULL,
	"detect" jsonb,
	"reach" jsonb,
	"why" text,
	"status" text DEFAULT 'todo' NOT NULL,
	"done_at" timestamp with time zone,
	"suggested_by" text,
	"accepted" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playthrough_snapshot" (
	"playthrough_id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"label" text NOT NULL,
	"level" integer NOT NULL,
	"xp" integer,
	"day" integer,
	"place" text,
	"skills" jsonb NOT NULL,
	"quest_stages" jsonb,
	"counts" jsonb,
	"read_by" text,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"prev_label" text,
	"prev_level" integer,
	"prev_skills" jsonb
);
--> statement-breakpoint
CREATE TABLE "playthrough" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"build_id" text,
	"name" text NOT NULL,
	"line" text DEFAULT '' NOT NULL,
	"game_version" text NOT NULL,
	"visibility" "build_visibility" DEFAULT 'private' NOT NULL,
	"drafted_by" text,
	"show_drafted" boolean DEFAULT true NOT NULL,
	"cover_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "playthrough_act" ADD CONSTRAINT "playthrough_act_playthrough_id_playthrough_id_fk" FOREIGN KEY ("playthrough_id") REFERENCES "public"."playthrough"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playthrough_chapter" ADD CONSTRAINT "playthrough_chapter_playthrough_id_playthrough_id_fk" FOREIGN KEY ("playthrough_id") REFERENCES "public"."playthrough"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playthrough_chapter" ADD CONSTRAINT "playthrough_chapter_act_id_playthrough_act_id_fk" FOREIGN KEY ("act_id") REFERENCES "public"."playthrough_act"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playthrough_chapter" ADD CONSTRAINT "playthrough_chapter_opens_after_playthrough_objective_id_fk" FOREIGN KEY ("opens_after") REFERENCES "public"."playthrough_objective"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playthrough_objective" ADD CONSTRAINT "playthrough_objective_act_id_playthrough_act_id_fk" FOREIGN KEY ("act_id") REFERENCES "public"."playthrough_act"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playthrough_snapshot" ADD CONSTRAINT "playthrough_snapshot_playthrough_id_playthrough_id_fk" FOREIGN KEY ("playthrough_id") REFERENCES "public"."playthrough"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playthrough" ADD CONSTRAINT "playthrough_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playthrough" ADD CONSTRAINT "playthrough_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "playthrough_act_idx" ON "playthrough_act" USING btree ("playthrough_id","position");--> statement-breakpoint
CREATE INDEX "playthrough_chapter_idx" ON "playthrough_chapter" USING btree ("playthrough_id","position");--> statement-breakpoint
CREATE INDEX "playthrough_objective_idx" ON "playthrough_objective" USING btree ("act_id","position");--> statement-breakpoint
CREATE INDEX "playthrough_owner_idx" ON "playthrough" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "playthrough_visibility_updated_idx" ON "playthrough" USING btree ("visibility","updated_at");