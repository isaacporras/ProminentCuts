import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Playfair_Display,
  Lora,
  Inter,
  Montserrat,
  Nunito_Sans,
} from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site.config";
import type { HeadingFont, BodyFont } from "@/types/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const allFontVariables = [
  geistSans,
  geistMono,
  cormorantGaramond,
  playfairDisplay,
  lora,
  inter,
  montserrat,
  nunitoSans,
]
  .map((font) => font.variable)
  .join(" ");

const HEADING_FONT_VARS: Record<HeadingFont, string> = {
  geist: "--font-geist-sans",
  "cormorant-garamond": "--font-cormorant-garamond",
  "playfair-display": "--font-playfair-display",
};

const BODY_FONT_VARS: Record<BodyFont, string> = {
  geist: "--font-geist-sans",
  lora: "--font-lora",
  inter: "--font-inter",
  montserrat: "--font-montserrat",
  "nunito-sans": "--font-nunito-sans",
};

export const metadata: Metadata = {
  title: `${siteConfig.business.name} | ${siteConfig.business.tagline}`,
  description: siteConfig.business.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeVars = {
    "--color-primary": siteConfig.theme.primary,
    "--color-secondary": siteConfig.theme.secondary,
    "--color-accent": siteConfig.theme.accent,
    "--color-bg": siteConfig.theme.background,
    "--color-text": siteConfig.theme.text,
    "--font-heading": `var(${HEADING_FONT_VARS[siteConfig.theme.fontHeading ?? "geist"]})`,
    "--font-body": `var(${BODY_FONT_VARS[siteConfig.theme.fontBody ?? "geist"]})`,
  } as React.CSSProperties;

  return (
    <html
      lang="es"
      className={`${allFontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={themeVars}>
        {children}
      </body>
    </html>
  );
}
