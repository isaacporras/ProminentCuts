import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  } as React.CSSProperties;

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={themeVars}>
        {children}
      </body>
    </html>
  );
}
