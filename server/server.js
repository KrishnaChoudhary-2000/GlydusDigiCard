import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from multiple sources for Vercel compatibility
dotenv.config({ path: './config.env' });
dotenv.config(); // Also load from .env file if it exists

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.vercel.app', 'https://your-domain.com'] 
    : true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database connection state management
let dbState = {
  isConnected: false,
  isConnecting: false,
  retryCount: 0,
  lastError: null,
  connectionStartTime: null
};

const MAX_RETRIES = 10;
const RETRY_DELAY = 3000; // 3 seconds
const CONNECTION_TIMEOUT = 10000; // 10 seconds

// Enhanced database connection function
const connectDB = async (isRetry = false) => {
  if (dbState.isConnecting) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    dbState.isConnected = false;
    return;
  }

  dbState.isConnecting = true;
  dbState.connectionStartTime = Date.now();

  try {
    // Configure mongoose for better connection handling
    mongoose.set('strictQuery', false);
    
    // Enhanced connection options for Vercel
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      maxPoolSize: 5, // Reduced for serverless
      minPoolSize: 1,
      retryWrites: true,
      w: 'majority',
      // Vercel-specific optimizations
      maxIdleTimeMS: 30000,
      compressors: ['zlib'],
      zlibCompressionLevel: 6
    };
    
    // Create connection with timeout
    const connectionPromise = mongoose.connect(process.env.MONGODB_URI, options);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT)
    );
    
    await Promise.race([connectionPromise, timeoutPromise]);
    
    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      dbState.isConnected = true;
      dbState.isConnecting = false;
      dbState.retryCount = 0;
      dbState.lastError = null;
    });

    mongoose.connection.on('error', (error) => {
      dbState.isConnected = false;
      dbState.isConnecting = false;
      dbState.lastError = error.message;
      
      if (dbState.retryCount < MAX_RETRIES) {
        dbState.retryCount++;
        setTimeout(() => connectDB(true), RETRY_DELAY);
      }
    });

    mongoose.connection.on('disconnected', () => {
      dbState.isConnected = false;
      dbState.isConnecting = false;
    });

  } catch (error) {
    dbState.isConnected = false;
    dbState.isConnecting = false;
    dbState.lastError = error.message;
    
    if (dbState.retryCount < MAX_RETRIES) {
      dbState.retryCount++;
      setTimeout(() => connectDB(true), RETRY_DELAY);
    }
  }
};

// Schedule retry function
const scheduleRetry = () => {
  if (dbState.retryCount < MAX_RETRIES) {
    dbState.retryCount++;
    setTimeout(() => connectDB(true), RETRY_DELAY);
  }
};

// Initial connection attempt
connectDB();

// Routes
import cardsRouter from './routes/cards.js';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: dbState.isConnected,
    connecting: dbState.isConnecting,
    retryCount: dbState.retryCount,
    hasUri: !!process.env.MONGODB_URI,
    lastError: dbState.lastError
  });
});

// API routes
app.use('/api/cards', cardsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 