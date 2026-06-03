"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { useAppStore } from "@/lib/store";
import Button from "@/components/ui/Button";
import { Heart, Clock, ChefHat, ArrowLeft, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import type { Language } from "@/types";

// Inline the same sample recipes used in results page
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
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    description: "Crispy whole wheat flatbread stuffed with spiced mashed potato.",
    steps: [
      "Boil and mash potatoes. Mix with chopped onion, green chilli, coriander, and salt.",
      "Knead atta into smooth dough with water.",
      "Roll small dough balls, add potato filling, seal, and roll flat.",
      "Cook on hot tawa with ghee until golden on both sides.",
      "Serve hot with curd and pickle.",
    ],
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
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    description: "Comforting lentil curry with a sizzling spiced tadka.",
    steps: [
      "Pressure cook dal with turmeric and salt for 3-4 whistles.",
      "Sauté onion in oil until golden. Add ginger-garlic, tomato, and spices.",
      "Mix cooked dal into the masala and simmer 10 mins.",
      "Prepare a quick cumin-chilli tadka and pour over dal.",
      "Garnish with coriander and serve with rice or roti.",
    ],
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
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    description: "Silky, rich tomato-based gravy with soft paneer cubes.",
    steps: [
      "Blend tomatoes, onion, cashew, ginger, garlic into a smooth paste.",
      "Cook paste in butter, add spices, and stir until oil separates.",
      "Add paneer cubes and simmer 10 mins.",
      "Finish with cream and sugar. Adjust seasoning.",
      "Garnish with cream swirl and coriander. Serve with naan.",
    ],
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
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    description: "Light and fluffy flattened rice breakfast tossed with spices.",
    steps: [
      "Rinse poha and let it soften for 5 mins. Drain well.",
      "Temper mustard seeds, curry leaves, green chilli in oil.",
      "Add onion and potato, cook until tender.",
      "Mix in poha, turmeric, salt, sugar. Toss gently.",
      "Squeeze lemon, garnish with coriander and serve.",
    ],
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
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    description: "Classic kidney bean curry served over steamed rice.",
    steps: [
      "Soak rajma overnight, then pressure cook until soft.",
      "Sauté onions until golden, add ginger-garlic paste.",
      "Add tomatoes and cook until masala is thick.",
      "Add rajma and cooking liquid, simmer 20 mins.",
      "Serve over steamed rice with onion and pickle.",
    ],
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
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
    description: "Aromatic spiced Indian tea brewed to perfection.",
    steps: [
      "Boil water with ginger, cardamom, cloves, and cinnamon.",
      "Add tea leaves and sugar, boil 1 min.",
      "Add milk and bring to a boil.",
      "Strain and serve hot.",
    ],
    youtubeQuery: "masala chai recipe",
    tags: ["drink", "vegetarian", "quick"],
    isVeg: true,
    calories: 80,
  },
];

const DIFF_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Easy: { color: "#16a34a", bg: "#dcfce7", icon: "⭐" },
  Medium: { color: "#d97706", bg: "#fef9c3", icon: "⭐⭐" },
  Hard: { color: "#dc2626", bg: "#fee2e2", icon: "⭐⭐⭐" },
};

