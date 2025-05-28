const Product = require('../models/Product');
const Category = require('../models/Category');
const menuData = require('./menuData');

const importData = async () => {
  try {
    // Get all categories first
    const categories = await Category.find({});
    if (!categories.length) {
      console.log('No categories found. Please run category seeder first.');
      return;
    }

    // Get existing product to preserve customization options
    const existingProduct = await Product.findOne({});
    const defaultCustomization = existingProduct ? existingProduct.customization : {
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

    // Create a map of category names to their IDs
    const categoryMap = categories.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    // Process each menu category
    for (const menuCategory of menuData) {
      const categoryId = categoryMap[menuCategory.category];
      if (!categoryId) {
        console.log(`Category not found: ${menuCategory.category}`);
        continue;
      }

      // Process each item in the category
      for (const item of menuCategory.items) {
        const basePrice = parseFloat(item.price);
        
        // Check if product already exists
        const existingItem = await Product.findOne({ name: item.title });
        if (existingItem) {
          console.log(`Updating existing product: ${item.title}`);
          existingItem.description = item.content;
          existingItem.basePrice = basePrice;
          existingItem.isVegetarian = item.isVegetarian || false;
          existingItem.isSpicy = item.isSpicy || false;
          existingItem.ingredients = item.content.split(', ');
          await existingItem.save();
          continue;
        }

        const product = {
          name: item.title,
          description: item.content,
          image: '/images/default-product.jpg',
          category: categoryId,
          basePrice: basePrice,
          countInStock: 100,
          isVegetarian: item.isVegetarian || false,
          isSpicy: item.isSpicy || false,
          isPopular: false,
          isActive: true,
          calories: 500,
          ingredients: item.content.split(', '),
          customization: {
            ...defaultCustomization,
            sizes: defaultCustomization.sizes.map(size => ({
              ...size,
              price: size.name === 'small' ? Math.max(basePrice - 2, 0.5) :
                     size.name === 'medium' ? basePrice :
                     basePrice + 2
            }))
          }
        };

        try {
          await Product.create(product);
          console.log(`Created product: ${product.name}`);
        } catch (error) {
          console.error(`Error creating product ${product.name}:`, error.message);
        }
      }
    }

    console.log('Menu items imported successfully!');
  } catch (error) {
    console.error('Error importing menu items:', error);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany({});
    console.log('Menu Items Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
}; 