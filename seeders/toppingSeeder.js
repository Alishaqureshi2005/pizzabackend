const Topping = require('../models/Topping');

const toppings = [
  {
    name: 'Extra Cheese',
    description: 'Additional mozzarella cheese',
    price: 1.99,
    image: '/images/toppings/extra-cheese.jpg',
    isAvailable: true,
    isVegetarian: true,
    calories: 100,
    type: 'cheese'
  },
  {
    name: 'Pepperoni',
    description: 'Classic Italian pepperoni',
    price: 2.49,
    image: '/images/toppings/pepperoni.jpg',
    isAvailable: true,
    isVegetarian: false,
    calories: 150,
    type: 'meat'
  },
  {
    name: 'Mushrooms',
    description: 'Fresh sliced mushrooms',
    price: 1.99,
    image: '/images/toppings/mushrooms.jpg',
    isAvailable: true,
    isVegetarian: true,
    calories: 20,
    type: 'vegetable'
  },
  {
    name: 'Green Peppers',
    description: 'Fresh green bell peppers',
    price: 1.49,
    image: '/images/toppings/green-peppers.jpg',
    isAvailable: true,
    isVegetarian: true,
    calories: 10,
    type: 'vegetable'
  },
  {
    name: 'Onions',
    description: 'Sliced red onions',
    price: 1.49,
    image: '/images/toppings/onions.jpg',
    isAvailable: true,
    isVegetarian: true,
    calories: 15,
    type: 'vegetable'
  },
  {
    name: 'Black Olives',
    description: 'Sliced black olives',
    price: 1.99,
    image: '/images/toppings/black-olives.jpg',
    isAvailable: true,
    isVegetarian: true,
    calories: 25,
    type: 'vegetable'
  },
  {
    name: 'Pineapple',
    description: 'Fresh pineapple chunks',
    price: 1.99,
    image: '/images/toppings/pineapple.jpg',
    isAvailable: true,
    isVegetarian: true,
    calories: 30,
    type: 'vegetable'
  },
  {
    name: 'Ham',
    description: 'Classic ham',
    price: 2.49,
    image: '/images/toppings/ham.jpg',
    isAvailable: true,
    isVegetarian: false,
    calories: 120,
    type: 'meat'
  },
  {
    name: 'Bacon',
    description: 'Crispy bacon bits',
    price: 2.99,
    image: '/images/toppings/bacon.jpg',
    isAvailable: true,
    isVegetarian: false,
    calories: 180,
    type: 'meat'
  },
  {
    name: 'Sausage',
    description: 'Italian sausage crumbles',
    price: 2.49,
    image: '/images/toppings/sausage.jpg',
    isAvailable: true,
    isVegetarian: false,
    calories: 160,
    type: 'meat'
  }
];

const importData = async () => {
  try {
    await Topping.deleteMany({});
    await Topping.insertMany(toppings);
    console.log('Toppings Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await Topping.deleteMany({});
    console.log('Toppings Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
}; 