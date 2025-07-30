import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config.env' });

console.log('🧪 Testing MongoDB Connection...\n');

const testMongoConnection = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('❌ No MongoDB URI found in config.env');
      console.log('Please set MONGODB_URI in your config.env file');
      return false;
    }

    console.log('🔌 MongoDB URI found');
    console.log('📡 Attempting to connect...\n');

    // Configure mongoose
    mongoose.set('strictQuery', false);
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Connection state: ${mongoose.connection.readyState}`);
    console.log(`🏠 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🔢 Port: ${mongoose.connection.port}`);
    
    // Test a simple operation
    console.log('\n🧪 Testing database operations...');
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Write operation successful');
    
    // Test reading from collection
    const result = await testCollection.findOne({ test: true });
    console.log('✅ Read operation successful');
    
    // Clean up test data
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete operation successful');
    
    console.log('\n🎉 All MongoDB operations working correctly!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n💡 Authentication failed. Check your username and password in the MongoDB URI.');
      console.log('Make sure your MongoDB Atlas user has the correct permissions.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Network error. Check your internet connection and MongoDB Atlas cluster status.');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.log('\n💡 Connection timeout. Check your network and MongoDB Atlas cluster status.');
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Verify your MongoDB Atlas cluster is running');
    console.log('2. Check your IP address is whitelisted in MongoDB Atlas');
    console.log('3. Verify your username and password are correct');
    console.log('4. Ensure your MongoDB Atlas user has read/write permissions');
    console.log('5. Check your internet connection');
    
    return false;
  }
};

// Run the test
testMongoConnection().then(success => {
  if (success) {
    console.log('\n✅ MongoDB connection test PASSED');
    process.exit(0);
  } else {
    console.log('\n❌ MongoDB connection test FAILED');
    process.exit(1);
  }
}); 