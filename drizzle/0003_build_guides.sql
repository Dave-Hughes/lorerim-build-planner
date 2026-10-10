CREATE TABLE "build_guides" (
	"build_id" text NOT NULL,
	"key" text NOT NULL,
	"doc" jsonb NOT NULL,
	"text_length" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "build_guides_build_id_key_pk" PRIMARY KEY("build_id","key")
);
--> statement-breakpoint
ALTER TABLE "build_guides" ADD CONSTRAINT "build_guides_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE cascade ON UPDATE no action;