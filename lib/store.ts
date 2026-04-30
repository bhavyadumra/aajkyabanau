import { create } from 'zustand';
import { AppState, Language } from '@/types';

export const useAppStore = create<AppState>((set) => ({
  selectedCuisines: [],
  selectedIngredients: [],
  favorites: [],
  recentlyViewed: [],
  recentlyUsedIngredients: [],
  language: 'en' as Language,
  darkMode: false,

  toggleCuisine: (id) =>
    set((state) => {
      const exists = state.selectedCuisines.includes(id);
      return {
        selectedCuisines: exists
          ? state.selectedCuisines.filter((c) => c !== id)
          : [...state.selectedCuisines, id],
      };
    }),

  toggleIngredient: (id) =>
    set((state) => {
      const exists = state.selectedIngredients.includes(id);
      return {
        selectedIngredients: exists
          ? state.selectedIngredients.filter((i) => i !== id)
          : [...state.selectedIngredients, id],
        // keep recently used list (max 20)
        recentlyUsedIngredients: (
          exists
            ? state.recentlyUsedIngredients.filter((i) => i !== id)
            : [id, ...state.recentlyUsedIngredients]
        ).slice(0, 20),
      };
    }),

  toggleFavorite: (id) =>
    set((state) => {
      const exists = state.favorites.includes(id);
      return {
        favorites: exists
          ? state.favorites.filter((f) => f !== id)
          : [...state.favorites, id],
      };
    }),

  addRecentlyViewed: (id) =>
    set((state) => ({
      recentlyViewed: [id, ...state.recentlyViewed].slice(0, 30),
    })),

  addRecentlyUsedIngredients: (ids) =>
    set((state) => ({
      recentlyUsedIngredients: [...ids, ...state.recentlyUsedIngredients].slice(0, 20),
    })),

  setLanguage: (lang) => set({ language: lang }),

  toggleDarkMode: () =>
    set((state) => ({ darkMode: !state.darkMode })),

  clearSelections: () =>
    set({ selectedCuisines: [], selectedIngredients: [] }),
}));