// Pastel bubble colors cycling for ingredients
const BUBBLE_COLORS = [
  { bg: "#fff0f6", border: "#f9a8d4", text: "#9d174d" },
  { bg: "#fdf4ff", border: "#e879f9", text: "#7e22ce" },
  { bg: "#fff7ed", border: "#fb923c", text: "#9a3412" },
  { bg: "#f0fdf4", border: "#4ade80", text: "#166534" },
  { bg: "#eff6ff", border: "#60a5fa", text: "#1e3a8a" },
  { bg: "#fef9c3", border: "#facc15", text: "#854d0e" },
];

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const toggleFav = useAppStore((s) => s.toggleFavorite);
  const favs = useAppStore((s) => s.favorites);
  const language = useAppStore((s) => s.language) as Language;
  const tr = t[language];
  const recipe = SAMPLE_RECIPES.find((r) => r.id === id);
  const isFav = recipe ? favs.includes(recipe.id) : false;

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-medium mb-4">{tr.recipeNotFound}</p>
        <Button onClick={() => router.back()}>← {tr.backBtn}</Button>
      </div>
    );
  }

  const diff = DIFF_CONFIG[recipe.difficulty] ?? DIFF_CONFIG.Easy;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto pb-16"
      style={{ position: "relative" }}
    >
      {/* ── HERO ── full-bleed with wave clip */}
      <div style={{ position: "relative", marginLeft: "-1rem", marginRight: "-1rem" }}>
        {/* Image */}
        <div style={{ position: "relative", height: "320px", overflow: "hidden" }}>
          <img
            src={recipe.image}
            alt={recipe.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Deep gradient for title contrast */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.88) 100%)"
          }} />

          {/* Back button */}
          <button
            onClick={() => router.back()}
            style={{
              position: "absolute", top: "16px", left: "16px",
              display: "flex", alignItems: "center", gap: "6px",
              background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: "999px", padding: "6px 14px",
              color: "#fff", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", transition: "background 0.2s",
            }}
          >
            <ArrowLeft size={14} /> {tr.backBtn}
          </button>

          {/* Veg / Non-Veg dot */}
          <div style={{
            position: "absolute", top: "16px", right: "16px",
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "999px", padding: "5px 12px",
            color: "#fff", fontSize: "12px", fontWeight: 700,
          }}>
            {recipe.isVeg ? `🌱 ${tr.recipeVeg}` : `🍗 ${tr.recipeNonVeg}`}
          </div>

          {/* Title area */}
          <div style={{ position: "absolute", bottom: "24px", left: "20px", right: "20px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              {recipe.cuisine.slice(0, 2).map((c) => (
                <span key={c} style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "rgba(255,107,157,0.35)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,107,157,0.5)",
                  borderRadius: "999px", padding: "2px 10px", color: "#ffe0ed",
                }}>
                  {c.replace(/-/g, " ")}
                </span>
              ))}
            </div>
            <h1
              className="heading-display"
              style={{
                fontSize: "clamp(2rem, 8vw, 2.75rem)",
                color: "#fff",
                lineHeight: 1.1,
                textShadow: "0 2px 16px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.8)",
                marginBottom: "6px",
              }}
            >
              {recipe.name}
            </h1>
            <p style={{
              fontSize: "13px", color: "rgba(255,255,255,0.82)", fontWeight: 400, lineHeight: 1.5,
              textShadow: "0 1px 8px rgba(0,0,0,0.7)",
            }}>
              {recipe.description}
            </p>
          </div>
        </div>

        {/* Wave bottom */}
        <svg viewBox="0 0 1440 54" preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "54px", marginTop: "-2px" }}>
          <path d="M0,32 C240,54 480,10 720,32 C960,54 1200,10 1440,32 L1440,54 L0,54 Z"
            fill="#fff8fb" />
        </svg>
      </div>

      {/* ── STATS ROW ── floating pill cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ display: "flex", gap: "10px", padding: "0 4px", marginTop: "-8px", flexWrap: "wrap" }}
      >
        {/* Difficulty */}
        <div style={{
          flex: 1, minWidth: "80px",
          background: diff.bg,
          border: `1.5px solid ${diff.color}33`,
          borderRadius: "20px",
          padding: "12px 14px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        }}>
          <span style={{ fontSize: "18px" }}>{diff.icon}</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: diff.color, letterSpacing: "0.05em" }}>
            {{ Easy: tr.diffEasy, Medium: tr.diffMedium, Hard: tr.diffHard }[recipe.difficulty] ?? diff.label}
          </span>
        </div>

        {/* Time */}
        <div style={{
          flex: 1, minWidth: "80px",
          background: "linear-gradient(135deg,#fff0f6,#fce4ec)",
          border: "1.5px solid #f9a8d433",
          borderRadius: "20px",
          padding: "12px 14px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        }}>
          <Clock size={18} color="#e91e8c" />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#9d174d" }}>{recipe.time} min</span>
        </div>

        {/* Calories */}
        <div style={{
          flex: 1, minWidth: "80px",
          background: "linear-gradient(135deg,#fff7ed,#ffedd5)",
          border: "1.5px solid #fb923c33",
          borderRadius: "20px",
          padding: "12px 14px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        }}>
          <Flame size={18} color="#ea580c" />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#9a3412" }}>{recipe.calories} kcal</span>
        </div>

        {/* Save */}
        <button
          onClick={() => toggleFav(recipe.id)}
          style={{
            flex: 1, minWidth: "80px",
            background: isFav ? "linear-gradient(135deg,#fff0f6,#fce4ec)" : "#fff",
            border: `1.5px solid ${isFav ? "#e91e8c" : "#e5e7eb"}`,
            borderRadius: "20px",
            padding: "12px 14px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          <Heart size={18} color={isFav ? "#e91e8c" : "#9ca3af"}
            fill={isFav ? "#e91e8c" : "none"} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: isFav ? "#e91e8c" : "#6b7280" }}>
            {isFav ? tr.recipeSaved : tr.recipeSave}
          </span>
        </button>
      </motion.div>

      {/* ── INGREDIENTS ── hexagonal/bubble grid */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ marginTop: "32px" }}
      >
        {/* Skewed section label */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "linear-gradient(135deg,#FF6B9D,#FF8C69)",
            color: "#fff", fontWeight: 800, fontSize: "13px",
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "8px 24px 8px 16px",
            clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
            borderRadius: "8px 0 0 8px",
          }}>
            🛒 {tr.recipeIngTitle}
            <span style={{
              background: "rgba(255,255,255,0.3)", borderRadius: "999px",
              padding: "1px 8px", fontSize: "11px",
            }}>
              {tr.recipeIngCount(recipe.ingredients.length)}
            </span>
          </div>
        </div>

        {/* Bubble grid */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "10px", padding: "0 4px",
        }}>
          {recipe.ingredients.map((ing, i) => {
            const c = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
            return (
              <motion.div
                key={ing.id}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.28 + i * 0.05, type: "spring", stiffness: 260, damping: 18 }}
                style={{
                  background: c.bg,
                  border: `1.5px solid ${c.border}`,
                  borderRadius: "999px",
                  padding: "8px 16px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "2px",
                  boxShadow: `0 2px 12px ${c.border}55`,
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 700, color: c.text, textTransform: "capitalize" }}>
                  {ing.id.replace(/-/g, " ")}
                </span>
                <span style={{ fontSize: "10px", fontWeight: 500, color: c.text + "aa" }}>
                  {ing.quantity}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── HOW TO MAKE ── vertical timeline */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ marginTop: "40px" }}
      >
        {/* Skewed label — right-aligned variant */}
        <div style={{ position: "relative", marginBottom: "24px", display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "linear-gradient(135deg,#FF8C69,#FFB347)",
            color: "#fff", fontWeight: 800, fontSize: "13px",
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "8px 16px 8px 24px",
            clipPath: "polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%)",
            borderRadius: "0 8px 8px 0",
          }}>
            👨‍🍳 How to Make
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: "44px" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: "19px", top: "12px", bottom: "12px",
            width: "2px",
            background: "linear-gradient(180deg,#FF6B9D,#FFB347,#FF6B9D)",
            borderRadius: "999px",
            opacity: 0.35,
          }} />

          {recipe.steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38 + idx * 0.08 }}
              style={{
                position: "relative", marginBottom: "20px", display: "flex", gap: "0",
              }}
            >
              {/* Step bubble */}
              <div style={{
                position: "absolute", left: "-44px",
                width: "38px", height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#FF6B9D,#FFB347)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "13px", fontWeight: 800,
                boxShadow: "0 4px 14px rgba(255,107,157,0.45)",
                flexShrink: 0,
              }}>
                {idx + 1}
              </div>

              {/* Step card — diagonal top-right notch via clip-path */}
              <div style={{
                flex: 1,
                background: idx % 2 === 0
                  ? "linear-gradient(135deg,#fff0f6,#fff8fb)"
                  : "linear-gradient(135deg,#fff8fb,#fff7ed)",
                border: `1.5px solid ${idx % 2 === 0 ? "#f9a8d433" : "#fb923c33"}`,
                borderRadius: "4px 18px 18px 18px",
                padding: "14px 16px",
                fontSize: "14px",
                color: "#2d1b2e",
                lineHeight: 1.6,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                position: "relative",
              }}>
                {/* Decorative corner accent */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "28px", height: "28px",
                  background: idx % 2 === 0
                    ? "linear-gradient(135deg,#f9a8d455,transparent)"
                    : "linear-gradient(135deg,#fb923c55,transparent)",
                  borderRadius: "0 18px 0 28px",
                }} />
                {step}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── YOUTUBE ── organic blob card */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: "40px" }}
      >
        <div style={{
          position: "relative",
          background: "linear-gradient(135deg,#1a0a0f 0%,#2d0a18 50%,#1a0a0f 100%)",
          borderRadius: "32px 8px 32px 8px",
          padding: "32px 24px",
          overflow: "hidden",
          textAlign: "center",
        }}>
          {/* Glowing blobs inside */}
          <div style={{
            position: "absolute", width: "200px", height: "200px",
            borderRadius: "50%", background: "rgba(255,107,157,0.2)",
            filter: "blur(50px)", top: "-60px", left: "-60px",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", width: "160px", height: "160px",
            borderRadius: "50%", background: "rgba(255,179,71,0.18)",
            filter: "blur(40px)", bottom: "-40px", right: "-40px",
            pointerEvents: "none",
          }} />

          {/* YouTube icon */}
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "linear-gradient(135deg,#ff0000,#cc0000)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(255,0,0,0.45)",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>

          <h2 className="heading-display" style={{ color: "#fff", fontSize: "22px", marginBottom: "8px" }}>
            {tr.recipeYtTitle}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", marginBottom: "24px" }}>
            {tr.recipeYtDesc(recipe.name)}
          </p>

          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.youtubeQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "linear-gradient(135deg,#FF6B9D,#FFB347)",
              color: "#fff", fontWeight: 700, fontSize: "14px",
              padding: "12px 28px",
              borderRadius: "999px",
              boxShadow: "0 6px 20px rgba(255,107,157,0.5)",
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 28px rgba(255,107,157,0.65)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(255,107,157,0.5)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            {tr.recipeYtBtn}
          </a>
        </div>
      </motion.section>
    </motion.div>
  );
}
