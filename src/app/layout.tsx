import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "ProductCase - Premium Product Protection",
    template: "%s | ProductCase",
  },
  description: "Your premium destination for high-quality product cases. Protecting what matters most with style and durability.",
  keywords: ["phone cases", "laptop sleeves", "tech accessories", "premium cases", "protective gear", "Poor and rich", "Poor and Rich cases"],
  authors: [{ name: "ProductCase Team" }],
  creator: "ProductCase",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ProductCase - Premium Product Protection",
    description: "Your premium destination for high-quality product cases. Protecting what matters most.",
    siteName: "ProductCase",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProductCase - Premium Product Protection",
    description: "Your premium destination for high-quality product cases.",
    creator: "@productcase",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
