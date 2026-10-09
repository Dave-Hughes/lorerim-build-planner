import type { Metadata } from "next";
import { Alegreya, Sofia_Sans, Sofia_Sans_Extra_Condensed } from "next/font/google";
import "./globals.css";

const sofia = Sofia_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sofia" });
const sofiaCondensed = Sofia_Sans_Extra_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-sofia-condensed",
});
const alegreya = Alegreya({ subsets: ["latin"], style: ["italic"], weight: ["400"], variable: "--font-alegreya" });

export const metadata: Metadata = {
  title: { default: "LoreRim Build Planner", template: "%s | LoreRim Build Planner" },
  description: "Plan and share LoreRim character builds level by level.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sofia.variable} ${sofiaCondensed.variable} ${alegreya.variable}`}>
      <body>{children}</body>
    </html>
  );
}
