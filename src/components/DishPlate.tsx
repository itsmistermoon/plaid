import type { Dish } from '../menu';

/** Placa de esquinas cóncavas que enmarca la foto del plato. */
export function DishPlate({ dish, size }: { dish: Dish; size?: 'big' }) {
  return (
    <span className="dish-plate" data-size={size}>
      <img src={`/fotos/${dish.id}.webp`} alt="" />
    </span>
  );
}
