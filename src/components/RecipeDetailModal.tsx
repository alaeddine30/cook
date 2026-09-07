import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import {
  X,
  Clock,
  Users,
  Flame,
  Check,
  ChefHat,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Timer,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  selectedIngredientIds: string[];
  customIngredients: string[];
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  selectedIngredientIds,
  customIngredients,
}) => {
  const [cookingMode, setCookingMode] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundManager.playSelect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Reset state on recipe change
  useEffect(() => {
    setCookingMode(false);
    setCurrentStepIndex(0);
    setIsTimerRunning(false);
    setTimerSeconds((recipe?.cookTimeMinutes || 20) * 60);
  }, [recipe]);

  if (!recipe) return null;

  const selectedSet = new Set(selectedIngredientIds);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      soundManager.playSelect();
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      soundManager.playNav();
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      id="tv-recipe-detail-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
    >
      <div className="bg-[#161616] border-2 border-white/10 w-full max-w-5xl rounded-3xl shadow-2xl shadow-black overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-[#0F0F0F] px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20 flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{recipe.title}</h3>
                {recipe.isAlgerian && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20">
                    🇩🇿 {recipe.algerianRegion || 'الجزائر'}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50">{recipe.category} • مستوى: {recipe.difficulty}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="tv-toggle-cooking-mode-btn"
              onClick={() => {
                soundManager.playSelect();
                setCookingMode(!cookingMode);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer border ${
                cookingMode
                  ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-md shadow-[#E67E22]/20'
                  : 'bg-[#1A1A1A] hover:bg-white/10 text-white/80 border-white/10'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{cookingMode ? 'إنهاء وضع الطبخ' : 'بدء وضع الطبخ الذكي خطوة بخطوة'}</span>
            </button>

            <button
              id="tv-modal-close-btn"
              onClick={() => {
                soundManager.playBack();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-[#1A1A1A] hover:bg-rose-950/80 hover:text-rose-400 text-white/60 border border-white/10 transition cursor-pointer"
              title="إغلاق النافذة (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* If Cooking Mode Active: Big TV Step-by-Step Experience */}
          {cookingMode ? (
            <div className="space-y-6" id="tv-cooking-mode-container">
              {/* Step Tracker */}
              <div className="flex items-center justify-between bg-[#0F0F0F] p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white/50">خطوات التحضير:</span>
                  <div className="flex gap-1.5">
                    {recipe.steps.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2.5 rounded-full transition-all ${
                          idx === currentStepIndex
                            ? 'w-8 bg-[#E67E22] ring-2 ring-[#E67E22]/50'
                            : idx < currentStepIndex
                            ? 'w-3 bg-emerald-500'
                            : 'w-3 bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-sm font-black text-[#E67E22] font-mono">
                  الخطوة {currentStepIndex + 1} من {recipe.steps.length}
                </div>
              </div>

              {/* Big Step Card */}
              <div className="bg-[#1A1A1A] p-8 rounded-3xl border-2 border-[#E67E22]/40 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-4 py-1.5 rounded-xl bg-[#E67E22] text-white font-black text-sm shadow-md">
                    الخطوة {currentStepIndex + 1}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>استخدم الأسهم بالريموت للتنقل</span>
                  </div>
                </div>

                <p className="text-2xl lg:text-3xl font-bold text-white leading-relaxed pt-2">
                  {recipe.steps[currentStepIndex]}
                </p>
              </div>

              {/* Step Navigation & Kitchen Timer Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step Controls */}
                <div className="flex items-center gap-3 bg-[#0F0F0F] p-4 rounded-2xl border border-white/10">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                    className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer border ${
                      currentStepIndex === 0
                        ? 'bg-[#161616] text-white/20 border-white/5 cursor-not-allowed'
                        : 'bg-[#1A1A1A] hover:bg-white/10 text-white border-white/10'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>الخطوة السابقة</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    disabled={currentStepIndex === recipe.steps.length - 1}
                    className={`flex-1 py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer border ${
                      currentStepIndex === recipe.steps.length - 1
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : 'bg-[#E67E22] hover:bg-[#d35400] text-white border-[#E67E22] shadow-lg shadow-[#E67E22]/20'
                    }`}
                  >
                    <span>{currentStepIndex === recipe.steps.length - 1 ? 'اكتمل الطبق 🎉' : 'الخطوة التالية'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Kitchen Timer */}
                <div className="flex items-center justify-between bg-[#0F0F0F] p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Timer className="w-6 h-6 text-[#E67E22]" />
                    <div>
                      <div className="text-xs text-white/50 font-bold">مؤقت الطهي الذكي</div>
                      <div className="text-2xl font-black font-mono text-[#E67E22]">
                        {formatTimer(timerSeconds)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundManager.playSelect();
                        setIsTimerRunning(!isTimerRunning);
                      }}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border ${
                        isTimerRunning
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-emerald-600 text-white border-emerald-500'
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isTimerRunning ? 'إيقاف مؤقت' : 'تشغيل'}</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playNav();
                        setIsTimerRunning(false);
                        setTimerSeconds(recipe.cookTimeMinutes * 60);
                      }}
                      className="p-2.5 rounded-xl bg-[#1A1A1A] text-white/70 hover:text-white border border-white/10 cursor-pointer"
                      title="إعادة ضبط المؤقت"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Normal Overview View */
            <>
              {/* Image & Quick Specs Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 h-64 rounded-2xl overflow-hidden relative shadow-xl bg-[#0F0F0F] border border-white/10">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
                  <div className="absolute bottom-3 right-3 left-3 flex justify-between text-xs text-white">
                    <span className="bg-[#0F0F0F]/90 px-3 py-1 rounded-lg border border-white/10 font-bold">
                      {recipe.category}
                    </span>
                    {recipe.isAlgerian && (
                      <span className="bg-[#0F0F0F]/90 text-[#E67E22] border border-white/10 px-3 py-1 rounded-lg font-bold">
                        🇩🇿 {recipe.algerianRegion}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-white/70 text-base leading-relaxed">
                      {recipe.description}
                    </p>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="bg-[#0F0F0F] p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-xs text-white/40 font-semibold">وقت التحضير</div>
                        <div className="text-lg font-black text-[#E67E22] font-mono">
                          {recipe.prepTimeMinutes} دقيقة
                        </div>
                      </div>
                      <div className="bg-[#0F0F0F] p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-xs text-white/40 font-semibold">وقت الطهي</div>
                        <div className="text-lg font-black text-[#E67E22] font-mono">
                          {recipe.cookTimeMinutes} دقيقة
                        </div>
                      </div>
                      <div className="bg-[#0F0F0F] p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-xs text-white/40 font-semibold">عدد الحصص</div>
                        <div className="text-lg font-black text-[#E67E22] font-mono">
                          {recipe.servings} أفراد
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips Callout if available */}
                  {recipe.tips && recipe.tips.length > 0 && (
                    <div className="bg-[#E67E22]/10 border border-[#E67E22]/20 p-3.5 rounded-2xl space-y-1">
                      <div className="flex items-center gap-2 text-xs font-black text-[#E67E22]">
                        <Lightbulb className="w-4 h-4 text-[#E67E22]" />
                        <span>أسرار الطهاة لهذا الطبق:</span>
                      </div>
                      <ul className="text-xs text-[#E67E22]/90 space-y-1 pr-6 list-disc">
                        {recipe.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients & Quantities Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <span>المقادير والمكونات</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#0F0F0F] text-[#E67E22] border border-white/10">
                      {recipe.ingredients.length} مكون
                    </span>
                  </h4>
                  <span className="text-xs text-white/40">
                    العلامة الخضراء ✅ تعني توفر المكون في مطبخك
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {recipe.ingredients.map((ing, idx) => {
                    const isAvailable =
                      (ing.ingredientId && selectedSet.has(ing.ingredientId)) ||
                      customIngredients.some((c) => ing.name.includes(c));

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                          isAvailable
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                            : 'bg-[#0F0F0F] border-white/10 text-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black ${
                              isAvailable
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-white/10 text-white/40'
                            }`}
                          >
                            {isAvailable ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '•'}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-white">{ing.name}</span>
                            {ing.alternative && !isAvailable && (
                              <p className="text-[11px] text-[#E67E22] flex items-center gap-1 mt-0.5">
                                <Lightbulb className="w-3 h-3 text-[#E67E22] shrink-0" />
                                <span>بديل: {ing.alternative}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#1A1A1A] border border-white/10 text-[#E67E22] font-mono">
                          {ing.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preparation Steps Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-lg font-black text-white">طريقة التحضير خطوة بخطوة</h4>
                  <button
                    onClick={() => {
                      soundManager.playSelect();
                      setCookingMode(true);
                    }}
                    className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>فتح في وضع الطبخ التفاعلي للـ TV</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {recipe.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#0F0F0F] border border-white/10 flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#E67E22] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-medium text-white/80 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0F0F0F] px-6 py-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              soundManager.playBack();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-white/10 text-white/70 font-bold text-xs border border-white/10 cursor-pointer"
          >
            إغلاق (Esc)
          </button>

          <button
            onClick={() => {
              soundManager.playSelect();
              setCookingMode(!cookingMode);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#E67E22] hover:bg-[#d35400] text-white font-black text-xs shadow-lg shadow-[#E67E22]/20 hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            <span>{cookingMode ? 'العودة للملخص العام' : 'الانتقال لوضع الطبخ على التلفاز'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
