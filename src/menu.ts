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
  price: number;
  soldOut?: boolean;
  extras?: Extra[];
}
/** Agregado opcional de un plato, con su precio por unidad. */
export interface Extra {
  id: string;
  name: string;
  price: number;
}
const sandwichExtras: Extra[] = [
  { id: 'palta', name: 'Palta', price: 1200 },
  { id: 'queso', name: 'Queso', price: 900 },
  { id: 'tomate', name: 'Tomate', price: 600 },
  { id: 'huevo', name: 'Huevo frito', price: 1000 },
  { id: 'tocino', name: 'Tocino', price: 1300 },
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
    price: 2900,
  },
  {
    id: 'papas',
    category: 'Entradas',
    name: 'Papas fritas',
    description:
      'Porción de papas cortadas a mano, fritas dos veces, con sal de mar y mayonesa casera.',
    price: 3500,
    extras: [
      { id: 'cheddar', name: 'Queso cheddar', price: 1500 },
      { id: 'huevo', name: 'Huevo frito', price: 1000 },
    ],
  },
  {
    id: 'ensalada',
    category: 'Entradas',
    name: 'Ensalada chilena',
    description:
      'Tomate y cebolla pluma amortiguada, con cilantro fresco y aceite de oliva.',
    price: 2900,
  },
  {
    id: 'chacarero',
    category: 'Sándwiches',
    name: 'Chacarero',
    description:
      'Churrasco de vacuno, porotos verdes, tomate y ají verde en pan frica.',
    price: 6900,
    extras: sandwichExtras,
  },
  {
    id: 'barros-luco',
    category: 'Sándwiches',
    name: 'Barros Luco',
    description:
      'Churrasco de vacuno con queso mantecoso derretido en marraqueta tostada.',
    price: 6400,
    extras: sandwichExtras,
  },
  {
    id: 'italiano',
    category: 'Sándwiches',
    name: 'Italiano',
    description:
      'Lomito de cerdo con palta, tomate y mayonesa casera; los colores de la bandera italiana.',
    price: 6200,
    extras: sandwichExtras,
  },
  {
    id: 'chemilico',
    category: 'Sándwiches',
    name: 'Chemilico',
    description:
      'Churrasco con huevo frito y cebolla caramelizada en pan amasado.',
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
    price: 9400,
  },
  {
    id: 'cazuela',
    category: 'Fondos',
    name: 'Cazuela de vacuno',
    description: 'Caldo casero con osobuco, zapallo, papa, choclo y arroz.',
    price: 8400,
  },
  {
    id: 'lomo',
    category: 'Fondos',
    name: 'Lomo a lo pobre',
    description:
      'Lomo vetado a la plancha con papas fritas, cebolla frita y dos huevos.',
    price: 13400,
    extras: [{ id: 'huevo', name: 'Huevo extra', price: 1000 }],
  },
  {
    id: 'porotos',
    category: 'Fondos',
    name: 'Porotos granados',
    description:
      'Porotos frescos con zapallo, choclo y albahaca; plato de verano.',
    price: 7400,
  },
  {
    id: 'mote',
    category: 'Bebidas',
    name: 'Mote con huesillo',
    description:
      'Néctar de durazno deshidratado con mote de trigo, bien helado.',
    price: 2500,
  },
  {
    id: 'cerveza',
    category: 'Bebidas',
    name: 'Cerveza de la casa',
    description: 'Lager artesanal de barril, 500 ml.',
    price: 3900,
  },
  {
    id: 'jugo',
    category: 'Bebidas',
    name: 'Jugo natural',
    description: 'Frambuesa, frutilla o mango, recién exprimido.',
    price: 2900,
  },
  {
    id: 'pisco',
    category: 'Bebidas',
    name: 'Pisco sour',
    description: 'Pisco, limón de Pica y jarabe de goma, batido con clara.',
    price: 4900,
  },
  {
    id: 'helado',
    category: 'Postres',
    name: 'Helado triple',
    description: 'Tres bolas de lúcuma, chocolate y frutilla.',
    price: 3900,
  },
  {
    id: 'leche',
    category: 'Postres',
    name: 'Leche asada',
    description: 'Receta de la abuela, con caramelo tostado.',
    price: 2900,
  },
  {
    id: 'sopaipillas',
    category: 'Postres',
    name: 'Sopaipillas pasadas',
    description:
      'Sopaipillas de zapallo bañadas en chancaca con canela y cáscara de naranja.',
    price: 3500,
  },
];
