import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface PhotoZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

export const PhotoZoomModal: React.FC<PhotoZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl
}) => {
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartDist = useRef<number | null>(null);
  const touchStartScale = useRef<number>(1);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchStartOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTapTime = useRef<number>(0);

  // Réinitialiser le zoom quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  if (!isOpen) return null;

  // Calcul de la distance entre deux doigts
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Début du pincement à deux doigts
      touchStartDist.current = getDistance(e.touches[0], e.touches[1]);
      touchStartScale.current = scale;
    } else if (e.touches.length === 1) {
      // Début du déplacement à un doigt (si zoomé)
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartOffset.current = { ...offset };

      // Double tap pour zoomer / dézoomer rapidement
      const now = Date.now();
      if (now - lastTapTime.current < 300) {
        if (scale > 1.2) {
          setScale(1);
          setOffset({ x: 0, y: 0 });
        } else {
          setScale(2.5);
        }
      }
      lastTapTime.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current !== null) {
      // Gestion du pinch-to-zoom à deux doigts
      const currentDist = getDistance(e.touches[0], e.touches[1]);
      const factor = currentDist / touchStartDist.current;
      const nextScale = Math.min(Math.max(touchStartScale.current * factor, 1), 4);
      setScale(nextScale);
      if (nextScale <= 1) {
        setOffset({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && touchStartPos.current && scale > 1) {
      // Déplacement de l'image agrandie
      const dx = e.touches[0].clientX - touchStartPos.current.x;
      const dy = e.touches[0].clientY - touchStartPos.current.y;
      const maxOffset = 180 * (scale - 1);
      setOffset({
        x: Math.min(Math.max(touchStartOffset.current.x + dx, -maxOffset), maxOffset),
        y: Math.min(Math.max(touchStartOffset.current.y + dy, -maxOffset), maxOffset)
      });
    }
  };

  const handleTouchEnd = () => {
    touchStartDist.current = null;
    touchStartPos.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bouton de fermeture discret translucide */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white/90 backdrop-blur-xs transition-all"
        title="Fermer"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Image plein écran sans entête ni outils */}
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt=""
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: touchStartDist.current ? 'none' : 'transform 0.1s ease-out'
          }}
          className="max-h-full max-w-full object-contain pointer-events-none"
        />
      </div>
    </div>
  );
};
