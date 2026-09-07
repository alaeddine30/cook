/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ActiveTVTab, Recipe } from './types';
import { RECIPES } from './data/recipesData';
import { ALGERIAN_PANTRY_PRESET, INITIAL_INGREDIENTS } from './data/ingredientsData';
import { calculateRecipeMatches } from './utils/matchingAlgorithm';
import { soundManager } from './utils/soundEffects';

import { TVHeader } from './components/TVHeader';
import { TVRemoteSimulator } from './components/TVRemoteSimulator';
import { PantrySelector } from './components/PantrySelector';
import { RecommendationsView } from './components/RecommendationsView';
import { WeeklyPlannerView } from './components/WeeklyPlannerView';
import { AlgerianCuisineView } from './components/AlgerianCuisineView';
import { CategoryBrowseView } from './components/CategoryBrowseView';
import { RecipeDetailModal } from './components/RecipeDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTVTab>('what_to_cook');
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>(ALGERIAN_PANTRY_PRESET);
  const [customIngredients, setCustomIngredients] = useState<string[]>(['كسبرة وبقدونس طازج']);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isRemoteOpen, setIsRemoteOpen] = useState<boolean>(true);

  // Compute live recipe matches based on selected ingredients
  const matches = useMemo(() => {
    return calculateRecipeMatches(RECIPES, selectedIngredientIds, customIngredients);
  }, [selectedIngredientIds, customIngredients]);

  // Toggle single ingredient
  const handleToggleIngredient = useCallback((id: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Add custom ingredient
  const handleAddCustomIngredient = useCallback((name: string) => {
    if (!customIngredients.includes(name)) {
      setCustomIngredients((prev) => [...prev, name]);
    }
  }, [customIngredients]);

  // Remove custom ingredient
  const handleRemoveCustomIngredient = useCallback((name: string) => {
    setCustomIngredients((prev) => prev.filter((i) => i !== name));
  }, []);

  // Set Algerian Preset
  const handleSetAlgerianPreset = useCallback(() => {
    setSelectedIngredientIds(ALGERIAN_PANTRY_PRESET);
  }, []);

  // Clear all
  const handleClearAll = useCallback(() => {
    setSelectedIngredientIds([]);
    setCustomIngredients([]);
  }, []);

  // Select all visible
  const handleSelectAllVisible = useCallback((ids: string[]) => {
    setSelectedIngredientIds((prev) => {
      const set = new Set([...prev, ...ids]);
      return Array.from(set);
    });
  }, []);

  // Remote Direction handler
  const handleRemoteNavigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    // Collect all focusable elements currently visible
    const focusable = Array.from(
      document.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not(#tv-remote-floating-simulator *), input:not([disabled]):not(#tv-remote-floating-simulator *), [tabindex="0"]:not(#tv-remote-floating-simulator *)'
      )
    );

    if (focusable.length === 0) return;

    const currentFocus = document.activeElement as HTMLElement | null;
    let currentIndex = focusable.indexOf(currentFocus as HTMLElement);

    if (currentIndex === -1) {
      focusable[0]?.focus();
      return;
    }

    let nextIndex = currentIndex;
    if (direction === 'down' || direction === 'right') {
      nextIndex = (currentIndex + 1) % focusable.length;
    } else if (direction === 'up' || direction === 'left') {
      nextIndex = (currentIndex - 1 + focusable.length) % focusable.length;
    }

    const nextEl = focusable[nextIndex];
    if (nextEl) {
      nextEl.focus();
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  // Remote Select OK
  const handleRemoteSelect = useCallback(() => {
    const currentFocus = document.activeElement as HTMLElement | null;
    if (currentFocus && !currentFocus.closest('#tv-remote-floating-simulator')) {
      currentFocus.click();
    }
  }, []);

  // Remote Back
  const handleRemoteBack = useCallback(() => {
    if (selectedRecipe) {
      setSelectedRecipe(null);
    } else if (activeTab !== 'what_to_cook') {
      setActiveTab('what_to_cook');
    }
  }, [selectedRecipe, activeTab]);

  // Remote 4 Color button actions
  const handleRemoteColorAction = useCallback((color: 'red' | 'green' | 'yellow' | 'blue') => {
    if (color === 'red') {
      setActiveTab('my_pantry');
    } else if (color === 'green') {
      setActiveTab('what_to_cook');
    } else if (color === 'yellow') {
      setActiveTab('algerian_cuisine');
    } else if (color === 'blue') {
      setActiveTab('categories_search');
    }
  }, []);

  // Global TV Keyboard listeners for standard Smart TV remotes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a text input field
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === 'Escape') {
        e.preventDefault();
        soundManager.playBack();
        handleRemoteBack();
        return;
      }

      if (isInput) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        soundManager.playNav();
        handleRemoteNavigate('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        soundManager.playNav();
        handleRemoteNavigate('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        soundManager.playNav();
        handleRemoteNavigate('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        soundManager.playNav();
        handleRemoteNavigate('right');
      } else if (e.key === 'r' || e.key === 'R' || e.key === '1') {
        soundManager.playSelect();
        handleRemoteColorAction('red');
      } else if (e.key === 'g' || e.key === 'G' || e.key === '2') {
        soundManager.playSelect();
        handleRemoteColorAction('green');
      } else if (e.key === 'y' || e.key === 'Y' || e.key === '3') {
        soundManager.playSelect();
        handleRemoteColorAction('yellow');
      } else if (e.key === 'b' || e.key === 'B' || e.key === '4') {
        soundManager.playSelect();
        handleRemoteColorAction('blue');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRemoteNavigate, handleRemoteBack, handleRemoteColorAction]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col justify-between selection:bg-[#E67E22] selection:text-white" dir="rtl">
      {/* Smart TV Header */}
      <TVHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedCount={selectedIngredientIds.length + customIngredients.length}
        onToggleRemoteModal={() => setIsRemoteOpen(!isRemoteOpen)}
        isRemoteOpen={isRemoteOpen}
      />

      {/* Main TV Screen Content Stage */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-28">
        {activeTab === 'what_to_cook' && (
          <RecommendationsView
            matches={matches}
            selectedCount={selectedIngredientIds.length + customIngredients.length}
            onSelectRecipe={setSelectedRecipe}
            onGoToPantry={() => setActiveTab('my_pantry')}
          />
        )}

        {activeTab === 'weekly_plan' && (
          <WeeklyPlannerView
            recipes={RECIPES}
            selectedIngredientIds={selectedIngredientIds}
            customIngredients={customIngredients}
            onSelectRecipe={setSelectedRecipe}
            onGoToPantry={() => setActiveTab('my_pantry')}
          />
        )}

        {activeTab === 'algerian_cuisine' && (
          <AlgerianCuisineView
            recipes={RECIPES}
            matches={matches}
            onSelectRecipe={setSelectedRecipe}
          />
        )}

        {activeTab === 'my_pantry' && (
          <PantrySelector
            selectedIds={selectedIngredientIds}
            customIngredients={customIngredients}
            onToggleIngredient={handleToggleIngredient}
            onAddCustomIngredient={handleAddCustomIngredient}
            onRemoveCustomIngredient={handleRemoveCustomIngredient}
            onSetAlgerianPreset={handleSetAlgerianPreset}
            onClearAll={handleClearAll}
            onSelectAllVisible={handleSelectAllVisible}
            onGoToRecommendations={() => setActiveTab('what_to_cook')}
          />
        )}

        {activeTab === 'categories_search' && (
          <CategoryBrowseView
            recipes={RECIPES}
            onSelectRecipe={setSelectedRecipe}
          />
        )}
      </main>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        selectedIngredientIds={selectedIngredientIds}
        customIngredients={customIngredients}
      />

      {/* Interactive Smart TV Remote Simulator (Floating or Toggleable) */}
      <TVRemoteSimulator
        isOpen={isRemoteOpen}
        onClose={() => setIsRemoteOpen(false)}
        onNavigate={handleRemoteNavigate}
        onSelect={handleRemoteSelect}
        onBack={handleRemoteBack}
        onColorAction={handleRemoteColorAction}
      />

      {/* TV Bottom Remote Shortcuts Legend Bar */}
      <footer className="fixed bottom-0 inset-x-0 bg-[#161616]/95 backdrop-blur-md border-t border-white/10 px-6 py-2.5 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-white/50 hidden sm:inline">أزرار الريموت السريعة:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <span className="font-semibold text-white/70">🔴 المؤونة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-white/70">🟢 ماذا أطبخ؟</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#E67E22] shrink-0" />
              <span className="font-semibold text-white/70">🟡 المطبخ الجزائري</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
              <span className="font-semibold text-white/70">🔵 التصنيفات والبحث</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/40 font-mono text-[11px]">
            <span className="hidden md:inline bg-[#1A1A1A] border border-white/10 px-2.5 py-1 rounded-lg">
              ↑ ↓ ← → للتنقل
            </span>
            <span className="hidden md:inline bg-[#1A1A1A] border border-white/10 px-2.5 py-1 rounded-lg">
              Enter للاختيار
            </span>
            <span className="hidden md:inline bg-[#1A1A1A] border border-white/10 px-2.5 py-1 rounded-lg">
              Esc للرجوع
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
