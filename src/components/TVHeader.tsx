import React, { useEffect, useState } from 'react';
import { ActiveTVTab } from '../types';
import { Sparkles, UtensilsCrossed, ChefHat, Search, Refrigerator, Volume2, VolumeX, Tv, Calendar } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface TVHeaderProps {
  activeTab: ActiveTVTab;
  onSelectTab: (tab: ActiveTVTab) => void;
  selectedCount: number;
  onToggleRemoteModal: () => void;
  isRemoteOpen: boolean;
}

export const TVHeader: React.FC<TVHeaderProps> = ({
  activeTab,
  onSelectTab,
  selectedCount,
  onToggleRemoteModal,
  isRemoteOpen,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [soundOn, setSoundOn] = useState<boolean>(soundManager.isEnabled());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSoundToggle = () => {
    const newState = soundManager.toggleSound();
    setSoundOn(newState);
  };

  const navItems: { id: ActiveTVTab; label: string; icon: React.ReactNode; colorBadge: string; keyHint: string }[] = [
    {
      id: 'what_to_cook',
      label: 'ماذا أطبخ اليوم؟',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      colorBadge: 'bg-emerald-500',
      keyHint: '🟢 الزر الأخضر',
    },
    {
      id: 'weekly_plan',
      label: 'جدول وجبات الأسبوع',
      icon: <Calendar className="w-5 h-5 text-[#E67E22]" />,
      colorBadge: 'bg-amber-500',
      keyHint: '📅 خطة الأسبوع',
    },
    {
      id: 'algerian_cuisine',
      label: 'المطبخ الجزائري',
      icon: <ChefHat className="w-5 h-5 text-emerald-400" />,
      colorBadge: 'bg-amber-400',
      keyHint: '🟡 الزر الأصفر',
    },
    {
      id: 'my_pantry',
      label: 'مكوناتي ومؤونتي',
      icon: <Refrigerator className="w-5 h-5 text-sky-400" />,
      colorBadge: 'bg-rose-500',
      keyHint: '🔴 الزر الأحمر',
    },
    {
      id: 'categories_search',
      label: 'التصنيفات والبحث',
      icon: <Search className="w-5 h-5 text-purple-400" />,
      colorBadge: 'bg-blue-500',
      keyHint: '🔵 الزر الأزرق',
    },
  ];

  return (
    <header className="w-full bg-[#161616]/95 backdrop-blur-md border-b border-white/10 px-6 py-3.5 sticky top-0 z-40 shadow-2xl" id="tv-main-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Smart TV tag */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E67E22] to-amber-500 p-0.5 shadow-lg shadow-[#E67E22]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0F0F0F] rounded-[14px] flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-[#E67E22]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-[#E67E22] tracking-tight">
                  طباخ التلفاز الذكي
                </h1>
                <span className="bg-[#E67E22]/10 text-[#E67E22] text-xs px-2.5 py-0.5 rounded-full border border-[#E67E22]/20 font-bold flex items-center gap-1">
                  <span>🇩🇿</span> جزائري وعربي
                </span>
              </div>
              <p className="text-xs text-white/40 flex items-center gap-2">
                <span className="uppercase tracking-widest text-[10px]">Smart TV Cooking</span>
                <span className="inline-block w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-[#E67E22] font-semibold">{selectedCount} مكون في مطبخك</span>
              </p>
            </div>
          </div>

          {/* Clock & Sound for mobile header */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleRemoteModal}
              className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
                isRemoteOpen ? 'bg-[#E67E22] text-white border-[#E67E22]' : 'bg-[#1A1A1A] text-white/70 border-white/10'
              }`}
              title="جهاز التحكم"
            >
              <Tv className="w-4 h-4" />
              <span>الريموت</span>
            </button>
            <span className="text-lg font-mono font-bold text-[#E67E22] bg-[#0F0F0F] px-2 py-1 rounded-lg border border-white/10">
              {timeStr}
            </span>
          </div>
        </div>

        {/* Navigation Tabs with TV Focus Feel */}
        <nav className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tv-nav-tab-${item.id}`}
                onClick={() => {
                  soundManager.playSelect();
                  onSelectTab(item.id);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-white/10 text-white border-[#E67E22] ring-2 ring-[#E67E22]/30 shadow-lg shadow-[#E67E22]/20 scale-[1.02]'
                    : 'bg-[#1A1A1A] text-white/60 border-white/10 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${item.colorBadge} shadow-sm shrink-0`} />
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'my_pantry' && selectedCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-[#E67E22] text-white' : 'bg-white/10 text-[#E67E22]'
                    }`}
                  >
                    {selectedCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* TV Clock, Audio & Remote Simulator Trigger */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="tv-toggle-remote-btn"
            onClick={() => {
              soundManager.playSelect();
              onToggleRemoteModal();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              isRemoteOpen
                ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-md shadow-[#E67E22]/20'
                : 'bg-[#1A1A1A] text-white/70 border-white/10 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>ريموت التلفاز</span>
          </button>

          <button
            id="tv-sound-toggle-btn"
            onClick={handleSoundToggle}
            className="p-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition cursor-pointer"
            title={soundOn ? 'كتم أصوات الريموت' : 'تشغيل أصوات الريموت'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-white/40" />}
          </button>

          <div className="bg-[#0F0F0F] border border-white/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-base font-mono font-bold text-[#E67E22]">{timeStr}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
