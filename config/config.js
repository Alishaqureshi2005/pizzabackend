module.exports = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '30d'
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://narwanigorav3:2ZPFT5SkaiVjeaaN@cluster0.viuwitx.mongodb.net/pizzahouse?retryWrites=true&w=majority'
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  // Password Configuration
  password: {
    minLength: 6,
    saltRounds: 10
  }
}; 