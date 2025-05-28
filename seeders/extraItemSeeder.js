const ExtraItem = require('../models/ExtraItem');

const extraItems = [
  // Sides
  {
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter',
    price: 4.99,
    image: '/images/extra-items/garlic-bread.jpg',
    category: 'side',
    isAvailable: true,
    isVegetarian: true,
    calories: 180
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing',
    price: 6.99,
    image: '/images/extra-items/caesar-salad.jpg',
    category: 'side',
    isAvailable: true,
    isVegetarian: true,
    calories: 220
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy chicken wings with choice of sauce',
    price: 8.99,
    image: '/images/extra-items/chicken-wings.jpg',
    category: 'side',
    isAvailable: true,
    isVegetarian: false,
    calories: 350
  },
  {
    name: 'Garlic Dip',
    description: 'Creamy garlic dipping sauce',
    price: 0.99,
    image: '/images/extra-items/garlic-dip.jpg',
    category: 'sauce',
    isAvailable: true,
    isVegetarian: true,
    calories: 50
  },
  {
    name: 'Marinara Sauce',
    description: 'Classic tomato marinara sauce',
    price: 0.99,
    image: '/images/extra-items/marinara.jpg',
    category: 'sauce',
    isAvailable: true,
    isVegetarian: true,
    calories: 40
  },
  {
    name: 'Ranch Dressing',
    description: 'Creamy ranch dressing',
    price: 0.99,
    image: '/images/extra-items/ranch.jpg',
    category: 'sauce',
    isAvailable: true,
    isVegetarian: true,
    calories: 60
  },

  // Drinks
  {
    name: 'Coca Cola',
    description: 'Classic carbonated soft drink',
    price: 2.49,
    image: '/images/extra-items/coca-cola.jpg',
    category: 'extra',
    extraType: 'drink',
    isAvailable: true,
    isVegetarian: true,
    calories: 140
  },
  {
    name: 'Sprite',
    description: 'Lemon-lime flavored carbonated drink',
    price: 2.49,
    image: '/images/extra-items/sprite.jpg',
    category: 'extra',
    extraType: 'drink',
    isAvailable: true,
    isVegetarian: true,
    calories: 140
  },
  {
    name: 'Fanta',
    description: 'Orange flavored carbonated drink',
    price: 2.49,
    image: '/images/extra-items/fanta.jpg',
    category: 'extra',
    extraType: 'drink',
    isAvailable: true,
    isVegetarian: true,
    calories: 160
  },

  // Desserts
  {
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with chocolate sauce',
    price: 5.99,
    image: '/images/extra-items/chocolate-brownie.jpg',
    category: 'extra',
    extraType: 'dessert',
    isAvailable: true,
    isVegetarian: true,
    calories: 320
  },
  {
    name: 'Ice Cream',
    description: 'Vanilla ice cream with chocolate sauce',
    price: 4.99,
    image: '/images/extra-items/ice-cream.jpg',
    category: 'extra',
    extraType: 'dessert',
    isAvailable: true,
    isVegetarian: true,
    calories: 250
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert',
    price: 4.99,
    image: '/images/extra-items/tiramisu.jpg',
    category: 'extra',
    extraType: 'dessert',
    isAvailable: true,
    isVegetarian: true,
    calories: 280
  }
];

const importData = async () => {
  try {
    await ExtraItem.deleteMany({});
    await ExtraItem.insertMany(extraItems);
    console.log('Extra Items Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await ExtraItem.deleteMany({});
    console.log('Extra Items Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
}; 