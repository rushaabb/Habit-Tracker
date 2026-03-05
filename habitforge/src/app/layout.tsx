import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HabitForge",
  description: "A modern, playful habit tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased selection:bg-primary selection:text-primary-foreground min-h-screen bg-background`}
      >
        <Sidebar />
        <main className="md:pl-64 min-h-screen transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
