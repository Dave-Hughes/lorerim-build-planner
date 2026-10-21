import {
  boolean,
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
import type { ChapterKind, Detect, DoneBy, ObjectiveKind, ObjectiveLink, ObjectiveStatus, Reach, SnapshotSource } from "@/lib/playthroughs/types";

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
  /** Let in early past the coming soon page by an invite (WO-96); null for everyone else. */
  earlyAccessAt: timestamp("early_access_at", { withTimezone: true }),
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
    /** The assistant's name when one of its tools made the build (WO-110); null for builds made on the site. */
    draftedBy: text("drafted_by"),
    /** Whether the page says who drafted it ("Drafted with Claude"); the author can turn it off in Set up. */
    showDrafted: boolean("show_drafted").notNull().default(true),
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

/**
 * What the rate limits count (WO-40): an account's image uploads and likes (builds and reports count
 * their own rows), and the MCP route's calls (WO-108), which have no account: those carry `subject`,
 * a SHA-256 of the caller's IP, never the IP itself.
 */
export const rateEvents = pgTable(
  "rate_event",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    subject: text("subject"),
    /** `upload`, `like` or `mcp`. */
    kind: text("kind").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rate_event_user_idx").on(t.userId, t.kind, t.at), index("rate_event_subject_idx").on(t.subject, t.kind, t.at)],
);

/**
 * Early-access invites (WO-96): an admin makes one for a named person; its link works once, for 14
 * days. Only a SHA-256 of the link's token is kept, never the token.
 */
export const invites = pgTable("invite", {
  id: serial("id").primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  /** Who it's for: "Zenematics". */
  label: text("label").notNull(),
  /** What Tapps says on this invite's page, written for the person; null for the usual line. */
  message: text("message"),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedBy: text("used_by").references(() => users.id, { onDelete: "set null" }),
  usedAt: timestamp("used_at", { withTimezone: true }),
});

/* ---------- Sign-in for assistants (WO-109): the planner as its own OAuth server for its MCP ---------- */

/**
 * An assistant that asks to act for a player: a Client ID Metadata Document (its `id` is the HTTPS URL
 * we fetched) or a client that registered itself (RFC 7591, a random id). Public clients only.
 */
export const oauthClients = pgTable("oauth_client", {
  id: text("id").primaryKey(),
  /** `cimd` or `registered`. */
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  redirectUris: jsonb("redirect_uris").$type<string[]>().notNull(),
  /** The document as fetched, or the metadata as registered. */
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** A one-time authorization code (10 minutes), stored only as a SHA-256. */
export const oauthCodes = pgTable("oauth_code", {
  hash: text("hash").primaryKey(),
  clientId: text("client_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  redirectUri: text("redirect_uri").notNull(),
  codeChallenge: text("code_challenge").notNull(),
  scopes: jsonb("scopes").$type<string[]>().notNull(),
  resource: text("resource"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});

/**
 * Access (8 hours) and refresh (90 days) tokens, stored only as SHA-256s. `pair` links an access
 * token to its refresh token; `grant` is the code they came from, kept through every refresh, so a
 * reused code revokes everything it led to.
 */
export const oauthTokens = pgTable(
  "oauth_token",
  {
    hash: text("hash").primaryKey(),
    /** `access` or `refresh`. */
    kind: text("kind").notNull(),
    pair: text("pair").notNull(),
    grant: text("grant").notNull(),
    clientId: text("client_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scopes: jsonb("scopes").$type<string[]>().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  },
  (t) => [index("oauth_token_pair_idx").on(t.pair), index("oauth_token_grant_idx").on(t.grant), index("oauth_token_user_idx").on(t.userId, t.clientId)],
);

/* ---------- Playthroughs (WO-111): a character's whole run, as a quest log and a tale ---------- */

export const playthroughs = pgTable(
  "playthrough",
  {
    /** Short id used in share links: /p/<id>, the builds' shape. */
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** The player's own build, when linked. */
    buildId: text("build_id").references(() => builds.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    /** One sentence, 140 at most. */
    line: text("line").notNull().default(""),
    gameVersion: text("game_version").notNull(),
    visibility: buildVisibility("visibility").notNull().default("private"),
    /** The assistant's name when one of its tools made it; null when made on the site. */
    draftedBy: text("drafted_by"),
    showDrafted: boolean("show_drafted").notNull().default(true),
    /**
     * The title page's picture (WO-117), set on the Story's title page. (WO-114 left it empty when the
     * character's cover became the build's.)
     */
    coverImageUrl: text("cover_image_url"),
    /** The Tale page's title and epigraph over its opening plate (WO-114): 60 and 140 at most. */
    taleTitle: text("tale_title"),
    taleLine: text("tale_line"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("playthrough_owner_idx").on(t.ownerId), index("playthrough_visibility_updated_idx").on(t.visibility, t.updatedAt)],
);

export const playthroughActs = pgTable(
  "playthrough_act",
  {
    id: serial("id").primaryKey(),
    playthroughId: text("playthrough_id")
      .notNull()
      .references(() => playthroughs.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    name: text("name").notNull(),
    levelFrom: integer("level_from").notNull(),
    /** Null: "and up". */
    levelTo: integer("level_to"),
    place: text("place").notNull().default(""),
    goal: text("goal").notNull().default(""),
    standingRule: text("standing_rule"),
    /** The act's image on its story card and in the reader (WO-116), uploaded as a guide image; null: its first chapter's image, else the cover. */
    imageUrl: text("image_url"),
    /** What stays in view of its image (WO-118), as the cover's focus; none, the middle. */
    imageFocus: jsonb("image_focus").$type<{ x: number; y: number }>(),
  },
  (t) => [index("playthrough_act_idx").on(t.playthroughId, t.position)],
);

export const playthroughObjectives = pgTable(
  "playthrough_objective",
  {
    id: serial("id").primaryKey(),
    actId: integer("act_id")
      .notNull()
      .references(() => playthroughActs.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    text: text("text").notNull(),
    kind: text("kind").$type<ObjectiveKind>().notNull(),
    link: jsonb("link").$type<ObjectiveLink | null>(),
    doneBy: text("done_by").$type<DoneBy>().notNull(),
    detect: jsonb("detect").$type<Detect | null>(),
    reach: jsonb("reach").$type<Reach | null>(),
    why: text("why"),
    /** The player's own status; `done` counts only for `hand` objectives (status.ts works out the rest). */
    status: text("status").$type<ObjectiveStatus>().notNull().default("todo"),
    doneAt: timestamp("done_at", { withTimezone: true }),
    /** The assistant's name when it was suggested; it counts for nothing until accepted. */
    suggestedBy: text("suggested_by"),
    accepted: boolean("accepted").notNull().default(true),
  },
  (t) => [index("playthrough_objective_idx").on(t.actId, t.position)],
);

export const playthroughChapters = pgTable(
  "playthrough_chapter",
  {
    id: serial("id").primaryKey(),
    playthroughId: text("playthrough_id")
      .notNull()
      .references(() => playthroughs.id, { onDelete: "cascade" }),
    /** Null: before the game. */
    actId: integer("act_id").references(() => playthroughActs.id, { onDelete: "set null" }),
    kind: text("kind").$type<ChapterKind>().notNull(),
    position: integer("position").notNull(),
    title: text("title").notNull(),
    /** A beat opens when this objective is done; none, it's open. */
    opensAfter: integer("opens_after").references(() => playthroughObjectives.id, { onDelete: "set null" }),
    /** "Save 7, 19 Oct 2026". */
    fromSave: text("from_save"),
    writtenBy: text("written_by"),
    readAt: timestamp("read_at", { withTimezone: true }),
    /** Its plate in the reader (WO-117), set where it shows in the Story; none: its text's first image, else the act's picture, else the cover. */
    imageUrl: text("image_url"),
    /** What stays in view of its image (WO-118), as the cover's focus: percents across and down; none, the middle. */
    imageFocus: jsonb("image_focus").$type<{ x: number; y: number }>(),
    /** The guide document, validated as the Story is, its limit the same. */
    doc: jsonb("doc").$type<GuideDoc>().notNull(),
    textLength: integer("text_length").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("playthrough_chapter_idx").on(t.playthroughId, t.position)],
);

/** Where the player stands: one row per playthrough, replaced on each update, the last one kept in prev_*. */
export const playthroughSnapshots = pgTable("playthrough_snapshot", {
  playthroughId: text("playthrough_id")
    .primaryKey()
    .references(() => playthroughs.id, { onDelete: "cascade" }),
  source: text("source").$type<SnapshotSource>().notNull(),
  /** "Save 7". */
  label: text("label").notNull(),
  level: integer("level").notNull(),
  xp: integer("xp"),
  day: integer("day"),
  place: text("place"),
  skills: jsonb("skills").$type<Record<string, number>>().notNull(),
  /** Quest edid to the highest stage the save has. */
  questStages: jsonb("quest_stages").$type<Record<string, number> | null>(),
  /** Counts the player or the save gives, by label ("books read"). */
  counts: jsonb("counts").$type<Record<string, number> | null>(),
  readBy: text("read_by"),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  prevLabel: text("prev_label"),
  prevLevel: integer("prev_level"),
  prevSkills: jsonb("prev_skills").$type<Record<string, number> | null>(),
});

/**
 * One call through the door (WO-119): when, the tool, how it went (ok, refused, warned), the refusal's
 * or warning's code, and the build or playthrough it was about. No user and no text: it's for counting
 * whether assistants build better after a change to the instructions.
 */
export const doorEvents = pgTable(
  "door_event",
  {
    id: serial("id").primaryKey(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
    tool: text("tool").notNull(),
    outcome: text("outcome").$type<"ok" | "refused" | "warned">().notNull(),
    code: text("code"),
    target: text("target"),
  },
  (t) => [index("door_event_at_idx").on(t.at)],
);
