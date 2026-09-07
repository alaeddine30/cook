export type IngredientCategory =
  | 'vegetables'
  | 'meat'
  | 'chicken'
  | 'fish'
  | 'grains'
  | 'dairy'
  | 'spices'
  | 'other';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  categoryName: string;
  icon: string;
  isStaple?: boolean; // Common pantry item
}

export type AlgerianRegion = 'الوسط الجزائري' | 'الشرق الجزائري' | 'الغرب الجزائري' | 'الجنوب الجزائري';

export type RecipeCategory =
  | 'أطباق رئيسية'
  | 'الدجاج'
  | 'اللحوم'
  | 'الأسماك'
  | 'السلطات'
  | 'المعجنات والمكرونة'
  | 'الحلويات'
  | 'وجبات سريعة وفاست فود';

export interface RecipeIngredient {
  name: string;
  quantity: string;
  ingredientId?: string; // Links to standard ingredient id
  optional?: boolean;
  alternative?: string; // E.g., "يمكن تعويض السمن بالزبدة أو الزيت"
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  isAlgerian: boolean;
  algerianRegion?: AlgerianRegion;
  image: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'سهل' | 'متوسط' | 'يحتاج مهارة';
  ingredients: RecipeIngredient[];
  steps: string[];
  tips?: string[];
  tags: string[];
}

export interface MatchResult {
  recipe: Recipe;
  matchScore: number; // 0 to 100
  availableCount: number;
  totalRequired: number;
  availableIngredients: string[];
  missingIngredients: string[];
  suggestedAlternatives: {
    missing: string;
    alternative: string;
  }[];
  isFullyReady: boolean;
  isNearlyReady: boolean; // missing 1 or 2
}

export type ActiveTVTab = 'what_to_cook' | 'weekly_plan' | 'algerian_cuisine' | 'my_pantry' | 'categories_search';

export type DayOfWeek = 'السبت' | 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';

export interface DayMealPlan {
  day: DayOfWeek;
  dayNumber: number;
  lunchRecipeId: string;
  dinnerRecipeId: string;
  note?: string;
}

export type WeeklyTheme = 'balanced' | 'fast_food' | 'algerian_heritage' | 'quick_budget';
