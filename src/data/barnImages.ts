/**
 * Banques d'illustrations haute fidélité pour les cas d'élevage et solutions
 * Ces illustrations vectorielles haute résolution représentent fidèlement les problématiques d'ambiance
 * des étables laitières (bâtiments, flux d'air, vaches en stress ou confort, rayonnement thermique).
 */

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const BARN_ILLUSTRATIONS: Record<string, string> = {
  // 1. Problème 1 : Bardage plein & mur bloquant la ventilation
  pignon_plein_etouffant: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <defs>
        <linearGradient id="skyHot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fdba74"/>
          <stop offset="60%" stop-color="#fed7aa"/>
          <stop offset="100%" stop-color="#fef08a"/>
        </linearGradient>
        <linearGradient id="heatHaze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#ea580c" stop-opacity="0.35"/>
        </linearGradient>
      </defs>
      <!-- Ciel chaud d'été -->
      <rect width="600" height="400" fill="url(#skyHot)"/>
      <circle cx="510" cy="70" r="45" fill="#f59e0b" opacity="0.85"/>
      <circle cx="510" cy="70" r="60" fill="#fbbf24" opacity="0.3"/>

      <!-- Sol de la stabulation -->
      <polygon points="40,240 560,240 580,390 20,390" fill="#94a3b8"/>
      <!-- Litière / couloir -->
      <polygon points="120,270 480,270 510,390 90,390" fill="#78716c"/>

      <!-- Bâtiment : Toiture et charpente -->
      <polygon points="300,60 50,150 70,170 300,90 530,170 550,150" fill="#475569"/>
      <polygon points="300,90 70,170 70,240 300,160 530,240 530,170" fill="#334155"/>

      <!-- LE PROBLÈME : MUR MASSIF EN PARPAINGS & BARDAGE EN TÔLE TOTALEMENT FERMÉ -->
      <polygon points="70,170 160,195 160,340 70,300" fill="#64748b"/>
      <!-- Joints de parpaings montrant l'absence totale d'ouverture -->
      <line x1="70" y1="200" x2="160" y2="225" stroke="#475569" stroke-width="2"/>
      <line x1="70" y1="230" x2="160" y2="255" stroke="#475569" stroke-width="2"/>
      <line x1="70" y1="260" x2="160" y2="285" stroke="#475569" stroke-width="2"/>
      <line x1="70" y1="290" x2="160" y2="315" stroke="#475569" stroke-width="2"/>
      
      <!-- Mur fond fermé -->
      <polygon points="160,195 440,195 440,300 160,300" fill="#cbd5e1" opacity="0.6"/>

      <!-- Mur droit fermé -->
      <polygon points="440,195 530,170 530,300 440,340" fill="#64748b"/>
      <line x1="440" y1="225" x2="530" y2="200" stroke="#475569" stroke-width="2"/>
      <line x1="440" y1="255" x2="530" y2="230" stroke="#475569" stroke-width="2"/>
      <line x1="440" y1="285" x2="530" y2="260" stroke="#475569" stroke-width="2"/>

      <!-- Nappe d'air chaud stagnant (rouge / orange) -->
      <polygon points="160,200 440,200 470,350 130,350" fill="url(#heatHaze)"/>

      <!-- Vaches en détresse thermique (regroupées, haletantes) -->
      <!-- Vache 1 -->
      <g transform="translate(240, 260) scale(0.65)">
        <ellipse cx="60" cy="50" rx="45" ry="25" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
        <path d="M40,35 Q60,40 50,65 Q30,60 40,35" fill="#0f172a"/>
        <ellipse cx="110" cy="40" rx="18" ry="16" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
        <!-- Langue sortie / halètement -->
        <path d="M125,48 Q135,52 130,60 Q122,58 123,48" fill="#ef4444"/>
        <circle cx="118" cy="36" r="3" fill="#0f172a"/>
        <!-- Gouttes de salive / sueur -->
        <circle cx="132" cy="65" r="2" fill="#38bdf8"/>
        <circle cx="130" cy="72" r="1.5" fill="#38bdf8"/>
      </g>
      <!-- Vache 2 debout tête basse -->
      <g transform="translate(320, 255) scale(0.6)">
        <ellipse cx="60" cy="50" rx="42" ry="24" fill="#0f172a"/>
        <ellipse cx="10" cy="45" rx="16" ry="15" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
        <circle cx="8" cy="42" r="2.5" fill="#0f172a"/>
      </g>

      <!-- Badge indicateur d'ambiance -->
      <rect x="25" y="25" width="220" height="60" rx="10" fill="#0f172a" fill-opacity="0.85"/>
      <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f87171">⚠️ AIR MORT : 0,1 m/s</text>
      <text x="40" y="68" font-family="sans-serif" font-size="11" fill="#e2e8f0">Pignon plein • Absence d'aération</text>
    </svg>
  `),

  // Solution 1.1 : Filet brise-vent mobile & bardage ouvert
  filet_brise_vent_ouvert: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#e0f2fe"/>
      <!-- Arrière plan campagne verdoyante visible car ouvert -->
      <path d="M0,230 Q200,200 400,225 T600,210 L600,400 L0,400" fill="#86efac"/>
      
      <!-- Bâtiment avec grande baie ouverte -->
      <polygon points="300,50 50,140 70,160 300,80 530,160 550,140" fill="#334155"/>
      
      <!-- Poteaux porteurs acier galvanisé -->
      <rect x="100" y="160" width="16" height="180" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <rect x="250" y="140" width="16" height="200" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <rect x="400" y="140" width="16" height="200" fill="#94a3b8" stroke="#475569" stroke-width="2"/>

      <!-- Filet brise-vent amovible relevé et enroulé en haut -->
      <rect x="100" y="160" width="316" height="30" rx="6" fill="#15803d" stroke="#166534" stroke-width="2"/>
      <text x="170" y="180" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">RIDEAU TEXTILE DÉROULANT OUVERT</text>

      <!-- Flèches de flux d'air naturel frais traversant (bleues) -->
      <g stroke="#0284c7" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M50,220 C150,200 300,240 550,210" marker-end="url(#arrow)"/>
        <path d="M30,260 C130,250 320,270 560,250"/>
        <path d="M70,300 C180,280 340,310 540,290"/>
      </g>

      <!-- Vache couchée paisiblement qui rumine (confort) -->
      <g transform="translate(230, 270) scale(0.75)">
        <ellipse cx="80" cy="50" rx="55" ry="26" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
        <ellipse cx="140" cy="40" rx="16" ry="14" fill="#0f172a"/>
        <circle cx="146" cy="38" r="3" fill="#ffffff"/>
        <!-- Symbole rumination calme -->
        <path d="M142,48 Q150,52 145,55" stroke="#15803d" stroke-width="2" fill="none"/>
      </g>

      <!-- Badge vert -->
      <rect x="25" y="25" width="240" height="60" rx="10" fill="#065f46" fill-opacity="0.9"/>
      <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#34d399">✅ VENTILATION NATURELLE</text>
      <text x="40" y="68" font-family="sans-serif" font-size="11" fill="#ecfdf5">Ouverture 100% • Filet régulé en hiver</text>
    </svg>
  `),

  // Solution 1.2 : Brasseurs d'air hélicoïdaux (diamètre 140cm)
  brasseur_air_helicoide: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#f1f5f9"/>
      <!-- Charpente haute -->
      <polygon points="300,30 20,120 40,140 300,60 560,140 580,120" fill="#475569"/>
      <rect x="180" y="60" width="12" height="70" fill="#64748b"/>
      <rect x="400" y="60" width="12" height="70" fill="#64748b"/>

      <!-- Gros ventilateur 1 (Gauche) incliné vers les vaches -->
      <g transform="translate(130, 100)">
        <circle cx="55" cy="55" r="50" fill="#0284c7" fill-opacity="0.15" stroke="#0284c7" stroke-width="5"/>
        <circle cx="55" cy="55" r="14" fill="#0f172a"/>
        <!-- Pales en rotation -->
        <path d="M55,55 L25,20 Q40,15 55,25 Z" fill="#0369a1"/>
        <path d="M55,55 L85,25 Q95,40 85,55 Z" fill="#0369a1"/>
        <path d="M55,55 L65,95 Q45,95 45,85 Z" fill="#0369a1"/>
        <!-- Flux d'air dynamique propulsé vers le bas -->
        <path d="M20,115 L10,190 M55,115 L55,200 M90,115 L100,190" stroke="#0ea5e9" stroke-width="4" stroke-dasharray="8 6"/>
      </g>

      <!-- Gros ventilateur 2 (Droite) -->
      <g transform="translate(350, 100)">
        <circle cx="55" cy="55" r="50" fill="#0284c7" fill-opacity="0.15" stroke="#0284c7" stroke-width="5"/>
        <circle cx="55" cy="55" r="14" fill="#0f172a"/>
        <path d="M55,55 L25,20 Q40,15 55,25 Z" fill="#0369a1"/>
        <path d="M55,55 L85,25 Q95,40 85,55 Z" fill="#0369a1"/>
        <path d="M55,55 L65,95 Q45,95 45,85 Z" fill="#0369a1"/>
        <path d="M20,115 L10,190 M55,115 L55,200 M90,115 L100,190" stroke="#0ea5e9" stroke-width="4" stroke-dasharray="8 6"/>
      </g>

      <!-- Logettes de couchage avec vaches couchées au frais -->
      <rect x="80" y="280" width="440" height="60" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <!-- Vaches couchées qui ruminent -->
      <ellipse cx="200" cy="300" rx="45" ry="22" fill="#0f172a"/>
      <ellipse cx="420" cy="300" rx="45" ry="22" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>

      <!-- Badge indicateur vitesse d'air -->
      <rect x="25" y="25" width="250" height="60" rx="10" fill="#0369a1" fill-opacity="0.95"/>
      <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">💨 VITESSE D'AIR : 2,0 m/s</text>
      <text x="40" y="68" font-family="sans-serif" font-size="11" fill="#bae6fd">Ciblage direct du dos des vaches</text>
    </svg>
  `),

  // Problème 2 : Plaques translucides sans isolation (Four solaire)
  translucides_surchauffe: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <!-- Ciel d'été caniculaire -->
      <rect width="600" height="400" fill="#ffedd5"/>
      <circle cx="300" cy="40" r="50" fill="#ea580c"/>

      <!-- Toiture métallique avec translucides -->
      <polygon points="300,50 30,140 50,160 300,80 550,160 570,140" fill="#64748b"/>
      <!-- PLAQUES TRANSLUCIDES COLORÉES EN JAUNE FLUO CRÉANT LE RADIATEUR -->
      <polygon points="180,95 240,115 220,135 160,115" fill="#facc15" stroke="#eab308" stroke-width="3"/>
      <polygon points="360,95 420,115 400,135 340,115" fill="#facc15" stroke="#eab308" stroke-width="3"/>

      <!-- Rayonnement infrarouge descendant sous forme de cônes brûlants -->
      <polygon points="180,120 240,120 310,320 110,320" fill="#dc2626" fill-opacity="0.35"/>
      <polygon points="360,120 420,120 490,320 290,320" fill="#dc2626" fill-opacity="0.35"/>

      <!-- Lignes de chaleur radiante -->
      <path d="M190,140 L150,300 M210,140 L210,300 M230,140 L270,300" stroke="#b91c1c" stroke-width="2" stroke-dasharray="6 4"/>
      <path d="M370,140 L330,300 M390,140 L390,300 M410,140 L450,300" stroke="#b91c1c" stroke-width="2" stroke-dasharray="6 4"/>

      <!-- Logettes vides car brûlantes (vaches fuyant la zone) -->
      <rect x="140" y="300" width="320" height="40" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <text x="210" y="325" font-family="sans-serif" font-size="12" font-weight="bold" fill="#991b1b">LOGETTES DÉSERTÉES : 54°C AU SOL</text>

      <!-- Badge alerte radiatif -->
      <rect x="25" y="25" width="250" height="60" rx="10" fill="#991b1b" fill-opacity="0.95"/>
      <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fee2e2">☀️ EFFET DE SERRE RADIATIF</text>
      <text x="40" y="68" font-family="sans-serif" font-size="11" fill="#fecaca">Translucides non occultés au zénith</text>
    </svg>
  `),

  // Solution 2.1 : Blanchiment ou peinture réflective blanche / occultation
  blanchiment_translucides: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#f0fdf4"/>
      <!-- Soleil -->
      <circle cx="300" cy="40" r="45" fill="#f59e0b"/>

      <!-- Toiture -->
      <polygon points="300,50 30,140 50,160 300,80 550,160 570,140" fill="#64748b"/>
      
      <!-- PLAQUES OCCULTÉES AVEC PEINTURE RÉFLECTIVE BLANCHE THERMIQUE -->
      <polygon points="180,95 240,115 220,135 160,115" fill="#ffffff" stroke="#93c5fd" stroke-width="3"/>
      <polygon points="360,95 420,115 400,135 340,115" fill="#ffffff" stroke="#93c5fd" stroke-width="3"/>

      <!-- Rayons solaires renvoyés vers le ciel (réflexion 85%) -->
      <g stroke="#0284c7" stroke-width="3" stroke-linecap="round">
        <path d="M200,80 L230,20"/>
        <path d="M220,90 L270,30"/>
        <path d="M380,80 L350,20"/>
        <path d="M400,90 L430,30"/>
      </g>
      <text x="140" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0369a1">RÉFLEXION ALBEDO 85%</text>

      <!-- Zone ombragée et fraîche au sol -->
      <rect x="140" y="270" width="320" height="80" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="200" y="300" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d">ZONE D'OMBRE FRAÎCHE (22°C)</text>
      <!-- Vaches couchées apaisées -->
      <ellipse cx="230" cy="325" rx="35" ry="16" fill="#0f172a"/>
      <ellipse cx="370" cy="325" rx="35" ry="16" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>

      <!-- Badge -->
      <rect x="25" y="25" width="240" height="60" rx="10" fill="#166534" fill-opacity="0.95"/>
      <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">🛡️ BLANCHIMENT RÉFLECTIF</text>
      <text x="40" y="68" font-family="sans-serif" font-size="11" fill="#bbf7d0">Stop infrarouge • Gain -8°C ambiant</text>
    </svg>
  `),

  // Problème 3 : Bac abreuvoir sous-dimensionné au soleil
  abreuvoir_surcharge: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#fff7ed"/>
      <circle cx="520" cy="60" r="50" fill="#ea580c"/>

      <!-- Sol extérieur en béton brûlant -->
      <rect x="0" y="200" width="600" height="200" fill="#a8a29e"/>

      <!-- Petit abreuvoir à niveau constant minuscule au milieu -->
      <rect x="260" y="270" width="80" height="50" rx="6" fill="#64748b" stroke="#334155" stroke-width="3"/>
      <rect x="265" y="275" width="70" height="15" fill="#38bdf8"/>
      <text x="270" y="305" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">15 LITRES</text>

      <!-- Foule de vaches qui se bousculent violemment -->
      <g transform="translate(180, 240) scale(0.65)">
        <ellipse cx="50" cy="50" rx="40" ry="24" fill="#0f172a"/>
        <ellipse cx="90" cy="40" rx="16" ry="14" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
      </g>
      <g transform="translate(320, 240) scale(0.65)">
        <ellipse cx="50" cy="50" rx="40" ry="24" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
        <ellipse cx="10" cy="40" rx="16" ry="14" fill="#0f172a"/>
      </g>
      <g transform="translate(240, 200) scale(0.6)">
        <ellipse cx="50" cy="50" rx="40" ry="24" fill="#475569"/>
      </g>

      <!-- Éclairs de dispute / bousculade -->
      <polygon points="250,230 260,215 255,225 265,210" fill="#ef4444"/>
      <polygon points="340,230 330,215 335,225 325,210" fill="#ef4444"/>

      <!-- Badge alerte hydratation -->
      <rect x="25" y="25" width="260" height="60" rx="10" fill="#9a3412" fill-opacity="0.95"/>
      <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffedd5">💧 GOULET D'ÉTRANGLEMENT</text>
      <text x="40" y="68" font-family="sans-serif" font-size="11" fill="#fed7aa">Front &lt; 3 cm/VL • Eau tiède à 28°C</text>
    </svg>
  `),

  // Solution 3.1 : Grands bacs inox basculants haut débit protégés du soleil
  abreuvoir_inox_grand_debit: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#f0f9ff"/>

      <!-- Auvent de protection solaire au-dessus de l'abreuvoir -->
      <polygon points="100,80 500,80 540,130 60,130" fill="#0284c7"/>
      <rect x="80" y="130" width="12" height="150" fill="#64748b"/>
      <rect x="500" y="130" width="12" height="150" fill="#64748b"/>
      <text x="210" y="110" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">AUVENT PARE-SOLEIL DÉDIÉ</text>

      <!-- Grand bac inox basculant (2,5 mètres, grand volume d'eau fraîche claire) -->
      <rect x="120" y="250" width="360" height="60" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
      <!-- Eau fraîche bleutée transparente -->
      <rect x="130" y="255" width="340" height="35" rx="4" fill="#38bdf8" fill-opacity="0.8"/>
      <!-- Arrivée gros débit (40 L/min) -->
      <rect x="290" y="210" width="20" height="45" fill="#475569"/>
      <circle cx="300" cy="255" r="8" fill="#0284c7"/>

      <!-- Accès large sans bousculade : 4 vaches s'abreuvent côte à côte tranquillement -->
      <g transform="translate(130, 220) scale(0.55)">
        <ellipse cx="40" cy="40" rx="30" ry="20" fill="#0f172a"/>
      </g>
      <g transform="translate(220, 220) scale(0.55)">
        <ellipse cx="40" cy="40" rx="30" ry="20" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
      </g>
      <g transform="translate(320, 220) scale(0.55)">
        <ellipse cx="40" cy="40" rx="30" ry="20" fill="#0f172a"/>
      </g>
      <g transform="translate(410, 220) scale(0.55)">
        <ellipse cx="40" cy="40" rx="30" ry="20" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
      </g>

      <!-- Badge vert -->
      <rect x="25" y="25" width="260" height="60" rx="10" fill="#0369a1" fill-opacity="0.95"/>
      <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">🚰 ABREUVOIR HAUT DÉBIT (40L/MIN)</text>
      <text x="40" y="68" font-family="sans-serif" font-size="11" fill="#e0f2fe">15 cm front/VL • Eau fraîche à 15°C</text>
    </svg>
  `),

  // Problème 4 : Aire d'attente surchauffée avant traite
  attente_traite_etouffante: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#fef2f2"/>
      <circle cx="500" cy="60" r="50" fill="#dc2626"/>

      <!-- Toiture basse en tôle accumulant la chaleur -->
      <polygon points="50,110 550,110 570,140 30,140" fill="#7f1d1d"/>
      <text x="180" y="130" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fee2e2">TOIT EN TÔLE BAS NON ISOLÉ (RAYONNANT)</text>

      <!-- Barrières de contention serrées -->
      <rect x="60" y="180" width="480" height="15" fill="#64748b"/>
      <rect x="60" y="230" width="480" height="15" fill="#64748b"/>

      <!-- Troupeau de vaches ultra serrées (1 m²/vache) haletantes -->
      <g transform="translate(80, 220) scale(0.6)">
        <ellipse cx="50" cy="50" rx="40" ry="24" fill="#0f172a"/>
        <!-- Bouche ouverte haletante -->
        <path d="M85,55 L105,62 L85,68 Z" fill="#ef4444"/>
      </g>
      <g transform="translate(180, 215) scale(0.6)">
        <ellipse cx="50" cy="50" rx="40" ry="24" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
        <path d="M85,55 L105,62 L85,68 Z" fill="#ef4444"/>
      </g>
      <g transform="translate(280, 225) scale(0.6)">
        <ellipse cx="50" cy="50" rx="40" ry="24" fill="#0f172a"/>
        <path d="M85,55 L105,62 L85,68 Z" fill="#ef4444"/>
      </g>
      <g transform="translate(380, 215) scale(0.6)">
        <ellipse cx="50" cy="50" rx="40" ry="24" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
        <path d="M85,55 L105,62 L85,68 Z" fill="#ef4444"/>
      </g>

      <!-- Fumée de chaleur / transpiration collective -->
      <path d="M120,200 Q150,170 140,150 T160,130" stroke="#f87171" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M250,200 Q280,170 270,150 T290,130" stroke="#f87171" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M380,200 Q410,170 400,150 T420,130" stroke="#f87171" stroke-width="3" fill="none" opacity="0.6"/>

      <!-- Badge alerte -->
      <rect x="25" y="25" width="270" height="60" rx="10" fill="#7f1d1d" fill-opacity="0.95"/>
      <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">🔥 PIC D'HYPERTHERMIE TRAITE</text>
      <text x="40" y="68" font-family="sans-serif" font-size="11" fill="#fecaca">Densité 1 m²/VL • Respiration &gt; 90 bpm</text>
    </svg>
  `),

  // Solution 4.1 : Douchage grosses gouttes + ventilation pulsée sur aire d'attente
  douchage_ventilation_attente: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#f0fdf4"/>

      <!-- Rampe de douchage et brasseur d'air puissant au plafond -->
      <rect x="80" y="80" width="440" height="15" fill="#0284c7"/>
      <!-- Buses de douchage intermittent (grosses gouttes pour tremper la peau) -->
      <g fill="#0284c7">
        <circle cx="150" cy="115" r="4"/><circle cx="150" cy="135" r="4"/><circle cx="150" cy="155" r="4"/>
        <circle cx="280" cy="115" r="4"/><circle cx="280" cy="135" r="4"/><circle cx="280" cy="155" r="4"/>
        <circle cx="410" cy="115" r="4"/><circle cx="410" cy="135" r="4"/><circle cx="410" cy="155" r="4"/>
      </g>
      <!-- Brasseur d'air qui évapore l'eau immédiatement (chaleur latente) -->
      <circle cx="500" cy="100" r="35" fill="#0284c7" stroke="#0369a1" stroke-width="4"/>
      <path d="M470,130 L400,220 M490,140 L430,240 M510,140 L470,250" stroke="#0ea5e9" stroke-width="4" stroke-dasharray="8 4"/>

      <!-- Vaches détendues recevant l'eau et le vent frais -->
      <g transform="translate(150, 240) scale(0.65)">
        <ellipse cx="50" cy="50" rx="42" ry="24" fill="#0f172a"/>
        <ellipse cx="90" cy="40" rx="16" ry="14" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
        <!-- Pas de halètement, respiration apaisée -->
        <circle cx="95" cy="38" r="2.5" fill="#0f172a"/>
      </g>
      <g transform="translate(300, 240) scale(0.65)">
        <ellipse cx="50" cy="50" rx="42" ry="24" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
        <ellipse cx="90" cy="40" rx="16" ry="14" fill="#0f172a"/>
      </g>

      <!-- Badge succès -->
      <rect x="25" y="25" width="280" height="60" rx="10" fill="#15803d" fill-opacity="0.95"/>
      <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">❄️ REFROIDISSEMENT ÉVAPORATIF</text>
      <text x="40" y="68" font-family="sans-serif" font-size="11" fill="#bbf7d0">Cycle 1 min pluie + 4 min ventilation</text>
    </svg>
  `),

  // Distracteur : Fermer hermétiquement le bâtiment la nuit ou le jour
  distracteur_fermeture_hermetique: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#450a0a"/>
      <!-- Portes closes cadenassées -->
      <rect x="100" y="100" width="400" height="250" fill="#7f1d1d" stroke="#991b1b" stroke-width="8"/>
      <line x1="300" y1="100" x2="300" y2="350" stroke="#450a0a" stroke-width="6"/>
      <circle cx="280" cy="230" r="12" fill="#e2e8f0"/>
      <circle cx="320" cy="230" r="12" fill="#e2e8f0"/>

      <!-- Condensation et air toxique -->
      <text x="140" y="160" font-family="sans-serif" font-size="18" font-weight="bold" fill="#fca5a5">PIÈGE : FERMER LES PORTES</text>
      <text x="150" y="195" font-family="sans-serif" font-size="13" fill="#fecaca">Asphyxie par l'ammoniac et l'humidité</text>
      <text x="170" y="220" font-family="sans-serif" font-size="13" fill="#fecaca">Bloque le refroidissement nocturne</text>

      <rect x="180" y="260" width="240" height="45" rx="8" fill="#ef4444"/>
      <text x="200" y="288" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">❌ ERREUR GRAVE EN ÉLEVAGE</text>
    </svg>
  `),

  // Distracteur : Arroser la litière de paille au jet d'eau
  distracteur_arroser_litiere: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#3f3f46"/>
      <rect x="50" y="220" width="500" height="150" fill="#713f12"/>
      <text x="140" y="140" font-family="sans-serif" font-size="16" font-weight="bold" fill="#fca5a5">PIÈGE : ARROSER LA LITIÈRE</text>
      <text x="120" y="170" font-family="sans-serif" font-size="12" fill="#fde047">Fermentation accrue • Prolifération bactéries (mammites)</text>
      <text x="120" y="190" font-family="sans-serif" font-size="12" fill="#fde047">Humidité étouffante au niveau de la mamelle</text>
      <rect x="180" y="270" width="240" height="45" rx="8" fill="#dc2626"/>
      <text x="210" y="298" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">❌ DANGER SANITAIRE MAJEUR</text>
    </svg>
  `),

  // Problème 5 : Faîtage fermé borgne bloquant l'effet cheminée
  faitage_borgne_bloque: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#fff7ed"/>
      <polygon points="300,50 60,180 540,180" fill="#475569"/>
      <polygon points="290,50 310,50 320,80 280,80" fill="#334155"/>
      <!-- Air chaud piégé au sommet du toit -->
      <polygon points="300,60 140,175 460,175" fill="#ea580c" fill-opacity="0.5"/>
      <text x="210" y="125" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">CUPULE D'AIR CHAUD PIÉGÉE (38°C)</text>
      <rect x="25" y="25" width="250" height="55" rx="10" fill="#c2410c" fill-opacity="0.95"/>
      <text x="40" y="46" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">⚠️ FAÎTAGE FERMÉ ÉTOUFFANT</text>
      <text x="40" y="66" font-family="sans-serif" font-size="10" fill="#ffedd5">Absence d'effet tirage thermique</text>
    </svg>
  `),

  // Solution 5 : Lanterneau d'extraction faîtière ouverte
  lanterneau_faitiere_ouvert: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#f0fdf4"/>
      <polygon points="260,80 60,180 260,180" fill="#475569"/>
      <polygon points="340,80 540,180 340,180" fill="#475569"/>
      <!-- Lanterneau pare-pluie surélevé créant un tirage puissant -->
      <rect x="230" y="35" width="140" height="15" rx="4" fill="#047857"/>
      <line x1="250" y1="50" x2="250" y2="80" stroke="#0f172a" stroke-width="4"/>
      <line x1="350" y1="50" x2="350" y2="80" stroke="#0f172a" stroke-width="4"/>
      <!-- Échappement dynamique de la chaleur vers le ciel -->
      <g stroke="#059669" stroke-width="3" stroke-linecap="round">
        <path d="M280,100 L280,20"/>
        <path d="M300,110 L300,10"/>
        <path d="M320,100 L320,20"/>
      </g>
      <rect x="25" y="25" width="260" height="55" rx="10" fill="#065f46" fill-opacity="0.95"/>
      <text x="40" y="46" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">💨 EFFET CHEMINÉE ACTIF</text>
      <text x="40" y="66" font-family="sans-serif" font-size="10" fill="#d1fae5">Ouverture faîtière 30cm avec déflecteur</text>
    </svg>
  `),

  // Problème 6 : Tôle bac acier sans isolation surchauffée
  tole_brulante_sans_isolation: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#fee2e2"/>
      <circle cx="300" cy="40" r="45" fill="#dc2626"/>
      <!-- Tôle bac acier métallique rougeoyante de chaleur -->
      <polygon points="300,55 50,150 550,150" fill="#b91c1c"/>
      <line x1="100" y1="150" x2="100" y2="280" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 4"/>
      <line x1="300" y1="150" x2="300" y2="280" stroke="#ef4444" stroke-width="3" stroke-dasharray="6 4"/>
      <line x1="500" y1="150" x2="500" y2="280" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="180" y="190" font-family="sans-serif" font-size="13" font-weight="bold" fill="#991b1b">RAYONNEMENT TOITURE : 68°C</text>
      <rect x="25" y="25" width="260" height="55" rx="10" fill="#991b1b" fill-opacity="0.95"/>
      <text x="40" y="46" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">☀️ TÔLE NU SANS ISOLATION</text>
      <text x="40" y="66" font-family="sans-serif" font-size="10" fill="#fecaca">Radiateur thermique géant au-dessus du bétail</text>
    </svg>
  `),

  // Solution 6 : Isolation sous toiture panneaux sandwich
  isolation_sous_toiture: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#f0fdf4"/>
      <!-- Couverture extérieure -->
      <polygon points="300,55 50,150 550,150" fill="#64748b"/>
      <!-- COUCHE ISOLANTE ÉPAISSE (Panneaux sandwich isolants 40mm) -->
      <polygon points="300,75 70,165 530,165" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
      <text x="170" y="130" font-family="sans-serif" font-size="12" font-weight="bold" fill="#713f12">BARRIÈRE THERMIQUE ISOLANTE 40 MM</text>
      <rect x="100" y="240" width="400" height="80" rx="8" fill="#dcfce7"/>
      <text x="170" y="285" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534">SOUS-FACE FRAÎCHE À 24°C</text>
      <rect x="25" y="25" width="260" height="55" rx="10" fill="#15803d" fill-opacity="0.95"/>
      <text x="40" y="46" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">🛡️ ISOLATION EN PANNEAUX</text>
      <text x="40" y="66" font-family="sans-serif" font-size="10" fill="#bbf7d0">Rupteur d'infrarouges • Gain de -10°C au dos</text>
    </svg>
  `),

  // Problème 7 : Aire d'exercice extérieure bétonnée sans ombre
  cour_exterieure_soleil: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#ffedd5"/>
      <circle cx="500" cy="50" r="50" fill="#f97316"/>
      <rect x="0" y="220" width="600" height="180" fill="#a8a29e"/>
      <text x="180" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#7f1d1d">BÉTON BRÛLANT AU SOLEIL : 52°C</text>
      <rect x="25" y="25" width="260" height="55" rx="10" fill="#c2410c" fill-opacity="0.95"/>
      <text x="40" y="46" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">☀️ AIRE D'EXERCICE SANS OMBRE</text>
      <text x="40" y="66" font-family="sans-serif" font-size="10" fill="#ffedd5">Vaches confinées refusant de sortir</text>
    </svg>
  `),

  // Solution 7 : Voiles d'ombrage et casquette débordante
  voiles_ombrage_auvent: svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#f0f9ff"/>
      <!-- Grand voile d'ombrage tendu créant une vaste zone fraîche -->
      <polygon points="60,110 540,110 480,180 120,180" fill="#0284c7" fill-opacity="0.85"/>
      <line x1="60" y1="110" x2="30" y2="280" stroke="#475569" stroke-width="4"/>
      <line x1="540" y1="110" x2="570" y2="280" stroke="#475569" stroke-width="4"/>
      <!-- Zone d'ombre au sol -->
      <polygon points="100,220 500,220 540,360 60,360" fill="#38bdf8" fill-opacity="0.25"/>
      <text x="190" y="280" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0369a1">ZONE D'OMBRE TENDUE 90%</text>
      <rect x="25" y="25" width="260" height="55" rx="10" fill="#0284c7" fill-opacity="0.95"/>
      <text x="40" y="46" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">☂️ VOILE D'OMBRAGE EXTÉRIEUR</text>
      <text x="40" y="66" font-family="sans-serif" font-size="10" fill="#e0f2fe">Ombrage 80% • Libère la circulation des vaches</text>
    </svg>
  `)
};

