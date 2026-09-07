import React, { useState } from 'react';
import { MatchResult, Recipe } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  ArrowRight,
  Lightbulb,
  ChefHat,
  Eye,
  Search,
  Keyboard,
  Delete,
  X,
  Flame
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface RecommendationsViewProps {
  matches: MatchResult[];
  selectedCount: number;
  onSelectRecipe: (recipe: Recipe) => void;
  onGoToPantry: () => void;
}

// Arabic On-Screen Virtual TV Keyboard layout
const KEYBOARD_ROWS = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ذ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'إ', 'أ', 'آ'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
];

// Quick shortcut pills for famous Algerian fast foods and street foods
const QUICK_ALGERIAN_FAST_FOODS = [
  { label: 'فريت أومليت', query: 'فريت أومليت', icon: '🍳' },
  { label: 'محاجب حارة', query: 'محاجب', icon: '🌶️' },
  { label: 'قرنطيطة وهران', query: 'قرنطيطة', icon: '🥖' },
  { label: 'سوفلي جزائري', query: 'سوفلي', icon: '🥐' },
  { label: 'بيتزا كاري', query: 'بيتزا كاري', icon: '🍕' },
  { label: 'برغر لحم كلاسيك', query: 'برغر', icon: '🍔' },
  { label: 'طاكوس جزائري', query: 'طاكوس', icon: '🌯' },
  { label: 'فريت مقرمشة', query: 'فريت', icon: '🍟' },
  { label: 'لودد فريز', query: 'لودد فريز', icon: '🧀' },
  { label: 'كاسكروت كفتة', query: 'كاسكروت', icon: '🥪' },
  { label: 'شاورما دجاج', query: 'شاورما', icon: '🥙' },
];

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  matches,
  selectedCount,
  onSelectRecipe,
  onGoToPantry,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'ready' | 'almost' | 'algerian' | 'fastfood'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);

  const readyMatches = matches.filter((m) => m.isFullyReady);
  const almostMatches = matches.filter((m) => m.isNearlyReady);
  const algerianMatches = matches.filter((m) => m.recipe.isAlgerian);
  const fastFoodMatches = matches.filter(
    (m) =>
      m.recipe.category === 'وجبات سريعة وفاست فود' ||
      m.recipe.tags.includes('فاست فود') ||
      m.recipe.tags.includes('فريت') ||
      m.recipe.tags.includes('فريت أومليت') ||
      m.recipe.tags.includes('محاجب') ||
      m.recipe.tags.includes('قرنطيطة')
  );

  // Filter matches based on active tab and live search query
  const displayedMatches = matches.filter((m) => {
    let passesTab = true;
    if (filterType === 'ready') passesTab = m.isFullyReady;
    else if (filterType === 'almost') passesTab = m.isNearlyReady;
    else if (filterType === 'algerian') passesTab = m.recipe.isAlgerian;
    else if (filterType === 'fastfood') {
      passesTab =
        m.recipe.category === 'وجبات سريعة وفاست فود' ||
        m.recipe.tags.includes('فاست فود') ||
        m.recipe.tags.includes('فريت') ||
        m.recipe.tags.includes('فريت أومليت') ||
        m.recipe.tags.includes('محاجب') ||
        m.recipe.tags.includes('قرنطيطة');
    }

    if (!passesTab) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const inTitle = m.recipe.title.toLowerCase().includes(q);
      const inDesc = m.recipe.description.toLowerCase().includes(q);
      const inTags = m.recipe.tags.some((t) => t.toLowerCase().includes(q));
      const inCategory = m.recipe.category.toLowerCase().includes(q);
      const inIngredients = m.recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
      return inTitle || inDesc || inTags || inCategory || inIngredients;
    }

    return true;
  });

  // Key press handlers
  const handleKeyPress = (char: string) => {
    soundManager.playNav();
    setSearchQuery((prev) => prev + char);
  };

  const handleBackspace = () => {
    soundManager.playBack();
    setSearchQuery((prev) => prev.slice(0, -1));
  };

  const handleClearSearch = () => {
    soundManager.playBack();
    setSearchQuery('');
  };

  const handleSpace = () => {
    soundManager.playNav();
    setSearchQuery((prev) => prev + ' ');
  };

  const handleSelectQuickFood = (query: string) => {
    soundManager.playSelect();
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6" id="tv-recommendations-container">
      {/* Hero Banner with TV Grandeur */}
      <div className="bg-gradient-to-r from-[#161616] via-[#1A1A1A] to-[#161616] rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#E67E22] text-white shadow-md">
                ✨ التوصيات الذكية الحية
              </span>
              <span className="text-xs text-white/40 font-semibold">
                تم فحص {matches.length} وصفة بناءً على {selectedCount} مكون في مطبخك
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              ماذا سأطبخ اليوم؟ 🥘
            </h2>
            <p className="text-white/60 text-sm mt-2 max-w-2xl leading-relaxed">
              قمنا بترتيب أفضل الأطباق حسب نسبة المكونات المتوفرة لديك مع إعطاء الأولوية لأطباق المطبخ الجزائري التراثية واقتراح بدائل ذكية لأي مكون ناقص.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-3 bg-[#0F0F0F] border border-white/10 p-4 rounded-2xl shrink-0">
            <div className="text-center px-3 border-l border-white/10">
              <div className="text-2xl font-black text-emerald-400">{readyMatches.length}</div>
              <div className="text-[11px] font-bold text-white/40">جاهزة 100%</div>
            </div>
            <div className="text-center px-3 border-l border-white/10">
              <div className="text-2xl font-black text-[#E67E22]">{almostMatches.length}</div>
              <div className="text-[11px] font-bold text-white/40">ينقصها قليل</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-white/80">{algerianMatches.length}</div>
              <div className="text-[11px] font-bold text-white/40">أطباق جزائرية</div>
            </div>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-[#E67E22]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Tabs for Smart TV Remote */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none" id="tv-recommendations-filter-bar">
        <button
          id="tv-rec-filter-all"
          onClick={() => {
            soundManager.playNav();
            setFilterType('all');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
            filterType === 'all'
              ? 'bg-[#E67E22] text-white border-[#E67E22] ring-4 ring-[#E67E22]/20 shadow-lg shadow-[#E67E22]/25 scale-[1.02]'
              : 'bg-[#161616] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>كل التوصيات المقترحة</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">
            {matches.length}
          </span>
        </button>

        <button
          id="tv-rec-filter-ready"
          onClick={() => {
            soundManager.playNav();
            setFilterType('ready');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
            filterType === 'ready'
              ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-400/20 shadow-lg shadow-emerald-600/20 scale-[1.02]'
              : 'bg-[#161616] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>جاهزة 100% الآن</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
            {readyMatches.length}
          </span>
        </button>

        <button
          id="tv-rec-filter-almost"
          onClick={() => {
            soundManager.playNav();
            setFilterType('almost');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
            filterType === 'almost'
              ? 'bg-[#E67E22] text-white border-[#E67E22] ring-4 ring-[#E67E22]/20 shadow-lg shadow-[#E67E22]/25 scale-[1.02]'
              : 'bg-[#161616] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-[#E67E22]" />
          <span>ينقصك مكون أو مكونان</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E67E22]/20 text-[#E67E22] border border-[#E67E22]/30 font-mono font-bold">
            {almostMatches.length}
          </span>
        </button>

        <button
          id="tv-rec-filter-algerian"
          onClick={() => {
            soundManager.playNav();
            setFilterType('algerian');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
            filterType === 'algerian'
              ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-400/20 shadow-lg shadow-emerald-600/20 scale-[1.02]'
              : 'bg-[#161616] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span>🇩🇿</span>
          <span>المطبخ الجزائري</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 font-mono font-bold">
            {algerianMatches.length}
          </span>
        </button>

        <button
          id="tv-rec-filter-fastfood"
          onClick={() => {
            soundManager.playNav();
            setFilterType('fastfood');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
            filterType === 'fastfood'
              ? 'bg-amber-600 text-white border-amber-400 ring-4 ring-amber-400/20 shadow-lg shadow-amber-600/25 scale-[1.02]'
              : 'bg-[#161616] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span>🍔</span>
          <span>فاست فود وبرغر وفريت</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
            {fastFoodMatches.length}
          </span>
        </button>
      </div>

      {/* Embedded Smart TV Search & Virtual Keyboard (NO POPUP WINDOW - DIRECTLY IN PAGE) */}
      <div
        id="tv-embedded-search-keyboard-container"
        className="bg-[#141414] border border-white/10 rounded-3xl p-5 lg:p-6 space-y-4 shadow-2xl relative overflow-hidden"
      >
        {/* Search Bar Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#E67E22] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="tv-live-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو المكون: فريت أومليت، محاجب، قرنطيطة، برغر، سوفلي، طاكوس..."
              className="w-full bg-[#1C1C1C] border-2 border-white/10 focus:border-[#E67E22] rounded-2xl pr-12 pl-4 py-3 text-sm md:text-base font-bold text-white placeholder-white/40 focus:outline-none transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all cursor-pointer"
                title="تفريغ البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {searchQuery && (
              <button
                onClick={handleBackspace}
                className="px-3.5 py-3 rounded-2xl bg-[#1F1F1F] hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="مسح آخر حرف"
              >
                <Delete className="w-4 h-4 text-[#E67E22]" />
                <span className="hidden md:inline">مسح حرف</span>
              </button>
            )}

            <button
              id="tv-btn-toggle-keyboard"
              onClick={() => {
                soundManager.playNav();
                setShowKeyboard((prev) => !prev);
              }}
              className={`px-4 py-3 rounded-2xl text-xs font-black border transition-all flex items-center gap-2 cursor-pointer ${
                showKeyboard
                  ? 'bg-[#E67E22]/20 text-[#E67E22] border-[#E67E22]/40 shadow-md shadow-[#E67E22]/10'
                  : 'bg-[#1C1C1C] text-white/70 hover:text-white border-white/10'
              }`}
            >
              <Keyboard className="w-4 h-4 text-[#E67E22]" />
              <span>{showKeyboard ? 'إخفاء لوحة التلفاز' : 'إظهار لوحة المفاتيح'}</span>
            </button>

            <span className="text-xs px-3 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-mono font-bold whitespace-nowrap">
              {displayedMatches.length} طبق
            </span>
          </div>
        </div>

        {/* Famous Algerian Fast Foods & Frite Omelette Quick Shortcuts */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2.5">
            <Flame className="w-4 h-4 text-[#E67E22]" />
            <span className="text-xs font-black text-white/70">
              المأكولات السريعة وفريت أومليت الجزائرية الأكثر طلباً:
            </span>
            <span className="text-[11px] text-white/40 font-semibold hidden md:inline">
              (اضغط على أي وجبة للبحث الفوري عنها)
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_ALGERIAN_FAST_FOODS.map((item) => {
              const isSelected = searchQuery.trim() === item.query;
              return (
                <button
                  key={item.label}
                  id={`tv-quick-food-${item.query}`}
                  onClick={() => handleSelectQuickFood(item.query)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-lg shadow-[#E67E22]/30 scale-105 ring-2 ring-[#E67E22]/30'
                      : 'bg-[#1C1C1C] text-white/70 hover:text-white border-white/10 hover:border-white/25 hover:bg-[#252525]'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded Arabic On-Screen TV Virtual Keyboard */}
        {showKeyboard && (
          <div
            id="tv-virtual-keyboard-section"
            className="pt-3 border-t border-white/10 space-y-2 bg-[#111111]/70 p-3.5 rounded-2xl border border-white/5"
          >
            <div className="flex items-center justify-between text-[11px] text-white/40 pb-1">
              <span>⌨️ لوحة مفاتيح التلفاز الذكي (مدمجة - انقر على الحروف أو استخدم أسهم الريموت):</span>
              <span className="font-mono">ARABIC SMART TV KEYBOARD</span>
            </div>

            {/* Keyboard Alphabet & Digit Rows */}
            {KEYBOARD_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-12 gap-1.5 md:gap-2">
                {row.map((char) => (
                  <button
                    key={char}
                    id={`tv-key-${char}`}
                    onClick={() => handleKeyPress(char)}
                    tabIndex={0}
                    className="h-10 md:h-12 rounded-xl bg-[#1C1C1C] hover:bg-[#E67E22] focus:bg-[#E67E22] text-white hover:text-white focus:text-white border border-white/10 hover:border-[#E67E22] focus:border-[#E67E22] font-black text-sm md:text-base flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md select-none"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}

            {/* Keyboard Bottom Action Keys */}
            <div className="grid grid-cols-12 gap-1.5 md:gap-2 pt-1">
              <button
                id="tv-key-space"
                onClick={handleSpace}
                tabIndex={0}
                className="col-span-6 h-10 md:h-12 rounded-xl bg-[#1F1F1F] hover:bg-[#E67E22] text-white border border-white/10 font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
              >
                <span>مسافة</span>
                <span className="text-xs opacity-60">␣</span>
              </button>

              <button
                id="tv-key-backspace"
                onClick={handleBackspace}
                tabIndex={0}
                className="col-span-3 h-10 md:h-12 rounded-xl bg-[#1F1F1F] hover:bg-rose-600 text-white/90 hover:text-white border border-white/10 font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
              >
                <Delete className="w-4 h-4" />
                <span>مسح حرف</span>
              </button>

              <button
                id="tv-key-clear"
                onClick={handleClearSearch}
                tabIndex={0}
                className="col-span-3 h-10 md:h-12 rounded-xl bg-[#1F1F1F] hover:bg-rose-700 text-white/90 hover:text-white border border-white/10 font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
              >
                <X className="w-4 h-4" />
                <span>مسح الكل</span>
              </button>
            </div>
          </div>
        )}

        {/* Active search banner if filtered */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between bg-[#E67E22]/10 border border-[#E67E22]/30 px-4 py-2.5 rounded-2xl text-xs font-bold text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E67E22]" />
              <span>نتائج البحث المباشر عن: &quot;{searchQuery}&quot;</span>
              <span className="text-[#E67E22]">({displayedMatches.length} طبق)</span>
            </div>
            <button
              onClick={handleClearSearch}
              className="text-[#E67E22] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>إلغاء البحث</span>
              <span>✕</span>
            </button>
          </div>
        )}
      </div>

      {/* Zero match fallback */}
      {displayedMatches.length === 0 && (
        <div className="text-center py-16 bg-[#161616] rounded-3xl border border-white/10 p-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#E67E22]/20 text-[#E67E22] flex items-center justify-center mx-auto text-2xl">
            🍲
          </div>
          <h3 className="text-2xl font-black text-white">لم يتم العثور على أطباق ضمن هذا التصنيف</h3>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            حدد المزيد من المكونات المتوفرة في منزلك لزيادة عدد الوصفات المقترحة.
          </p>
          <button
            onClick={() => {
              soundManager.playSelect();
              onGoToPantry();
            }}
            className="px-6 py-3 rounded-2xl bg-[#E67E22] text-white font-black text-sm hover:bg-[#d35400] cursor-pointer shadow-lg shadow-[#E67E22]/20"
          >
            الذهاب لقائمة المؤونة وتحديد المكونات
          </button>
        </div>
      )}

      {/* TV Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tv-recommendations-grid">
        {displayedMatches.map((match) => {
          const { recipe, matchScore, isFullyReady, availableIngredients, missingIngredients, suggestedAlternatives } = match;

          return (
            <div
              key={recipe.id}
              id={`recipe-card-${recipe.id}`}
              onClick={() => {
                soundManager.playSelect();
                onSelectRecipe(recipe);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  soundManager.playSelect();
                  onSelectRecipe(recipe);
                }
              }}
              className="group bg-[#1A1A1A] rounded-3xl border-2 border-white/5 hover:border-[#E67E22] focus:border-[#E67E22] focus:ring-4 focus:ring-[#E67E22]/20 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-[#E67E22]/10 cursor-pointer focus:outline-none transform hover:-translate-y-1"
            >
              <div>
                {/* Photo & Badge Overlays */}
                <div className="relative h-56 w-full overflow-hidden bg-[#0F0F0F]">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />

                  {/* Match Percentage Badge */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                    {isFullyReady ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        <span>جاهز للطبخ 100%</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-[#0F0F0F]/80 backdrop-blur-md border border-[#E67E22] text-[#E67E22] font-black text-xs shadow-lg flex items-center gap-1.5">
                        <span>متوفر بنسبة {matchScore}%</span>
                      </span>
                    )}

                    {recipe.isAlgerian && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                        <span>🇩🇿</span>
                        <span>{recipe.algerianRegion || 'طبق جزائري'}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Image info */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white/80 font-semibold">
                    <span className="bg-[#0F0F0F]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                      {recipe.category}
                    </span>
                    <div className="flex items-center gap-3 bg-[#0F0F0F]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                        <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} دقيقة</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#E67E22]" />
                        <span>{recipe.servings} أفراد</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-[#E67E22] transition-colors line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Ingredient Status Bar */}
                  <div className="space-y-2.5 bg-[#0F0F0F]/80 p-3.5 rounded-2xl border border-white/5">
                    {/* Available */}
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold text-xs shrink-0 mt-0.5">✅ المتوفر:</span>
                      <div className="flex flex-wrap gap-1">
                        {availableIngredients.slice(0, 4).map((name) => (
                          <span
                            key={name}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium"
                          >
                            {name}
                          </span>
                        ))}
                        {availableIngredients.length > 4 && (
                          <span className="text-[10px] text-white/40 self-center">
                            +{availableIngredients.length - 4} أخرى
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Missing */}
                    {missingIngredients.length > 0 && (
                      <div className="flex items-start gap-2 pt-1.5 border-t border-white/5">
                        <span className="text-rose-400 font-bold text-xs shrink-0 mt-0.5">❌ الناقص:</span>
                        <div className="flex flex-wrap gap-1">
                          {missingIngredients.map((name) => (
                            <span
                              key={name}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Alternative Note */}
                    {suggestedAlternatives.length > 0 && (
                      <div className="bg-[#E67E22]/10 border border-[#E67E22]/25 p-2.5 rounded-xl flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
                        <div className="text-[11px] text-[#E67E22] leading-snug">
                          <span className="font-bold">بديل مقترح لـ ({suggestedAlternatives[0].missing}):</span>{' '}
                          {suggestedAlternatives[0].alternative}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    soundManager.playSelect();
                    onSelectRecipe(recipe);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#161616] group-hover:bg-[#E67E22] group-hover:text-white text-white/80 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>عرض المقادير وطريقة التحضير</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
