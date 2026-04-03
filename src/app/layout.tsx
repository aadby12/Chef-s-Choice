import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { GlobalJsonLd } from "@/components/seo/global-json-ld";
import { BRAND } from "@/lib/brand";
import { DEFAULT_DESCRIPTION, SITE_KEYWORDS } from "@/lib/seo";
import { OG_IMAGE_SIZE } from "@/lib/og-image";
import { getSiteUrl } from "@/lib/site-url";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

export const viewport: Viewport = {
  themeColor: "#2C2420",
  colorScheme: "light",
};

const ogImageAlt = `${BRAND.fullName} — ${BRAND.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.webmanifest",
  title: {
    default: `${BRAND.fullName} · ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: BRAND.name,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: "Maison Solange", url: siteUrl }],
  creator: "Maison Solange",
  publisher: "Maison Solange",
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: siteUrl.replace(/\/+$/, "") || siteUrl,
    siteName: BRAND.fullName,
    title: `${BRAND.fullName} · ${BRAND.tagline}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.fullName} · ${BRAND.tagline}`,
    description: DEFAULT_DESCRIPTION,
    images: ["/twitter-image"],
  },
  category: "ecommerce",
  appleWebApp: {
    capable: true,
    title: BRAND.name,
    statusBarStyle: "black-translucent",
  },
  ...(googleSiteVerification || bingVerification
    ? {
        verification: {
          ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
          ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
        },
      }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GH" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        {/* Skip link: keyboard UX + crawl clarity for main landmark */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-cream focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-espresso focus:shadow-lift focus:outline-none focus:ring-2 focus:ring-brand-gold"
        >
          Skip to main content
        </a>
        <GlobalJsonLd />
        <Providers>
          <AnnouncementBar />
          <SiteHeader />
          <main id="main-content" tabIndex={-1} className="min-h-screen pb-12 pt-0 outline-none">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
