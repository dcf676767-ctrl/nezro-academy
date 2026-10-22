import CookieBanner from "./components/CookieBanner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon-48.png", sizes: "48x48", type: "image/png" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icon.svg", type: "image/svg+xml" }], shortcut: "/favicon.ico", apple: "/apple-touch-icon.png" },
  verification: { google: "yn3c6uG0YfRwl0_z_lfPUEycAE30KDGWWk1WXr_GDhI"
    
   },
  applicationName: "Nezro Academy",
  title: "Nezro Academy | Crée et monétise ta chaîne YouTube anonyme",
  description: "Nezro Academy est la plateforme de formation YMA (YouTube Money Academy) : apprends à créer du contenu anonyme, monter tes vidéos et développer ta chaîne YouTube.",
  openGraph: { siteName: "Nezro Academy", title: "Nezro Academy | Crée et monétise ta chaîne YouTube anonyme", description: "La plateforme de formation YMA : contenu anonyme, montage, niches et monétisation YouTube.", locale: "fr_FR", type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      translate="no"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Sidebar />{children}
        <CookieBanner /></body>
    </html>
  );
}
