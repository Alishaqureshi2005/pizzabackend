const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get all pizza sizes or sizes for specific product
// @route   GET /api/pizza/sizes
// @route   GET /api/pizza/sizes/:productId
// @access  Public
exports.getSizes = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    if (productId) {
      // Get sizes for specific product
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const sizes = product.customization.sizes.map(size => ({
        name: size.name.charAt(0).toUpperCase() + size.name.slice(1),
        price: size.price,
        category: 'Size'
      }));

      return res.json({
        success: true,
        productName: product.name,
        sizes
      });
    }

    // Get default sizes from any product
    const product = await Product.findOne({});
    
    if (!product) {
      // Return default sizes if no product exists
      return res.json({
        success: true,
        sizes: [
          { name: 'Small', price: 8.99, category: 'Size' },
          { name: 'Medium', price: 10.99, category: 'Size' },
          { name: 'Large', price: 12.99, category: 'Size' }
        ]
      });
    }

    // Extract sizes from product customization
    const sizes = product.customization.sizes.map(size => ({
      name: size.name.charAt(0).toUpperCase() + size.name.slice(1),
      price: size.price,
      category: 'Size'
    }));
    console.log(sizes);
    res.json({
      success: true,
      sizes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pizza sizes',
      error: error.message
    });
  }
});

// @desc    Get all pizza crusts
// @route   GET /api/pizza/crusts
// @access  Public
exports.getCrusts = asyncHandler(async (req, res) => {
  try {
    // Get any product to extract default crusts
    const product = await Product.findOne({});
    
    if (!product) {
      // Return default crusts if no product exists
      return res.json([
        { name: 'Classic', price: 0, category: 'Crust' },
        { name: 'Thin', price: 0, category: 'Crust' },
        { name: 'Thick', price: 1.99, category: 'Crust' }
      ]);
    }

    // Extract crusts from product customization
    const crusts = product.customization.crusts.map(crust => ({
      name: crust.name.charAt(0).toUpperCase() + crust.name.slice(1),
      price: crust.price,
      category: 'Crust'
    }));

    res.json(crusts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pizza crusts',
      error: error.message
    });
  }
});

// @desc    Get all pizza toppings
// @route   GET /api/pizza/toppings
// @access  Public
exports.getToppings = asyncHandler(async (req, res) => {
  try {
    // Get any product to extract default toppings
    const product = await Product.findOne({}).populate('defaultToppings');
    
    if (!product || !product.defaultToppings) {
      // Return default toppings if no product exists
      return res.json([
        { id: 1, name: 'Pepperoni', price: 1.99, category: 'Meat' },
        { id: 2, name: 'Mushrooms', price: 1.49, category: 'Vegetables' },
        { id: 3, name: 'Onions', price: 1.49, category: 'Vegetables' },
        { id: 4, name: 'Sausage', price: 1.99, category: 'Meat' },
        { id: 5, name: 'Bacon', price: 1.99, category: 'Meat' },
        { id: 6, name: 'Extra Cheese', price: 1.49, category: 'Cheese' }
      ]);
    }

    // Extract toppings from product
    const toppings = product.defaultToppings.map(topping => ({
      id: topping._id,
      name: topping.name,
      price: topping.price,
      category: topping.category
    }));

    res.json(toppings);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pizza toppings',
      error: error.message
    });
  }
});

// @desc    Get all extra items
// @route   GET /api/pizza/extra-items
// @access  Public
exports.getExtraItems = asyncHandler(async (req, res) => {
  try {
    // Get any product to extract default extra items
    const product = await Product.findOne({});
    
    if (!product) {
      // Return default extra items if no product exists
      return res.json([
        { id: 1, name: 'Garlic Bread', price: 3.99, category: 'Sides' },
        { id: 2, name: 'Chicken Wings', price: 6.99, category: 'Sides' },
        { id: 3, name: 'Soft Drink', price: 1.99, category: 'Drinks' }
      ]);
    }

    // Extract extra items from product customization
    const extraItems = product.customization.extraItems || [
      { id: 1, name: 'Garlic Bread', price: 3.99, category: 'Sides' },
      { id: 2, name: 'Chicken Wings', price: 6.99, category: 'Sides' },
      { id: 3, name: 'Soft Drink', price: 1.99, category: 'Drinks' }
    ];

    res.json(extraItems);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching extra items',
      error: error.message
    });
  }
}); 