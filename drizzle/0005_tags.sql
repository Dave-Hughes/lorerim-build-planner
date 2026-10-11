CREATE TABLE "build_tag" (
	"build_id" text NOT NULL,
	"tag_slug" text NOT NULL,
	CONSTRAINT "build_tag_build_id_tag_slug_pk" PRIMARY KEY("build_id","tag_slug")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"group" text NOT NULL,
	"sort" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "build_tag" ADD CONSTRAINT "build_tag_build_id_build_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."build"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_tag" ADD CONSTRAINT "build_tag_tag_slug_tag_slug_fk" FOREIGN KEY ("tag_slug") REFERENCES "public"."tag"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "build_tag_tag_idx" ON "build_tag" USING btree ("tag_slug");
--> statement-breakpoint
-- The set list of tags (src/lib/builds/tags.ts).
INSERT INTO "tag" ("slug", "name", "group", "sort") VALUES
  ('one-handed', 'One-Handed', 'Weapons', 1),
  ('two-handed', 'Two-Handed', 'Weapons', 2),
  ('marksman', 'Marksman', 'Weapons', 3),
  ('shield', 'Shield', 'Weapons', 4),
  ('heavy-armor', 'Heavy Armor', 'Armor', 5),
  ('light-armor', 'Light Armor', 'Armor', 6),
  ('unarmored', 'Unarmored', 'Armor', 7),
  ('destruction', 'Destruction', 'Magic', 8),
  ('conjuration', 'Conjuration', 'Magic', 9),
  ('necromancy', 'Necromancy', 'Magic', 10),
  ('illusion', 'Illusion', 'Magic', 11),
  ('alteration', 'Alteration', 'Magic', 12),
  ('restoration', 'Restoration', 'Magic', 13),
  ('spellsword', 'Spellsword', 'Magic', 14),
  ('stealth', 'Stealth', 'Way of play', 15),
  ('thief', 'Thief', 'Way of play', 16),
  ('crafter', 'Crafter', 'Way of play', 17),
  ('shouts', 'Shouts', 'Way of play', 18),
  ('tank', 'Tank', 'Way of play', 19),
  ('beginner-friendly', 'Beginner-friendly', 'Way of play', 20)
ON CONFLICT ("slug") DO NOTHING;
