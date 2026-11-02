import {
  getMapData,
  show3dMap,
  type Coordinate,
  type Directions,
  type MapData,
  type MapView,
  type Space,
} from '@mappedin/mappedin-js';
import { BlueDot } from '@mappedin/blue-dot';
import Sortable from 'sortablejs';
import '@mappedin/mappedin-js/lib/index.css';
import './style.css';
import { lang, switchLang, t } from './i18n';
import { brands, events, trails, type Brand, type MallEvent, type Trail } from './brands';

// Public demo credentials from Mappedin's developer docs (they only work with demo maps).
// Default map: Mappedin's "Mall Demo - Consumer". Store names in src/brands.ts match that map.
const MAP_OPTIONS = {
  key: import.meta.env.VITE_MAPPEDIN_KEY ?? 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: import.meta.env.VITE_MAPPEDIN_SECRET ?? 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
  mapId: new URLSearchParams(location.search).get('map') ?? import.meta.env.VITE_MAPPEDIN_MAP_ID ?? '660c0c6e7c0c4fe5b4cc484c',
};

const START_STORE = 'Mall Reception';
// Simulated walking speed in metres per second (about 2x a normal pace, so the demo is short).
const WALK_SPEED = 3;
// How close the walk must pass a store (or an event) for its "passing by" card to show.
const PASS_BY_METRES = 13;
const TOAST_MS = 3200;

type Mode = 'choose' | 'ready' | 'walking' | 'stop' | 'done';
// Stores are spaces; some places in the demo map (the food court) are only a point.
type Place = { space?: Space; center: Coordinate };

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const ui = {
  title: $('title'),
  message: $('message'),
  body: $('body'),
  actions: $('actions'),
  steps: $('steps'),
  toasts: $('toasts'),
};

let mapData: MapData;
let mapView: MapView;
let blueDot: BlueDot;
let mode: Mode = 'choose';
let start: Coordinate | undefined;
let trail: Trail | undefined;
let stops: Brand[] = [];
let legs: Directions[] = [];
let walkToken = 0;
let stopIndex = 0;
let resumeStop: (() => void) | undefined;
const saved = new Set<string>();
const seen = new Set<string>();
const places = new Map<string, Place>();
const baseColors = new Map<string, string>();

const logoUrl = (brand: Brand) => `${import.meta.env.BASE_URL}logos/${brand.logo}`;
const brandById = (id: string) => brands.find((b) => b.id === id)!;
const placed = (brand: Brand) => !!places.get(brand.store)?.space;

function metres(a: Coordinate, b: Coordinate) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function placeBlueDot(coordinate: Coordinate) {
  // `update` sets the position directly. In production this would come from an IPS
  // (Wi-Fi/BLE, VPS) through `reportPosition`, blended with the device sensors.
  // The walk already interpolates between points, so the SDK animation is turned off.
  blueDot.update(
    { latitude: coordinate.latitude, longitude: coordinate.longitude, accuracy: 2, floorOrFloorId: coordinate.floorId },
    { animate: false },
  );
}

function button(label: string, onClick: () => void, primary = false) {
  const b = document.createElement('button');
  b.textContent = label;
  if (primary) b.className = 'primary';
  b.addEventListener('click', onClick);
  return b;
}

function badge(brand: Brand, size = '') {
  return `<span class="badge ${size} ${brand.dark ? 'dark' : ''}"><img src="${logoUrl(brand)}" alt="${brand.name}" /></span>`;
}

function el(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstElementChild as HTMLElement;
}

// --- Map decoration -------------------------------------------------------

// Every brand gets a logo pin; the stops of the chosen trail get a numbered, coloured one.
function drawPins() {
  mapView.Markers.removeAll();
  for (const brand of brands.filter(placed)) {
    const index = stops.indexOf(brand);
    const html =
      index >= 0
        ? `<div class="pin stop" style="--c:${trail!.color}">${badge(brand)}<b>${index + 1}</b></div>`
        : `<div class="pin">${badge(brand, 'small')}</div>`;
    mapView.Markers.add(places.get(brand.store)!.center, html, { rank: index >= 0 ? 'always-visible' : 'high' });
  }
  for (const event of events) {
    const place = places.get(event.store);
    if (place) mapView.Markers.add(place.center, '<div class="pin event">★</div>', { rank: 'medium' });
  }
}

