// «¡Atrápame si puedes!»: Kinti, the hummingbird mascot of Atlas Kinetix, shows up along the
// trail and hides inside one of its stores. Catching her earns points and fills an
// album. The demo keeps points and album in the browser only (no sign-up).

import { lang, t } from './i18n';

type Text = { es: string; en: string };

export type Variant = {
  id: string;
  name: Text;
  // Accessory drawn next to her, so each trail has its own Kinti.
  extra: string;
  body: string;
  wing: string;
  points: number;
};

export const classic: Variant = { id: 'clasica', name: { es: 'Kinti clásica', en: 'Classic Kinti' }, extra: '', body: '#12b886', wing: '#087f5b', points: 10 };
export const golden: Variant = { id: 'dorada', name: { es: 'Kinti dorada', en: 'Golden Kinti' }, extra: '✨', body: '#fcc419', wing: '#e67700', points: 50 };

// One variant per trail id (see src/brands.ts).
const trailVariants: Record<string, Variant> = {
  sabores: { id: 'aji', name: { es: 'Kinti ají', en: 'Chili Kinti' }, extra: '🌶️', body: '#ff6b6b', wing: '#c92a2a', points: 20 },
  belleza: { id: 'glam', name: { es: 'Kinti glam', en: 'Glam Kinti' }, extra: '🎀', body: '#f783ac', wing: '#c2255c', points: 20 },
  gamer: { id: 'gamer', name: { es: 'Kinti gamer', en: 'Gamer Kinti' }, extra: '🎧', body: '#9775fa', wing: '#5f3dc4', points: 20 },
  moda: { id: 'chalina', name: { es: 'Kinti con chalina', en: 'Scarf Kinti' }, extra: '🧣', body: '#3bc9db', wing: '#0b7285', points: 20 },
  hogar: { id: 'maestra', name: { es: 'Kinti maestra de obra', en: 'Builder Kinti' }, extra: '🔨', body: '#69db7c', wing: '#2b8a3e', points: 20 },
  cafe: { id: 'barista', name: { es: 'Kinti barista', en: 'Barista Kinti' }, extra: '☕', body: '#d9a066', wing: '#8a5a2b', points: 20 },
};

export const variantFor = (trailId: string) => trailVariants[trailId] ?? classic;
export const allVariants = [classic, ...Object.values(trailVariants), golden];

// Points needed to unlock the mall's (illustrative) reward.
export const UNLOCK_POINTS = 50;

export function kintiSvg(v: Variant, size = 56) {
  return `<span class="kinti" style="--k1:${v.body};--k2:${v.wing};width:${size}px;height:${size}px;font-size:${size}px">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M16 40 L3 52 L8 40 L1 35 L15 34 Z" fill="var(--k2)"/>
      <ellipse cx="27" cy="37" rx="14" ry="9.5" fill="var(--k1)" transform="rotate(-24 27 37)"/>
      <path d="M22 44 Q29 47 35 40" stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="39" cy="24" r="9.5" fill="var(--k1)"/>
      <path d="M36 30 Q40 34 45 29" fill="#e03131"/>
      <path d="M47.5 22 L63 19.5 L47.5 25.5 Z" fill="#343a40"/>
      <g class="wing"><ellipse cx="25" cy="27" rx="12" ry="5.2" fill="var(--k2)" transform="rotate(-55 25 27)"/></g>
      <circle cx="42" cy="22" r="2.6" fill="#fff"/><circle cx="42.6" cy="22.2" r="1.5" fill="#0b1220"/>
    </svg>
    ${v.extra ? `<i>${v.extra}</i>` : ''}
  </span>`;
}

// --- Points and album (browser only) -------------------------------------------

const STORE_KEY = 'rutas-tematicas:kinti';
type Saved = { points: number; album: string[] };

function load(): Saved {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) ?? '');
    if (typeof raw?.points === 'number' && Array.isArray(raw.album)) return raw;
  } catch {
    // Nothing saved yet, or storage is blocked: start from zero.
  }
  return { points: 0, album: [] };
}

const state = load();

function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Without storage the points last until the page reloads.
  }
}

export const points = () => state.points;
export const hasVariant = (v: Variant) => state.album.includes(v.id);

