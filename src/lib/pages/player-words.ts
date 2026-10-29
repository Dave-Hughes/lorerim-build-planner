/**
 * A line a player reads never names a record and never hedges in the middle of a sentence (WO-177): "…can be shut away; the records don't show
 * when" and "(not checked yet)" are the editors' words. What is unsure comes out of the sentence and goes to Information Confidence's Not sure
 * yet, with its reason as a whole sentence about the thing, in a player's words. Pure.
 */
const HEDGES: RegExp[] = [
  // "; the records don't show when", ", and the records don't show which one you get"
  /\s*[;,]?\s*(?:and\s+)?the records (?:don't|do not|doesn't|does not) (?:show|say|have|give|tell)\b[^;.()]*/gi,
  // "(not checked yet)", "(not checked yet: LoreRim's files set their chance to 0)", "(the records don't show when)", "(presumably once you own it)"
  /\s*\((?:not checked yet|isn't checked yet|the records [^)]*|(?:presumably|probably|likely|possibly|perhaps)\b[^)]*)\)/gi,
  /\s*[;,]?\s*not checked yet\b[^;.()]*/gi,
];

/** What a hedge clause says, as one whole sentence about the sentence it was in. */
export function reasonOf(clause: string, about: string): string {
  const subject = about.split(/[:;]/)[0].trim();
  const named = subject.length > 0 && subject.length <= 80 ? `About “${subject}”: ` : "";
  const c = clause.trim().replace(/[.]+$/, "");
  const m = /^the records (?:don't|do not|doesn't|does not) (?:show|say|have|give|tell)\s*(.*)$/i.exec(c);
  if (m) return `${named}we can't tell from the game files ${m[1] || "more than this"}.`.replace(/^(.)/, (x) => x.toUpperCase());
  if (/^(?:presumably|probably)\b/i.test(c)) return `${named}this is a guess from the game files: ${c.charAt(0).toLowerCase()}${c.slice(1)}.`.replace(/^(.)/, (x) => x.toUpperCase());
  if (/^(?:not checked yet|isn't checked yet)/i.test(c)) return `${named}we haven't checked this against the game files yet.`.replace(/^(.)/, (x) => x.toUpperCase());
  return `${named}${c.charAt(0).toLowerCase()}${c.slice(1)}.`.replace(/^(.)/, (x) => x.toUpperCase());
}

export function playerWords(text: string): { text: string; unsure: string[] } {
  const clauses: string[] = [];
  let out = text;
  for (const re of HEDGES) {
    out = out.replace(re, (m) => {
      const clause = m.replace(/^[\s;,]+|\s*[()]\s*/g, " ").replace(/^\s*and\s+/i, "").trim();
      if (clause) clauses.push(clause.charAt(0).toUpperCase() + clause.slice(1));
      return " ";
    });
  }
  const cleaned = out.replace(/\s*\(\s*\)/g, "").replace(/\s+/g, " ").replace(/\s+([,;.])/g, "$1").replace(/[;,]\s*$/, "").replace(/(\S)\(/g, "$1 (").trim();
  return { text: cleaned, unsure: clauses.map((c) => reasonOf(c, cleaned)) };
}

/**
 * "Paarthurnax dies if you kill him (Paarthurnax)": a quest's name in brackets after a sentence that already holds the name says which quest
 * it is as "in the quest Paarthurnax"; a bracket with a name the sentence doesn't hold stays (WO-177).
 */
export function quoteQuest(text: string): string {
  return text.replace(/^([\s\S]*?)\s*\(([^()]+)\)\s*$/, (all, before: string, quest: string) => (before.toLowerCase().includes(quest.trim().toLowerCase()) ? `${before} in the quest ${quest.trim()}` : all));
}

/**
 * A sentence the reads assembled with a bracketed aside or a repeated place: "same job (Windhelm's own copy of it)" is said as a clause, and
 * "in her own house, Bryling's House" is "in Bryling's House" (WO-177). Done once, where the reads are loaded, so no page has to.
 */
export function assembled(text: string): string {
  return text
    .replace(/\bsame job \(([^()]+?)'s own copy of it\)/gi, "it is the same job, $1's own copy")
    .replace(/\b(?:his|her|their)(?: own)? (\w+), (?=[A-Z][^,.;]*\b\1\b)/gi, (all, noun: string, offset: number, whole: string) => (new RegExp(`^[A-Z][^,.;]*\\b${noun}\\b`, "i").test(whole.slice(offset + all.length)) ? "" : all));
}

/** A record's editor id (DLC2WE09, MQ102A, REQ_HOGITHUM) or a plugin file (Name.esp): never shown to a player. */
export const RECORD = /\b[A-Za-z][A-Za-z_]*\d[A-Za-z0-9_]*\b|\b[A-Z]{2,}_[A-Za-z0-9_]+\b|\.(?:esp|esm|esl)\b/;

/**
 * Words an editor writes and a player does not (Bob's ruling, WO-177 Part 6): a reason for a doubt with any of them in it is not shown (it is kept in the
 * data); the unsure field is still listed, in a player's words. A rewrite of the reasons in players' words is a later batch (docs/backlog.md).
 */
const EDITOR_TERMS = /\b(?:packages?|alias(?:es)?|scripts?|propert(?:y|ies)|records?|factions?|keywords?|conditions?|stages?|forms?|globals?|cells?|refs?|plugins?|placed|placement|I went with|here)\b/i;

/** An unsure reason for the page: whole, with a capital, or null when it is written for editors or names a record or a file. */
export function playerReason(why: string): string | null {
  if (RECORD.test(why) || EDITOR_TERMS.test(why)) return null;
  // The reader's own field label in front ("what you get: ...") goes: Not sure yet already names the field.
  const t = why.trim().replace(/\s+/g, " ").replace(/^[a-z][a-z' ,()-]{2,40}:\s+(?=\S)/, "");
  return `${t.charAt(0).toUpperCase()}${t.slice(1)}${/[.!?]$/.test(t) ? "" : "."}`;
}

/** A field name for Not sure yet without a record id in brackets after it. */
export const playerField = (field: string) => field.replace(/\s*\([A-Za-z][A-Za-z_]*\d[A-Za-z0-9_]*\)/g, "").replace(/\s*\S+\.(?:esp|esm|esl)\b/gi, "").trim();

/**
 * Every string in a parsed read through `fn`: the reads are mended once, where they are loaded, so no page has to. A key in `skip` (the reads'
 * own reasons for a doubt) is left as it is: those are what Not sure yet says, in words the box cleans itself.
 */
export function mapStrings<T>(o: T, fn: (s: string) => string, skip: ReadonlySet<string> = new Set()): T {
  if (typeof o === "string") return fn(o) as T;
  if (Array.isArray(o)) return o.map((x) => mapStrings(x, fn, skip)) as T;
  if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, skip.has(k) ? v : mapStrings(v, fn, skip)])) as T;
  return o;
}

/** An alias the records left unfilled ("<Alias=Victim01> has been dazzled"): the words of its name, "the victim". */
const ALIAS = /<Alias=([A-Za-z0-9_]+)>/g;
const aliasWords = (name: string) => `the ${name.replace(/\d+$/, "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase().trim()}`;
/** A bracket that holds a plugin file ("(cceejsse005-cave.esm; its start checks that…)"): a file is never shown to a player. */
const FILE_BRACKET = /\s*\([^()]*\.(?:esp|esm|esl)\b[^()]*\)/gi;
export const EDITOR_BODY = /\b(?:packages?|aliases|alias|scripts?|propert(?:y|ies)|keywords?|plugins?)\b/i;
const ANY_HEDGE = /\((?:probably|likely|possibly|perhaps|presumably)\b|the records (?:don't|do not|doesn't|does not) (?:show|say|have|give|tell)|not checked yet|\((?:presumably|probably) /i;
const SENTENCE_HEDGE = /(?<=[.!?]\s)The records (?:don't|do not|doesn't|does not) (?:show|say|have|give|tell)\b[^.]*\.\s*/g;

/**
 * What a read's sentence needs before a page shows it (WO-177 Part 5): its assembled wording said once, an unfilled alias said as words, a
 * plugin file out of its brackets, and the editors' hedge taken out (a whole sentence of it, or a clause). A string that is only a hedge is kept.
 */
export function mend(text: string): string {
  if (SAID_NAMES[text]) return SAID_NAMES[text];
  // A shelf or a place named "Whiterun Hold": the hold is "Whiterun hold" on every page (the game's own journal words are left as they are).
  if (/^(?:Odd jobs in )?[A-Z][a-z']+(?: [A-Z][a-z']+)? Hold$/.test(text)) return text.replace(/ Hold$/, " hold");
  // "a dragon lair in the Rift (likely one of: A, B)" is "a dragon lair in the Rift, one of: A, B" (WO-180 Part 2).
  let out = assembled(text).replace(/\s*\((?:likely|probably|possibly|perhaps),?\s+one of:?\s+([^)]+)\)/gi, ", one of: $1").replace(ALIAS, (_m, n: string) => aliasWords(n)).replace(FILE_BRACKET, "");
  // "(he's in the follower and marriage factions)": a bracket that holds an editor's term is an editor's note.
  out = out.replace(/\s*\([^()]*\b(?:factions?|packages?|aliases|keywords?|scripts?|globals?)\b[^()]*\)/gi, "");
  if (/^named in (?:its )?aliases?\.?$/i.test(out.trim())) return "Has a part in it";
  // A clause that talks about the game's packages, aliases or scripts is the editors': "Going about her home; her sandbox package sits above her sleep package" keeps its first clause.
  if (EDITOR_BODY.test(out) && out.includes(";")) {
    const kept = out.split(/;\s*/).filter((c) => !EDITOR_BODY.test(c));
    if (kept.length) out = kept.join("; ");
  }
  // A trailing clause after a comma that talks about the editors' packages ("..., or in the market by day once the market package applies") goes too.
  if (EDITOR_BODY.test(out)) {
    const trimmed = out.replace(/\s*,\s*(?:or |and )?[^,;.]*\b(?:packages?|aliases|alias|scripts?|propert(?:y|ies)|keywords?|plugins?)\b[^,;.]*(?=[.;]|$)/i, "");
    if (trimmed.trim().length > 12) out = trimmed;
  }
  if (ANY_HEDGE.test(out)) {
    const noSentence = out.replace(SENTENCE_HEDGE, "").trimEnd();
    const r = playerWords(noSentence);
    out = r.text.length ? r.text : out;
  }
  return out;
}

/** Keys whose subtree is a reason for a doubt: not mended, the Information Confidence box says them itself. (A quest's why, as in takesYou.why, and canDoWhy are body text and are mended.) */
export const REASON_KEYS: ReadonlySet<string> = new Set(["unsure"]);

/** Three quests the records name with an editor id, said as what they are (WO-177 Part 5: no record id on any page). */
export const SAID_NAMES: Record<string, string> = { "DA02 Hook": "Boethiah's Calling: the hook", DB01_Opt: "Delayed Burial: optional objectives", "TG00 Maul Handler": "Maul's handler" };

/** A job template with a placeholder name ("Delivery for the npc", "Hunter Marks Animal Den 02"): not a quest a player has a page for, nor a change (WO-180). */
export const isTemplateName = (name: string) => /\bthe npc\b/i.test(name) || /^Hunter Marks Animal Den(?: \d+)?$/i.test(name.trim()) || /^The item$/i.test(name.trim()) || /^Mark an animal den(?: \(second job\))?$/i.test(name.trim());
