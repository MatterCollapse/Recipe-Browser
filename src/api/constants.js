export const CUISINES = [
  'american',
  'chinese',
  'french',
  'greek',
  'italian',
  'japanese',
  'mexican',
  'portuguese',
  'spanish',
  'thai',
  'turkish',
];

// The API exposes a single `dietary_tags` filter that covers both
// "diet" (vegetarian/vegan) and "health" (gluten free/nut free/halal/kosher)
// style filtering, so this app combines both into one "Diet" dropdown.
export const DIETARY_TAGS = [
  'vegetarian',
  'vegan',
  'gluten_free',
  'dairy_free',
  'nut_free',
  'halal',
  'kosher',
];

// A fixed list of common ingredients to filter by, per the "common
// ingredients from a list" requirement. Values are matched against the
// API's `ingredients` param (case-insensitive partial match).
export const COMMON_INGREDIENTS = [
  'Tomato',
  'Onion',
  'Garlic',
  'Chicken',
  'Beef',
  'Egg',
  'Cheese',
  'Butter',
  'Olive oil',
  'Rice',
  'Pasta',
  'Potato',
  'Carrot',
  'Lemon',
  'Basil',
  'Milk',
  'Flour',
  'Mushroom',
  'Bell pepper',
  'Spinach',
];

export function formatLabel(value) {
  if (!value) return '';
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
