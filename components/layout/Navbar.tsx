"use client";

import Link from "next/link";
import { Sun, Moon, ChevronDown, Globe } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { LANGUAGES } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";
import type { Language } from "@/types";

export default function Navbar() {
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDark = useAppStore((s) => s.toggleDarkMode);
  const language = useAppStore((s) => s.language) as Language;
  const setLanguage = useAppStore((s) => s.setLanguage);

  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-5 py-3"
      style={{
        background: "rgba(255,255,255,0.92)",
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

        {/* ── Language picker dropdown ── */}
        <div ref={dropRef} style={{ position: "relative" }}>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: open ? "rgba(233,30,140,0.10)" : "rgba(233,30,140,0.06)",
              border: "1px solid rgba(233,30,140,0.22)",
              color: "#e91e8c",
              borderRadius: "20px",
              padding: "5px 11px 5px 9px",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <Globe size={13} />
            <span>{current.flag} {current.nativeLabel}</span>
            <ChevronDown size={12} style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }} />
          </button>

          {/* Dropdown panel */}
          {open && (
            <div
              style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "#fff",
                border: "1px solid rgba(233,30,140,0.15)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(233,30,140,0.10)",
                overflow: "hidden",
                minWidth: "170px",
                zIndex: 100,
              }}
            >
              {/* Header */}
              <div style={{
                padding: "10px 14px 8px",
                borderBottom: "1px solid #fce4ec",
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "#b07a9e",
              }}>
                🌐 Choose Language
              </div>

              {LANGUAGES.map((lang) => {
                const isActive = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as Language);
                      setOpen(false);
                    }}
                    style={{
                      width: "100%", textAlign: "left",
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "9px 14px",
                      background: isActive ? "linear-gradient(135deg,#fff0f6,#fce4ec)" : "transparent",
                      border: "none", cursor: "pointer",
                      transition: "background 0.15s",
                      borderLeft: isActive ? "3px solid #e91e8c" : "3px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#fff8fb";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{lang.flag}</span>
                    <div>
                      <div style={{
                        fontSize: "13px", fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#e91e8c" : "#2d1b2e",
                        lineHeight: 1.2,
                      }}>
                        {lang.nativeLabel}
                      </div>
                      <div style={{ fontSize: "10px", color: "#9c6b8a" }}>
                        {lang.label}
                      </div>
                    </div>
                    {isActive && (
                      <span style={{
                        marginLeft: "auto", fontSize: "12px",
                        color: "#e91e8c", fontWeight: 700,
                      }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          title="Toggle dark mode"
          style={{
            width: 34, height: 34,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
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
