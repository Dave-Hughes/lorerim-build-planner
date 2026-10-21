CREATE TABLE "door_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"tool" text NOT NULL,
	"outcome" text NOT NULL,
	"code" text,
	"target" text
);
--> statement-breakpoint
CREATE INDEX "door_event_at_idx" ON "door_event" USING btree ("at");