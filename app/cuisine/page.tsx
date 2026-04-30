"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cuisines } from "@/data/cuisines";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";

const BTN = {
  background: "linear-gradient(135deg,#ff6b9d,#e91e8c)",
  color: "#ffffff",
  fontWeight: 600,
  borderRadius: 12,
  padding: "10px 22px",
  fontSize: "0.9rem",
  boxShadow: "0 4px 14px rgba(233,30,140,0.35)",
  border: "none",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
  transition: "all 0.2s",
};

export default function CuisinePage() {
  const selected = useAppStore((s) => s.selectedCuisines);
  const toggle = useAppStore((s) => s.toggleCuisine);
  const language = useAppStore((s) => s.language);
  const tr = t[language];

  const progress = (selected.length / cuisines.length) * 100;

  return (
    <section className="space-y-6 pb-6">
      <div className="text-center space-y-2 mb-8">
        <h2
          className="heading-display text-4xl md:text-5xl"
          style={{
            background: "linear-gradient(135deg,#e91e8c,#ff6b9d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {tr.cuisineTitle}
        </h2>
        <p className="heading-display-italic text-lg" style={{ color: "#b07a9e" }}>
          {tr.cuisineSub}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cuisines.map((c, idx) => {
          const isSelected = selected.includes(c.id);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => toggle(c.id)}
              className="relative rounded-card overflow-hidden cursor-pointer group"
              style={{
                border: isSelected ? "2px solid #e91e8c" : "2px solid transparent",
                boxShadow: isSelected ? "0 0 0 3px rgba(233,30,140,0.15)" : "0 2px 12px rgba(0,0,0,0.08)",
                transition: "all 0.2s",
              }}
            >
              <CuisineImage src={c.image} alt={c.name} emoji={c.emoji} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs font-semibold text-center drop-shadow">
                  {c.emoji} {language === "hi" ? c.nameHindi : c.name}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 size={20} className="text-white drop-shadow" style={{ fill: "#e91e8c" }} />
                </div>
              )}
              <div className="absolute inset-0 group-hover:bg-white/5 transition-all" />
            </motion.div>
          );
        })}
      </div>

      {/* Progress + CTA */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ background: "#ffe0ed" }}>
          <motion.div
            className="h-2 rounded-full"
            style={{ background: "linear-gradient(90deg,#ff6b9d,#e91e8c)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 80 }}
          />
        </div>
        <span className="text-sm whitespace-nowrap" style={{ color: "#b07a9e" }}>
          {tr.cuisineSelected(selected.length)}
        </span>
        <Link href="/ingredients">
          <button style={BTN}>{tr.cuisineNext}</button>
        </Link>
      </div>
    </section>
  );
}

function CuisineImage({ src, alt, emoji }: { src: string; alt: string; emoji: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="w-full h-28 flex items-center justify-center text-5xl"
        style={{ background: "linear-gradient(135deg,rgba(255,107,157,0.2),rgba(255,179,71,0.2))" }}
      >
        {emoji}
      </div>
    );
  }
  return (
    <img
      src={src} alt={alt}
      onError={() => setFailed(true)}
      className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
    />
  );
}
