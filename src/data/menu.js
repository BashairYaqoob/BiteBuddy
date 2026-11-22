// Source: "BiteBuddy Shared Menu Sheet" (see CLAUDE.md section 4).
// Single source of truth for all menu content. Do not change any value here.
// Prices are PKR, shown elsewhere as "Rs. 720" (comma thousands, no decimals).
// Ratings are shown elsewhere with one decimal (e.g. "4.0").

export const CATEGORIES = ['Burgers', 'Wraps', 'Pizza', 'Rice Bowls', 'Drinks']

export const MENU_ITEMS = [
  { id: 'M01', name: 'Crispy Chicken Burger', category: 'Burgers', price: 720, rating: 4.2, dietTag: 'Non-vegetarian', description: 'Fried chicken fillet, lettuce and mayo in a sesame bun.', type: 'Meal', order: 1 },
  { id: 'M02', name: 'Grilled Chicken Burger', category: 'Burgers', price: 790, rating: 4.6, dietTag: 'Non-vegetarian', description: 'Grilled chicken breast, tomato and garlic sauce in a sesame bun.', type: 'Meal', order: 2 },
  { id: 'M03', name: 'BBQ Chicken Burger', category: 'Burgers', price: 920, rating: 4.4, dietTag: 'Non-vegetarian', description: 'Chicken patty, onion rings and barbecue sauce in a sesame bun.', type: 'Meal', order: 3 },
  { id: 'M04', name: 'Veggie Crunch Burger', category: 'Burgers', price: 680, rating: 4.8, dietTag: 'Vegetarian', description: 'Crumbed vegetable patty, lettuce and mayo in a sesame bun.', type: 'Meal', order: 4 },

  { id: 'M05', name: 'Chicken Caesar Wrap', category: 'Wraps', price: 850, rating: 4.2, dietTag: 'Non-vegetarian', description: 'Chicken strips, lettuce and Caesar dressing in a flour tortilla.', type: 'Meal', order: 1 },
  { id: 'M06', name: 'Chicken Tikka Wrap', category: 'Wraps', price: 640, rating: 4.6, dietTag: 'Non-vegetarian', description: 'Tikka chicken, onion and mint chutney in a flour tortilla.', type: 'Meal', order: 2 },
  { id: 'M07', name: 'Spicy Chicken Wrap', category: 'Wraps', price: 610, rating: 4.4, dietTag: 'Non-vegetarian', description: 'Spiced chicken, cabbage and chilli sauce in a flour tortilla.', type: 'Meal', order: 3 },
  { id: 'M08', name: 'Falafel Wrap', category: 'Wraps', price: 660, rating: 4.8, dietTag: 'Vegetarian', description: 'Chickpea falafel, hummus and salad in a flour tortilla.', type: 'Meal', order: 4 },

  { id: 'M09', name: 'Cheese Margherita Pizza', category: 'Pizza', price: 770, rating: 4.3, dietTag: 'Vegetarian', description: 'Tomato sauce and mozzarella on a thin 9-inch crust.', type: 'Meal', order: 1 },
  { id: 'M10', name: 'Veggie Supreme Pizza', category: 'Pizza', price: 950, rating: 4.7, dietTag: 'Vegetarian', description: 'Peppers, olives, onion and mushrooms on a thin 9-inch crust.', type: 'Meal', order: 2 },
  { id: 'M11', name: 'Chicken Fajita Pizza', category: 'Pizza', price: 1090, rating: 4.4, dietTag: 'Non-vegetarian', description: 'Fajita chicken, peppers and onion on a thin 9-inch crust.', type: 'Meal', order: 3 },

  { id: 'M12', name: 'Daal Chawal Bowl', category: 'Rice Bowls', price: 650, rating: 4.1, dietTag: 'Vegetarian', description: 'Yellow lentil daal over steamed rice with fried onion.', type: 'Meal', order: 1 },
  { id: 'M13', name: 'Chana Pulao Bowl', category: 'Rice Bowls', price: 630, rating: 4.4, dietTag: 'Vegetarian', description: 'Chickpea pulao with raita and a cucumber slice.', type: 'Meal', order: 2 },
  { id: 'M14', name: 'Vegetable Biryani', category: 'Rice Bowls', price: 690, rating: 4.3, dietTag: 'Vegetarian', description: 'Spiced rice with mixed vegetables and fried onion.', type: 'Meal', order: 3 },

  { id: 'D01', name: 'Mango Lassi', category: 'Drinks', price: 260, rating: 4.3, dietTag: null, description: 'Chilled yogurt drink blended with mango.', type: 'Drink', order: 1 },
  { id: 'D02', name: 'Sweet Lassi', category: 'Drinks', price: 220, rating: 4.1, dietTag: null, description: 'Chilled yogurt drink with sugar.', type: 'Drink', order: 2 },
  { id: 'D03', name: 'Mint Lemonade', category: 'Drinks', price: 240, rating: 4.4, dietTag: null, description: 'Fresh lemon, mint and soda.', type: 'Drink', order: 3 },
  { id: 'D04', name: 'Classic Lemonade', category: 'Drinks', price: 200, rating: 4.0, dietTag: null, description: 'Fresh lemon, sugar and water.', type: 'Drink', order: 4 },
  { id: 'D05', name: 'Fresh Orange Juice', category: 'Drinks', price: 300, rating: 4.2, dietTag: null, description: 'Orange juice squeezed to order.', type: 'Drink', order: 5 },
  { id: 'D06', name: 'Cola 345 ml', category: 'Drinks', price: 150, rating: 3.9, dietTag: null, description: 'Carbonated cola in a 345 ml can.', type: 'Drink', order: 6 },
]
