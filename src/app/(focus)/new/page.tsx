import type { Metadata } from "next";
import { auth } from "@/auth";
import { WizardLoader as Wizard } from "@/components/creation/wizard-loader";
import { SignInButton } from "@/components/site-header";
import { playthroughsOn } from "@/lib/features";

export const generateMetadata = (): Metadata => ({ title: playthroughsOn() ? "New character" : "New build" });
export const dynamic = "force-dynamic";

export default async function NewBuild() {
  const session = await auth();
  const characters = playthroughsOn();
  return <Wizard mode="create" characters={characters} signedIn={!!session?.user} signIn={<SignInButton redirectTo="/new?step=name" className="btn btn-primary" />} />;
}
