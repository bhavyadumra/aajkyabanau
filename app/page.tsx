"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";

const BTN = {
  background: "linear-gradient(135deg,#ff6b9d,#e91e8c)",
  color: "#fff",
  fontWeight: 600,
  borderRadius: 16,
  padding: "12px 32px",
  fontSize: "1rem",
  boxShadow: "0 4px 18px rgba(233,30,140,0.35)",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s",
  display: "inline-block",
} as const;

const BTN_OUTLINE = {
  background: "#fff",
  color: "#e91e8c",
  fontWeight: 600,
  borderRadius: 16,
  padding: "12px 32px",
  fontSize: "1rem",
  border: "2px solid rgba(233,30,140,0.30)",
  boxShadow: "0 2px 12px rgba(233,30,140,0.10)",
  cursor: "pointer",
  transition: "all 0.2s",
  display: "inline-block",
} as const;

export default function HomePage() {
  const language = useAppStore((s) => s.language);
  const tr = t[language];

  return (
    <div className="relative overflow-hidden min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 space-y-6 max-w-2xl"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
          style={{ background: "rgba(233,30,140,0.08)", color: "#e91e8c", border: "1px solid rgba(233,30,140,0.2)" }}
        >
          {tr.badge}
        </div>

        {/* Heading */}
        <h1
          className="heading-display text-5xl md:text-7xl"
          style={{
            background: "linear-gradient(135deg,#e91e8c 0%,#ff6b9d 50%,#ff8c69 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {tr.heroTitle}
        </h1>

        {/* Sub heading */}
        <p className="heading-display-italic text-2xl md:text-3xl" style={{ color: "#9c6b8a" }}>
          {tr.heroSub}
        </p>

        {/* Description */}
        <p className="text-base md:text-lg max-w-lg mx-auto leading-relaxed" style={{ color: "#b07a9e" }}>
          {tr.heroDesc}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
          <Link href="/cuisine">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={BTN}>
              {tr.ctaStart}
            </motion.button>
          </Link>
          <Link href="/ingredients">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={BTN_OUTLINE}>
              {tr.ctaSkip}
            </motion.button>
          </Link>
          <Link href="/spin">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 16,
                padding: '12px 32px',
                fontSize: '1rem',
                boxShadow: '0 4px 18px rgba(124,58,237,0.35)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              } as React.CSSProperties}
            >
              🎡 Spin the Wheel
            </motion.button>
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {[tr.feat1, tr.feat2, tr.feat3, tr.feat4].map((f) => (
            <span key={f} className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: "white", color: "#b07a9e", border: "1px solid #ffb3d1" }}
            >
              {f}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
