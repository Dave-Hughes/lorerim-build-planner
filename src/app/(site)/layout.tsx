import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";
import { NavTrail } from "@/components/pages/nav-trail";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="site">
      <SiteHeader />
      <Suspense fallback={null}>
        <NavTrail />
      </Suspense>
      {children}
      <SiteFooter />
    </div>
  );
}
