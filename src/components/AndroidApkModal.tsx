import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Smartphone, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // URL actuelle ou URL partagée
  const currentUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost')
        ? 'https://ais-pre-il3q5ie4dhodjgvj74cqap-474896488429.europe-west2.run.app'
        : window.location.href)
    : 'https://ais-pre-il3q5ie4dhodjgvj74cqap-474896488429.europe-west2.run.app';

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-none">
                Tester sur Mobile Android / APK
              </h3>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Installation directe ou fichier .APK
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* MÉTHODE 1 : SCAN QR CODE (LE PLUS RAPIDE SUR SMARTPHONE) */}
        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900 text-[10px] font-black uppercase tracking-wide">
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>Méthode recommandée (30 secondes)</span>
          </div>

          <h4 className="font-bold text-xs text-slate-900">
            Scannez ce QR Code avec l'appareil photo de votre mobile :
          </h4>

          {/* Affichage du QR code dynamique */}
          <div className="bg-white p-3 rounded-2xl shadow-xs border border-emerald-200 inline-block mx-auto">
            <QRCodeSVG
              value={currentUrl}
              size={160}
              level="M"
              includeMargin={false}
              className="rounded-lg"
            />
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed px-2">
            1. Pointez votre appareil photo Android vers le QR code.<br />
            2. Appuyez sur le lien qui s'affiche.<br />
            3. Appuyez sur <strong>« Installer sur Android »</strong> : Android génère automatiquement l'application native (WebAPK) sur votre écran d'accueil !
          </p>
        </div>

        {/* MÉTHODE 2 : TÉLÉCHARGER LE FICHIER .APK DIRECT VIA PWABUILDER */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-900 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Générer le fichier .APK physique</span>
            </span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              Pour clé USB / ENT
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Pour obtenir un fichier d'installation <strong>.apk</strong> traditionnel (Android Package),
            le service officiel <strong>PWABuilder</strong> convertit cette application en APK en un clic :
          </p>

          <a
            href={pwaBuilderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>Ouvrir PWABuilder & Générer l'APK</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* COPIER LE LIEN DE L'APPLICATION */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="flex-1 text-[11px] p-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 truncate"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier lien'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
