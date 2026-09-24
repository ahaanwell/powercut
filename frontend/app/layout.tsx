import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import NoticesTicker from "@/components/NoticesTicker";
import Disclaimer from "@/components/Disclaimer";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import RestoreTextSize from "@/components/RestoreTextSize";
import NavigationProgress from "@/components/NavigationProgress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.powercut.info";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PowerCut- Power cut in my area | Live Power Outage Tracker for India",
    template: "%s | PowerCut",
  },
  description:
    "Check power cut in your area with PowerCut. Find live power outage status, report outages, track complaints, and check restoration updates by PIN code or locality",
  keywords: [
    "power cut",
    "power outage",
    "electricity outage tracker",
    "pincode power status",
    "load shedding India",
  ],
  openGraph: {
    type: "website",
    siteName: "PowerCut",
    title: "PowerCut- Power cut in my area | Live Power Outage Tracker for India",
    description:
      "Check power cut in your area with PowerCut. Find live power outage status, report outages, track complaints, and check restoration updates by PIN code or locality",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerCut- Power cut in my area | Live Power Outage Tracker for India",
    description:
      "Check power cut in your area with PowerCut. Find live power outage status, report outages, track complaints, and check restoration updates by PIN code or locality",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#172554",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PowerCut",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/pincode/{search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PowerCut",
      url: SITE_URL,
      description:
        "An independent, community-driven power outage reporting and tracking platform for India, organized by PIN code.",
      slogan: "Real-time power outage reporting and monitoring, by PIN code.",
    },
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <RestoreTextSize />
        <Header />
        <Suspense fallback={<div className="h-6 bg-blue-950" />}>
          <NoticesTicker />
        </Suspense>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Disclaimer />
        <Footer />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
