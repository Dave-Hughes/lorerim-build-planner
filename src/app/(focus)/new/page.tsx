import type { Metadata } from "next";
import { auth } from "@/auth";
import { WizardLoader as Wizard } from "@/components/creation/wizard-loader";
import { SignInButton } from "@/components/site-header";
import { playthroughsOn } from "@/lib/features";

export const generateMetadata = (): Metadata => ({ title: "New character" });
export const dynamic = "force-dynamic";

export default async function NewBuild() {
  const session = await auth();
  return <Wizard mode="create" characters playthroughs={playthroughsOn()} signedIn={!!session?.user} signIn={<SignInButton redirectTo="/new?step=name" className="btn btn-primary" />} />;
}
