CREATE TABLE "build_like" (
	"user_id" text NOT NULL,
	"build_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "build_like_user_id_build_id_pk" PRIMARY KEY("user_id","build_id")
);
--> statement-breakpoint
ALTER TABLE "build" ADD COLUMN "like_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "build_like" ADD CONSTRAINT "build_like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_like" ADD CONSTRAINT "build_like_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "build_like_build_idx" ON "build_like" USING btree ("build_id");--> statement-breakpoint
CREATE INDEX "build_visibility_likes_idx" ON "build" USING btree ("visibility","like_count","updated_at");