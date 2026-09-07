import { Recipe, MatchResult } from '../types';
import { INITIAL_INGREDIENTS } from '../data/ingredientsData';

// Helper to normalize arabic text for fuzzy matching
export function normalizeArabic(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, ''); // strip harakat
}

// Fallback dictionary of common culinary substitutions in Arabic
const INGREDIENT_SUBSTITUTIONS_MAP: Record<string, string> = {
  smen: 'يمكن استبدال السمن بالزبدة الطبيعية أو زيت الزيتون',
  freekeh: 'يمكن تعويض الفريك بلسان العصفور أو الشوفان أو الأرز',
  lamb: 'يمكن تعويض لحم الخروف بقطع الدجاج أو اللحم البقري',
  beef: 'يمكن تعويض اللحم بقطع الدجاج أو كرات الكفتة',
  chicken_meat: 'يمكن تعويض الدجاج بقطع اللحم أو الحمص كمصدر بروتين نباتي',
  orange_blossom_water: 'يمكن استبدال ماء الزهر بماء الورد أو رشة فانيليا أو بشر ليمون',
  couscous: 'يمكن تعويض الكسكس بالبرغل الخشن أو الكينوا',
  rechta: 'يمكن تعويض الرشتة بشعرية التاجلياتيل أو النودلز الرفيعة',
  trida: 'يمكن استخدام معكرونة لسان العصفور أو التليتلي كبديل للتريدة',
  chakhchoukha_dough: 'يمكن استخدام خبز الرقاق أو الفطير الرقيق المفتت',
  dioul: 'يمكن استخدام رقائق الجلاش أو عجينة السمبوسة المربعة',
  harissa: 'يمكن استخدام مسحوق الشطة الحارة مع قليل من زيت الزيتون والثوم',
  tomato_paste: 'يمكن استخدام طماطم طازجة مسبكة ومصفاة من الماء',
  turnip: 'يمكن الاكتفاء بالكوسة والجزر في المرق',
  green_peas: 'يمكن استخدام الفاصوليا الخضراء أو الزبيب المنقوع',
  dates_paste: 'يمكن استبدال الغرس بمعجون اللوز أو المربى السميكة',
  olives: 'يمكن استخدام الفطر المقطع أو مكعبات الخضار',
  burger_buns: 'يمكن استخدام خبز الباغيت المقرمش أو الخبز العربي أو التورتيلا كبديل لخبز البرغر',
  cheddar_slices: 'يمكن استخدام الجبن الطري المثلثات أو الموتزاريلا أو الغرويير',
  mayonnaise: 'يمكن استخدام صلصة الزبادي مع الليمون وزيت الزيتون كبديل خفيف للمايونيز',
  ketchup: 'يمكن استخدام صلصة الطماطم الخفيفة مع رشة سكر وخل',
  tortilla: 'يمكن استخدام الخبز العربي الرقيق أو خبز الصاج أو المسمن',
  pickles: 'يمكن استخدام شرائح الخيار الطازج مع رشة ملح وخل',
  chickpea_flour: 'يمكن طحن الحمص اليابس المنقوع والمجفف ناعماً كبديل لفرينة الحمص',
  baguette: 'يمكن استخدام الخبز الدائري التقليدي أو خبز الصامولي أو التورتيلا'
};

export function calculateRecipeMatches(
  recipes: Recipe[],
  selectedIngredientIds: string[],
  customIngredients: string[] = []
): MatchResult[] {
  const selectedSet = new Set(selectedIngredientIds);
  const normalizedCustom = customIngredients.map(normalizeArabic);

  // Also get names of selected standard ingredients
  const selectedNames = new Set(
    INITIAL_INGREDIENTS
      .filter((i) => selectedSet.has(i.id))
      .map((i) => normalizeArabic(i.name))
  );

  return recipes.map((recipe) => {
    const totalRequired = recipe.ingredients.filter((i) => !i.optional).length;
    const availableIngredients: string[] = [];
    const missingIngredients: string[] = [];
    const suggestedAlternatives: { missing: string; alternative: string }[] = [];

    recipe.ingredients.forEach((ing) => {
      // Check if ingredientId is selected
      const isIdSelected = ing.ingredientId && selectedSet.has(ing.ingredientId);
      
      // Check if name matches any custom or selected item
      const normName = normalizeArabic(ing.name);
      const isNameMatched =
        selectedNames.has(normName) ||
        normalizedCustom.some((c) => normName.includes(c) || c.includes(normName));

      const isAvailable = isIdSelected || isNameMatched;

      if (isAvailable) {
        availableIngredients.push(ing.name);
      } else {
        missingIngredients.push(ing.name);
        // Find substitution
        const altText =
          ing.alternative ||
          (ing.ingredientId && INGREDIENT_SUBSTITUTIONS_MAP[ing.ingredientId]) ||
          'يمكن تحضير الوصفة بدون هذا المكون أو الاستغناء عنه';
        
        suggestedAlternatives.push({
          missing: ing.name,
          alternative: altText,
        });
      }
    });

    const availableCount = availableIngredients.length;
    const matchScore = totalRequired > 0 ? Math.round((availableCount / recipe.ingredients.length) * 100) : 0;
    const isFullyReady = missingIngredients.length === 0;
    const isNearlyReady = missingIngredients.length > 0 && missingIngredients.length <= 2;

    return {
      recipe,
      matchScore,
      availableCount,
      totalRequired: recipe.ingredients.length,
      availableIngredients,
      missingIngredients,
      suggestedAlternatives,
      isFullyReady,
      isNearlyReady,
    };
  }).sort((a, b) => {
    // 1. Sort by Fully Ready first
    if (a.isFullyReady && !b.isFullyReady) return -1;
    if (!a.isFullyReady && b.isFullyReady) return 1;

    // 2. Sort by match score descending
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }

    // 3. Prioritize Algerian dishes if both have good/equal match
    if (a.recipe.isAlgerian && !b.recipe.isAlgerian) return -1;
    if (!a.recipe.isAlgerian && b.recipe.isAlgerian) return 1;

    // 4. Lowest missing count
    return a.missingIngredients.length - b.missingIngredients.length;
  });
}
