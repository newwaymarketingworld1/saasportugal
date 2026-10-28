import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { site, contact } from "@/lib/content";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: "normal",
  // Fonte variável com eixo de tamanho óptico: títulos grandes ganham o
  // desenho de "display" automaticamente (font-optical-sizing: auto).
  axes: ["opsz"],
  display: "swap",
  variable: "--font-newsreader",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f8f6",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: site.name,
  medicalSpecialty: "Rheumatology",
  telephone: "+55-47-99139-2555",
  url: site.url,
  image: `${site.url}/opengraph-image.png`,
  address: {
    "@type": "PostalAddress",
    // O bairro (Nações) não tem campo próprio no schema.org.
    streetAddress: "Rua Dinamarca, 141, sala 303, Nações",
    addressLocality: "Balneário Camboriú",
    addressRegion: "SC",
    addressCountry: "BR",
  },
  areaServed: "Balneário Camboriú",
  sameAs: [contact.instagramUrl],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${hanken.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
