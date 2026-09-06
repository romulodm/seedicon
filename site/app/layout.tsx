import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "seedicon — deterministic SVG avatars from any string",
  description:
    "Generate a stable SVG avatar from a UUID, wallet address or user id. No image storage, no uploads, no CDN. Works in SSR.",
  openGraph: {
    title: "seedicon",
    description:
      "Deterministic SVG avatars generated from any string seed. No image storage.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
