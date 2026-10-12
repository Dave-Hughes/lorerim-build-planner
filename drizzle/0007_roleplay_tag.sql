-- WO-36: the Roleplay tag, after Beginner-friendly in Way of play (src/lib/builds/tags.ts).
INSERT INTO "tag" ("slug", "name", "group", "sort") VALUES
  ('roleplay', 'Roleplay', 'Way of play', 21)
ON CONFLICT ("slug") DO NOTHING;
