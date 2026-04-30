import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeManager from "@/components/ThemeManager";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Aaj Kya Banau? — Find Recipes from Your Ingredients",
  description: "Discover delicious Indian recipes based on ingredients you already have at home.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans" style={{ background: "var(--bg-page)" }}>
        <ThemeManager />
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          {children}
        </main>
        <footer className="text-center py-5 text-xs text-rose-300 border-t border-rose-100">
          Made with ❤️ for every Indian kitchen · © {new Date().getFullYear()} Aaj Kya Banau?
        </footer>
      </body>
    </html>
  );
}
