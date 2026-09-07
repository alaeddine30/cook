import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft, Undo2, X, Info } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface TVRemoteSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onSelect: () => void;
  onBack: () => void;
  onColorAction: (color: 'red' | 'green' | 'yellow' | 'blue') => void;
}

export const TVRemoteSimulator: React.FC<TVRemoteSimulatorProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelect,
  onBack,
  onColorAction,
}) => {
  if (!isOpen) return null;

  const handleNav = (dir: 'up' | 'down' | 'left' | 'right') => {
    soundManager.playNav();
    onNavigate(dir);
  };

  const handleOK = () => {
    soundManager.playSelect();
    onSelect();
  };

  const handleBackAction = () => {
    soundManager.playBack();
    onBack();
  };

  const handleColor = (color: 'red' | 'green' | 'yellow' | 'blue') => {
    soundManager.playSelect();
    onColorAction(color);
  };

  return (
    <div
      id="tv-remote-floating-simulator"
      className="fixed bottom-6 left-6 z-50 flex flex-col items-center bg-[#161616]/95 border-2 border-white/10 shadow-2xl shadow-black/80 rounded-3xl p-5 w-72 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5"
    >
      {/* Remote Top bar */}
      <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E67E22] animate-pulse" />
          <span className="text-xs font-bold text-white/80">ريموت التلفاز الذكي</span>
        </div>
        <button
          onClick={() => {
            soundManager.playBack();
            onClose();
          }}
          className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="إغلاق نافذة الريموت"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* D-Pad Controller */}
      <div className="relative w-48 h-48 my-2 flex items-center justify-center">
        {/* Background circular D-pad plate */}
        <div className="absolute inset-0 rounded-full bg-[#0F0F0F] border border-white/10 shadow-inner flex items-center justify-center">
          {/* Subtle concentric ring */}
          <div className="w-36 h-36 rounded-full border border-white/5" />
        </div>

        {/* Up Arrow */}
        <button
          id="remote-btn-up"
          onClick={() => handleNav('up')}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-12 rounded-t-2xl bg-[#1A1A1A] hover:bg-[#E67E22] hover:text-white text-white/80 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
          title="سهم للأعلى (↑)"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* Down Arrow */}
        <button
          id="remote-btn-down"
          onClick={() => handleNav('down')}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-12 rounded-b-2xl bg-[#1A1A1A] hover:bg-[#E67E22] hover:text-white text-white/80 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
          title="سهم للأسفل (↓)"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        {/* Left Arrow */}
        <button
          id="remote-btn-left"
          onClick={() => handleNav('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-14 rounded-l-2xl bg-[#1A1A1A] hover:bg-[#E67E22] hover:text-white text-white/80 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
          title="سهم لليسار (←)"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow */}
        <button
          id="remote-btn-right"
          onClick={() => handleNav('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-14 rounded-r-2xl bg-[#1A1A1A] hover:bg-[#E67E22] hover:text-white text-white/80 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
          title="سهم لليمين (→)"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Center OK Button */}
        <button
          id="remote-btn-ok"
          onClick={handleOK}
          className="relative z-10 w-16 h-16 rounded-full bg-[#E67E22] hover:bg-[#d35400] text-white font-black text-sm flex items-center justify-center shadow-lg shadow-[#E67E22]/30 hover:scale-105 active:scale-95 cursor-pointer border-2 border-[#E67E22]"
          title="زر التأكيد (OK / Enter)"
        >
          <span>OK</span>
        </button>
      </div>

      {/* Back & Enter Bar */}
      <div className="grid grid-cols-2 gap-2 w-full my-3">
        <button
          id="remote-btn-back"
          onClick={handleBackAction}
          className="py-2.5 px-3 rounded-xl bg-[#1A1A1A] hover:bg-white/10 text-white/80 text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition cursor-pointer"
          title="زر الرجوع (Back / Esc)"
        >
          <Undo2 className="w-4 h-4 text-[#E67E22]" />
          <span>رجوع</span>
        </button>
        <button
          id="remote-btn-enter"
          onClick={handleOK}
          className="py-2.5 px-3 rounded-xl bg-[#1A1A1A] hover:bg-white/10 text-white/80 text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition cursor-pointer"
          title="تأكيد الاختيار"
        >
          <CornerDownLeft className="w-4 h-4 text-emerald-400" />
          <span>اختيار</span>
        </button>
      </div>

      {/* Smart TV 4 Color Shortcut Buttons */}
      <div className="w-full pt-2 border-t border-white/10">
        <div className="text-[11px] font-semibold text-white/40 text-center mb-2">
          أزرار التلفاز الملونة
        </div>
        <div className="grid grid-cols-4 gap-1.5 w-full">
          <button
            id="remote-color-red"
            onClick={() => handleColor('red')}
            className="h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shadow cursor-pointer active:scale-95 transition"
            title="المؤونة والمكونات"
          >
            المؤونة
          </button>
          <button
            id="remote-color-green"
            onClick={() => handleColor('green')}
            className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shadow cursor-pointer active:scale-95 transition"
            title="ماذا أطبخ اليوم؟"
          >
            أطبخ؟
          </button>
          <button
            id="remote-color-yellow"
            onClick={() => handleColor('yellow')}
            className="h-8 rounded-lg bg-[#E67E22] hover:bg-[#d35400] text-white font-bold text-[10px] flex items-center justify-center shadow cursor-pointer active:scale-95 transition"
            title="المطبخ الجزائري"
          >
            جزائري
          </button>
          <button
            id="remote-color-blue"
            onClick={() => handleColor('blue')}
            className="h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center shadow cursor-pointer active:scale-95 transition"
            title="تصفح وبحث"
          >
            بحث
          </button>
        </div>
      </div>

      {/* Keyboard info note */}
      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-white/40 text-center">
        <Info className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
        <span>تدعم أسهم لوحة المفاتيح ومفتاح Enter و Esc</span>
      </div>
    </div>
  );
};
