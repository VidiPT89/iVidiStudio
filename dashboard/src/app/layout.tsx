import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { NO_FLASH_SCRIPT } from "@/lib/storage-keys";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iVidi Studio HQ",
  description: "Live demo: iVidi Studio running on its own as a twelve-floor building — every floor a team, every request riding the elevator, every real-impact decision waiting for a human.",
  authors: [{ name: "David Arsénio Martins", url: "https://ividi.dev" }],
  creator: "David Arsénio Martins",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-PT" data-theme="dark" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
