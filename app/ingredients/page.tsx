"use client";

import { useState } from "react";
import { ingredients, ingredientCategories } from "@/data/ingredients";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { t } from "@/lib/i18n";

export default function IngredientsPage() {
  const selected = useAppStore((s) => s.selectedIngredients);
  const toggle = useAppStore((s) => s.toggleIngredient);
  const language = useAppStore((s) => s.language);
  const tr = t[language];

  const [activeCat, setActiveCat] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = ingredients.filter((i) => {
    const name = language === "hi" ? i.nameHindi : i.name;
    const matchesCat = activeCat === "All" || i.category === activeCat;
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      i.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredIds = filtered.map((i) => i.id);
  const allSelectedInView = filteredIds.length > 0 && filteredIds.every((id) => selected.includes(id));

  const toggleSelectAll = () => {
    filteredIds.forEach((id) => {
      const isSelected = selected.includes(id);
      if (allSelectedInView ? isSelected : !isSelected) toggle(id);
    });
  };

  return (
    <section className="space-y-5 pb-28">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h2
          className="heading-display text-4xl md:text-5xl"
          style={{
            background: "linear-gradient(135deg,#e91e8c,#ff6b9d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {tr.ingTitle}
        </h2>
        <p className="heading-display-italic text-lg" style={{ color: "#b07a9e" }}>
          {tr.ingSub}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={17} style={{ color: "#e91e8c", opacity: 0.6 }} />
        <input
          type="text"
          placeholder={tr.ingSearch}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setActiveCat("All"); }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
          style={{
            background: "#fff",
            border: "1px solid rgba(233,30,140,0.20)",
            boxShadow: "0 2px 10px rgba(233,30,140,0.06)",
            outline: "none",
            color: "#2d1b2e",
          }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {ingredientCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCat(cat); setSearch(""); }}
            style={
              activeCat === cat
                ? { background: "linear-gradient(135deg,#ff6b9d,#e91e8c)", color: "#fff", border: "none", boxShadow: "0 2px 10px rgba(233,30,140,0.35)", borderRadius: 20, padding: "6px 16px", fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer" }
                : { background: "#fff", color: "#b07a9e", border: "1px solid #ffb3d1", borderRadius: 20, padding: "6px 16px", fontSize: "0.8rem", fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.15s" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count + Select All */}
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: "#b07a9e" }}>
          {tr.ingCount(filtered.length, activeCat)}
        </span>
        {filtered.length > 0 && (
          <button
            onClick={toggleSelectAll}
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "5px 14px",
              borderRadius: 20,
              cursor: "pointer",
              transition: "all 0.2s",
              background: allSelectedInView ? "rgba(233,30,140,0.07)" : "#fff",
              color: "#e91e8c",
              border: "1px solid rgba(233,30,140,0.30)",
            }}
          >
            {allSelectedInView ? tr.ingDeselectAll : tr.ingSelectAll}
          </button>
        )}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
        <AnimatePresence>
          {filtered.map((ing) => {
            const isSelected = selected.includes(ing.id);
            return (
              <motion.div
                key={ing.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.12 }}
              >
                <div
                  onClick={() => toggle(ing.id)}
                  className="flex flex-col items-center py-3 px-1 rounded-2xl cursor-pointer select-none transition-all"
                  style={{
                    background: isSelected ? "linear-gradient(135deg,#fff0f6,#fce4ec)" : "#fff",
                    border: isSelected ? "2px solid #e91e8c" : "2px solid rgba(233,30,140,0.10)",
                    boxShadow: isSelected ? "0 2px 10px rgba(233,30,140,0.15)" : "0 1px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <span className="text-2xl">{ing.emoji}</span>
                  <span className="text-xs mt-1 text-center leading-tight" style={{ color: isSelected ? "#e91e8c" : "#7a5068", fontWeight: isSelected ? 600 : 400 }}>
                    {language === "hi" ? ing.nameHindi : ing.name}
                  </span>
                  {isSelected && <span style={{ color: "#e91e8c", fontSize: "0.65rem", fontWeight: 700, marginTop: 2 }}>✓</span>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center py-10" style={{ color: "#b07a9e" }}>{tr.ingNone}</p>
      )}

      {/* Sticky bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-6 py-4 flex items-center justify-between z-30"
        style={{
          background: "rgba(255,255,255,0.98)",
          borderTop: "1px solid rgba(233,30,140,0.12)",
          boxShadow: "0 -4px 20px rgba(233,30,140,0.08)",
        }}
      >
        <span className="text-sm font-medium" style={{ color: "#9c6b8a" }}>
          {tr.ingSelectedCount(selected.length)}
        </span>
        <Link href="/results">
          <button
            style={{
              background: "linear-gradient(135deg,#ff6b9d,#e91e8c)",
              color: "#ffffff",
              fontWeight: 700,
              borderRadius: 12,
              padding: "10px 24px",
              fontSize: "0.9rem",
              boxShadow: "0 4px 14px rgba(233,30,140,0.40)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tr.ingCta}
          </button>
        </Link>
      </div>
    </section>
  );
}
