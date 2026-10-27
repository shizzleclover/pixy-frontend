import type { Metadata, Viewport } from "next";
import "./globals.css";
import QueryProvider from "@/lib/query-client";
import Nav from "@/components/shared/nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixy.ng"),
  title: {
    default: "Pixy.ng — Every photo from your event, one printed magazine",
    template: "%s · Pixy.ng",
  },
  description:
    "Guests scan a QR code, upload from their phones and find every photo they're in. Pixy.ng lays the best shots into a printed magazine and delivers it to the host.",
  keywords: ["event photos", "QR upload", "face search", "photo magazine", "Nigeria", "owambe", "wedding"],
  openGraph: {
    title: "Pixy.ng — Every photo from your event, one printed magazine",
    description:
      "QR upload, selfie face search, live wall and an auto-built printed magazine. Built for Nigerian events.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryProvider>
          <Nav />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
