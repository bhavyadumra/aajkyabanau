export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'bn';
export type VegFilter = 'veg' | 'both' | 'non-veg';

export interface Ingredient {
  id: string;
  name: string;
  nameHindi: string;
  category: IngredientCategory;
  emoji: string;
  common?: boolean;
}

export type IngredientCategory =
  | 'Vegetables'
  | 'Pulses & Dal'
  | 'Flour & Grains'
  | 'Dairy'
  | 'Oils & Ghee'
  | 'Masalas & Spices'
  | 'Herbs'
  | 'Sauces & Condiments'
  | 'Nuts & Dry Fruits'
  | 'Fruits'
  | 'Non-Veg'
  | 'Frozen'
  | 'Bakery & Snacks'
  | 'Sweet Items';

export interface RecipeIngredient {
  id: string;
  quantity: string;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  nameHindi: string;
  cuisine: string[];
  ingredients: RecipeIngredient[];
  time: number;
  difficulty: Difficulty;
  image: string;
  description: string;
  steps: string[];
  youtubeQuery: string;
  tags: string[];
  isVeg: boolean;
  calories?: number;
  matchScore?: number;
}

export interface Cuisine {
  id: string;
  name: string;
  nameHindi: string;
  image: string;
  description: string;
  emoji: string;
}

export interface AppState {
  selectedCuisines: string[];
  selectedIngredients: string[];
  favorites: string[];
  recentlyViewed: string[];
  recentlyUsedIngredients: string[];
  language: Language;
  darkMode: boolean;
  vegFilter: VegFilter;
  toggleCuisine: (id: string) => void;
  toggleIngredient: (id: string) => void;
  setIngredients: (ids: string[]) => void;
  toggleFavorite: (id: string) => void;
  addRecentlyViewed: (id: string) => void;
  addRecentlyUsedIngredients: (ids: string[]) => void;
  setLanguage: (lang: Language) => void;
  setVegFilter: (filter: VegFilter) => void;
  toggleDarkMode: () => void;
  clearSelections: () => void;
}
