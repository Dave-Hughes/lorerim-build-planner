import { InfoTip } from "@/components/ui/info-tip";

export const EXAMPLE_TIP = "A sample to show what a build page can look like, not a tested guide.";

/**
 * The sample build's mark (WO-90): `Example` in brass with its "i". Nothing is stored on the build;
 * the sample is whichever build tourSampleId() names.
 */
export function ExampleTag({ small, className }: { small?: boolean; className?: string }) {
  return (
    <span className={`example-tag ${className ?? ""}`}>
      <span className={`tag tag-brass ${small ? "tag-sm" : ""}`}>Example</span>
      <InfoTip label="About the Example tag" text={EXAMPLE_TIP} />
    </span>
  );
}