function paintStores() {
  for (const [store, place] of places) {
    const stop = stops.find((b) => b.store === store);
    if (!place.space) continue;
    const color = stop ? trail!.color : baseColors.get(place.space.id);
    if (color) mapView.updateState(place.space, { color });
  }
}

// --- Routing --------------------------------------------------------------

// A tap can land outside the walkable area (a wall, inside a counter). Then there is
// no route, so try the closest spaces instead.
function candidates(coordinate: Coordinate) {
  const nearest = [...places.values()]
    .map((p) => ({ p, d: metres(coordinate, p.center) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map(({ p }) => p.center);
  return [coordinate, ...nearest];
}

async function route() {
  if (!start || !trail) return;
  mapView.Navigation.clear();
  legs = [];
  for (const from of candidates(start)) {
    const found = await mapData.getDirectionsMultiDestination(from, stops.map((b) => places.get(b.store)!.space!));
    if (found?.length) {
      legs = found;
      start = found[0].coordinates[0];
      break;
    }
  }
  placeBlueDot(start);
  drawPins();
  paintStores();
  if (legs.length) {
    // Not awaited: the path animates in while the sheet already shows the stops.
    void mapView.Navigation.draw(legs, {
      pathOptions: { color: trail.color, width: 1.1, displayArrowsOnPath: true },
      inactivePathOptions: { color: trail.color, width: 0.8 },
      createMarkers: { departure: false, destination: false, connection: false },
    });
    setMode('ready');
    focusTrail();
    return;
  }
  setMode('ready');
}

// Frame the whole walk, from where the shopper stands to the last stop.
function focusTrail() {
  mapView.Camera.focusOn(legs.flatMap((d) => d.coordinates), { duration: 600 });
}

// --- Walk -----------------------------------------------------------------

function toast(html: string) {
  const item = el(`<div class="toast">${html}</div>`);
  ui.toasts.prepend(item);
  setTimeout(() => item.classList.add('out'), TOAST_MS);
  setTimeout(() => item.remove(), TOAST_MS + 400);
}

function passBy(here: Coordinate, shown: Set<string>) {
  for (const brand of brands) {
    if (shown.has(brand.id) || stops.includes(brand) || !placed(brand)) continue;
    if (metres(here, places.get(brand.store)!.center) > PASS_BY_METRES) continue;
    shown.add(brand.id);
    seen.add(brand.id);
    toast(`${badge(brand, 'small')}<div><small>${t.passing} · ${brand.category[lang]}</small><strong>${brand.name}</strong><span>${t.offerTitle}</span></div>`);
  }
  for (const event of events) {
    const place = places.get(event.store);
    if (!place || shown.has(event.id) || metres(here, place.center) > PASS_BY_METRES) continue;
    shown.add(event.id);
    toast(`<span class="badge small event">★</span><div><small>${t.eventLabel} · ${event.when[lang]}</small><strong>${event.title[lang]}</strong></div>`);
  }
}

// Walks the Blue Dot leg by leg. At each stop the walk waits for the shopper,
// as it would in the real app while they look at the offer.
async function walk() {
  if (!legs.length) return;
  const token = ++walkToken;
  const shown = new Set<string>();
  setMode('walking');
  blueDot.follow('position-only', { zoomLevel: 19 });

  for (let leg = 0; leg < legs.length; leg++) {
    stopIndex = leg;
    mapView.Navigation.setActivePathByIndex(leg);
    render();
    const points = legs[leg].coordinates;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const duration = (metres(a, b) / WALK_SPEED) * 1000;
      const t0 = performance.now();
      while (true) {
        if (token !== walkToken) return;
        const k = Math.min(1, (performance.now() - t0) / Math.max(duration, 1));
        const here = mapView.createCoordinate({
          latitude: a.latitude + (b.latitude - a.latitude) * k,
          longitude: a.longitude + (b.longitude - a.longitude) * k,
          floorId: b.floorId,
        });
        placeBlueDot(here);
        passBy(here, shown);
        if (k >= 1) break;
        await sleep(80);
      }
    }
    if (token !== walkToken) return;
    seen.add(stops[leg].id);
    await new Promise<void>((resolve) => {
      resumeStop = resolve;
      setMode('stop');
    });
    if (token !== walkToken) return;
    setMode('walking');
  }

  blueDot.follow(false);
  setMode('done');
  focusTrail();
}

function continueWalk(save: boolean) {
  if (save) saved.add(stops[stopIndex].id);
  const resume = resumeStop;
  resumeStop = undefined;
  resume?.();
}

function stopWalk() {
  walkToken++;
  resumeStop = undefined;
  blueDot.follow(false);
  if (start) placeBlueDot(start);
  setMode('ready');
}

// --- Sheet ----------------------------------------------------------------

// Stops start in the trail's curated order, like a buyer journey (dessert comes last).
async function chooseTrail(item: Trail) {
  trail = item;
  stops = item.stops.map(brandById).filter(placed);
  await route();
}

function trailCard(item: Trail) {
  const logos = item.stops.map(brandById).filter(placed).map((b) => badge(b, 'small')).join('');
  const card = el(
    `<button class="trail ${item === trail ? 'selected' : ''}" style="--c:${item.color}">
      <span class="emoji">${item.emoji}</span>
      <span class="text"><strong>${item.name[lang]}</strong><small>${item.pitch[lang]}</small><span class="logos">${logos}</span></span>
    </button>`,
  );
  card.addEventListener('click', () => chooseTrail(item));
  return card;
}

function stopList() {
  return el(
    `<ol class="stops">${stops
      .map(
        (b, i) =>
          `<li data-id="${b.id}">
            <b style="background:${trail!.color}">${i + 1}</b>${badge(b, 'small')}<span><strong>${b.name}</strong><small>${b.category[lang]}</small></span>
          </li>`,
      )
      .join('')}</ol>`,
  );
}

// The shopper can drag the stops into their own order; the route follows it.
function sortableStops(list: HTMLElement) {
  Sortable.create(list, {
    animation: 150,
    // Pointer-based dragging behaves the same with a mouse and a finger.
    forceFallback: true,
    fallbackTolerance: 3,
    delay: 120,
    delayOnTouchOnly: true,
    ghostClass: 'ghost',
    chosenClass: 'chosen',
    onEnd: async ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) return;
      stops = [...list.querySelectorAll<HTMLElement>('li')].map((li) => brandById(li.dataset.id!));
      await route();
    },
  });
}

