import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Smartphone, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  AlertTriangle,
  Sparkles,
  FileCode,
  Globe
} from 'lucide-react';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MANIFEST_CONTENT = JSON.stringify({
  id: "/",
  name: "KeepCool Challenge",
  short_name: "KeepCool",
  description: "Trouver la meilleure solution pour adapter le bâtiment",
  start_url: "/",
  scope: "/",
  display: "standalone",
  orientation: "portrait",
  background_color: "#047857",
  theme_color: "#047857",
  categories: ["education", "agriculture", "games"],
  icons: [
    {
      src: "/pwa-48x48.png",
      sizes: "48x48",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/pwa-72x72.png",
      sizes: "72x72",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/pwa-96x96.png",
      sizes: "96x96",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/pwa-128x128.png",
      sizes: "128x128",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/pwa-144x144.png",
      sizes: "144x144",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/pwa-152x152.png",
      sizes: "152x152",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/pwa-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/pwa-maskable-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable"
    },
    {
      src: "/pwa-384x384.png",
      sizes: "384x384",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/pwa-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/pwa-maskable-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable"
    },
    {
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/icon.svg",
      sizes: "192x192 512x512",
      type: "image/svg+xml",
      purpose: "any"
    }
  ]
}, null, 2);

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [showManifestText, setShowManifestText] = useState(false);

  if (!isOpen) return null;

  // URL publique partagée de l'application
  const currentUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost')
        ? 'https://ais-pre-il3q5ie4dhodjgvj74cqap-474896488429.europe-west2.run.app'
        : window.location.href.split('?')[0])
    : 'https://ais-pre-il3q5ie4dhodjgvj74cqap-474896488429.europe-west2.run.app';

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(MANIFEST_CONTENT);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-none">
                Tester sur Mobile & APK Android
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

        {/* Bannière de marque KeepCool & Icône officielle */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-3 border border-emerald-200 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/pwa-192x192.png"
              alt="Icône Ferme Laitière Durable"
              className="w-12 h-12 rounded-xl object-cover shadow-xs border border-emerald-300/60 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-black text-slate-900 leading-tight">
                  ThermiLait
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 uppercase">
                  PWA prête
                </span>
              </div>
              <p className="text-[10px] text-slate-600 line-clamp-1 mt-0.5">
                Icône officielle ferme laitière (192, 512, maskable)
              </p>
            </div>
          </div>
          <img
            src="/logo-keepcool.png"
            alt="KeepCool"
            className="h-8 max-w-[110px] object-contain shrink-0"
          />
        </div>

        {/* MÉTHODE 1 : SCAN DIRECT SUR MOBILE (LA PLUS SIMPLE & 0 CONFIG) */}
        <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 text-[10px] font-black uppercase tracking-wide">
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>Option 1 : Installation directe sans store</span>
          </div>

          <h4 className="font-bold text-xs text-slate-900">
            Scannez ce QR Code avec l'appareil photo de votre smartphone Android :
          </h4>

          {/* Affichage du QR code dynamique */}
          <div className="bg-white p-3 rounded-2xl shadow-xs border border-emerald-200 inline-block mx-auto">
            <QRCodeSVG
              value={currentUrl}
              size={150}
              level="M"
              includeMargin={false}
              className="rounded-lg"
            />
          </div>

          <p className="text-[11px] text-slate-700 leading-relaxed px-1">
            Dès que la page s'ouvre sur votre téléphone dans <strong>Chrome Android</strong>, appuyez sur <strong>« Installer »</strong> (ou dans le menu ⋮ &gt; <em>« Installer l'application »</em>). Android génère l'application native directement !
          </p>
        </div>

        {/* MÉTHODE 2 : PWABUILDER ET POURQUOI IL DEMANDE LE MANIFEST */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-900 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Option 2 : Fichier .APK via PWABuilder</span>
            </span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              Pour clé USB / ENT
            </span>
          </div>

          {/* Explication concrète sur le message de PWABuilder */}
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 text-amber-950">
            <div className="flex items-start gap-1.5 font-bold text-[11px] text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Pourquoi PWABuilder réclame le manifest ?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Le robot de PWABuilder teste l'URL depuis l'extérieur. Si votre application dans Google AI Studio est en mode privé de travail, le robot se heurte à la page de connexion Google.
            </p>
            <div className="pt-1 space-y-1 text-[11px]">
              <p><strong>Deux solutions très simples :</strong></p>
              <p>
                <strong>A.</strong> Cliquez sur le bouton <strong>« Partager » (Share)</strong> en haut à droite de Google AI Studio pour publier l'application publiquement.
              </p>
              <p>
                <strong>B.</strong> Ou collez directement le <strong>Manifest JSON</strong> ci-dessous dans PWABuilder !
              </p>
            </div>
          </div>

          {/* Bouton copier le Manifest JSON */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={handleCopyManifest}
              className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              {copiedManifest ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
              <span>{copiedManifest ? 'Manifest JSON copié dans le presse-papiers !' : 'Copier le code du Manifest (JSON)'}</span>
            </button>

            <button
              onClick={() => setShowManifestText(!showManifestText)}
              className="text-[10px] text-slate-500 hover:text-slate-800 underline text-center w-full block"
            >
              {showManifestText ? 'Masquer le code JSON' : 'Voir le code JSON du manifest'}
            </button>

            {showManifestText && (
              <pre className="p-2 bg-slate-900 text-emerald-300 text-[10px] rounded-xl overflow-x-auto max-h-36">
                {MANIFEST_CONTENT}
              </pre>
            )}
          </div>

          {/* Lien direct PWABuilder */}
          <a
            href={pwaBuilderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all block text-center mt-2"
          >
            <span>Ouvrir PWABuilder</span>
            <ExternalLink className="w-3.5 h-3.5 inline" />
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
            onClick={handleCopyUrl}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copié !' : 'Copier URL'}</span>
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
