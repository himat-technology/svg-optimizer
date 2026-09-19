import type { Metadata } from "next";
import { SvgOptimizer } from "@/components/svg-optimizer/SvgOptimizer";

const SITE_URL = "https://himat.tech";
const PAGE_PATH = "/free-tools/svg-optimizer";
const TITLE =
  "SVG Optimizer & Vector Cleaner Online | HiMat Technology";
const DESCRIPTION =
  "Compress, clean, sanitize, and minify SVG files directly in your browser. Remove metadata, clean unused elements, round path precision, preview results, and download optimized SVGs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}${PAGE_PATH}`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PAGE_PATH}`,
    siteName: "HiMat Technology",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SVG Optimizer & Vector Cleaner",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: DESCRIPTION,
  url: `${SITE_URL}${PAGE_PATH}`,
  creator: {
    "@type": "Organization",
    name: "HiMat Technology",
    url: SITE_URL,
  },
};

export default function SvgOptimizerPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SvgOptimizer />
    </main>
  );
}
