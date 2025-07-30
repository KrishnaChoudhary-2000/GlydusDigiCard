import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from multiple sources for Vercel compatibility
dotenv.config({ path: './config.env' });
dotenv.config(); // Also load from .env file if it exists

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced logging
console.log('🚀 Starting Glydus Digital Business Card Server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Configured' : 'Not configured');

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.vercel.app', 'https://your-domain.com'] 
    : true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

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
    console.log('🔄 Database connection already in progress, skipping...');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.log('⚠️ No MongoDB URI provided - running in memory-only mode');
    dbState.isConnected = false;
    return;
  }

  dbState.isConnecting = true;
  dbState.connectionStartTime = Date.now();

  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    
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
      console.log('✅ MongoDB connected successfully');
      dbState.isConnected = true;
      dbState.isConnecting = false;
      dbState.retryCount = 0;
      dbState.lastError = null;
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      dbState.isConnected = false;
      dbState.isConnecting = false;
      dbState.lastError = err.message;
      scheduleRetry();
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      dbState.isConnected = false;
      dbState.isConnecting = false;
      scheduleRetry();
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      dbState.isConnected = true;
      dbState.isConnecting = false;
      dbState.retryCount = 0;
      dbState.lastError = null;
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    dbState.isConnected = false;
    dbState.isConnecting = false;
    dbState.lastError = error.message;
    
    if (!isRetry) {
      scheduleRetry();
    }
    
    return false;
  }
};

// Schedule retry with exponential backoff
const scheduleRetry = () => {
  if (dbState.retryCount >= MAX_RETRIES) {
    console.log('⚠️ Max retries reached, continuing without MongoDB');
    return;
  }
  
  dbState.retryCount++;
  const delay = RETRY_DELAY * Math.pow(2, dbState.retryCount - 1);
  
  console.log(`🔄 Scheduling retry ${dbState.retryCount}/${MAX_RETRIES} in ${delay}ms`);
  
  setTimeout(() => {
    if (!dbState.isConnected) {
      connectDB(true);
    }
  }, delay);
};

// Enhanced health check endpoint
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'OK',
    message: 'Glydus API is running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
    },
    mongodb: {
      connected: dbState.isConnected,
      connecting: dbState.isConnecting,
      connectionState: mongoose.connection.readyState,
      retryCount: dbState.retryCount,
      lastError: dbState.lastError,
      connectionTime: dbState.connectionStartTime 
        ? Date.now() - dbState.connectionStartTime 
        : null
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: PORT,
      hasMongoUri: !!process.env.MONGODB_URI
    }
  });
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: dbState.isConnected,
    connecting: dbState.isConnecting,
    retryCount: dbState.retryCount,
    lastError: dbState.lastError,
    connectionState: mongoose.connection.readyState,
    hasUri: !!process.env.MONGODB_URI
  });
});

// Routes
import cardsRouter from './routes/cards.js';
app.use('/api/cards', cardsRouter);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close();
  }
  process.exit(0);
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Database status at: http://localhost:${PORT}/api/db-status`);
  
  // Try to connect to database after server is running
  connectDB();
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

export default app; 