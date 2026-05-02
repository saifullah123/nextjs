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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.netgate.in'),
  title: {
    default: "Net Gate | Premium Equestrian Gear & Western Horse Tack",
    template: "%s | Net Gate",
  },
  description: "Net Gate is India's premier destination for high-end equestrian luxury. Discover handcrafted saddles, professional bridles, and premium western riding gear designed for champions.",
  keywords: [
    "Net Gate",
    "Net Gate Western Boutique",
    "horse riding equipment India",
    "equestrian gear",
    "premium saddles",
    "handcrafted horse tack",
    "western show shirts",
    "horse riding accessories",
    "luxury horse equipment",
    "equestrian boutique"
  ],
  authors: [{ name: "Net Gate" }],
  creator: "Net Gate",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Net Gate - Premium Equestrian Luxury & Gear",
    description: "The ultimate destination for professional horse riding gear and premium equestrian supplies. Quality that speaks for itself.",
    siteName: "Net Gate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Net Gate - Premium Equestrian Gear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Net Gate - Premium Equestrian Luxury & Gear",
    description: "Handcrafted horse riding equipment and professional tack for every rider.",
    images: ["/og-image.png"],
    creator: "@NetGateEquestrian",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Net Gate",
              "url": "https://www.netgate.in",
              "logo": "https://www.netgate.in/logo.png",
              "description": "Premium Equestrian Gear & Western Horse Tack",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "India"
              }
            }),
          }}
        />
        <div className="relative min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
