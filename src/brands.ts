// Peruvian brands placed on the stores of Mappedin's "Mall Demo - Consumer" map.
// Illustrative only: the brands do not take part in or endorse this demo, so the
// offer cards never show discounts or terms, just where a tenant's offer would go.
// In a real deployment this file would come from the mall's CMS.

type Text = { es: string; en: string };

export type Brand = {
  id: string;
  name: string;
  logo: string;
  // Name of the store in the demo map that this brand takes over.
  store: string;
  category: Text;
  // White logos need a dark badge.
  dark?: boolean;
};

export type Trail = {
  id: string;
  emoji: string;
  name: Text;
  pitch: Text;
  color: string;
  stops: string[];
};

export type MallEvent = {
  id: string;
  // Store or point in the demo map where the event happens.
  store: string;
  title: Text;
  when: Text;
};

export const brands: Brand[] = [
  { id: 'bembos', name: 'Bembos', logo: 'bembos.svg', store: "Bob's Burger Club", category: { es: 'Hamburguesas', en: 'Burgers' } },
  { id: 'pardos', name: 'Pardos Chicken', logo: 'pardos.png', store: 'Taco Tuesday', category: { es: 'Pollo a la brasa', en: 'Peruvian rotisserie chicken' } },
  { id: 'tanta', name: 'Tanta', logo: 'tanta.png', store: 'Mediterranean Tonite', category: { es: 'Cocina peruana', en: 'Peruvian cuisine' } },
  { id: 'rokys', name: "Roky's", logo: 'rokys.svg', store: 'Sun Restaurant', category: { es: 'Pollo a la brasa y parrillas', en: 'Rotisserie chicken and grill' } },
  { id: 'lalucha', name: 'La Lucha', logo: 'lalucha.svg', store: 'The Calzone Zone', category: { es: 'Sanguchería criolla', en: 'Peruvian sandwiches' }, dark: true },
  { id: 'chinawok', name: 'Chinawok', logo: 'chinawok.svg', store: 'The Korean BBQ Corner', category: { es: 'Chifa', en: 'Peruvian-Chinese food' } },
  { id: 'sanantonio', name: 'San Antonio', logo: 'sanantonio.png', store: "Lyn's Bakery", category: { es: 'Panadería y café', en: 'Bakery and café' } },
  { id: 'donmamino', name: 'Don Mamino', logo: 'donmamino.png', store: 'Pancake Stack', category: { es: 'Pastas, postres y café', en: 'Pasta, desserts and coffee' } },
  { id: 'helena', name: 'Helena Chocolatier', logo: 'helena.png', store: 'Confectionary Goods', category: { es: 'Chocolates', en: 'Chocolates' } },
  { id: 'esika', name: 'Ésika', logo: 'esika.png', store: 'Soap Stop', category: { es: 'Belleza y fragancias', en: 'Beauty and fragrances' } },
  { id: 'inkafarma', name: 'Inkafarma', logo: 'inkafarma.svg', store: 'Drug Store⚕️', category: { es: 'Farmacia y cuidado personal', en: 'Pharmacy and personal care' } },
  { id: 'platanitos', name: 'Platanitos', logo: 'platanitos.svg', store: 'Bead Boutique', category: { es: 'Calzado y accesorios', en: 'Shoes and accessories' } },
  { id: 'topitop', name: 'Topitop', logo: 'topitop.svg', store: 'Fill Your Closets👖', category: { es: 'Moda', en: 'Fashion' } },
  { id: 'kuna', name: 'Kuna', logo: 'kuna.svg', store: "Vanessa's Craft Store", category: { es: 'Alpaca y vicuña', en: 'Alpaca and vicuña' }, dark: true },
  { id: 'coolbox', name: 'Coolbox', logo: 'coolbox.png', store: 'Gamespot', category: { es: 'Tecnología y gaming', en: 'Tech and gaming' } },
  { id: 'hiraoka', name: 'Hiraoka', logo: 'hiraoka.png', store: 'Electronics Lab', category: { es: 'Electrónica', en: 'Electronics' } },
  { id: 'tailoy', name: 'Tai Loy', logo: 'tailoy.svg', store: 'Paper and Stationary', category: { es: 'Librería y útiles', en: 'Stationery' } },
  { id: 'promart', name: 'Promart', logo: 'promart.png', store: "Ron's Construction Depot 👷‍♂️", category: { es: 'Mejoramiento del hogar', en: 'Home improvement' } },
  { id: 'plazavea', name: 'Plaza Vea', logo: 'plazavea.png', store: 'Grocery Store', category: { es: 'Supermercado', en: 'Supermarket' } },
  { id: 'mass', name: 'Mass', logo: 'mass.webp', store: 'Discount Shop', category: { es: 'Tienda de barrio', en: 'Neighbourhood store' } },
];

