import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Log environment info
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection Management
let isMongoConnected = false;
let mongoConnectionRetries = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('❌ No MongoDB URI provided, running without database');
      return false;
    }
    
    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Configure mongoose for better connection handling
    mongoose.set('strictQuery', false);
    
    // Connection options for better reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferMaxEntries: 0,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };
    
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
      isMongoConnected = true;
      mongoConnectionRetries = 0;
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      isMongoConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isMongoConnected = false;
      // Attempt to reconnect
      setTimeout(() => {
        if (!isMongoConnected && mongoConnectionRetries < MAX_RETRIES) {
          mongoConnectionRetries++;
          console.log(`🔄 Attempting to reconnect to MongoDB (attempt ${mongoConnectionRetries}/${MAX_RETRIES})`);
          connectDB();
        }
      }, 5000);
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isMongoConnected = true;
      mongoConnectionRetries = 0;
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    isMongoConnected = false;
    
    if (mongoConnectionRetries < MAX_RETRIES) {
      mongoConnectionRetries++;
      console.log(`🔄 Retrying MongoDB connection in 5 seconds (attempt ${mongoConnectionRetries}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(), 5000);
    } else {
      console.log('⚠️ Max retries reached, continuing without MongoDB');
    }
    
    return false;
  }
};

// Health check endpoint that includes MongoDB status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Glydus API is running',
    timestamp: new Date().toISOString(),
    mongodb: {
      connected: isMongoConnected,
      connectionState: mongoose.connection.readyState,
      retries: mongoConnectionRetries
    }
  });
});

// Routes
import cardsRouter from './routes/cards.js';
app.use('/api/cards', cardsRouter);

// Start the server first, then try to connect to database
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Try to connect to database after server is running
  connectDB();
}); 