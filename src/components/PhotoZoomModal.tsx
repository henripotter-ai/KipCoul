import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { motion } from 'motion/react';

interface PhotoZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

export const PhotoZoomModal: React.FC<PhotoZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle
}) => {
  const [scale, setScale] = useState<number>(1);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.35, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.35, 0.8));
  };

  const handleReset = () => {
    setScale(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-2 sm:p-4 animate-in fade-in duration-150">
      {/* Barre supérieure */}
      <div className="flex items-center justify-between text-white p-2 border-b border-white/10 z-10">
        <div className="min-w-0 pr-2">
          <h3 className="font-extrabold text-xs sm:text-sm text-white truncate">{title}</h3>
          {subtitle && (
            <p className="text-[10px] text-emerald-300 truncate">{subtitle}</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center shrink-0"
          title="Fermer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Zone centrale : Image zoomable et déplaçable */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center touch-none">
        <motion.div
          drag={scale > 1}
          dragConstraints={{ left: -200 * scale, right: 200 * scale, top: -200 * scale, bottom: 200 * scale }}
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <img
            src={imageUrl}
            alt={title}
            style={{
              transform: `scale(${scale})`,
              transition: 'transform 0.15s ease-out'
            }}
            className="max-h-[75vh] max-w-[95vw] object-contain select-none pointer-events-none rounded-lg"
          />
        </motion.div>

        {scale > 1 && (
          <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
            <Move className="w-3 h-3 text-emerald-400" />
            <span>Glissez pour vous déplacer</span>
          </div>
        )}
      </div>

      {/* Barre inférieure des commandes de zoom */}
      <div className="p-2 sm:p-3 bg-black/80 rounded-2xl border border-white/10 flex items-center justify-between text-white z-10">
        <span className="text-xs font-bold text-slate-300 pl-2">
          Zoom : {Math.round(scale * 100)}%
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center gap-1 text-xs"
            title="Dézoomer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center gap-1 text-xs"
            title="Réinitialiser"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center gap-1 text-xs font-bold"
            title="Zoomer"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Agrandir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
