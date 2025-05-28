const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    
    const menuData = await Promise.all(
      categories.map(async (category) => {
        const items = await Product.find({ 
          category: category._id,
          isActive: true 
        }).populate({
          path: 'category',
          select: 'name description'
        });
        
        return {
          _id: category._id,
          name: category.name,
          description: category.description,
          items: items.map(item => ({
            _id: item._id,
            name: item.name,
            description: item.description,
            basePrice: parseFloat(item.basePrice),
            image: item.image,
            isVegetarian: item.isVegetarian,
            isSpicy: item.isSpicy,
            isPopular: item.isPopular,
            calories: item.calories,
            ingredients: item.ingredients,
            customization: item.customization
          }))
        };
      })
    );

    res.status(200).json({
      success: true,
      data: menuData
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const productData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      productData.image = req.file.filename;
    }

    // Parse customization if it's a string
    if (productData.customization && typeof productData.customization === 'string') {
      try {
        productData.customization = JSON.parse(productData.customization);
      } catch (parseError) {
        console.error('Error parsing customization:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Invalid customization data format'
        });
      }
    }

    // Validate required fields
    if (!productData.name || !productData.description || !productData.basePrice || !productData.category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['name', 'description', 'basePrice', 'category']
      });
    }

    // Set default customization if not provided
    if (!productData.customization) {
      productData.customization = {
        sizes: [
          { name: 'small', price: 0 },
          { name: 'medium', price: 2 },
          { name: 'large', price: 4 }
        ],
        crusts: [
          { name: 'classic', price: 0 },
          { name: 'thin', price: 0 },
          { name: 'thick', price: 1 }
        ],
        maxToppings: 5,
        maxExtraItems: 3
      };
    } else {
      // Validate and set defaults for customization if partially provided
      if (!productData.customization.sizes) {
        productData.customization.sizes = [
          { name: 'small', price: 0 },
          { name: 'medium', price: 2 },
          { name: 'large', price: 4 }
        ];
      }
      if (!productData.customization.crusts) {
        productData.customization.crusts = [
          { name: 'classic', price: 0 },
          { name: 'thin', price: 0 },
          { name: 'thick', price: 1 }
        ];
      }
      if (!productData.customization.maxToppings) {
        productData.customization.maxToppings = 5;
      }
      if (!productData.customization.maxExtraItems) {
        productData.customization.maxExtraItems = 3;
      }
    }

    // Ensure all prices are numbers
    if (productData.customization.sizes) {
      productData.customization.sizes = productData.customization.sizes.map(size => ({
        ...size,
        price: parseFloat(size.price)
      }));
    }
    if (productData.customization.crusts) {
      productData.customization.crusts = productData.customization.crusts.map(crust => ({
        ...crust,
        price: parseFloat(crust.price)
      }));
    }

    const product = await Product.create(productData);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    // If there's an error and a file was uploaded, delete it
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('Update request file:', req.file);

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = { ...req.body };

    // Parse and validate basePrice
    if (updateData.basePrice !== undefined) {
      const basePrice = parseFloat(updateData.basePrice);
      if (isNaN(basePrice)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid base price value'
        });
      }
      updateData.basePrice = basePrice;
    }

    // Parse customization if it's a string
    if (updateData.customization && typeof updateData.customization === 'string') {
      try {
        updateData.customization = JSON.parse(updateData.customization);
      } catch (parseError) {
        console.error('Error parsing customization:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Invalid customization data format'
        });
      }
    }

    // Ensure all prices are numbers in customization
    if (updateData.customization) {
      if (updateData.customization.sizes) {
        updateData.customization.sizes = updateData.customization.sizes.map(size => ({
          ...size,
          price: parseFloat(size.price)
        }));
      }
      if (updateData.customization.crusts) {
        updateData.customization.crusts = updateData.customization.crusts.map(crust => ({
          ...crust,
          price: parseFloat(crust.price)
        }));
      }
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if it exists and is not the default
      if (product.image && product.image !== 'default-product.jpg') {
        const oldImagePath = path.join('uploads', product.image);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (unlinkError) {
            console.error('Error deleting old image:', unlinkError);
          }
        }
      }
      updateData.image = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    // If there's an error and a file was uploaded, delete it
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
}; 