import type { Dish } from '../menu';

/** Plate with concave corners that frames the dish photo. */
export function DishPlate({ dish, size }: { dish: Dish; size?: 'big' }) {
  return (
    <span className="dish-plate" data-size={size}>
      <img src={`/fotos/${dish.id}.webp`} alt="" />
    </span>
  );
}
