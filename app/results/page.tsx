"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { filterRecipes } from "@/lib/matching";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Heart, Clock, ChefHat, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

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
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
    description: "Classic kidney bean curry served over steamed rice — ultimate comfort food.",
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
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
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

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

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
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedCuisines, selectedIngredients]);

  const shuffle = () => {
    setReady((prev) => [...prev].sort(() => Math.random() - 0.5));
    setShuffleSeed((s) => s + 1);
  };

  // Prettify ingredient id → name (e.g. "green-chilli" → "Green Chilli")
  const prettyName = (id: string) =>
    id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const RecipeCard = ({ r, idx }: { r: any; idx: number }) => (
    <motion.div
      key={r.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      <Link href={`/recipe/${r.id}`}>
        <div className="flex gap-4 bg-white dark:bg-gray-800 rounded-card p-4 shadow hover:shadow-lg transition-all group">
          <img
            src={r.image}
            alt={r.name}
            className="w-28 h-28 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <h3 className="font-semibold text-base truncate">{r.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{r.description}</p>
            </div>

            {/* Missing ingredients badge */}
            {r.missingIngredients?.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Need:</span>
                {r.missingIngredients.map((mid: string) => (
                  <span
                    key={mid}
                    className="text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 px-2 py-0.5 rounded-full"
                  >
                    {prettyName(mid)}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-2 items-center">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[r.difficulty]}`}>
                {r.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} /> {r.time} min
              </span>
              <button
                onClick={(e) => { e.preventDefault(); toggleFavorite(r.id); }}
                className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart size={16} className={favorites.includes(r.id) ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <section className="space-y-8 pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h2
            className="heading-display text-4xl md:text-5xl"
            style={{
              background: "linear-gradient(135deg,#e91e8c,#ff6b9d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your Recipes
          </h2>
          <p className="heading-display-italic text-base mt-1" style={{ color: "#b07a9e" }}>
            Cooked up just for your pantry
          </p>
        </div>
        <button
          onClick={shuffle}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-all"
        >
          <Shuffle size={16} /> Surprise me
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-card" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Ready to Cook ── */}
          {ready.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <h3 className="text-xl font-semibold">Ready to Cook</h3>
                <span className="text-sm text-gray-400">({ready.length})</span>
              </div>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ready.map((r, idx) => <RecipeCard key={r.id} r={r} idx={idx} />)}
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-card">
              <p className="text-gray-500">No recipes match your exact ingredients.</p>
              <p className="text-gray-400 text-sm mt-1">Check the "Almost There" section below!</p>
            </div>
          )}

          {/* ── Almost There ── */}
          {almostThere.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛒</span>
                <h3 className="text-xl font-semibold">Almost There</h3>
                <span className="text-sm text-gray-400">
                  — grab 1-2 more ingredients
                </span>
              </div>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {almostThere.map((r, idx) => <RecipeCard key={r.id} r={r} idx={idx} />)}
              </motion.div>
            </div>
          )}

          {/* Empty state when both sections are empty */}
          {ready.length === 0 && almostThere.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No recipes found.</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting more ingredients or different cuisines.</p>
              <Link href="/ingredients">
                <Button className="mt-6">← Change Ingredients</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
