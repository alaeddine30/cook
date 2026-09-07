import React, { useState } from 'react';
import { Recipe, RecipeCategory } from '../types';
import { Search, Clock, Users, Flame, ChefHat, Eye, X } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface CategoryBrowseViewProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const CATEGORIES_LIST: { id: RecipeCategory | 'all'; name: string; icon: string }[] = [
  { id: 'all', name: 'الكل', icon: '✨' },
  { id: 'وجبات سريعة وفاست فود', name: 'برغر وفريت وفاست فود', icon: '🍔' },
  { id: 'أطباق رئيسية', name: 'أطباق رئيسية', icon: '🍲' },
  { id: 'الدجاج', name: 'الدجاج', icon: '🍗' },
  { id: 'اللحوم', name: 'اللحوم', icon: '🥩' },
  { id: 'الأسماك', name: 'الأسماك', icon: '🐟' },
  { id: 'السلطات', name: 'السلطات', icon: '🥗' },
  { id: 'المعجنات والمكرونة', name: 'المعجنات والمكرونة', icon: '🍝' },
  { id: 'الحلويات', name: 'الحلويات', icon: '🍰' },
];

export const CategoryBrowseView: React.FC<CategoryBrowseViewProps> = ({
  recipes,
  onSelectRecipe,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const quickSearchTags = ['برغر', 'فريت', 'طاكوس', 'شاورما', 'كسكس', 'رشتة', 'بوراك', 'شطيطحة', 'طاجين', 'شوربة', 'لحم'];

  const filteredRecipes = recipes.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesCat;

    const matchesTitle = r.title.toLowerCase().includes(q);
    const matchesDesc = r.description.toLowerCase().includes(q);
    const matchesTags = r.tags.some((t) => t.toLowerCase().includes(q));
    const matchesIngredients = r.ingredients.some((i) => i.name.toLowerCase().includes(q));

    return matchesCat && (matchesTitle || matchesDesc || matchesTags || matchesIngredients);
  });

  return (
    <div className="space-y-6" id="tv-categories-browse-container">
      {/* Search Header Banner */}
      <div className="bg-[#161616] rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-2xl lg:text-3xl font-black text-white">
            تصفح الوصفات والبحث في الأطباق 🔍
          </h2>
          <p className="text-white/60 text-sm">
            ابحث بالاسم، المكونات، أو اختر أحد التصنيفات الغذائية المعتمدة للشاشات الذكية.
          </p>

          {/* Large TV Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#E67E22]" />
            </div>
            <input
              id="tv-main-recipe-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم وصفة (مثال: شطيطحة دجاج، بوراك، قلب اللوز، كفتة)..."
              className="w-full bg-[#0F0F0F] border-2 border-white/10 hover:border-[#E67E22]/60 focus:border-[#E67E22] rounded-2xl pr-12 pl-12 py-4 text-base text-white placeholder-white/30 focus:outline-none focus:ring-4 focus:ring-[#E67E22]/20 transition-all font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/40 hover:text-white cursor-pointer"
                title="مسح البحث"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick TV search suggestions tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-white/40 font-bold">كلمات شائعة:</span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  soundManager.playNav();
                  setSearchQuery(tag);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  searchQuery === tag
                    ? 'bg-[#E67E22] text-white border-[#E67E22]'
                    : 'bg-[#1A1A1A] text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none" id="tv-categories-list-bar">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === 'all'
              ? recipes.length
              : recipes.filter((r) => r.category === cat.id).length;

          return (
            <button
              key={cat.id}
              id={`tv-cat-btn-${cat.id}`}
              onClick={() => {
                soundManager.playNav();
                setSelectedCategory(cat.id);
              }}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#E67E22] text-white border-[#E67E22] ring-4 ring-[#E67E22]/20 font-black shadow-lg shadow-[#E67E22]/25 scale-[1.02]'
                  : 'bg-[#161616] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-[#0F0F0F] text-[#E67E22]' : 'bg-[#1A1A1A] text-white/40'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-white/40 px-2 font-semibold">
        <span>عرض {filteredRecipes.length} وصفة</span>
        {searchQuery && (
          <span>
            نتائج البحث عن: <strong className="text-[#E67E22]">"{searchQuery}"</strong>
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tv-browse-recipes-grid">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            id={`browse-recipe-card-${recipe.id}`}
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
            className="group bg-[#1A1A1A] rounded-3xl border-2 border-white/5 hover:border-[#E67E22] focus:border-[#E67E22] focus:ring-4 focus:ring-[#E67E22]/20 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl cursor-pointer focus:outline-none transform hover:-translate-y-1"
          >
            <div>
              <div className="relative h-56 w-full overflow-hidden bg-[#0F0F0F]">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {recipe.isAlgerian && (
                    <span className="px-2.5 py-1 rounded-xl bg-[#0F0F0F]/90 border border-white/10 text-[#E67E22] text-xs font-black shadow flex items-center gap-1">
                      <span>🇩🇿</span>
                      <span>{recipe.algerianRegion || 'طبق جزائري'}</span>
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-xl bg-[#0F0F0F]/90 border border-white/10 text-white/80 text-xs font-bold">
                    {recipe.difficulty}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white/80 font-semibold">
                  <span className="bg-[#0F0F0F]/80 px-2.5 py-1 rounded-lg border border-white/10">
                    {recipe.category}
                  </span>
                  <div className="flex items-center gap-3 bg-[#0F0F0F]/80 px-2.5 py-1 rounded-lg border border-white/10">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                      <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} د</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#E67E22]" />
                      <span>{recipe.servings} حصص</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-xl font-black text-white group-hover:text-[#E67E22] transition-colors line-clamp-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#0F0F0F] text-white/60 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  onSelectRecipe(recipe);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#161616] group-hover:bg-[#E67E22] group-hover:text-white text-white/80 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer shadow-md"
              >
                <Eye className="w-4 h-4" />
                <span>عرض تفاصيل الوصفة</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-16 bg-[#161616] rounded-3xl border border-white/10 p-6">
          <p className="text-lg text-white font-bold">لم نجد أطباقاً تطابق بحثك</p>
          <p className="text-sm text-white/40 mt-1">جرّب البحث باسم مكون كـ "لحم" أو "دجاج" أو اختر تصنيفاً آخر.</p>
        </div>
      )}
    </div>
  );
};
