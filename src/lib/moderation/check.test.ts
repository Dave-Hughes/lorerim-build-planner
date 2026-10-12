import { describe, expect, it, vi } from "vitest";
import { MODEL, checkImage } from "./check";

const ENV = { SIGHTENGINE_API_USER: "u", SIGHTENGINE_API_SECRET: "s" };
const BYTES = new Uint8Array([1, 2, 3]);

/** A mocked Sightengine that answers with these nudity-2.1 scores. */
function answering(nudity: Record<string, number>) {
  return vi.fn(async () => new Response(JSON.stringify({ status: "success", nudity: { none: 0.01, ...nudity, context: { sea_lake_pool: 0.01 } } }), { status: 200 })) as unknown as typeof fetch;
}

describe("the image check", () => {
  it("refuses sexual_display at 0.9", async () => {
    expect((await checkImage(BYTES, "image/png", { fetch: answering({ sexual_display: 0.9 }), env: ENV })).outcome).toBe("refused");
  });

  it("refuses sexual_activity at 0.9", async () => {
    expect((await checkImage(BYTES, "image/png", { fetch: answering({ sexual_activity: 0.9 }), env: ENV })).outcome).toBe("refused");
  });

  it("stores and lists erotica at 0.9", async () => {
    const r = await checkImage(BYTES, "image/png", { fetch: answering({ erotica: 0.9 }), env: ENV });
    expect(r.outcome).toBe("listed");
    expect(r.scores?.erotica).toBe(0.9);
  });

  it("stores mildly_suggestive at 0.95 without listing it", async () => {
    expect((await checkImage(BYTES, "image/png", { fetch: answering({ mildly_suggestive: 0.95, suggestive: 0.7, very_suggestive: 0.6 }), env: ENV })).outcome).toBe("passed");
  });

  it("stores a timeout as not checked", async () => {
    const hang = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_, reject) => init.signal?.addEventListener("abort", () => reject(init.signal?.reason))),
    ) as unknown as typeof fetch;
    expect(await checkImage(BYTES, "image/png", { fetch: hang, env: ENV, timeoutMs: 20 })).toEqual({ outcome: "unchecked", scores: null });
  });

  it("stores as not checked with no keys, on an error, or over the plan's limits", async () => {
    const never = vi.fn() as unknown as typeof fetch;
    expect((await checkImage(BYTES, "image/png", { fetch: never, env: {} })).outcome).toBe("unchecked");
    expect(never).not.toHaveBeenCalled();
    const limit = vi.fn(async () => new Response(JSON.stringify({ status: "failure", error: { type: "usage_limit", code: 32 } }), { status: 429 })) as unknown as typeof fetch;
    expect((await checkImage(BYTES, "image/png", { fetch: limit, env: ENV })).outcome).toBe("unchecked");
    const down = vi.fn(async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;
    expect((await checkImage(BYTES, "image/png", { fetch: down, env: ENV })).outcome).toBe("unchecked");
  });

  it("follows the cut-offs in MOD_REFUSE_AT and MOD_REVIEW_AT", async () => {
    const env = { ...ENV, MOD_REFUSE_AT: "0.95", MOD_REVIEW_AT: "0.5" };
    expect((await checkImage(BYTES, "image/png", { fetch: answering({ sexual_display: 0.9 }), env })).outcome).toBe("passed");
    expect((await checkImage(BYTES, "image/png", { fetch: answering({ erotica: 0.6 }), env })).outcome).toBe("listed");
  });

  it("asks for nudity-2.1 and nothing else", async () => {
    const f = answering({});
    await checkImage(BYTES, "image/png", { fetch: f, env: ENV });
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.sightengine.com/1.0/check.json");
    const form = init.body as FormData;
    expect(form.getAll("models")).toEqual([MODEL]);
    expect(MODEL).toBe("nudity-2.1");
  });
});
