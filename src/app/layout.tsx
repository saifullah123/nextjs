import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "ProductCase - Elite Product Protection & Aesthetics",
    template: "%s | ProductCase",
  },
  description: "Experience the pinnacle of device protection. ProductCase offers military-grade security with high-end luxury aesthetics for perfectionists.",
  keywords: ["premium phone cases", "luxury tech accessories", "military grade protection", "elite device gear", "ProductCase"],
  authors: [{ name: "ProductCase Design Team" }],
  creator: "ProductCase Luxury",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ProductCase - Elite Product Protection",
    description: "The only case that feels more premium than the device it protects.",
    siteName: "ProductCase",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProductCase - Elite Product Protection",
    description: "The only case that feels more premium than the device it protects.",
    creator: "@productcase",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} antialiased font-inter bg-mesh`}>
        <div className="relative min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
