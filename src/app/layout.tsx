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
    default: "The Horse Rider's Shop - Premium Horse Riding Equipment & Tack",
    template: "%s | The Horse Rider's Shop",
  },
  description: "Your one-stop destination for premium horse riding equipment, professional tack, and equestrian supplies. We provide high-quality saddles, bridles, helmets, and boots for both horse and rider.",
  keywords: [
    "horse riding equipment", 
    "horse tack shop", 
    "equestrian supplies", 
    "premium saddles", 
    "horse bridles", 
    "riding helmets", 
    "riding boots", 
    "horse blankets", 
    "saddle pads",
    "horse grooming kit"
  ],
  authors: [{ name: "The Horse Rider's Shop" }],
  creator: "The Horse Rider's Shop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "The Horse Rider's Shop - Premium Equestrian Gear",
    description: "The best destination for professional horse riding gear and equestrian supplies. Quality you can trust.",
    siteName: "The Horse Rider's Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Horse Rider's Shop - Premium Equestrian Gear",
    description: "Premium horse riding equipment and professional tack for every horse and rider.",
    creator: "@HorseRiderShop",
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
