export type Lang = 'es' | 'en';

const LANG_KEY = 'rutas-tematicas:lang';

const strings = {
  es: {
    appName: 'Rutas temáticas',
    subtitle: 'Demo de recorridos con marcas · Mappedin JS',
    stepChoose: '1 · Elige',
    stepWalk: '2 · Recorre',
    stepDone: '3 · Tus cupones',
    loading: 'Cargando mapa…',
    chooseTitle: '¿Qué te provoca hoy?',
    chooseMessage: 'Elige una ruta y el mapa te lleva por sus tiendas. Estás en Informes; toca el mapa para cambiar tu punto de partida.',
    routeMessage: (stops: number, m: number, min: number) => `${stops} tiendas · ${m} m · unos ${min} min caminando`,
    noRoute: 'No hay ruta desde este punto. Toca otro lugar del pasillo.',
    start: 'Empezar recorrido',
    reorderHint: 'Arrastra las tiendas para cambiar el orden de las paradas.',
    otherTrail: 'Otra ruta',
    walkingTitle: 'En camino…',
    walkingMessage: (next: string) => `Próxima parada: ${next}. Punto azul simulado.`,
    stop: 'Detener',
    stopLabel: (n: number, total: number) => `Parada ${n} de ${total}`,
    offerTitle: 'Beneficio del locatario',
    offerBody: 'Aquí la tienda publica su cupón o promoción del día desde el CMS del mall.',
    save: 'Guardar y seguir',
    skip: 'Seguir',
    passing: 'Al paso',
    eventLabel: 'Evento',
    doneTitle: 'Recorrido completo',
    doneMessage: (saved: number, seen: number) => `Guardaste ${saved} cupones y pasaste por ${seen} tiendas con beneficios.`,
    doneNone: 'Tus cupones guardados aparecen aquí.',
    mallNote: 'Para el mall: cada parada y cada «al paso» es una impresión medible por locatario.',
    startOver: 'Elegir otra ruta',
    youAreHere: 'Estás aquí',
    loadErrorTitle: 'No se pudo cargar el mapa',
    loadErrorMessage: 'Revisa tu conexión y vuelve a cargar la página.',
    credit: 'Mapa demo y SDK de Mappedin · hecho por Felipe Chavarri',
    disclaimer: 'Demo ilustrativa. Las marcas y logos pertenecen a sus dueños, que no participan ni respaldan esta página.',
    switchTo: 'EN',
    // «¡Atrápame si puedes!»
    gameName: '¡Atrápame si puedes!',
    gameToggle: 'Jugar «¡Atrápame si puedes!»',
    gameToggleHint: 'Kinti, la mascota de Atlas Kinetix, aparece en tu ruta y se esconde en una tienda. Atrápala para sumar puntos.',
    pts: 'pts',
    kintiAppears: 'Kinti apareció en tu ruta',
    kintiHides: (store: string) => `¡Me escondí en ${store}… atrápame si puedes!`,
    kintiNear: 'Llegaste a tiempo',
    timer: (s: number) => `${s} s`,
    catchPrompt: '¡Tócala antes de que se escape!',
    caught: '¡Atrapada!',
    escaped: 'Se escapó…',
    hidTitle: (store: string) => `Kinti se metió en ${store}`,
    hidMessage: 'Solo se atrapa desde adentro: entra a la tienda para encontrarla.',
    enterStore: 'Entrar a la tienda',
    skipStore: 'Seguir sin entrar',
    insideTitle: '¡Entraste! Kinti está aquí',
    insideMessage: 'Confirma tu visita con el QR de la tienda. En un mall real va al fondo del local, junto a un exhibidor.',
    scanQr: 'Escanear el QR',
    qrCaption: 'QR de la tienda (simulado)',
    kintiCouponTitle: 'Cupón Kinti · solo hoy',
    kintiCouponBody: (store: string) => `Exclusivo por entrar a ${store}: válido hoy y solo en esta tienda. Aquí iría la promoción del locatario.`,
    kintiCouponDone: 'Cupón Kinti',
    albumTitle: 'Álbum de Kinti',
    albumHint: (have: number, total: number) => `${have} de ${total} variantes · tus puntos se guardan solo en este navegador`,
    albumReset: 'Reiniciar',
    close: 'Cerrar',
    unlockTitle: 'Beneficio desbloqueado',
    lockedTitle: (missing: number) => `Te faltan ${missing} pts para un beneficio`,
    unlockBody: 'El mall define qué se canjea con los puntos: un cupón de una tienda, estacionamiento o una experiencia (ilustrativo).',
    gameDone: (caught: number, total: number, pts: number) => `Atrapaste ${caught} de ${total} Kintis y sumaste ${pts} pts.`,
    panelButton: 'Panel del mall',
    panelTitle: 'Panel del mall · esta sesión',
    panelNote: 'En producción estos datos se agregan por tienda, zona y hora: así se cobra el auspicio por visita y se lleva gente a las zonas frías.',
    kpiSpawns: 'Apariciones',
    kpiCaught: 'Capturas',
    kpiVisits: 'Visitas a tienda',
    kpiCoupons: 'Cupones',
    visitsBy: 'Visitas generadas por Kinti',
    noVisits: 'Ninguna todavía: entra a la tienda donde se esconde Kinti.',
    back: 'Volver',
  },
  en: {
    appName: 'Theme trails',
    subtitle: 'Branded mall trails demo · Mappedin JS',
    stepChoose: '1 · Choose',
    stepWalk: '2 · Walk',
    stepDone: '3 · Your coupons',
    loading: 'Loading map…',
    chooseTitle: 'What are you in the mood for?',
    chooseMessage: 'Pick a trail and the map walks you through its stores. You start at the information desk; tap the map to change it.',
    routeMessage: (stops: number, m: number, min: number) => `${stops} stores · ${m} m · about ${min} min walking`,
    noRoute: 'No route from this point. Tap another spot in the corridor.',
    start: 'Start the trail',
    reorderHint: 'Drag the stores to change the order of the stops.',
    otherTrail: 'Another trail',
    walkingTitle: 'On the way…',
    walkingMessage: (next: string) => `Next stop: ${next}. Simulated Blue Dot.`,
    stop: 'Stop',
    stopLabel: (n: number, total: number) => `Stop ${n} of ${total}`,
    offerTitle: "Tenant's offer",
    offerBody: "This is where the store posts today's coupon or promotion from the mall's CMS.",
    save: 'Save and continue',
    skip: 'Continue',
    passing: 'Passing by',
    eventLabel: 'Event',
    doneTitle: 'Trail complete',
    doneMessage: (saved: number, seen: number) => `You saved ${saved} coupons and passed ${seen} stores with offers.`,
    doneNone: 'Your saved coupons show up here.',
    mallNote: 'For the mall: every stop and every pass-by is a measurable impression per tenant.',
    startOver: 'Choose another trail',
    youAreHere: 'You are here',
    loadErrorTitle: 'The map could not load',
    loadErrorMessage: 'Check your connection and reload the page.',
    credit: 'Demo map and SDK by Mappedin · built by Felipe Chavarri',
    disclaimer: 'Illustrative demo. Brands and logos belong to their owners, who do not take part in or endorse this page.',
    switchTo: 'ES',
    gameName: 'Catch me if you can!',
    gameToggle: 'Play "Catch me if you can!"',
    gameToggleHint: "Kinti, Atlas Kinetix's mascot, shows up on your trail and hides in a store. Catch her to earn points.",
    pts: 'pts',
    kintiAppears: 'Kinti showed up on your trail',
    kintiHides: (store: string) => `I'm hiding in ${store}… catch me if you can!`,
    kintiNear: 'You made it in time',
    timer: (s: number) => `${s} s`,
    catchPrompt: 'Tap her before she gets away!',
    caught: 'Caught!',
    escaped: 'She got away…',
    hidTitle: (store: string) => `Kinti flew into ${store}`,
    hidMessage: 'She can only be caught from inside: walk into the store to find her.',
    enterStore: 'Walk into the store',
    skipStore: 'Keep going',
    insideTitle: "You're in! Kinti is here",
    insideMessage: "Confirm the visit with the store's QR code. In a real mall it sits at the back of the store, next to a display.",
    scanQr: 'Scan the QR code',
    qrCaption: 'Store QR code (simulated)',
    kintiCouponTitle: 'Kinti coupon · today only',
    kintiCouponBody: (store: string) => `For walking into ${store}: valid today and only in this store. The tenant's promotion would go here.`,
    kintiCouponDone: 'Kinti coupon',
    albumTitle: "Kinti's album",
    albumHint: (have: number, total: number) => `${have} of ${total} variants · your points are kept in this browser only`,
    albumReset: 'Reset',
    close: 'Close',
    unlockTitle: 'Reward unlocked',
    lockedTitle: (missing: number) => `${missing} pts to go for a reward`,
    unlockBody: 'The mall decides what points are redeemed for: a store coupon, parking or an experience (illustrative).',
    gameDone: (caught: number, total: number, pts: number) => `You caught ${caught} of ${total} Kintis and earned ${pts} pts.`,
    panelButton: 'Mall dashboard',
    panelTitle: 'Mall dashboard · this session',
    panelNote: 'In production this data adds up by store, zone and hour: that is how a mall sells sponsored visits and moves people to quiet zones.',
    kpiSpawns: 'Appearances',
    kpiCaught: 'Catches',
    kpiVisits: 'Store visits',
    kpiCoupons: 'Coupons',
    visitsBy: 'Visits driven by Kinti',
    noVisits: 'None yet: walk into the store where Kinti hides.',
    back: 'Back',
  },
};

// Spanish by default; ?lang=en or a saved choice switch to English.
function detect(): Lang {
  const param = new URLSearchParams(location.search).get('lang');
  if (param === 'es' || param === 'en') return param;
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    // Storage can be blocked; Spanish is the default.
  }
  return 'es';
}

export const lang: Lang = detect();
export const t = strings[lang];

export function switchLang() {
  const next: Lang = lang === 'es' ? 'en' : 'es';
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {
    // Without storage the URL parameter below still carries the choice.
  }
  const url = new URL(location.href);
  url.searchParams.set('lang', next);
  location.href = url.toString();
}
