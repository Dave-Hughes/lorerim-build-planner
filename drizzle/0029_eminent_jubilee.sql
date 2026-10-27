CREATE TABLE "page_confirmation" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"key" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "page_confirmation" ADD CONSTRAINT "page_confirmation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "page_confirmation_one_per_player" ON "page_confirmation" USING btree ("kind","key","user_id");--> statement-breakpoint
CREATE INDEX "page_confirmation_page" ON "page_confirmation" USING btree ("kind","key");