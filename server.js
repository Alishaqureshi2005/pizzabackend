
const express = require('express');
const path = require('path');

app.use(express.static(path.join(__dirname, '../pizzahome/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../pizzahome/build/index.html'));
});
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Admin rout
app.use('/api/admin', require('./routes/adminRoutes'));

// Product routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Cart and Order routes
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/delivery-addresses', require('./routes/deliveryAddressRoutes'));

// Delivery and Restaurant routes
app.use('/api/delivery-zones', require('./routes/deliveryZoneRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

// Pizza customization routes
app.use('/api/pizza', require('./routes/pizzaCustomizationRoutes'));

// Extra items and toppings routes
app.use('/api/extras', require('./routes/extraItemRoutes'));
app.use('/api/toppings', require('./routes/toppingRoutes'));

// Upload routes
app.use('/api/upload', require('./routes/uploadRoutes'));

// Printer routes
app.use('/api/printer', require('./routes/printerRoutes'));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzahouse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 