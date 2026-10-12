import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import type { GuideDoc } from "@/lib/guide/doc";
import type { BuildPlan } from "@/lib/rules/types";

/* ---------- Auth.js tables (shape required by @auth/drizzle-adapter) ---------- */

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  /** The public page's address, /u/<handle>. Made from the Discord name once, then never changed. */
  handle: text("handle").unique(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

/* ---------- Builds ---------- */

export const buildVisibility = pgEnum("build_visibility", ["public", "unlisted", "private"]);

export const builds = pgTable(
  "build",
  {
    /** Short id used in share links: /b/<id> */
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    /** One or two lines in the author's words, shown under the name. */
    description: text("description").notNull().default(""),
    /** Link to the author's written guide, usually a Discord post. */
    writeupUrl: text("writeup_url"),
    /** LoreRim version the build was planned against, e.g. 5.0.4.8. */
    gameVersion: text("game_version").notNull(),
    /** The author's choices only. Numbers are recomputed on read. */
    plan: jsonb("plan").$type<BuildPlan>().notNull(),
    coverImageUrl: text("cover_image_url"),
    visibility: buildVisibility("visibility").notNull().default("unlisted"),
    /** Likes, kept in step with build_like in the same transaction, so sorting never counts rows. */
    likeCount: integer("like_count").notNull().default(0),
    /** When an admin featured it on Browse (WO-39). At most one build has it; only Listed builds. */
    featuredAt: timestamp("featured_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("build_owner_idx").on(t.ownerId),
    index("build_visibility_updated_idx").on(t.visibility, t.updatedAt),
    /** Browse filters by LoreRim version. */
    index("build_game_version_idx").on(t.gameVersion),
    /** Browse sorted by Most liked. */
    index("build_visibility_likes_idx").on(t.visibility, t.likeCount, t.updatedAt),
  ],
);

/** The set list of tags a build can carry (seeded by migration 0005; not made by users). */
export const tags = pgTable("tag", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  /** Weapons, Armor, Magic, Way of play. */
  group: text("group").notNull(),
  sort: integer("sort").notNull(),
});

/** Who likes which build: one row each; the build keeps the count. */
export const buildLikes = pgTable(
  "build_like",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    buildId: text("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.buildId] }), index("build_like_build_idx").on(t.buildId)],
);

/** A build's tags, up to 5. */
export const buildTags = pgTable(
  "build_tag",
  {
    buildId: text("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    tagSlug: text("tag_slug")
      .notNull()
      .references(() => tags.slug),
  },
  (t) => [primaryKey({ columns: [t.buildId, t.tagSlug] }), index("build_tag_tag_idx").on(t.tagSlug)],
);

/** The written guide: one row for the whole build (`overview`) and one per level with notes (`level:<n>`). */
export const buildGuides = pgTable(
  "build_guides",
  {
    buildId: text("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    /** `overview` or `level:<n>` */
    key: text("key").notNull(),
    /** Tiptap JSON, validated against src/lib/guide/doc.ts on every save. Never HTML. */
    doc: jsonb("doc").$type<GuideDoc>().notNull(),
    textLength: integer("text_length").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.buildId, t.key] })],
);

/**
 * Image checks (WO-40): one row per uploaded image's nudity check (Sightengine), with its scores and
 * outcome. Refused images were never stored, so they have no URL. Images the check flagged or
 * couldn't check wait on the admins' review list (`review` open until decided).
 */
export const imageChecks = pgTable(
  "image_check",
  {
    id: serial("id").primaryKey(),
    /** The stored image; null when refused (nothing was stored). */
    url: text("url"),
    uploaderId: text("uploader_id").references(() => users.id, { onDelete: "set null" }),
    /** The build a guide image belongs to; null for covers (uploaded before a build may exist). */
    buildId: text("build_id").references(() => builds.id, { onDelete: "set null" }),
    /** `cover` or `guide`. */
    kind: text("kind").notNull(),
    /** Sightengine's nudity-2.1 class scores, 0 to 1; null when the check couldn't run. */
    scores: jsonb("scores").$type<Record<string, number> | null>(),
    /** `passed`, `listed` (stored and on the review list), `refused` or `unchecked`. */
    outcome: text("outcome").notNull(),
    /** For listed and unchecked images: `open` until an admin keeps, hides or removes it. */
    review: text("review"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("image_check_review_idx").on(t.review, t.createdAt), index("image_check_url_idx").on(t.url)],
);

/** Reports on a build (WO-40): one per signed-in player per build. Cleared when an admin decides. */
export const buildReports = pgTable(
  "build_report",
  {
    id: serial("id").primaryKey(),
    buildId: text("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    reporterId: text("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** `sexual`, `hateful`, `spam` or `other`. */
    reason: text("reason").notNull(),
    note: text("note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    /** Set when an admin decided (Keep, Hide image or Remove image); open reports have none. */
    clearedAt: timestamp("cleared_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("build_report_once_idx").on(t.buildId, t.reporterId), index("build_report_reporter_idx").on(t.reporterId, t.createdAt)],
);

/** Images an admin hid or removed (WO-40): each shows as a plain panel wherever it's used. */
export const hiddenImages = pgTable("hidden_image", {
  url: text("url").primaryKey(),
  hiddenAt: timestamp("hidden_at", { withTimezone: true }).notNull().defaultNow(),
});

/** What the per-account rate limits count (WO-40): image uploads and likes. Builds and reports count their own rows. */
export const rateEvents = pgTable(
  "rate_event",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** `upload` or `like`. */
    kind: text("kind").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rate_event_user_idx").on(t.userId, t.kind, t.at)],
);
