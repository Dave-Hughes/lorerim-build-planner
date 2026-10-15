import type { Metadata } from "next";
import { Alegreya, Alegreya_SC, Sofia_Sans, Sofia_Sans_Extra_Condensed } from "next/font/google";
import "./globals.css";
import { SITE_LINE, SITE_NAME, siteBase, siteMetadata } from "@/lib/og/metadata";
import { FeaturesProvider } from "@/components/features";
import { features } from "@/lib/features";

const sofia = Sofia_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sofia" });
const sofiaCondensed = Sofia_Sans_Extra_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-sofia-condensed",
});
// Italic for flavour lines; roman and bold for the build page's intro and its drop cap (WO-25).
const alegreya = Alegreya({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "700"], variable: "--font-alegreya" });
// Only the intro's first line, in small caps: not preloaded on every page.
const alegreyaSC = Alegreya_SC({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-alegreya-sc", preload: false });

// Link previews (WO-33): absolute image URLs on staging and production, and the site's card on
// every page that doesn't set its own. "./" is each page's own address.
export const metadata: Metadata = {
  metadataBase: siteBase(),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_LINE,
  ...siteMetadata("./"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sofia.variable} ${sofiaCondensed.variable} ${alegreya.variable} ${alegreyaSC.variable}`}>
      <body>
        {/* The launch switches (WO-81), for the client components that hide what's off. */}
        <FeaturesProvider value={features()}>{children}</FeaturesProvider>
      </body>
    </html>
  );
}
