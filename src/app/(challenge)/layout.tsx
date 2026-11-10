import { ChallengeFooter, ChallengeHeader } from "@/components/challenge/challenge-header";
import styles from "@/components/challenge/challenge.module.css";

/** The challenge's own frame: its header and footer, without the planner's navigation. */
export default function ChallengeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`site ${styles.frame}`}>
      <ChallengeHeader />
      {children}
      <ChallengeFooter />
    </div>
  );
}
