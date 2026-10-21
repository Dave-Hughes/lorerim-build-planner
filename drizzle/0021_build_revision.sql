CREATE TABLE "build_revision" (
	"id" serial PRIMARY KEY NOT NULL,
	"build_id" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"by" text NOT NULL,
	"client" text,
	"plan" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "build_revision" ADD CONSTRAINT "build_revision_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "build_revision_build_idx" ON "build_revision" USING btree ("build_id","id");