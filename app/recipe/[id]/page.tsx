"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { useAppStore } from "@/lib/store";
import Button from "@/components/ui/Button";
import { Heart, Clock, ChefHat, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

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

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const toggleFav = useAppStore((s) => s.toggleFavorite);
  const favs = useAppStore((s) => s.favorites);
  const recipe = SAMPLE_RECIPES.find((r) => r.id === id);
  const isFav = recipe ? favs.includes(recipe.id) : false;

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-medium mb-4">Recipe not found.</p>
        <Button onClick={() => router.back()}>← Go Back</Button>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6 pb-10"
    >
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primaryMid transition-colors"
      >
        <ArrowLeft size={16} /> Back to results
      </button>

      {/* Hero image */}
      <div className="relative rounded-hero overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1
            className="heading-display text-3xl text-white drop-shadow-lg"
          >
            {recipe.name}
          </h1>
          <p className="text-sm text-white/80 mt-1 font-light">{recipe.description}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
          {recipe.difficulty}
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-600">
          <Clock size={14} /> {recipe.time} min
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-600">
          <ChefHat size={14} /> {recipe.calories} cal
        </span>
        <span className="text-sm px-2 py-0.5 rounded-full bg-green-50 text-green-600">
          {recipe.isVeg ? "🌱 Vegetarian" : "🍗 Non-Veg"}
        </span>
        <button
          onClick={() => toggleFav(recipe.id)}
          className="ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <Heart size={16} className={isFav ? "fill-red-500 text-red-500" : ""} />
          {isFav ? "Saved" : "Save"}
        </button>
      </div>

      {/* Ingredients */}
      <div className="bg-white dark:bg-gray-800 rounded-card p-5 shadow">
        <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing) => (
            <li key={ing.id} className="flex justify-between text-sm border-b border-gray-100 dark:border-gray-700 pb-1">
              <span className="capitalize">{ing.id.replace(/-/g, " ")}</span>
              <span className="text-gray-500">{ing.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-card p-5 shadow">
        <h2 className="text-lg font-semibold mb-3">How to Make</h2>
        <ol className="space-y-3">
          {recipe.steps.map((step, idx) => (
            <li key={idx} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-primaryStart to-primaryEnd text-white text-xs flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <span className="text-gray-700 dark:text-gray-300">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* YouTube */}
      <div className="bg-white dark:bg-gray-800 rounded-card p-5 shadow flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold self-start">Watch on YouTube</h2>
        <div className="flex flex-col items-center gap-3 py-4 w-full">
          <span className="text-5xl">▶️</span>
          <p className="text-sm text-gray-500 text-center">
            Watch a step-by-step video tutorial for <strong>{recipe.name}</strong> on YouTube.
          </p>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.youtubeQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Watch on YouTube
          </a>
        </div>
      </div>
    </motion.section>
  );
}
