const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const {
      productId,
      size,
      crust,
      toppings,
      extraItems,
      specialInstructions,
      quantity
    } = req.body;

    console.log('Received cart request:', {
      productId,
      size,
      crust,
      toppings,
      extraItems,
      specialInstructions,
      quantity
    });

    // Validate required fields
    if (!productId || !size || !crust) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: productId, size, and crust are required'
      });
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('Found product:', product.name);

    // Validate size and crust
    const sizeOption = product.customization.sizes.find(s => s.name === size);
    const crustOption = product.customization.crusts.find(c => c.name === crust);

    if (!sizeOption || !crustOption) {
      return res.status(400).json({
        success: false,
        message: 'Invalid size or crust selection',
        availableSizes: product.customization.sizes.map(s => s.name),
        availableCrusts: product.customization.crusts.map(c => c.name)
      });
    }

    // Calculate base price
    let totalPrice = sizeOption.price + crustOption.price;

    // Add toppings price
    if (toppings && toppings.length > 0) {
      if (toppings.length > product.customization.maxToppings) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${product.customization.maxToppings} toppings allowed`
        });
      }
      toppings.forEach(topping => {
        if (!topping.price || !topping.quantity) {
          throw new Error('Invalid topping data: price and quantity are required');
        }
        totalPrice += topping.price * topping.quantity;
      });
    }

    // Add extra items price
    if (extraItems && extraItems.length > 0) {
      if (extraItems.length > product.customization.maxExtraItems) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${product.customization.maxExtraItems} extra items allowed`
        });
      }
      extraItems.forEach(item => {
        if (!item.price || !item.quantity) {
          throw new Error('Invalid extra item data: price and quantity are required');
        }
        totalPrice += item.price * item.quantity;
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    // Format extra items to match schema
    const formattedExtraItems = extraItems ? extraItems.map(item => ({
      id: item.id.toString(), // Convert numeric ID to string
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })) : [];

    const cartItem = {
      id: `${productId}-${size}-${crust}-${Date.now()}`, // Add timestamp to ensure uniqueness
      product: productId,
      name: product.name,
      image: product.image,
      size,
      crust,
      toppings: toppings || [],
      extraItems: formattedExtraItems,
      specialInstructions: specialInstructions || '',
      price: totalPrice,
      quantity: quantity || 1
    };

    console.log('Creating cart item:', cartItem);

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [cartItem]
      });
    } else {
      // Check if same customization already in cart
      const existingItem = cart.items.find(item => 
        item.product.toString() === productId &&
        item.size === size &&
        item.crust === crust &&
        JSON.stringify(item.toppings) === JSON.stringify(toppings || []) &&
        JSON.stringify(item.extraItems) === JSON.stringify(formattedExtraItems)
      );

      if (existingItem) {
        existingItem.quantity += (quantity || 1);
      } else {
        cart.items.push(cartItem);
      }

      await cart.save();
    }

    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.find(item => item.id === itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.id !== itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item.id !== itemId);
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
}; 