function render() {
  const order = ['choose', 'walk', 'done'];
  const current = mode === 'choose' || mode === 'ready' ? 'choose' : mode === 'done' ? 'done' : 'walk';
  ui.steps.querySelectorAll('span').forEach((s) => {
    const step = s.dataset.step!;
    s.className = step === current ? 'active' : order.indexOf(step) < order.indexOf(current) ? 'done' : '';
  });

  ui.actions.replaceChildren();
  ui.body.replaceChildren();
  ui.message.hidden = false;

  switch (mode) {
    case 'choose':
      ui.title.textContent = t.chooseTitle;
      ui.message.textContent = t.chooseMessage;
      ui.body.append(el('<div class="trails"></div>'));
      ui.body.firstElementChild!.append(...trails.map(trailCard));
      break;
    case 'ready': {
      const distance = legs.reduce((sum, d) => sum + d.distance, 0);
      ui.title.textContent = `${trail!.emoji} ${trail!.name[lang]}`;
      ui.message.textContent = legs.length
        ? t.routeMessage(stops.length, Math.round(distance), Math.max(1, Math.round(distance / 1.3 / 60)))
        : t.noRoute;
      ui.body.append(stopList());
      if (legs.length) {
        ui.body.append(el(`<p class="hint">${t.reorderHint}</p>`));
        sortableStops(ui.body.querySelector<HTMLElement>('.stops')!);
        ui.actions.append(button(t.start, walk, true));
      }
      ui.actions.append(button(t.otherTrail, resetAll));
      break;
    }
    case 'walking':
      ui.title.textContent = t.walkingTitle;
      ui.message.textContent = t.walkingMessage(stops[stopIndex].name);
      ui.actions.append(button(t.stop, stopWalk));
      break;
    case 'stop': {
      const brand = stops[stopIndex];
      ui.title.textContent = t.stopLabel(stopIndex + 1, stops.length);
      ui.message.hidden = true;
      ui.body.append(
        el(
          `<div class="offer" style="--c:${trail!.color}">
            ${badge(brand, 'large')}
            <div><strong>${brand.name}</strong><small>${brand.category[lang]}</small></div>
            <div class="coupon"><span>${t.offerTitle}</span><p>${t.offerBody}</p></div>
          </div>`,
        ),
      );
      ui.actions.append(button(t.save, () => continueWalk(true), true), button(t.skip, () => continueWalk(false)));
      break;
    }
    case 'done': {
      const kept = [...saved].map(brandById);
      ui.title.textContent = t.doneTitle;
      ui.message.textContent = t.doneMessage(saved.size, seen.size);
      ui.body.append(
        el(
          `<div class="saved">${
            kept.length
              ? kept.map((b) => `<div class="ticket">${badge(b, 'small')}<span><strong>${b.name}</strong><small>${t.offerTitle}</small></span></div>`).join('')
              : `<p>${t.doneNone}</p>`
          }<p class="note">${t.mallNote}</p></div>`,
        ),
      );
      ui.actions.append(button(t.startOver, resetAll, true));
      break;
    }
  }
  fitCamera();
}

