import type { Metadata } from "next";
import { Asap, JetBrains_Mono } from "next/font/google";
import { portfolio } from "@/data/portfolio";
import "./globals.css";

const asap = Asap({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-asap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500","700"], variable: "--font-jetbrains" });

// Person structured data for rich results — sourced from the portfolio so it
// stays honest and in sync with the rest of the site.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: portfolio.profile.name,
  jobTitle: portfolio.profile.role,
  url: "https://axelstz.fr",
  sameAs: portfolio.social
    .filter((s) => s.href.startsWith("http"))
    .map((s) => s.href),
};

export const metadata: Metadata = {
  metadataBase: new URL("https://axelstz.fr"),
  title: "Axel.S — Full-Stack Web Developer",
  description: "SHOOTS — a Steam-profile-inspired developer portfolio by Axel.S.",
  keywords: ["Axel.S", "SHOOTS", "web developer", "portfolio", "React", "Next.js", "TypeScript", "full-stack developer"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://axelstz.fr",
    title: "Axel.S — Full-Stack Web Developer",
    description: "SHOOTS — a Steam-profile-inspired developer portfolio by Axel.S.",
    siteName: "SHOOTS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axel.S — Full-Stack Web Developer",
    description: "SHOOTS — a Steam-profile-inspired developer portfolio by Axel.S.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${asap.variable} ${jetbrains.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        {children}
      </body>
    </html>
  );
}
