import type { Metadata } from "next";
import { Asap, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const asap = Asap({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-asap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500","700"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://axelstz.fr"),
  title: "Axel.S — Junior Web Developer",
  description: "SHOOTS — a Steam-profile-inspired developer portfolio by Axel.S.",
  keywords: ["Axel.S", "SHOOTS", "web developer", "portfolio", "React", "Next.js", "TypeScript", "junior developer"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://axelstz.fr",
    title: "Axel.S — Junior Web Developer",
    description: "SHOOTS — a Steam-profile-inspired developer portfolio by Axel.S.",
    siteName: "SHOOTS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axel.S — Junior Web Developer",
    description: "SHOOTS — a Steam-profile-inspired developer portfolio by Axel.S.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${asap.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
