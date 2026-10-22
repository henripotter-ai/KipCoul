import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Smartphone, Download, CheckCircle2, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" />
        <span>Installée sur smartphone</span>
      </span>
    );
  }

  return (
    <>
      <button
        onClick={async () => {
          if (isInstallable) {
            await install();
          } else {
            setShowAndroidGuide(true);
          }
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
        title="Installer l'application sur votre smartphone Android"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>📲 Installer sur Android</span>
      </button>

      {/* Guide d'installation sur Android / Smartphone */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3.5 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Installer sur Smartphone Android</span>
              </div>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900">
                Cette application est une <strong>Progressive Web App (PWA)</strong> : elle s'installe directement sur votre téléphone Android sans passer par Google Play !
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <p><strong>1.</strong> Dans Chrome sur votre smartphone, appuyez sur le menu <strong>⋮</strong> (en haut à droite).</p>
                <p><strong>2.</strong> Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</p>
                <p><strong>3.</strong> L'icône ThermiLait apparaît parmi vos applications Android et s'ouvre en plein écran hors-ligne !</p>
              </div>
              <p className="text-[11px] text-slate-400">
                💡 Pour générer un fichier <strong>.APK</strong> traditionnel distribuable par clé USB, vous pouvez entrer l'URL de cette application sur <em>PWABuilder.com</em>.
              </p>
            </div>

            <button
              onClick={() => setShowAndroidGuide(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
