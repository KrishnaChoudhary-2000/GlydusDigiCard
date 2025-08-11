import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.js';

// Load environment variables
dotenv.config();

const app = express();
// Trust proxy in production so req.protocol/host are correct behind proxies
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
const PORT = process.env.PORT || 5000;

console.log(`🚀 Starting server on port ${PORT}`);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!origin || allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint (must come before routes)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Database status endpoint (must come before routes)
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: mongoose.connection.readyState === 1,
    database: mongoose.connection.db?.databaseName || 'unknown',
    collections: mongoose.connection.db ? 'available' : 'unknown'
  });
});

// Simple MongoDB connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      console.log('💡 Please create a .env file with your MongoDB connection string');
      return false;
    }

    console.log('🔌 Connecting to MongoDB...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`🗄️  Database: ${mongoose.connection.db.databaseName}`);
    console.log(`📊 Collections: ${(await mongoose.connection.db.listCollections().toArray()).map(c => c.name).join(', ')}`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

// Import routes
import cardsRouter from './routes/cards.js';

// Routes
app.use('/api/cards', cardsRouter);

// Swagger documentation (development only, or enable with ENABLE_SWAGGER=true)
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(`🎉 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️  DB Status: http://localhost:${PORT}/api/db-status`);
    });
  } else {
    console.log('⚠️  Starting server without database connection');
    console.log('💡 Cards will be stored in memory (not persistent)');
    
    app.listen(PORT, () => {
      console.log(`🎉 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️  DB Status: http://localhost:${PORT}/api/db-status`);
    });
  }
};

startServer(); 