export const trails: Trail[] = [
  {
    id: 'sabores',
    emoji: '🍗',
    name: { es: 'Ruta Sabores del Perú', en: 'Flavours of Peru trail' },
    pitch: { es: 'Para el que viene a comer: pollo a la brasa, cocina peruana, sánguches y chocolate de postre.', en: 'For the foodie: rotisserie chicken, Peruvian cuisine, sandwiches and chocolate for dessert.' },
    color: '#e4572e',
    stops: ['pardos', 'tanta', 'lalucha', 'helena'],
  },
  {
    id: 'belleza',
    emoji: '💄',
    name: { es: 'Ruta Belleza y cuidado', en: 'Beauty and self-care trail' },
    pitch: { es: 'Fragancias, cuidado personal y accesorios en un solo recorrido.', en: 'Fragrances, personal care and accessories in one walk.' },
    color: '#d6336c',
    stops: ['esika', 'inkafarma', 'platanitos'],
  },
  {
    id: 'gamer',
    emoji: '🎮',
    name: { es: 'Ruta Gamer y tecno', en: 'Gamer and tech trail' },
    pitch: { es: 'Consolas, electrónica y lo que falta para el setup.', en: 'Consoles, electronics and the rest of the setup.' },
    color: '#7048e8',
    stops: ['coolbox', 'hiraoka', 'tailoy'],
  },
  {
    id: 'moda',
    emoji: '🦙',
    name: { es: 'Ruta Moda hecha en Perú', en: 'Made in Peru fashion trail' },
    pitch: { es: 'Moda peruana, de lo diario a la alpaca.', en: 'Peruvian fashion, from everyday wear to alpaca.' },
    color: '#0c8599',
    stops: ['topitop', 'kuna', 'platanitos'],
  },
  {
    id: 'hogar',
    emoji: '🏠',
    name: { es: 'Ruta Hogar y despensa', en: 'Home and pantry trail' },
    pitch: { es: 'Para el que viene a resolver: mejoras para la casa y la compra de la semana.', en: 'For the errand run: home improvement and the weekly shop.' },
    color: '#2b8a3e',
    stops: ['promart', 'plazavea', 'mass'],
  },
  {
    id: 'cafe',
    emoji: '☕',
    name: { es: 'Ruta Café y algo dulce', en: 'Coffee and something sweet trail' },
    pitch: { es: 'Desayuno, café y chocolate para llevar.', en: 'Breakfast, coffee and chocolate to go.' },
    color: '#a0522d',
    stops: ['sanantonio', 'donmamino', 'helena'],
  },
];

// Events belong to the (fictional) demo mall, not to any brand.
export const events: MallEvent[] = [
  { id: 'musica', store: 'Food Court', title: { es: 'Música en vivo en el patio de comidas', en: 'Live music at the food court' }, when: { es: 'Ejemplo de evento del mall', en: 'Sample mall event' } },
  { id: 'taller', store: 'Mall Office', title: { es: 'Taller para niños', en: "Kids' workshop" }, when: { es: 'Ejemplo de evento del mall', en: 'Sample mall event' } },
];
