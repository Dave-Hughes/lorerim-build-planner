CREATE TABLE "invite" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"label" text NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_by" text,
	"used_at" timestamp with time zone,
	CONSTRAINT "invite_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "early_access_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invite" ADD CONSTRAINT "invite_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite" ADD CONSTRAINT "invite_used_by_user_id_fk" FOREIGN KEY ("used_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;