# Theme Trails · Rutas temáticas

A mall wayfinding demo built on [Mappedin JS](https://developer.mappedin.com/) and a simulated Blue Dot. The shopper picks a theme trail (food, beauty, gaming, made-in-Peru fashion, home, coffee), the map highlights the stores on that trail and walks them through each stop. At every stop a tenant offer card opens, and stores or mall events near the path pop up as "passing by" cards.

- Live (Spanish): https://theme-trails-demo.atlas-lac.com/
- Live (English): https://theme-trails-demo.atlas-lac.com/?lang=en

## What it shows

- **Trails as buyer journeys.** Each trail is a curated list of stores, routed in one go with `getDirectionsMultiDestination` and drawn as a multi-leg path.
- **Offers in the path, not in an app.** The walk pauses at each stop with the tenant's offer, and stores or events within a few metres of the route show up as the Blue Dot passes them.
- **Something the mall can measure.** Every stop and every pass-by is an impression per tenant, which is the basis for sponsored trails.

## Brands

The stores of Mappedin's public "Mall Demo - Consumer" map are relabelled with well-known Peruvian brands and their logos, as published on each brand's website. **This is an illustrative demo: the brands do not take part in or endorse it**, so the offer cards show where a tenant's coupon would go, never a real discount. Brands, trails and events live in [`src/brands.ts`](src/brands.ts); in a real deployment they would come from the mall's CMS.

## Run it

```bash
npm install
npm run dev
```

The public demo credentials from Mappedin's docs are in the code and only work with demo maps. Override them, or the map, with `VITE_MAPPEDIN_KEY`, `VITE_MAPPEDIN_SECRET` and `VITE_MAPPEDIN_MAP_ID` in a `.env` file, or load another map with `?map=<mapId>`.

Built by Felipe Chavarri. Companion to [Find My Car](https://github.com/fchavarrix/mappedin-find-my-car).
