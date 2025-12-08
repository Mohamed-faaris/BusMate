import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { PostHogProviderWrapper } from "@/providers/PostHogProvider";
import { env } from "@/env";

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
  title: "BusMate",
  description:
    "BusMate, a product by QBix, is a smart platform for schools, colleges, and educational institutions like KRCE, KRCT, and MKCE to manage buses and student transportation efficiently. Ensure safe, reliable, and transparent commutes for students, parents, and administrators while simplifying communication and operations.",
  keywords: [
    "School bus management app",
    "Student transport management system",
    "Smart school transport platform",
    "School bus communication app",
    "School transportation management software",
    "Bus management for schools and colleges",
    "Parent-school transport communication",
    "School fleet management platform",
    "Safe student transport solution",
    "School transport coordination app",
    "Student bus app",
    "School transport safety solution",
    "Smart campus transport management",
    "Educational transport management system",
    "Safe school commute solution",
    "K Ramakrishnan College of Engineering",
    "KRCE",
    "KRCT",
    "MKCE",
    "QBix",
    "QBix product",
  ],
  authors: [{ name: "QBix" }],
  robots: "index, follow",
  icons: [
    { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32" },
    { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16" },
    { rel: "apple-touch-icon", url: "/favicon.ico" },
  ],
  openGraph: {
    type: "website",
    url: `${baseUrl}/`,
    title: "BusMate",
    description:
      "BusMate, a product by QBix, is a smart platform for educational institutions like KRCE, KRCT, and MKCE to manage buses and student transportation efficiently. Ensure safe, reliable, and transparent commutes for students, parents, and administrators.",
    siteName: "QBix",
    images: [
      {
        url: "/favicon-32x32.png",
        width: 1200,
        height: 630,
        alt: "BusMate Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@QBix",
    creator: "@QBix",
    title: "BusMate | Smart School & College Transport Management Platform",
    description:
      "BusMate, a product by QBix, is a smart platform for colleges like KRCE, KRCT, and MKCE to manage buses and student transportation efficiently. Ensure safe, reliable, and transparent commutes for students, parents, and administrators.",
    images: ["/favicon-32x32.png"],
  },
  metadataBase: new URL(`${baseUrl}/`),
  alternates: {
    canonical: `${baseUrl}/`,
    languages: {
      "en-US": `${baseUrl}/en-US`,
    },
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="no-scrollbar bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <div className="absolute top-5 right-5">
            <ThemeToggle animate={true} />
          </div> */}
          <PostHogProviderWrapper>
            <NextAuthProvider>
              <ReactQueryProvider>
                <div className="bg-background no-scrollbar h-full min-h-screen">
                  {children}
                </div>
              </ReactQueryProvider>
            </NextAuthProvider>
          </PostHogProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
