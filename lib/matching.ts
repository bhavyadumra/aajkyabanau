import { Recipe } from '@/types';

/**
 * Calculate match score for a recipe based on selected ingredient IDs.
 * Only counts required (non-optional) ingredients.
 * Returns a percentage (0-100).
 */
export function calculateMatchScore(recipe: Recipe, selectedIngredientIds: string[]): number {
  const requiredIds = recipe.ingredients
    .filter((i) => !i.optional)
    .map((i) => i.id);
  if (requiredIds.length === 0) return 100;
  const matched = requiredIds.filter((id) => selectedIngredientIds.includes(id)).length;
  return Math.round((matched / requiredIds.length) * 100);
}

/**
 * Get the list of required ingredient IDs that the user is missing for a recipe.
 */
export function getMissingIngredients(recipe: Recipe, selectedIngredientIds: string[]): string[] {
  return recipe.ingredients
    .filter((i) => !i.optional && !selectedIngredientIds.includes(i.id))
    .map((i) => i.id);
}

export interface FilteredResults {
  /** Recipes where ALL required ingredients are selected */
  ready: Recipe[];
  /** Recipes missing only 1 or 2 required ingredients */
  almostThere: (Recipe & { missingIngredients: string[] })[];
}

/**
 * Split recipes into "ready to cook" and "almost there" groups.
 *
 * - ready: every required ingredient is in selectedIngredientIds
 * - almostThere: missing exactly 1 or 2 required ingredients
 *
 * Also filters by selected cuisines if any are chosen.
 */
export function filterRecipes(
  allRecipes: Recipe[],
  selectedCuisines: string[],
  selectedIngredientIds: string[],
): FilteredResults {
  const ready: Recipe[] = [];
  const almostThere: (Recipe & { missingIngredients: string[] })[] = [];

  for (const recipe of allRecipes) {
    // Cuisine filter
    if (
      selectedCuisines.length > 0 &&
      !recipe.cuisine.some((c) => selectedCuisines.includes(c))
    ) {
      continue;
    }

    const missing = getMissingIngredients(recipe, selectedIngredientIds);

    if (missing.length === 0) {
      // All required ingredients available
      ready.push({ ...recipe, matchScore: 100 });
    } else if (missing.length <= 3) {
      // Missing 1–3 required ingredients — show as "almost there"
      almostThere.push({
        ...recipe,
        matchScore: calculateMatchScore(recipe, selectedIngredientIds),
        missingIngredients: missing,
      });
    }
    // Missing 4+ ingredients — don't show
  }

  // Sort ready by time (quickest first)
  ready.sort((a, b) => a.time - b.time);
  // Sort almost-there by number of missing ingredients, then by time
  almostThere.sort((a, b) => a.missingIngredients.length - b.missingIngredients.length || a.time - b.time);

  return { ready, almostThere };
}