export function addCatch(v: Variant) {
  state.points += v.points;
  if (!state.album.includes(v.id)) state.album.push(v.id);
  persist();
}

export function resetGame() {
  state.points = 0;
  state.album = [];
  persist();
}

// --- Catch mini-game ------------------------------------------------------------

const CATCH_MS = 6000;
const HOP_MS = 850;
let cancelCurrent: (() => void) | undefined;

// Ends a catch in progress (the walk was stopped or reset).
export const cancelCatch = () => cancelCurrent?.();

// Kinti flutters around the screen; one tap before the time runs out catches her.
export function catchKinti(v: Variant): Promise<boolean> {
  cancelCatch();
  return new Promise((resolve) => {
    const layer = document.createElement('div');
    layer.className = 'catch-layer';
    layer.innerHTML = `
      <div class="catch-head">
        <strong>${t.catchPrompt}</strong>
        <small>${v.name[lang]} · +${v.points} ${t.pts}</small>
        <span class="catch-bar"><span></span></span>
      </div>
      <button class="catch-target" type="button" aria-label="${v.name[lang]}">${kintiSvg(v, 84)}</button>`;
    document.body.append(layer);
    const target = layer.querySelector<HTMLButtonElement>('.catch-target')!;
    const bar = layer.querySelector<HTMLElement>('.catch-bar span')!;
    bar.style.animationDuration = `${CATCH_MS}ms`;

    const hop = () => {
      target.style.left = `${12 + Math.random() * 62}%`;
      target.style.top = `${24 + Math.random() * 34}%`;
      target.classList.toggle('flip', Math.random() < 0.5);
    };
    hop();
    const hops = setInterval(hop, HOP_MS);

    let done = false;
    const finish = (caught: boolean, delay: number) => {
      if (done) return;
      done = true;
      cancelCurrent = undefined;
      clearInterval(hops);
      clearTimeout(timeout);
      layer.classList.add(caught ? 'caught' : 'escaped');
      layer.querySelector('.catch-head strong')!.textContent = caught ? t.caught : t.escaped;
      if (caught) target.insertAdjacentHTML('beforeend', `<b class="plus">+${v.points}</b>`);
      setTimeout(() => {
        layer.remove();
        resolve(caught);
      }, delay);
    };
    const timeout = setTimeout(() => finish(false, 900), CATCH_MS);
    target.addEventListener('pointerdown', () => finish(true, 900));
    cancelCurrent = () => finish(false, 0);
  });
}

// --- Album ----------------------------------------------------------------------

export function openAlbum(onChange: () => void) {
  const layer = document.createElement('div');
  layer.className = 'album-layer';
  const draw = () => {
    const unlocked = state.points >= UNLOCK_POINTS;
    layer.innerHTML = `
      <div class="album" role="dialog" aria-label="${t.albumTitle}">
        <div class="album-head">
          <div><strong>${t.albumTitle}</strong><small>${t.albumHint(state.album.length, allVariants.length)}</small></div>
          <span class="score big">${kintiSvg(classic, 22)}${state.points} ${t.pts}</span>
        </div>
        <div class="album-grid">${allVariants
          .map(
            (v) => `<div class="album-card ${hasVariant(v) ? '' : 'missing'}">${kintiSvg(v, 48)}<small>${
              hasVariant(v) ? v.name[lang] : '¿?'
            }</small><b>+${v.points}</b></div>`,
          )
          .join('')}</div>
        <div class="reward ${unlocked ? '' : 'locked'}">
          <strong>${unlocked ? t.unlockTitle : t.lockedTitle(UNLOCK_POINTS - state.points)}</strong>
          <span>${t.unlockBody}</span>
        </div>
        <div class="actions">
          <button class="primary" data-close>${t.close}</button>
          <button data-reset>${t.albumReset}</button>
        </div>
      </div>`;
    layer.querySelector('[data-close]')!.addEventListener('click', () => layer.remove());
    layer.querySelector('[data-reset]')!.addEventListener('click', () => {
      resetGame();
      onChange();
      draw();
    });
  };
  layer.addEventListener('click', (e) => {
    if (e.target === layer) layer.remove();
  });
  draw();
  document.body.append(layer);
}
