"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { filterRecipes } from "@/lib/matching";
import Link from "next/link";
import { Heart, Clock, ChefHat, Shuffle, Flame, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

// Placeholder recipes until data/recipes.ts is populated
const SAMPLE_RECIPES = [
  {
    id: "aloo-paratha",
    name: "Aloo Paratha",
    cuisine: ["north-indian", "breakfast", "punjabi"],
    ingredients: [
      { id: "atta", quantity: "2 cups" },
      { id: "potato", quantity: "3 medium" },
      { id: "onion", quantity: "1 small" },
      { id: "green-chilli", quantity: "2" },
      { id: "coriander", quantity: "handful" },
      { id: "ghee", quantity: "2 tbsp" },
      { id: "salt", quantity: "to taste" },
    ],
    time: 30,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
    description: "Crispy whole wheat flatbread stuffed with spiced mashed potato.",
    youtubeQuery: "aloo paratha recipe",
    tags: ["breakfast", "vegetarian"],
    isVeg: true,
    calories: 320,
  },
  {
    id: "dal-tadka",
    name: "Dal Tadka",
    cuisine: ["north-indian"],
    ingredients: [
      { id: "toor-dal", quantity: "1 cup" },
      { id: "onion", quantity: "1 medium" },
      { id: "tomato", quantity: "2 medium" },
      { id: "garlic", quantity: "4 cloves" },
      { id: "ginger", quantity: "1 inch" },
      { id: "cumin", quantity: "1 tsp" },
      { id: "turmeric", quantity: "1/2 tsp" },
      { id: "red-chilli", quantity: "1 tsp" },
      { id: "garam-masala", quantity: "1/2 tsp" },
      { id: "oil", quantity: "2 tbsp" },
      { id: "salt", quantity: "to taste" },
      { id: "coriander", quantity: "for garnish" },
    ],
    time: 40,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
    description: "Comforting lentil curry with a sizzling spiced tadka.",
    youtubeQuery: "dal tadka recipe restaurant style",
    tags: ["dal", "vegetarian", "lunch"],
    isVeg: true,
    calories: 250,
  },
  {
    id: "paneer-butter-masala",
    name: "Paneer Butter Masala",
    cuisine: ["north-indian", "mughlai"],
    ingredients: [
      { id: "paneer", quantity: "250g" },
      { id: "tomato", quantity: "4 medium" },
      { id: "onion", quantity: "2 medium" },
      { id: "butter", quantity: "3 tbsp" },
      { id: "cream", quantity: "3 tbsp" },
      { id: "garlic", quantity: "5 cloves" },
      { id: "ginger", quantity: "1 inch" },
      { id: "cashew", quantity: "10-12" },
      { id: "red-chilli", quantity: "1 tsp" },
      { id: "garam-masala", quantity: "1 tsp" },
      { id: "salt", quantity: "to taste" },
      { id: "sugar", quantity: "1 tsp" },
    ],
    time: 45,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
    description: "Silky, rich tomato-based gravy with soft paneer cubes.",
    youtubeQuery: "paneer butter masala recipe",
    tags: ["paneer", "vegetarian", "dinner"],
    isVeg: true,
    calories: 420,
  },
  {
    id: "poha",
    name: "Poha",
    cuisine: ["maharashtrian", "breakfast"],
    ingredients: [
      { id: "poha", quantity: "2 cups" },
      { id: "onion", quantity: "1 medium" },
      { id: "potato", quantity: "1 small" },
      { id: "peanuts", quantity: "2 tbsp" },
      { id: "mustard-seeds", quantity: "1 tsp" },
      { id: "curry-leaves", quantity: "8-10" },
      { id: "green-chilli", quantity: "1-2" },
      { id: "turmeric", quantity: "1/2 tsp" },
      { id: "lemon", quantity: "1" },
      { id: "sugar", quantity: "1 tsp" },
      { id: "salt", quantity: "to taste" },
      { id: "oil", quantity: "2 tbsp" },
      { id: "coriander", quantity: "for garnish" },
    ],
    time: 20,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
    description: "Light and fluffy flattened rice breakfast tossed with spices.",
    youtubeQuery: "poha recipe Maharashtra style",
    tags: ["breakfast", "vegetarian", "quick"],
    isVeg: true,
    calories: 220,
  },
  {
    id: "rajma-chawal",
    name: "Rajma Chawal",
    cuisine: ["north-indian", "punjabi"],
    ingredients: [
      { id: "rajma", quantity: "1 cup" },
      { id: "rice", quantity: "2 cups" },
      { id: "onion", quantity: "2 medium" },
      { id: "tomato", quantity: "3 medium" },
      { id: "garlic", quantity: "6 cloves" },
      { id: "ginger", quantity: "1 inch" },
      { id: "oil", quantity: "3 tbsp" },
      { id: "cumin", quantity: "1 tsp" },
      { id: "red-chilli", quantity: "1 tsp" },
      { id: "coriander-powder", quantity: "2 tsp" },
      { id: "garam-masala", quantity: "1 tsp" },
      { id: "salt", quantity: "to taste" },
    ],
    time: 60,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
    description: "Classic kidney bean curry served over steamed rice — ultimate comfort food.",
    youtubeQuery: "rajma chawal recipe Punjabi",
    tags: ["lunch", "vegetarian", "comfort"],
    isVeg: true,
    calories: 380,
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    cuisine: ["snacks"],
    ingredients: [
      { id: "milk", quantity: "1 cup" },
      { id: "cardamom", quantity: "2 pods" },
      { id: "ginger", quantity: "small piece" },
      { id: "sugar", quantity: "2 tsp" },
      { id: "cloves", quantity: "2" },
      { id: "cinnamon", quantity: "small piece" },
    ],
    time: 10,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
    description: "Aromatic spiced Indian tea brewed to perfection.",
    youtubeQuery: "masala chai recipe",
    tags: ["drink", "vegetarian", "quick"],
    isVeg: true,
    calories: 80,
  },
];

const DIFF_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  Easy:   { color: "#16a34a", bg: "#dcfce7", label: "Easy" },
  Medium: { color: "#d97706", bg: "#fef9c3", label: "Medium" },
  Hard:   { color: "#dc2626", bg: "#fee2e2", label: "Hard" },
};

