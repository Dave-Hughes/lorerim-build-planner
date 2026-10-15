import "server-only";
import { SAMPLE_BUILD_ID, isValidBuildId } from "./ids";

/**
 * The build the first visit offers to walk through (WO-80). It's config, not code: SAMPLE_BUILD_ID in
 * the environment names a build Dave picks; without it, the built-in example build.
 */
export function tourSampleId(): string {
  const id = process.env.SAMPLE_BUILD_ID?.trim();
  return id && isValidBuildId(id) ? id : SAMPLE_BUILD_ID;
}
