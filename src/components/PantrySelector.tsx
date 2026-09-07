import React, { useState } from 'react';
import { Ingredient, IngredientCategory } from '../types';
import { INGREDIENT_CATEGORIES, INITIAL_INGREDIENTS, ALGERIAN_PANTRY_PRESET } from '../data/ingredientsData';
import { Check, Plus, Trash2, CheckSquare, Square, Sparkles, Filter } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface PantrySelectorProps {
  selectedIds: string[];
  customIngredients: string[];
  onToggleIngredient: (id: string) => void;
  onAddCustomIngredient: (name: string) => void;
  onRemoveCustomIngredient: (name: string) => void;
  onSetAlgerianPreset: () => void;
  onClearAll: () => void;
  onSelectAllVisible: (ids: string[]) => void;
  onGoToRecommendations: () => void;
}

export const PantrySelector: React.FC<PantrySelectorProps> = ({
  selectedIds,
  customIngredients,
  onToggleIngredient,
  onAddCustomIngredient,
  onRemoveCustomIngredient,
  onSetAlgerianPreset,
  onClearAll,
  onSelectAllVisible,
  onGoToRecommendations,
}) => {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory | 'all'>('all');
  const [customInput, setCustomInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngredients = INITIAL_INGREDIENTS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || item.name.includes(searchQuery.trim());
    return matchesCategory && matchesSearch;
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      soundManager.playSelect();
      onAddCustomIngredient(customInput.trim());
      setCustomInput('');
    }
  };

  const isPresetActive = ALGERIAN_PANTRY_PRESET.every((id) => selectedIds.includes(id));

  return (
    <div className="space-y-6" id="tv-pantry-container">
      {/* Top Banner & Quick TV Action Bar */}
      <div className="bg-[#161616] rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20">
                1. تحديد المؤونة المنزلية
              </span>
              <span className="text-xs text-white/40">تحكم بالريموت والأسهم</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white">
              ما هي المكونات المتوفرة في ثلاجتك ومطبخك اليوم؟
            </h2>
            <p className="text-white/60 text-sm mt-1 max-w-2xl leading-relaxed">
              اختر المكونات التي لديك في المنزل بالضغط عليها أو بالريموت، وسنقترح عليك فوراً أشهى الوصفات والأطباق الجزائرية والعربية التي يمكنك طهيها الآن!
            </p>
          </div>

          {/* Quick Preset Buttons for TV */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              id="tv-btn-preset-algerian"
              onClick={() => {
                soundManager.playSelect();
                onSetAlgerianPreset();
              }}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border shadow-lg transition-all cursor-pointer ${
                isPresetActive
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/30 ring-2 ring-emerald-400'
                  : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-700/50'
              }`}
            >
              <span>🇩🇿</span>
              <span>المؤونة الجزائرية الأساسية</span>
              <Check className={`w-4 h-4 ${isPresetActive ? 'opacity-100' : 'opacity-60'}`} />
            </button>

            <button
              id="tv-btn-clear-all"
              onClick={() => {
                soundManager.playBack();
                onClearAll();
              }}
              className="px-4 py-3 rounded-2xl font-bold text-sm bg-[#1A1A1A] hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-700/50 text-white/70 border border-white/10 transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>إلغاء التحديد</span>
            </button>

            <button
              id="tv-btn-go-recommendations"
              onClick={() => {
                soundManager.playSelect();
                onGoToRecommendations();
              }}
              className="px-6 py-3 rounded-2xl font-black text-sm bg-[#E67E22] hover:bg-[#d35400] text-white border border-[#E67E22] shadow-xl shadow-[#E67E22]/20 flex items-center gap-2 transition cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>ماذا أطبخ اليوم؟ ({selectedIds.length + customIngredients.length})</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E67E22]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="tv-ingredient-categories-bar">
        <button
          id="tv-category-filter-all"
          onClick={() => {
            soundManager.playNav();
            setActiveCategory('all');
          }}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#E67E22] text-white border-[#E67E22] ring-4 ring-[#E67E22]/20 font-black shadow-lg shadow-[#E67E22]/20'
              : 'bg-[#161616] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>كل المكونات</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">
            {INITIAL_INGREDIENTS.length}
          </span>
        </button>

        {INGREDIENT_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const countInCat = INITIAL_INGREDIENTS.filter((i) => i.category === cat.id).length;
          const selectedInCat = INITIAL_INGREDIENTS.filter(
            (i) => i.category === cat.id && selectedIds.includes(i.id)
          ).length;

          return (
            <button
              key={cat.id}
              id={`tv-category-filter-${cat.id}`}
              onClick={() => {
                soundManager.playNav();
                setActiveCategory(cat.id);
              }}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#E67E22] text-white border-[#E67E22] ring-4 ring-[#E67E22]/20 font-black shadow-lg shadow-[#E67E22]/20'
                  : 'bg-[#161616] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                  selectedInCat > 0
                    ? isSelected
                      ? 'bg-[#0F0F0F] text-emerald-400'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isSelected
                    ? 'bg-black/20 text-white'
                    : 'bg-[#1A1A1A] text-white/40'
                }`}
              >
                {selectedInCat > 0 ? `${selectedInCat}/${countInCat}` : countInCat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick Select All in Category & Search & Custom Ingredient Adder */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#161616] p-4 rounded-2xl border border-white/10">
        {/* Fast Search input for TV */}
        <div className="md:col-span-4">
          <input
            id="tv-ingredients-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مكون معين (مثال: بصل، لحم، فريك)..."
            className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] transition"
          />
        </div>

        {/* Custom Ingredient Adder */}
        <form onSubmit={handleCustomSubmit} className="md:col-span-5 flex gap-2">
          <input
            id="tv-custom-ingredient-input"
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="إضافة مكون مخصص غير موجود بالقائمة..."
            className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] transition"
          />
          <button
            id="tv-add-custom-btn"
            type="submit"
            className="px-5 py-3 rounded-xl bg-[#E67E22] hover:bg-[#d35400] text-white font-bold text-sm flex items-center gap-1.5 shrink-0 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة</span>
          </button>
        </form>

        {/* Select Visible Toggle */}
        <div className="md:col-span-3 flex items-center justify-end">
          <button
            id="tv-select-visible-btn"
            onClick={() => {
              soundManager.playSelect();
              onSelectAllVisible(filteredIngredients.map((i) => i.id));
            }}
            className="w-full md:w-auto px-4 py-3 rounded-xl bg-[#1A1A1A] hover:bg-white/10 text-white/80 text-xs font-bold flex items-center justify-center gap-2 border border-white/10 cursor-pointer transition"
          >
            <CheckSquare className="w-4 h-4 text-[#E67E22]" />
            <span>تحديد كل المعروض ({filteredIngredients.length})</span>
          </button>
        </div>
      </div>

      {/* Custom Ingredients Chips Section (if any added) */}
      {customIngredients.length > 0 && (
        <div className="bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-2xl p-4">
          <div className="text-xs font-bold text-[#E67E22] mb-2 flex items-center gap-2">
            <span>✨ مكوناتك المخصصة المضافة:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {customIngredients.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0F0F0F] text-white/90 border border-white/10 text-sm font-semibold"
              >
                <span>{name}</span>
                <button
                  onClick={() => {
                    soundManager.playBack();
                    onRemoveCustomIngredient(name);
                  }}
                  className="hover:text-rose-400 cursor-pointer transition"
                  title="حذف هذا المكون"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Big TV Ingredient Cards Grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5"
        id="tv-ingredients-grid"
      >
        {filteredIngredients.map((ingredient) => {
          const isSelected = selectedIds.includes(ingredient.id);

          return (
            <button
              key={ingredient.id}
              id={`ingredient-card-${ingredient.id}`}
              onClick={() => {
                soundManager.playSelect();
                onToggleIngredient(ingredient.id);
              }}
              tabIndex={0}
              className={`p-4 rounded-2xl border-2 text-right transition-all duration-200 flex flex-col justify-between h-32 relative cursor-pointer group focus:outline-none ${
                isSelected
                  ? 'bg-gradient-to-b from-[#E67E22]/20 to-[#1A1A1A] border-[#E67E22] ring-4 ring-[#E67E22]/20 shadow-xl shadow-[#E67E22]/10 scale-[1.02]'
                  : 'bg-[#1A1A1A] border-white/5 hover:border-[#E67E22]/60 hover:bg-white/5 focus:border-[#E67E22] focus:ring-4 focus:ring-[#E67E22]/20'
              }`}
            >
              {/* Header with Icon and Checkbox */}
              <div className="flex items-center justify-between w-full">
                <span className="text-3xl filter drop-shadow">{ingredient.icon}</span>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#E67E22] text-white font-black shadow-md'
                      : 'bg-[#0F0F0F] border border-white/10 text-transparent group-hover:border-white/20'
                  }`}
                >
                  <Check className={`w-4 h-4 ${isSelected ? 'opacity-100 stroke-[3]' : 'opacity-0'}`} />
                </div>
              </div>

              {/* Title and Category Name */}
              <div>
                <div
                  className={`font-black text-base line-clamp-1 ${
                    isSelected ? 'text-[#E67E22]' : 'text-white group-hover:text-white'
                  }`}
                >
                  {ingredient.name}
                </div>
                <div className="text-[11px] text-white/40 font-semibold mt-0.5">
                  {ingredient.categoryName}
                </div>
              </div>

              {/* Active Badge Dot */}
              {isSelected && (
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#E67E22] animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {filteredIngredients.length === 0 && (
        <div className="text-center py-12 bg-[#161616] rounded-3xl border border-white/10">
          <p className="text-lg text-white font-bold">لم يتم العثور على مكون بهذا الاسم</p>
          <p className="text-sm text-white/40 mt-1">يمكنك إضافته كمكون مخصص في الحقل بالأعلى!</p>
        </div>
      )}
    </div>
  );
};
