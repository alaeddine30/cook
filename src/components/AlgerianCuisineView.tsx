import React, { useState } from 'react';
import { Recipe, AlgerianRegion, MatchResult } from '../types';
import { ChefHat, MapPin, Clock, Sparkles, CheckCircle2, ChevronLeft, Eye } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface AlgerianCuisineViewProps {
  recipes: Recipe[];
  matches: MatchResult[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export const AlgerianCuisineView: React.FC<AlgerianCuisineViewProps> = ({
  recipes,
  matches,
  onSelectRecipe,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<AlgerianRegion | 'all'>('all');

  const algerianRecipes = recipes.filter((r) => r.isAlgerian);

  const filteredRecipes = algerianRecipes.filter((r) => {
    if (selectedRegion === 'all') return true;
    return r.algerianRegion === selectedRegion;
  });

  const regions: { id: AlgerianRegion | 'all'; label: string; icon: string; desc: string }[] = [
    { id: 'all', label: 'كل ربوع الجزائر', icon: '🇩🇿', desc: 'تراث الطهي الوطني العريق' },
    { id: 'الوسط الجزائري', label: 'الوسط الجزائري', icon: '🏛️', desc: 'الجزائر العاصمة، القصبة، البليدة، تيبازة، تيزي وزو' },
    { id: 'الشرق الجزائري', label: 'الشرق الجزائري', icon: '🏰', desc: 'قسنطينة، سطيف، بسكرة، عنابة، الأوراس، باتنة' },
    { id: 'الغرب الجزائري', label: 'الغرب الجزائري', icon: '🌅', desc: 'وهران، تلمسان، مستغانم، معسكر، سيدي بلعباس' },
    { id: 'الجنوب الجزائري', label: 'الجنوب الجزائري', icon: '🏜️', desc: 'بسكرة، وادي سوف، غرداية، ورقلة، تمنراست' },
  ];

  // Helper to get match info for each recipe
  const getMatch = (recipeId: string): MatchResult | undefined => {
    return matches.find((m) => m.recipe.id === recipeId);
  };

  return (
    <div className="space-y-6" id="tv-algerian-cuisine-container">
      {/* Algerian Heritage Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#161616] via-[#1A1A1A] to-[#161616] border border-white/10 p-6 lg:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#E67E22] text-white shadow-md flex items-center gap-1.5">
                <span>🇩🇿</span>
                <span>المطبخ الجزائري الأصيل</span>
              </span>
              <span className="text-xs text-[#E67E22] font-bold">تراث لا مادي مصنف عالمياً</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              أصالة الأطباق التقليدية الجزائرية حسب المناطق
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              من الكسكس والرشتة العاصمية إلى شخشوخة بسكرة وتريدة قسنطينة ودوبارة الصحراء وحريرة تلمسان، استكشف ألذ الوصفات التراثية بمقاديرها المضبوطة وطرق تحضيرها خطوة بخطوة.
            </p>
          </div>

          <div className="bg-[#0F0F0F] border border-white/10 p-4 rounded-2xl flex items-center gap-4 shrink-0">
            <div className="text-center px-2">
              <div className="text-3xl font-black text-[#E67E22]">{algerianRecipes.length}</div>
              <div className="text-[11px] font-bold text-white/40">وصفة تقليدية</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center px-2">
              <div className="text-3xl font-black text-white/80">4</div>
              <div className="text-[11px] font-bold text-white/40">أقاليم جغرافية</div>
            </div>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E67E22]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Regional Selector Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none" id="tv-algerian-region-tabs">
        {regions.map((reg) => {
          const isSelected = selectedRegion === reg.id;
          const count =
            reg.id === 'all'
              ? algerianRecipes.length
              : algerianRecipes.filter((r) => r.algerianRegion === reg.id).length;

          return (
            <button
              key={reg.id}
              id={`tv-region-btn-${reg.id}`}
              onClick={() => {
                soundManager.playNav();
                setSelectedRegion(reg.id);
              }}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#E67E22] text-white border-[#E67E22] ring-4 ring-[#E67E22]/20 font-black shadow-lg shadow-[#E67E22]/25 scale-[1.02]'
                  : 'bg-[#161616] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{reg.icon}</span>
              <span>{reg.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-[#0F0F0F] text-[#E67E22]' : 'bg-white/10 text-white/60'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Authentic Algerian Recipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tv-algerian-recipes-grid">
        {filteredRecipes.map((recipe) => {
          const match = getMatch(recipe.id);
          const isReady = match?.isFullyReady;
          const matchPercent = match?.matchScore || 0;

          return (
            <div
              key={recipe.id}
              id={`algerian-recipe-card-${recipe.id}`}
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

                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                    <span className="px-3 py-1 rounded-xl bg-[#0F0F0F]/90 border border-white/10 text-white/90 text-xs font-black shadow-md flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E67E22]" />
                      <span>{recipe.algerianRegion || 'الجزائر'}</span>
                    </span>

                    {match && isReady ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black shadow flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>متوفر لديك 100%</span>
                      </span>
                    ) : match && matchPercent > 0 ? (
                      <span className="px-2.5 py-1 rounded-xl bg-[#0F0F0F]/80 border border-[#E67E22] text-[#E67E22] text-xs font-black shadow">
                        متوفر {matchPercent}%
                      </span>
                    ) : null}
                  </div>

                  {/* Time and category */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white/80 font-semibold">
                    <span className="bg-[#0F0F0F]/80 px-2.5 py-1 rounded-lg border border-white/10">
                      {recipe.category}
                    </span>
                    <span className="bg-[#0F0F0F]/80 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                      <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} دقيقة</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
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
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#0F0F0F] text-white/60 border border-white/10 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    soundManager.playSelect();
                    onSelectRecipe(recipe);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#161616] group-hover:bg-[#E67E22] group-hover:text-white text-white/80 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>طريقة التحضير والمقادير</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
