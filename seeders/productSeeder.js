const Product = require('../models/Product');
const Category = require('../models/Category');

const products = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    basePrice: 12.99,
    image: '/images/products/margherita.jpg',
    category: null, // Will be set dynamically
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 15,
    calories: 266,
    customization: {
      allowExtraToppings: true,
      allowExtraCheese: true,
      allowExtraSauce: true,
      allowCrustSelection: true,
      allowSizeSelection: true,
      maxToppings: 5,
      maxExtraCheese: 2,
      maxExtraSauce: 2
    }
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and pepperoni',
    basePrice: 14.99,
    image: '/images/products/pepperoni.jpg',
    category: null, // Will be set dynamically
    isAvailable: true,
    isVegetarian: false,
    isSpicy: true,
    preparationTime: 15,
    calories: 298,
    customization: {
      allowExtraToppings: true,
      allowExtraCheese: true,
      allowExtraSauce: true,
      allowCrustSelection: true,
      allowSizeSelection: true,
      maxToppings: 5,
      maxExtraCheese: 2,
      maxExtraSauce: 2
    }
  },
  {
    name: 'Vegetarian Pizza',
    description: 'Pizza loaded with fresh vegetables',
    basePrice: 13.99,
    image: '/images/products/vegetarian.jpg',
    category: null, // Will be set dynamically
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 15,
    calories: 245,
    customization: {
      allowExtraToppings: true,
      allowExtraCheese: true,
      allowExtraSauce: true,
      allowCrustSelection: true,
      allowSizeSelection: true,
      maxToppings: 5,
      maxExtraCheese: 2,
      maxExtraSauce: 2
    }
  }
];

const importData = async () => {
  try {
    // Get existing products to preserve customization options
    const existingProducts = await Product.find({});
    let defaultCustomization;
    
    if (existingProducts.length > 0) {
      defaultCustomization = existingProducts[0].customization;
    } else {
      defaultCustomization = {
        sizes: [
          { name: 'small', price: 8.99 },
          { name: 'medium', price: 10.99 },
          { name: 'large', price: 12.99 }
        ],
        crusts: [
          { name: 'classic', price: 0 },
          { name: 'thin', price: 0 },
          { name: 'thick', price: 1 },
          { name: 'stuffed', price: 2 }
        ],
        maxToppings: 5,
        maxExtraItems: 3
      };
    }

    // Get the Classic Pizzas category
    const category = await Category.findOne({ name: 'Classic Pizzas' });
    if (!category) {
      throw new Error('Classic Pizzas category not found. Please seed categories first.');
    }

    // Delete only products that are being reseeded
    const productNames = products.map(p => p.name);
    await Product.deleteMany({ name: { $in: productNames } });

    // Set category and customization for all products
    const productsWithCustomization = products.map(product => ({
      ...product,
      category: category._id,
      customization: {
        ...defaultCustomization,
        sizes: defaultCustomization.sizes.map(size => ({
          ...size,
          price: size.name === 'small' ? Math.max(product.basePrice - 2, 0.5) :
                 size.name === 'medium' ? product.basePrice :
                 product.basePrice + 2
        }))
      }
    }));

    await Product.insertMany(productsWithCustomization);
    console.log('Products Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany({});
    console.log('Products Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
}; 