// Card accent colors — cycle through these for visual variety
const CARD_ACCENTS = [
  { top: "#FF6B9D", bottom: "#FFB347" },
  { top: "#a78bfa", bottom: "#60a5fa" },
  { top: "#34d399", bottom: "#06b6d4" },
  { top: "#fb7185", bottom: "#f97316" },
  { top: "#f472b6", bottom: "#c084fc" },
  { top: "#fbbf24", bottom: "#84cc16" },
];

export default function ResultsPage() {
  const selectedCuisines = useAppStore((s) => s.selectedCuisines);
  const selectedIngredients = useAppStore((s) => s.selectedIngredients);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState<typeof SAMPLE_RECIPES>([]);
  const [almostThere, setAlmostThere] = useState<(typeof SAMPLE_RECIPES[0] & { missingIngredients: string[] })[]>([]);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const result = filterRecipes(SAMPLE_RECIPES as any, selectedCuisines, selectedIngredients);
      setReady(result.ready as any);
      setAlmostThere(result.almostThere as any);
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [selectedCuisines, selectedIngredients, shuffleSeed]);

  const shuffle = () => {
    setReady((prev) => [...prev].sort(() => Math.random() - 0.5));
    setShuffleSeed((s) => s + 1);
  };

  const prettyName = (id: string) =>
    id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // ── CARD COMPONENT ──────────────────────────────────────────────
  const RecipeCard = ({ r, idx, showMissing }: { r: any; idx: number; showMissing?: boolean }) => {
    const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
    const diff = DIFF_CONFIG[r.difficulty] ?? DIFF_CONFIG.Easy;
    const isFav = favorites.includes(r.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ delay: idx * 0.07, type: "spring", stiffness: 220, damping: 22 }}
        style={{ position: "relative" }}
      >
        <Link href={`/recipe/${r.id}`} style={{ textDecoration: "none", display: "block" }}>
          <div
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              transition: "box-shadow 0.25s, transform 0.25s",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
          >
            {/* ── Image with diagonal slash overlay ── */}
            <div style={{ position: "relative", height: "180px" }}>
              <img
                src={r.image}
                alt={r.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Diagonal gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(160deg, transparent 45%, rgba(0,0,0,0.75) 100%)`,
              }} />
              {/* Top accent bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                background: `linear-gradient(90deg, ${accent.top}, ${accent.bottom})`,
              }} />

              {/* Veg dot */}
              <div style={{
                position: "absolute", top: "12px", left: "12px",
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px",
              }}>
                {r.isVeg ? "🌱" : "🍗"}
              </div>

              {/* Fav button */}
              <button
                onClick={(e) => { e.preventDefault(); toggleFavorite(r.id); }}
                style={{
                  position: "absolute", top: "10px", right: "10px",
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: isFav ? "rgba(233,30,140,0.9)" : "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(8px)",
                  border: `1.5px solid ${isFav ? "rgba(233,30,140,0.6)" : "rgba(255,255,255,0.25)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <Heart size={14} color="#fff" fill={isFav ? "#fff" : "none"} />
              </button>

              {/* Recipe name bottom-left over image */}
              <div style={{ position: "absolute", bottom: "12px", left: "14px", right: "50px" }}>
                <h3
                  className="heading-display"
                  style={{
                    color: "#fff",
                    fontSize: "18px",
                    lineHeight: 1.2,
                    textShadow: "0 2px 10px rgba(0,0,0,0.85)",
                    margin: 0,
                  }}
                >
                  {r.name}
                </h3>
              </div>

              {/* Calorie badge bottom-right */}
              <div style={{
                position: "absolute", bottom: "12px", right: "12px",
                background: `linear-gradient(135deg, ${accent.top}, ${accent.bottom})`,
                borderRadius: "999px",
                padding: "3px 10px",
                display: "flex", alignItems: "center", gap: "4px",
              }}>
                <Flame size={10} color="#fff" />
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff" }}>{r.calories} kcal</span>
              </div>
            </div>

            {/* ── Card body ── */}
            <div style={{ padding: "14px 16px 16px" }}>
              <p style={{
                fontSize: "12px", color: "#6b7280", lineHeight: 1.5,
                marginBottom: "12px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {r.description}
              </p>

              {/* Missing ingredients */}
              {showMissing && r.missingIngredients?.length > 0 && (
                <div style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  marginBottom: "12px",
                }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#92400e", marginBottom: "6px" }}>
                    🛒 Need to buy:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {r.missingIngredients.map((mid: string) => (
                      <span key={mid} style={{
                        fontSize: "10px", fontWeight: 600,
                        background: "#fef3c7", color: "#92400e",
                        border: "1px solid #fde68a",
                        borderRadius: "999px", padding: "2px 8px",
                      }}>
                        {prettyName(mid)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                {/* Difficulty pill */}
                <span style={{
                  fontSize: "11px", fontWeight: 700,
                  background: diff.bg, color: diff.color,
                  borderRadius: "999px", padding: "3px 10px",
                  border: `1px solid ${diff.color}33`,
                }}>
                  {diff.label}
                </span>

                {/* Time */}
                <span style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  fontSize: "12px", color: "#6b7280", fontWeight: 500,
                }}>
                  <Clock size={12} color="#e91e8c" /> {r.time} min
                </span>

                {/* Cuisine tags */}
                {r.cuisine.slice(0, 1).map((c: string) => (
                  <span key={c} style={{
                    fontSize: "10px", fontWeight: 600,
                    background: `${accent.top}18`,
                    color: accent.top,
                    borderRadius: "999px", padding: "3px 9px",
                    border: `1px solid ${accent.top}33`,
                    textTransform: "capitalize",
                  }}>
                    {c.replace(/-/g, " ")}
                  </span>
                ))}

                {/* Cook now arrow */}
                <div style={{
                  marginLeft: "auto",
                  background: `linear-gradient(135deg, ${accent.top}, ${accent.bottom})`,
                  borderRadius: "999px", padding: "5px 12px",
                  display: "flex", alignItems: "center", gap: "4px",
                }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>Cook →</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  // ── SKELETON CARD ──
  const SkeletonCard = ({ i }: { i: number }) => (
    <div style={{
      borderRadius: "24px", overflow: "hidden",
      background: "#fff",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      <div className="skeleton-shimmer" style={{ height: "180px" }} />
      <div style={{ padding: "14px 16px 16px" }}>
        <div className="skeleton-shimmer" style={{ height: "12px", borderRadius: "99px", marginBottom: "8px", width: "70%" }} />
        <div className="skeleton-shimmer" style={{ height: "12px", borderRadius: "99px", width: "90%" }} />
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <div className="skeleton-shimmer" style={{ height: "24px", borderRadius: "99px", width: "60px" }} />
          <div className="skeleton-shimmer" style={{ height: "24px", borderRadius: "99px", width: "60px" }} />
        </div>
      </div>
    </div>
  );

  return (
    <section style={{ paddingBottom: "48px" }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div>
            <h2
              className="heading-display"
              style={{
                fontSize: "clamp(2rem, 7vw, 3rem)",
                background: "linear-gradient(135deg,#e91e8c,#ff6b9d,#ffb347)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.1,
                marginBottom: "6px",
              }}
            >
              Your Recipes ✨
            </h2>
            <p className="heading-display-italic" style={{ color: "#b07a9e", fontSize: "15px" }}>
              Cooked up just for your pantry
            </p>
          </div>

          {/* Shuffle button */}
          <motion.button
            whileTap={{ scale: 0.93, rotate: 180 }}
            onClick={shuffle}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "linear-gradient(135deg,#fff0f6,#fce4ec)",
              border: "1.5px solid #f9a8d4",
              borderRadius: "999px", padding: "8px 18px",
              fontSize: "13px", fontWeight: 700, color: "#9d174d",
              cursor: "pointer", flexShrink: 0,
              boxShadow: "0 2px 12px rgba(233,30,140,0.15)",
            }}
          >
            <Shuffle size={15} /> Shuffle
          </motion.button>
        </div>

        {/* Decorative divider */}
        <div style={{
          marginTop: "16px", height: "3px", borderRadius: "999px",
          background: "linear-gradient(90deg,#FF6B9D,#FFB347,#FF6B9D)",
          opacity: 0.35,
        }} />
      </div>

      {/* ── LOADING STATE ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Animated loading label */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "20px",
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "linear-gradient(135deg,#FF6B9D,#FFB347)",
                animation: "pulse 1.2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: "14px", color: "#b07a9e", fontWeight: 600 }}>
                Finding the best matches…
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RESULTS ── */}
      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

          {/* ── READY TO COOK ── */}
          {ready.length > 0 && (
            <div style={{ marginBottom: "40px" }}>
              {/* Section label — left chevron shape */}
              <div style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "linear-gradient(135deg,#16a34a,#4ade80)",
                  color: "#fff", fontWeight: 800, fontSize: "13px",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "7px 20px 7px 14px",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                  borderRadius: "6px 0 0 6px",
                }}>
                  ✅ Ready to Cook
                </div>
                <span style={{
                  fontSize: "13px", fontWeight: 700,
                  background: "#dcfce7", color: "#16a34a",
                  borderRadius: "999px", padding: "3px 10px",
                  border: "1px solid #bbf7d0",
                }}>
                  {ready.length} recipe{ready.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
                {ready.map((r, idx) => (
                  <RecipeCard key={r.id} r={r} idx={idx} />
                ))}
              </div>
            </div>
          )}

          {/* No exact matches notice */}
          {ready.length === 0 && almostThere.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: "28px",
                background: "linear-gradient(135deg,#fff7ed,#fef9c3)",
                border: "1.5px solid #fde68a",
                borderRadius: "20px",
                padding: "18px 20px",
                display: "flex", alignItems: "center", gap: "14px",
              }}
            >
              <span style={{ fontSize: "32px" }}>🤔</span>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#92400e", marginBottom: "2px" }}>
                  No exact matches yet
                </p>
                <p style={{ fontSize: "12px", color: "#a16207" }}>
                  But you&apos;re close! Grab 1–2 more ingredients to unlock these recipes.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── ALMOST THERE ── */}
          {almostThere.length > 0 && (
            <div style={{ marginBottom: "40px" }}>
              {/* Section label — right chevron shape */}
              <div style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "linear-gradient(135deg,#d97706,#fbbf24)",
                  color: "#fff", fontWeight: 800, fontSize: "13px",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "7px 20px 7px 14px",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                  borderRadius: "6px 0 0 6px",
                }}>
                  🛒 Almost There
                </div>
                <span style={{
                  fontSize: "12px", fontWeight: 600, color: "#92400e",
                }}>
                  — grab 1–2 more items
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
                {almostThere.map((r, idx) => (
                  <RecipeCard key={r.id} r={r} idx={idx} showMissing />
                ))}
              </div>
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {ready.length === 0 && almostThere.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: "center", padding: "60px 24px",
                background: "linear-gradient(135deg,#fff0f6,#fce4ec)",
                borderRadius: "32px",
                border: "1.5px solid #f9a8d4",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🍽️</div>
              <h3 className="heading-display" style={{ fontSize: "24px", color: "#9d174d", marginBottom: "8px" }}>
                No recipes found
              </h3>
              <p style={{ fontSize: "14px", color: "#be185d", marginBottom: "24px" }}>
                Try selecting more ingredients or a different cuisine.
              </p>
              <Link href="/ingredients">
                <button style={{
                  background: "linear-gradient(135deg,#FF6B9D,#FFB347)",
                  color: "#fff", fontWeight: 700, fontSize: "14px",
                  padding: "12px 28px", borderRadius: "999px",
                  border: "none", cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(255,107,157,0.4)",
                }}>
                  ← Change Ingredients
                </button>
              </Link>
            </motion.div>
          )}

        </motion.div>
      )}
    </section>
  );
}
