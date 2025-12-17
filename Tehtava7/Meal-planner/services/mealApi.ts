import { Meal, Recipe, Ingredient } from '../types';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchMealsByIngredient = async (ingredient: string): Promise<Meal[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals:', error);
    return [];
  }
};

export const getMealDetails = async (mealId: string): Promise<Meal | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${encodeURIComponent(mealId)}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching meal details:', error);
    return null;
  }
};

export const parseIngredients = (meal: Meal): Ingredient[] => {
  const ingredients: Ingredient[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        name: ingredient.trim().toLowerCase(),
        measure: measure?.trim() || '',
      });
    }
  }
  
  return ingredients;
};

export const calculateMatchPercentage = (
  recipeIngredients: Ingredient[],
  userIngredients: string[]
): { percentage: number; missing: string[] } => {
  const normalizedUserIngredients = userIngredients.map(ing => ing.toLowerCase().trim());
  
  let matchCount = 0;
  const missingSet = new Set<string>();
  
  recipeIngredients.forEach(recipeIng => {
    const found = normalizedUserIngredients.some(userIng => 
      recipeIng.name.includes(userIng) || userIng.includes(recipeIng.name)
    );
    
    if (found) {
      matchCount++;
    } else {
      missingSet.add(recipeIng.name);
    }
  });
  
  const percentage = recipeIngredients.length > 0 
    ? Math.round((matchCount / recipeIngredients.length) * 100) 
    : 0;
  
  return { percentage, missing: Array.from(missingSet) };
};

export const searchRecipesByIngredients = async (
  userIngredients: string[]
): Promise<Recipe[]> => {
  const normalized = userIngredients
    .map(i => i.toLowerCase().trim())
    .filter(Boolean);

  if (normalized.length === 0) return [];

  try {
    // 1) Hae ehdokkaat kaikilla aineksilla
    const lists = await Promise.all(normalized.map(searchMealsByIngredient));

    // 2) Laske "hits" (montako aines-hakua osui samaan reseptiin)
    const hits = new Map<string, number>();
    for (const meals of lists) {
      for (const m of meals) {
        hits.set(m.idMeal, (hits.get(m.idMeal) ?? 0) + 1);
      }
    }

    const candidateIds = Array.from(hits.keys());
    if (candidateIds.length === 0) return [];

    // 3) Ota top-N (ensin eniten osumia)
    const TOP_N = 20;
    const topIds = candidateIds
      .sort((a, b) => (hits.get(b) ?? 0) - (hits.get(a) ?? 0))
      .slice(0, TOP_N);

    // 4) Hae yksityiskohdat rinnakkain
    const details = await Promise.all(topIds.map(getMealDetails));

    const detailedRecipes: Recipe[] = [];
    for (const d of details) {
      if (!d) continue;
      const ingredients = parseIngredients(d);
      const { percentage, missing } = calculateMatchPercentage(ingredients, normalized);

      detailedRecipes.push({
        id: d.idMeal,
        name: d.strMeal,
        category: d.strCategory ?? "",
        area: d.strArea ?? "",
        instructions: d.strInstructions,
        thumbnail: d.strMealThumb,
        ingredients,
        matchPercentage: percentage,
        missingIngredients: missing,
        tags: d.strTags ? d.strTags.split(",").map(t => t.trim()).filter(Boolean) : [],
      });
    }

    return detailedRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
};

export const filterRecipesByCategory = (
  recipes: Recipe[],
  category: string
): Recipe[] => {
  if (!category || category === 'all') return recipes;
  return recipes.filter(recipe => 
    (recipe.category ?? "").toLowerCase() === category.toLowerCase()
  );
};

export const filterRecipesByTag = (
  recipes: Recipe[],
  tag: string
): Recipe[] => {
  if (!tag || tag === 'all') return recipes;
  return recipes.filter(recipe => 
    recipe.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};
