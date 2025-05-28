const Category = require('../models/Category');

const categories = [
  {
    name: 'Classic Pizzas',
    description: 'Traditional and classic pizza flavors',
    isActive: true
  },
  {
    name: 'Specialty Pizzas',
    description: 'Unique and special pizza combinations',
    isActive: true
  },
  {
    name: 'Vegetarian Pizzas',
    description: 'Delicious vegetarian pizza options',
    isActive: true
  },
  {
    name: 'Spicy Pizzas',
    description: 'Hot and spicy pizza varieties',
    isActive: true
  },
  {
    name: 'Pasta\'s',
    description: 'We bieden een verscheidenheid aan pasta\'s, ontdek ons menu',
    isActive: true
  },
  {
    name: 'Pitta Brood',
    description: 'Turkse Kebab En Brood',
    isActive: true
  },
  {
    name: 'Schotels',
    description: 'Pitta Vlees, Frietjes, Keuze Van saus en Groentjes',
    isActive: true
  },
  {
    name: 'Durum',
    description: 'Heerlijke wraps met verschillende vullingen',
    isActive: true
  },
  {
    name: 'Desserts',
    description: 'Sweet treats and desserts',
    isActive: true
  },
  {
    name: 'Drinks',
    description: 'Refreshing beverages',
    isActive: true
  }
];

const importData = async () => {
  try {
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories Imported!');
    return createdCategories;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany({});
    console.log('Categories Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
}; 