import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eidi Pay | Generate Your Official Eidi Invoice",
  description:
    "The #1 platform to generate official-looking Eidi invoices for your friends and family. Track your earnings and manage your sponsors in one place.",
  keywords: [
    "Salami",
    "Eid Salami",
    "Salami Tracker",
    "Eidi Pay",
    "Eidi",
    "Eid-ul-Fitr",
    "Eid-ul-Adha",
    "Eid Mobarak",
    "Eidi Link Generator",
    "Eidi Invoice",
    "Fahim Shariar",
  ],
  authors: [{ name: "Fahim Shariar" }],
  openGraph: {
    title: "Eidi Pay - Get Your Eidi Simplified",
    description:
      "Don't just ask for Eidi, send an official invoice. Generate your link now!",
    url: "https://eidi-pay.vercel.app",
    siteName: "Eidi Pay",
    images: [
      {
        url: "https://eidi-pay.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eidi Pay Preview",
      },
    ],
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eidi Pay | Official Eidi Generator",
    description: "Generate and track your Eidi invoices with ease.",
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
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
