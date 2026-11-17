export type Category =
  | 'Entradas'
  | 'Sándwiches'
  | 'Fondos'
  | 'Bebidas'
  | 'Postres';
export interface Dish {
  id: string;
  category: Category;
  name: string;
  description: string;
  /** English subtitle: the Chilean name is kept. */
  en: string;
  price: number;
  soldOut?: boolean;
  extras?: Extra[];
}
/** Optional extra of a dish, with its price per unit. */
export interface Extra {
  id: string;
  name: string;
  en: string;
  price: number;
}
const sandwichExtras: Extra[] = [
  { id: 'palta', name: 'Palta', en: 'Avocado', price: 1200 },
  { id: 'queso', name: 'Queso', en: 'Cheese', price: 900 },
  { id: 'tomate', name: 'Tomate', en: 'Tomato', price: 600 },
  { id: 'huevo', name: 'Huevo frito', en: 'Fried egg', price: 1000 },
  { id: 'tocino', name: 'Tocino', en: 'Bacon', price: 1300 },
];
export const categories: Category[] = [
  'Entradas',
  'Sándwiches',
  'Fondos',
  'Bebidas',
  'Postres',
];
export const dishes: Dish[] = [
  {
    id: 'empanada',
    category: 'Entradas',
    name: 'Empanada de pino',
    description:
      'Horneada, rellena de carne picada a cuchillo, cebolla, huevo duro, aceituna y pasas.',
    en: 'Baked beef empanada — hand-cut beef, onion, hard-boiled egg, olive and raisins.',
    price: 2900,
  },
  {
    id: 'papas',
    category: 'Entradas',
    name: 'Papas fritas',
    description:
      'Porción de papas cortadas a mano, fritas dos veces, con sal de mar y mayonesa casera.',
    en: 'Fries — hand-cut, double-fried, with sea salt and homemade mayo.',
    price: 3500,
    extras: [
      {
        id: 'cheddar',
        name: 'Queso cheddar',
        en: 'Cheddar cheese',
        price: 1500,
      },
      { id: 'huevo', name: 'Huevo frito', en: 'Fried egg', price: 1000 },
    ],
  },
  {
    id: 'ensalada',
    category: 'Entradas',
    name: 'Ensalada chilena',
    description:
      'Tomate y cebolla pluma amortiguada, con cilantro fresco y aceite de oliva.',
    en: 'Chilean salad — tomato and mellowed onion with fresh cilantro and olive oil.',
    price: 2900,
  },
  {
    id: 'chacarero',
    category: 'Sándwiches',
    name: 'Chacarero',
    description:
      'Churrasco de vacuno, porotos verdes, tomate y ají verde en pan frica.',
    en: 'Steak sandwich with green beans, tomato and green chili on a soft round bun.',
    price: 6900,
    extras: sandwichExtras,
  },
  {
    id: 'barros-luco',
    category: 'Sándwiches',
    name: 'Barros Luco',
    description:
      'Churrasco de vacuno con queso mantecoso derretido en marraqueta tostada.',
    en: 'Steak and melted cheese on toasted Chilean bread.',
    price: 6400,
    extras: sandwichExtras,
  },
  {
    id: 'italiano',
    category: 'Sándwiches',
    name: 'Italiano',
    description:
      'Lomito de cerdo con palta, tomate y mayonesa casera; los colores de la bandera italiana.',
    en: 'Pulled pork with avocado, tomato and homemade mayo — the Italian flag colors.',
    price: 6200,
    extras: sandwichExtras,
  },
  {
    id: 'chemilico',
    category: 'Sándwiches',
    name: 'Chemilico',
    description:
      'Churrasco con huevo frito y cebolla caramelizada en pan amasado.',
    en: 'Steak, fried egg and caramelized onion on country bread.',
    price: 6600,
    soldOut: true,
    extras: sandwichExtras,
  },
  {
    id: 'pastel',
    category: 'Fondos',
    name: 'Pastel de choclo',
    description:
      'Pino de vacuno y pollo bajo pastelera de choclo con albahaca, gratinado en greda.',
    en: 'Corn pie — beef and chicken under sweet corn and basil, baked in clay.',
    price: 9400,
  },
  {
    id: 'cazuela',
    category: 'Fondos',
    name: 'Cazuela de vacuno',
    description: 'Caldo casero con osobuco, zapallo, papa, choclo y arroz.',
    en: 'Beef stew — homemade broth with shank, squash, potato, corn and rice.',
    price: 8400,
  },
  {
    id: 'lomo',
    category: 'Fondos',
    name: 'Lomo a lo pobre',
    description:
      'Lomo vetado a la plancha con papas fritas, cebolla frita y dos huevos.',
    en: 'Grilled steak with fries, fried onions and two eggs.',
    price: 13400,
    extras: [
      { id: 'huevo', name: 'Huevo extra', en: 'Extra egg', price: 1000 },
    ],
  },
  {
    id: 'porotos',
    category: 'Fondos',
    name: 'Porotos granados',
    description:
      'Porotos frescos con zapallo, choclo y albahaca; plato de verano.',
    en: 'Fresh bean stew with squash, corn and basil — a summer classic.',
    price: 7400,
  },
  {
    id: 'mote',
    category: 'Bebidas',
    name: 'Mote con huesillo',
    description:
      'Néctar de durazno deshidratado con mote de trigo, bien helado.',
    en: 'Peach nectar with dried peaches and husked wheat, served cold.',
    price: 2500,
  },
  {
    id: 'cerveza',
    category: 'Bebidas',
    name: 'Cerveza de la casa',
    description: 'Lager artesanal de barril, 500 ml.',
    en: 'House lager, draft, 500 ml.',
    price: 3900,
  },
  {
    id: 'jugo',
    category: 'Bebidas',
    name: 'Jugo natural',
    description: 'Frambuesa, frutilla o mango, recién exprimido.',
    en: 'Fresh juice — raspberry, strawberry or mango.',
    price: 2900,
  },
  {
    id: 'pisco',
    category: 'Bebidas',
    name: 'Pisco sour',
    description: 'Pisco, limón de Pica y jarabe de goma, batido con clara.',
    en: 'Pisco sour — pisco, Pica lime and syrup, shaken with egg white.',
    price: 4900,
  },
  {
    id: 'helado',
    category: 'Postres',
    name: 'Helado triple',
    description: 'Tres bolas de lúcuma, chocolate y frutilla.',
    en: 'Triple scoop — lucuma, chocolate and strawberry.',
    price: 3900,
  },
  {
    id: 'leche',
    category: 'Postres',
    name: 'Leche asada',
    description: 'Receta de la abuela, con caramelo tostado.',
    en: 'Chilean baked custard with dark caramel.',
    price: 2900,
  },
  {
    id: 'sopaipillas',
    category: 'Postres',
    name: 'Sopaipillas pasadas',
    description:
      'Sopaipillas de zapallo bañadas en chancaca con canela y cáscara de naranja.',
    en: 'Pumpkin fritters soaked in warm cane-sugar syrup with cinnamon and orange.',
    price: 3500,
  },
];
