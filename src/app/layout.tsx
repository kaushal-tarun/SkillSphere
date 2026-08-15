import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSphere | Student Developer Network",
  description: "SkillSphere is the premier student developer network. Build side projects, compete in community arena battles, showcase proof-of-work, and rise in your developer career.",
  icons: {
    icon: "/SSblacky.png",
    shortcut: "/SSblacky.png",
    apple: "/SSblacky.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf6f0] text-zinc-900 selection:bg-zinc-900 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
