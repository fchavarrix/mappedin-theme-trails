# Theme Trails · Rutas temáticas

A mall wayfinding demo built on [Mappedin JS](https://developer.mappedin.com/) and a simulated Blue Dot. The shopper picks a theme trail (food, beauty, gaming, made-in-Peru fashion, home, coffee), the map highlights the stores on that trail and walks them through each stop. At every stop a tenant offer card opens, and stores or mall events near the path pop up as "passing by" cards.

- Live (Spanish): https://theme-trails-demo.atlas-lac.com/
- Live (English): https://theme-trails-demo.atlas-lac.com/?lang=en

## What it shows

- **Trails as buyer journeys.** Each trail is a curated list of stores, routed in one go with `getDirectionsMultiDestination` and drawn as a multi-leg path.
- **Offers in the path, not in an app.** The walk pauses at each stop with the tenant's offer, and stores or events within a few metres of the route show up as the Blue Dot passes them.
- **Something the mall can measure.** Every stop and every pass-by is an impression per tenant, which is the basis for sponsored trails.
- **A reason to walk the trail.** The mascot game below turns impressions into store visits.

## Catch me if you can! (¡Atrápame si puedes!)

A game on top of the trails, on by default (`?game=0` turns it off). Kinti, the hummingbird mascot of Atlas Kinetix (*q'inti* is hummingbird in Quechua), shows up on the trail and hides inside one of its stores:

- **In the corridor.** Two Kintis appear on the map with a countdown, one classic and one dressed for the trail. When the Blue Dot reaches one, the walk waits and she flutters around the screen: one tap catches her.
- **Inside a store.** She flies into the trail's second stop and can only be caught from inside. The Blue Dot walks into the store, the shopper confirms the visit with the store's QR code (simulated) and gets a bonus coupon valid only there, that day. This turns an impression into a store visit.
- **Points and album.** Each catch adds points and a variant to an album (eight in all). Past a threshold, an illustrative mall reward unlocks. Points stay in the browser only; the album has a reset button.
- **Mall dashboard.** At the end, the session's appearances, catches, store visits and coupons, with the visits each store got from Kinti: the basis for selling sponsored visits and moving people to quiet zones.

In a real mall the catch inside a store would be confirmed by the indoor position inside the store's polygon plus a QR or NFC tag at the back of the store, because positioning error is largest at the door.

## Brands

The stores of Mappedin's public "Mall Demo - Consumer" map are relabelled with well-known Peruvian brands and their logos, as published on each brand's website. **This is an illustrative demo: the brands do not take part in or endorse it**, so the offer cards show where a tenant's coupon would go, never a real discount. Brands, trails and events live in [`src/brands.ts`](src/brands.ts); in a real deployment they would come from the mall's CMS.

## Run it

```bash
npm install
npm run dev
```

The public demo credentials from Mappedin's docs are in the code and only work with demo maps. Override them, or the map, with `VITE_MAPPEDIN_KEY`, `VITE_MAPPEDIN_SECRET` and `VITE_MAPPEDIN_MAP_ID` in a `.env` file, or load another map with `?map=<mapId>`.

Built by Felipe Chavarri. Companion to [Find My Car](https://github.com/fchavarrix/mappedin-find-my-car).
