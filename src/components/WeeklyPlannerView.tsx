import React, { useState, useMemo } from 'react';
import { Recipe, DayOfWeek, DayMealPlan, WeeklyTheme } from '../types';
import { calculateRecipeMatches } from '../utils/matchingAlgorithm';
import { soundManager } from '../utils/soundEffects';
import {
  Calendar,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  Utensils,
  Copy,
  Check,
  Flame,
  Search,
  X,
  Plus
} from 'lucide-react';

interface WeeklyPlannerViewProps {
  recipes: Recipe[];
  selectedIngredientIds: string[];
  customIngredients: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onGoToPantry: () => void;
}

const DAYS_ORDER: DayOfWeek[] = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
];

// Presets by theme
const THEME_PLANS: Record<WeeklyTheme, { name: string; icon: string; description: string; plan: { day: DayOfWeek; lunch: string; dinner: string }[] }> = {
  balanced: {
    name: 'جدول متوازن ومتنوع',
    icon: '🥗',
    description: 'تشكيلة متوازنة تجمع بين الأطباق الرئيسية المغذية وعشاء فاست فود وساندويتشات لذيذة.',
    plan: [
      { day: 'السبت', lunch: 'couscous-algerian', dinner: 'beef-burger-classic' },
      { day: 'الأحد', lunch: 'chakhchoukha-biskra', dinner: 'loaded-cheesy-fries' },
      { day: 'الإثنين', lunch: 'loubia-fasolia', dinner: 'cassecroute-frite-omelette' },
      { day: 'الثلاثاء', lunch: 'tajine-zitoun', dinner: 'crispy-french-fries' },
      { day: 'الأربعاء', lunch: 'rechta-algiers', dinner: 'crispy-chicken-burger' },
      { day: 'الخميس', lunch: 'dolma-algerienne', dinner: 'algerian-french-tacos' },
      { day: 'الجمعة', lunch: 'couscous-algerian', dinner: 'shawarma-wrap' },
    ],
  },
  fast_food: {
    name: 'جدول الفاست فود والوجبات السريعة',
    icon: '🍔',
    description: 'أسبوع محبي البرغر، البطاطا المقلية المقرمشة، الطاكوس الجزائري والشاورما واللودد فريز.',
    plan: [
      { day: 'السبت', lunch: 'beef-burger-classic', dinner: 'crispy-french-fries' },
      { day: 'الأحد', lunch: 'crispy-chicken-burger', dinner: 'loaded-cheesy-fries' },
      { day: 'الإثنين', lunch: 'algerian-french-tacos', dinner: 'cassecroute-frite-omelette' },
      { day: 'الثلاثاء', lunch: 'shawarma-wrap', dinner: 'crispy-french-fries' },
      { day: 'الأربعاء', lunch: 'beef-burger-classic', dinner: 'loaded-cheesy-fries' },
      { day: 'الخميس', lunch: 'algerian-french-tacos', dinner: 'crispy-chicken-burger' },
      { day: 'الجمعة', lunch: 'cassecroute-frite-omelette', dinner: 'shawarma-wrap' },
    ],
  },
  algerian_heritage: {
    name: 'جدول التراث الجزائري الأصيل',
    icon: '🇩🇿',
    description: 'أطباق تقليدية عريقة من مختلف ولايات الجزائر؛ كسكس، رشتة، شخشوخة، طواجن وشوربة فريك.',
    plan: [
      { day: 'السبت', lunch: 'chakhchoukha-biskra', dinner: 'bourek-annaba' },
      { day: 'الأحد', lunch: 'rechta-algiers', dinner: 'cassecroute-frite-omelette' },
      { day: 'الإثنين', lunch: 'tajine-zitoun', dinner: 'chakchouka' },
      { day: 'الثلاثاء', lunch: 'chtitha-djedj', dinner: 'tajine-jben' },
      { day: 'الأربعاء', lunch: 'tajine-lahlou', dinner: 'beef-burger-classic' },
      { day: 'الخميس', lunch: 'chorba-frik', dinner: 'bourek-annaba' },
      { day: 'الجمعة', lunch: 'couscous-algerian', dinner: 'algerian-french-tacos' },
    ],
  },
  quick_budget: {
    name: 'جدول اقتصادي وسريع (تحت 30 دقيقة)',
    icon: '⚡',
    description: 'وجبات سريعة التحضير بمكونات منزلية بسيطة لا تستغرق وقتاً طويلاً ومناسبة لأيام العمل.',
    plan: [
      { day: 'السبت', lunch: 'chakchouka', dinner: 'crispy-french-fries' },
      { day: 'الأحد', lunch: 'cassecroute-frite-omelette', dinner: 'beef-burger-classic' },
      { day: 'الإثنين', lunch: 'pasta-red-sauce', dinner: 'shawarma-wrap' },
      { day: 'الثلاثاء', lunch: 'bourek-annaba', dinner: 'loaded-cheesy-fries' },
      { day: 'الأربعاء', lunch: 'loubia-fasolia', dinner: 'algerian-french-tacos' },
      { day: 'الخميس', lunch: 'cassecroute-frite-omelette', dinner: 'crispy-chicken-burger' },
      { day: 'الجمعة', lunch: 'couscous-algerian', dinner: 'crispy-french-fries' },
    ],
  },
};

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  recipes,
  selectedIngredientIds,
  customIngredients,
  onSelectRecipe,
  onGoToPantry,
}) => {
  const [activeTheme, setActiveTheme] = useState<WeeklyTheme>('balanced');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [copiedList, setCopiedList] = useState<boolean>(false);
  const [purchasedIngredients, setPurchasedIngredients] = useState<Record<string, boolean>>({});

  // Recipe swap modal state
  const [swappingTarget, setSwappingTarget] = useState<{ dayIndex: number; mealType: 'lunch' | 'dinner' } | null>(null);
  const [swapSearchQuery, setSwapSearchQuery] = useState<string>('');

  // Weekly plan state: initialized from the active theme preset
  const [customPlan, setCustomPlan] = useState<DayMealPlan[]>(() => {
    return THEME_PLANS.balanced.plan.map((item, idx) => ({
      day: item.day,
      dayNumber: idx + 1,
      lunchRecipeId: item.lunch,
      dinnerRecipeId: item.dinner,
    }));
  });

  // Calculate recipe matching map for fast lookup
  const matchesMap = useMemo(() => {
    const matches = calculateRecipeMatches(recipes, selectedIngredientIds, customIngredients);
    const map = new Map<string, typeof matches[0]>();
    matches.forEach((m) => map.set(m.recipe.id, m));
    return map;
  }, [recipes, selectedIngredientIds, customIngredients]);

  // Handle switching preset themes
  const handleThemeChange = (theme: WeeklyTheme) => {
    soundManager.playNav();
    setActiveTheme(theme);
    const preset = THEME_PLANS[theme].plan;
    setCustomPlan(
      preset.map((item, idx) => ({
        day: item.day,
        dayNumber: idx + 1,
        lunchRecipeId: item.lunch,
        dinnerRecipeId: item.dinner,
      }))
    );
  };

  // Smart AI Pantry Auto-Generator: generates 7-day schedule prioritizing 100% available or highest score
  const handleGenerateSmartPantryPlan = () => {
    soundManager.playAction();
    const sorted = [...recipes].sort((a, b) => {
      const matchA = matchesMap.get(a.id)?.matchScore || 0;
      const matchB = matchesMap.get(b.id)?.matchScore || 0;
      return matchB - matchA;
    });

    if (sorted.length < 2) return;

    // Distribute sorted recipes across lunch and dinner
    const newPlan: DayMealPlan[] = DAYS_ORDER.map((day, idx) => {
      const lunchIndex = (idx * 2) % sorted.length;
      const dinnerIndex = (idx * 2 + 1) % sorted.length;
      return {
        day,
        dayNumber: idx + 1,
        lunchRecipeId: sorted[lunchIndex].id,
        dinnerRecipeId: sorted[dinnerIndex].id,
      };
    });

    setCustomPlan(newPlan);
  };

  // Swap meal modal
  const handleOpenSwapModal = (dayIndex: number, mealType: 'lunch' | 'dinner') => {
    soundManager.playNav();
    setSwappingTarget({ dayIndex, mealType });
    setSwapSearchQuery('');
  };

  const handleConfirmSwap = (recipeId: string) => {
    if (!swappingTarget) return;
    soundManager.playAction();
    const { dayIndex, mealType } = swappingTarget;
    setCustomPlan((prev) => {
      const next = [...prev];
      next[dayIndex] = {
        ...next[dayIndex],
        [mealType === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId']: recipeId,
      };
      return next;
    });
    setSwappingTarget(null);
  };

  // Aggregate weekly grocery items
  const weeklyGrocerySummary = useMemo(() => {
    const selectedIdsSet = new Set(selectedIngredientIds);
    const inPantry: { name: string; quantity: string; recipeTitle: string }[] = [];
    const missing: { name: string; quantity: string; recipeTitle: string }[] = [];

    customPlan.forEach((dayPlan) => {
      const lunchRecipe = recipes.find((r) => r.id === dayPlan.lunchRecipeId);
      const dinnerRecipe = recipes.find((r) => r.id === dayPlan.dinnerRecipeId);

      [lunchRecipe, dinnerRecipe].forEach((rec) => {
        if (!rec) return;
        rec.ingredients.forEach((ing) => {
          const isPresent = ing.ingredientId ? selectedIdsSet.has(ing.ingredientId) : false;
          const item = { name: ing.name, quantity: ing.quantity, recipeTitle: rec.title };
          if (isPresent) {
            inPantry.push(item);
          } else {
            missing.push(item);
          }
        });
      });
    });

    // Deduplicate by name
    const uniqueInPantryMap = new Map<string, typeof inPantry[0]>();
    inPantry.forEach((item) => uniqueInPantryMap.set(item.name, item));

    const uniqueMissingMap = new Map<string, typeof missing[0]>();
    missing.forEach((item) => uniqueMissingMap.set(item.name, item));

    return {
      availableList: Array.from(uniqueInPantryMap.values()),
      neededList: Array.from(uniqueMissingMap.values()),
    };
  }, [customPlan, recipes, selectedIngredientIds]);

  const handleCopyShoppingList = () => {
    soundManager.playAction();
    const text = `🛒 قائمة مشتريات الأسبوع الذكية - طباخ التلفاز\n` +
      `الأطباق المخططة للأسبوع: ${customPlan.length} أيام\n\n` +
      `المكونات الناقصة للشراء (${weeklyGrocerySummary.neededList.length} مكوّن):\n` +
      weeklyGrocerySummary.neededList.map((item, i) => `${i + 1}. ${item.name} (${item.quantity}) - لوصفة: ${item.recipeTitle}`).join('\n') +
      `\n\nالمكونات المتوفرة لديك بالفعل (${weeklyGrocerySummary.availableList.length} مكوّن):\n` +
      weeklyGrocerySummary.availableList.map((item, i) => `✓ ${item.name}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 3000);
  };

  const activeDayPlan = customPlan[selectedDayIndex] || customPlan[0];
  const activeLunchRecipe = recipes.find((r) => r.id === activeDayPlan?.lunchRecipeId) || recipes[0];
  const activeDinnerRecipe = recipes.find((r) => r.id === activeDayPlan?.dinnerRecipeId) || recipes[1];

  const lunchMatch = matchesMap.get(activeLunchRecipe.id);
  const dinnerMatch = matchesMap.get(activeDinnerRecipe.id);

  return (
    <div className="space-y-8" id="tv-weekly-planner-container">
      {/* Top Banner with TV Grandeur */}
      <div className="bg-gradient-to-r from-[#161616] via-[#1A1A1A] to-[#161616] rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#E67E22] text-white shadow-md flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>خطة الأسبوع الذكية</span>
              </span>
              <span className="text-xs text-white/50 font-semibold">
                ماذا أطبخ طوال الأسبوع؟ (غداء وعشاء محسوب من مؤونتك)
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              جدول وجبات الأسبوع 📅
            </h2>
            <p className="text-white/60 text-sm mt-2 max-w-2xl leading-relaxed">
              خطة طعام أسبوعية ذكية تناسب عائلتك وتوفر وقت التفكير اليومي. يمكنك اختيار خطة جاهزة أو توليد جدول تلقائي من مؤونتك الحالية وتبديل أي وجبة بضغطة زر.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
            <button
              id="tv-btn-auto-plan"
              onClick={handleGenerateSmartPantryPlan}
              className="flex-1 lg:flex-none px-5 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 border border-emerald-400/30 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>⚡ توليد ذكي من مؤونتي</span>
            </button>
            <button
              id="tv-btn-goto-pantry"
              onClick={onGoToPantry}
              className="px-4 py-3 rounded-2xl font-bold text-sm bg-[#1A1A1A] hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              🧺 فحص المؤونة
            </button>
          </div>
        </div>

        {/* Theme Selector Pills */}
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-white/40 whitespace-nowrap ml-2">نمط الأسبوع:</span>
          {(Object.keys(THEME_PLANS) as WeeklyTheme[]).map((themeKey) => {
            const item = THEME_PLANS[themeKey];
            const isSelected = activeTheme === themeKey;
            return (
              <button
                key={themeKey}
                id={`tv-theme-${themeKey}`}
                onClick={() => handleThemeChange(themeKey)}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-lg shadow-[#E67E22]/25 ring-2 ring-[#E67E22]/30 scale-[1.02]'
                    : 'bg-[#141414] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7-Days Horizontal Day Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>أيام الأسبوع</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">
              7 أيام
            </span>
          </h3>
          <span className="text-xs text-white/40">اضغط على اليوم لعرض تفاصيل وجباته</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {DAYS_ORDER.map((dayName, idx) => {
            const isSelected = selectedDayIndex === idx;
            const dayPlan = customPlan[idx];
            const lunch = recipes.find((r) => r.id === dayPlan?.lunchRecipeId);
            const dinner = recipes.find((r) => r.id === dayPlan?.dinnerRecipeId);

            const lunchM = lunch ? matchesMap.get(lunch.id) : null;
            const dinnerM = dinner ? matchesMap.get(dinner.id) : null;
            const bothReady = lunchM?.isFullyReady && dinnerM?.isFullyReady;

            return (
              <button
                key={dayName}
                id={`tv-day-strip-${idx}`}
                onClick={() => {
                  soundManager.playNav();
                  setSelectedDayIndex(idx);
                }}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1E1E1E] border-[#E67E22] ring-4 ring-[#E67E22]/20 shadow-xl shadow-[#E67E22]/15 scale-[1.03]'
                    : 'bg-[#141414] border-white/10 hover:bg-[#181818] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-black ${isSelected ? 'text-[#E67E22]' : 'text-white'}`}>
                    {dayName}
                  </span>
                  {bothReady && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" title="كل الوجبات متوفرة 100%" />
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="truncate text-white/80 font-medium flex items-center gap-1">
                    <span className="text-[10px] text-amber-400">☀️</span>
                    <span className="truncate">{lunch?.title || 'وجبة الغداء'}</span>
                  </div>
                  <div className="truncate text-white/50 text-[11px] flex items-center gap-1">
                    <span className="text-[10px] text-sky-400">🌙</span>
                    <span className="truncate">{dinner?.title || 'وجبة العشاء'}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="h-1 bg-[#E67E22] w-full rounded-full mt-2.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Day Spotlight (Lunch & Dinner Cards) */}
      <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E67E22]/10 border border-[#E67E22]/30 flex items-center justify-center text-xl font-black text-[#E67E22]">
              {selectedDayIndex + 1}
            </div>
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <span>وجبات يوم {DAYS_ORDER[selectedDayIndex]}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#E67E22]/20 text-[#E67E22] border border-[#E67E22]/30 font-bold">
                  {THEME_PLANS[activeTheme].name}
                </span>
              </h3>
              <p className="text-white/50 text-xs mt-0.5">
                اضغط على أي وجبة لفتح طريقة التحضير ومؤقت الطهي، أو اضغط زر التبديل لتغييرها
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playNav();
                setSelectedDayIndex((prev) => (prev > 0 ? prev - 1 : 6));
              }}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
            >
              اليوم السابق ◀
            </button>
            <button
              onClick={() => {
                soundManager.playNav();
                setSelectedDayIndex((prev) => (prev < 6 ? prev + 1 : 0));
              }}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
            >
              ▶ اليوم التالي
            </button>
          </div>
        </div>

        {/* 2 Meal Cards: Lunch & Dinner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lunch Card */}
          <div className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden hover:border-[#E67E22]/50 transition-all group flex flex-col justify-between">
            <div>
              {/* Card Header Tag */}
              <div className="px-5 py-3 bg-[#1F1F1F] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">☀️</span>
                  <span className="text-sm font-black text-amber-400">وجبة الغداء الرئيسية</span>
                </div>
                <button
                  id={`tv-btn-swap-lunch-${selectedDayIndex}`}
                  onClick={() => handleOpenSwapModal(selectedDayIndex, 'lunch')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#E67E22]" />
                  <span>تبديل الوجبة</span>
                </button>
              </div>

              {/* Meal Banner Image */}
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => {
                  soundManager.playAction();
                  onSelectRecipe(activeLunchRecipe);
                }}
              >
                <img
                  src={activeLunchRecipe.image}
                  alt={activeLunchRecipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />

                {/* Match Badge */}
                <div className="absolute top-3 right-3">
                  {lunchMatch?.isFullyReady ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-lg flex items-center gap-1 border border-emerald-400/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>جاهزة 100% الآن</span>
                    </span>
                  ) : lunchMatch?.isNearlyReady ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E67E22] text-white shadow-lg flex items-center gap-1 border border-[#E67E22]/40">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>ينقصك {lunchMatch.missingIngredients.length} مكوّن</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
                      جاهزية {lunchMatch?.matchScore || 50}%
                    </span>
                  )}
                </div>

                {activeLunchRecipe.category === 'وجبات سريعة وفاست فود' && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-black shadow-md">
                      🍔 فاست فود
                    </span>
                  </div>
                )}
              </div>

              {/* Recipe Meta */}
              <div className="p-5 space-y-3">
                <h4
                  onClick={() => {
                    soundManager.playAction();
                    onSelectRecipe(activeLunchRecipe);
                  }}
                  className="text-lg font-black text-white group-hover:text-[#E67E22] transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {activeLunchRecipe.title}
                </h4>
                <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
                  {activeLunchRecipe.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/50 pt-2 border-t border-white/5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                    <span>{activeLunchRecipe.prepTimeMinutes + activeLunchRecipe.cookTimeMinutes} دقيقة</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-white/40" />
                    <span>{activeLunchRecipe.servings} أفراد</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-white/60 font-semibold">
                    {activeLunchRecipe.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-5 pt-0">
              <button
                id={`tv-btn-view-lunch-${selectedDayIndex}`}
                onClick={() => {
                  soundManager.playAction();
                  onSelectRecipe(activeLunchRecipe);
                }}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-[#E67E22] text-white font-bold text-xs border border-white/10 hover:border-[#E67E22] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>عرض الوصفة وطريقة الطهي</span>
                <span>◀</span>
              </button>
            </div>
          </div>

          {/* Dinner Card */}
          <div className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden hover:border-[#E67E22]/50 transition-all group flex flex-col justify-between">
            <div>
              {/* Card Header Tag */}
              <div className="px-5 py-3 bg-[#1F1F1F] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌙</span>
                  <span className="text-sm font-black text-sky-400">وجبة العشاء والمساء</span>
                </div>
                <button
                  id={`tv-btn-swap-dinner-${selectedDayIndex}`}
                  onClick={() => handleOpenSwapModal(selectedDayIndex, 'dinner')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#E67E22]" />
                  <span>تبديل الوجبة</span>
                </button>
              </div>

              {/* Meal Banner Image */}
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => {
                  soundManager.playAction();
                  onSelectRecipe(activeDinnerRecipe);
                }}
              >
                <img
                  src={activeDinnerRecipe.image}
                  alt={activeDinnerRecipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />

                {/* Match Badge */}
                <div className="absolute top-3 right-3">
                  {dinnerMatch?.isFullyReady ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-lg flex items-center gap-1 border border-emerald-400/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>جاهزة 100% الآن</span>
                    </span>
                  ) : dinnerMatch?.isNearlyReady ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E67E22] text-white shadow-lg flex items-center gap-1 border border-[#E67E22]/40">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>ينقصك {dinnerMatch.missingIngredients.length} مكوّن</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
                      جاهزية {dinnerMatch?.matchScore || 50}%
                    </span>
                  )}
                </div>

                {activeDinnerRecipe.category === 'وجبات سريعة وفاست فود' && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-black shadow-md">
                      🍔 فاست فود
                    </span>
                  </div>
                )}
              </div>

              {/* Recipe Meta */}
              <div className="p-5 space-y-3">
                <h4
                  onClick={() => {
                    soundManager.playAction();
                    onSelectRecipe(activeDinnerRecipe);
                  }}
                  className="text-lg font-black text-white group-hover:text-[#E67E22] transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {activeDinnerRecipe.title}
                </h4>
                <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
                  {activeDinnerRecipe.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/50 pt-2 border-t border-white/5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                    <span>{activeDinnerRecipe.prepTimeMinutes + activeDinnerRecipe.cookTimeMinutes} دقيقة</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-white/40" />
                    <span>{activeDinnerRecipe.servings} أفراد</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-white/60 font-semibold">
                    {activeDinnerRecipe.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-5 pt-0">
              <button
                id={`tv-btn-view-dinner-${selectedDayIndex}`}
                onClick={() => {
                  soundManager.playAction();
                  onSelectRecipe(activeDinnerRecipe);
                }}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-[#E67E22] text-white font-bold text-xs border border-white/10 hover:border-[#E67E22] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>عرض الوصفة وطريقة الطهي</span>
                <span>◀</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Smart Grocery & Shopping List */}
      <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 lg:p-8 space-y-6" id="tv-weekly-grocery-section">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-xl bg-[#E67E22]/20 text-[#E67E22] flex items-center justify-center font-bold">
                🛒
              </span>
              <h3 className="text-2xl font-black text-white">
                قائمة مشتريات الأسبوع الذكية
              </h3>
            </div>
            <p className="text-white/50 text-xs">
              تم حصر جميع مكونات الوجبات الـ 14 للأسبوع ومقارنتها بمؤونتك؛ إليك ما تملكه وما تحتاج لشرائه
            </p>
          </div>

          <button
            id="tv-btn-copy-shopping"
            onClick={handleCopyShoppingList}
            className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            {copiedList ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">تم نسخ القائمة بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#E67E22]" />
                <span>نسخ قائمة التسوق</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Items needed to buy */}
          <div className="bg-[#181818] border border-amber-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#E67E22]" />
                <span className="font-black text-white text-sm">مكونات تحتاج لشرائها لهذا الأسبوع</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E67E22]/20 text-[#E67E22] font-mono font-bold">
                {weeklyGrocerySummary.neededList.length} مكوّن
              </span>
            </div>

            {weeklyGrocerySummary.neededList.length === 0 ? (
              <div className="text-center py-8 text-emerald-400 text-sm font-bold flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8" />
                <span>كل مكونات خطة هذا الأسبوع متوفرة لديك في المطبخ بنسبة 100%!</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {weeklyGrocerySummary.neededList.map((item, idx) => {
                  const isChecked = !!purchasedIngredients[item.name];
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        soundManager.playNav();
                        setPurchasedIngredients((prev) => ({
                          ...prev,
                          [item.name]: !prev[item.name],
                        }));
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-950/30 border-emerald-500/30 line-through text-white/40'
                          : 'bg-[#141414] border-white/5 hover:border-white/20 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-white/30 bg-transparent'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{item.name}</p>
                          <p className="text-[10px] text-white/40">لوصفة: {item.recipeTitle}</p>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400/80 font-mono font-bold">
                        {item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Items already available in pantry */}
          <div className="bg-[#181818] border border-emerald-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-white text-sm">متوفرة في مطبخك ومؤونتك بالفعل</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                {weeklyGrocerySummary.availableList.length} مكوّن
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {weeklyGrocerySummary.availableList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#141414] border border-white/5 flex items-center justify-between gap-3 text-white/80"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-400 text-sm">✓</span>
                    <span className="text-xs font-semibold">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-white/40">متوفر بمطبخك</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Swap Modal */}
      {swappingTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-white/15 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black text-white">
                  تبديل وجبة {swappingTarget.mealType === 'lunch' ? 'الغداء' : 'العشاء'} ليوم {DAYS_ORDER[swappingTarget.dayIndex]}
                </h4>
                <p className="text-xs text-white/50 mt-1">
                  اختر أي طبق من القائمة لتعيينه في هذا اليوم
                </p>
              </div>
              <button
                onClick={() => setSwappingTarget(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search */}
            <div className="p-4 border-b border-white/10 bg-[#121212]">
              <div className="relative">
                <Search className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={swapSearchQuery}
                  onChange={(e) => setSwapSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم: برغر، فريت، كسكس، طاكوس..."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E67E22]"
                />
              </div>
            </div>

            {/* Modal Recipe List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {recipes
                .filter((r) => {
                  if (!swapSearchQuery) return true;
                  const q = swapSearchQuery.trim().toLowerCase();
                  return (
                    r.title.toLowerCase().includes(q) ||
                    r.description.toLowerCase().includes(q) ||
                    r.category.toLowerCase().includes(q) ||
                    r.tags.some((t) => t.toLowerCase().includes(q))
                  );
                })
                .map((r) => {
                  const m = matchesMap.get(r.id);
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleConfirmSwap(r.id)}
                      className="p-3 rounded-2xl bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 hover:border-[#E67E22] flex items-center justify-between gap-4 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={r.image}
                          alt={r.title}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div>
                          <h5 className="text-sm font-bold text-white group-hover:text-[#E67E22] transition-colors">
                            {r.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-white/50">
                            <span>{r.category}</span>
                            <span>•</span>
                            <span>{r.prepTimeMinutes + r.cookTimeMinutes} دقيقة</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {m?.isFullyReady ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                            جاهزة 100%
                          </span>
                        ) : (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/60">
                            مطابقة {m?.matchScore || 0}%
                          </span>
                        )}
                        <span className="text-xs px-3 py-1.5 rounded-xl bg-[#E67E22] text-white font-bold group-hover:scale-105 transition-transform">
                          اختيار
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
