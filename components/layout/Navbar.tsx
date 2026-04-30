"use client";

import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Navbar() {
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDark = useAppStore((s) => s.toggleDarkMode);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const isHindi = language === "hi";

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-5 py-3"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(233,30,140,0.12)",
        boxShadow: "0 2px 20px rgba(233,30,140,0.07)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center text-base shadow-md flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#ff6b9d,#ffb347)" }}
        >
          🍳
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "1.15rem",
            background: "linear-gradient(135deg,#e91e8c,#ff6b9d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Aaj Kya Banau?
        </span>
      </Link>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={() => setLanguage(isHindi ? "en" : "hi")}
          title="Switch language"
          style={{
            background: "rgba(233,30,140,0.07)",
            border: "1px solid rgba(233,30,140,0.20)",
            color: "#e91e8c",
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: isHindi ? "'Hind', sans-serif" : "inherit",
          }}
        >
          {isHindi ? "EN" : "हिन्दी"}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          title="Toggle dark mode"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(233,30,140,0.07)",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {darkMode
            ? <Sun size={16} style={{ color: "#e91e8c" }} />
            : <Moon size={16} style={{ color: "#e91e8c" }} />
          }
        </button>
      </div>
    </nav>
  );
}
