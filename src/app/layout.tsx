import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { NextAuthProvider } from "@/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "BusMate",
  description: "A bus tracking application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
          <NextAuthProvider>
            <ReactQueryProvider>
              <div className="bg-background no-scrollbar h-full min-h-screen">
                {children}
              </div>
            </ReactQueryProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
