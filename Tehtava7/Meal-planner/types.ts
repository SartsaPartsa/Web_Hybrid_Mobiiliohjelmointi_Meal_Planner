export interface Meal {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;

  strCategory?: string | null;
  strArea?: string | null;
  strTags?: string | null;
  strYoutube?: string | null;

  // TheMealDB: strIngredient1..20, strMeasure1..20 jne.
  [key: string]: any;
}

export interface Ingredient {
  name: string;
  measure: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  ingredients: Ingredient[];
  matchPercentage: number;
  missingIngredients: string[];
  tags: string[];
}

export interface UserIngredient {
  id: string;
  name: string;
}