// Keep the map's focus clear of the top bar and the bottom sheet.
function fitCamera() {
  if (!mapView) return;
  const sheet = $('sheet').getBoundingClientRect();
  // The side margins keep the logo pins at the ends of a trail on screen.
  mapView.Camera.setScreenOffsets({ top: 100, bottom: innerHeight - sheet.top + 24, left: 36, right: 36 });
}

function setMode(next: Mode) {
  mode = next;
  render();
}

function resetAll() {
  walkToken++;
  resumeStop = undefined;
  mapView.Navigation.clear();
  blueDot.follow(false);
  trail = undefined;
  stops = [];
  legs = [];
  saved.clear();
  seen.clear();
  drawPins();
  paintStores();
  if (start) placeBlueDot(start);
  setMode('choose');
  mapView.Camera.focusOn(mapView.currentFloor, { duration: 600 });
}

// --- Start ----------------------------------------------------------------

// Static labels; the sheet's dynamic text comes from render().
function applyStaticText() {
  document.documentElement.lang = lang;
  document.title = `${t.appName} · Mappedin demo`;
  $('app-name').textContent = t.appName;
  $('subtitle').textContent = t.subtitle;
  const labels: Record<string, string> = { choose: t.stepChoose, walk: t.stepWalk, done: t.stepDone };
  ui.steps.querySelectorAll('span').forEach((s) => (s.textContent = labels[s.dataset.step!]));
  ui.title.textContent = t.loading;
  $('credit').textContent = t.credit;
  $('disclaimer').textContent = t.disclaimer;
  const langButton = $<HTMLButtonElement>('lang');
  langButton.textContent = t.switchTo;
  langButton.addEventListener('click', switchLang);
}

async function init() {
  mapData = await getMapData(MAP_OPTIONS);
  mapView = await show3dMap($('map') as HTMLDivElement, mapData, { outdoorView: { enabled: false } });
  blueDot = new BlueDot(mapView);
  if (import.meta.env.DEV) Object.assign(window, { mapData, mapView, blueDot });
  blueDot.enable({ watchDevicePosition: false, color: '#2266ff', timeout: 600000 });

  // Stores are found by their name in the demo map, through its location profiles.
  for (const profile of mapData.getByType('location-profile')) {
    const space = profile.spaces[0];
    const center = space?.center ?? profile.points[0]?.coordinate;
    if (center && !places.has(profile.name)) places.set(profile.name, { space, center });
  }
  for (const space of mapData.getByType('space')) {
    if (space.name && !places.has(space.name)) places.set(space.name, { space, center: space.center });
  }
  for (const { space } of places.values()) {
    if (!space) continue;
    const color = mapView.getState(space)?.color;
    if (color) baseColors.set(space.id, color);
  }

  // The demo map's own store names (in English) would clash with the brands.
  mapView.Labels.removeAll();
  start = places.get(START_STORE)?.center ?? mapView.currentFloor.center;
  placeBlueDot(start);
  drawPins();

  mapView.on('click', async (e) => {
    if (mode !== 'choose' && mode !== 'ready') return;
    start = mapView.createCoordinate({
      latitude: e.coordinate.latitude,
      longitude: e.coordinate.longitude,
      floorId: e.floors?.[0]?.id ?? mapView.currentFloor.id,
    });
    placeBlueDot(start);
    if (trail) await route();
  });

  render();
  mapView.Camera.focusOn(mapView.currentFloor, { duration: 0 });

  // ?trail=<id> opens a trail directly, for example from a QR code in the mall.
  const linked = trails.find((item) => item.id === new URLSearchParams(location.search).get('trail'));
  if (linked) await chooseTrail(linked);
}

applyStaticText();
init().catch((err) => {
  console.error(err);
  ui.title.textContent = t.loadErrorTitle;
  ui.message.textContent = t.loadErrorMessage;
});
