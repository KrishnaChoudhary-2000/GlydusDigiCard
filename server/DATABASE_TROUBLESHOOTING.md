# Database Connection Troubleshooting Guide

This guide helps you diagnose and fix database connection issues with the enhanced error handling system.

## 🚀 Quick Start

### 1. Test Database Connection
Run the test script to check your database connection:

```bash
cd server
node test-db-connection.js
```

### 2. Check Database Status
Visit the database status endpoint to see connection details:

```
http://localhost:5000/api/db-status
```

### 3. Manual Retry
If connection fails, you can manually trigger a retry:

```bash
curl -X POST http://localhost:5000/api/db-retry
```

## 🔍 Enhanced Error Handling Features

### Detailed Logging
The server now provides comprehensive logging with emojis for easy identification:

- 🔌 Database connection attempts
- ✅ Successful operations
- ❌ Failed operations
- ⚠️  Warnings and fallbacks
- 🔄 Retry attempts
- 🚫 Max retries reached

### Error Types and Solutions

#### 1. MONGODB_URI Not Set
**Error**: `MONGODB_URI environment variable is not set`

**Solution**:
1. Create a `.env` file in the server directory
2. Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://username:password@host:port/database
   ```

#### 2. Network Errors (MongoNetworkError)
**Error**: Network-related connection failures

**Solutions**:
- Check your internet connection
- Verify MongoDB server is running
- Check if MongoDB port (usually 27017) is accessible
- Try pinging the MongoDB host

#### 3. Server Selection Errors (MongoServerSelectionError)
**Error**: Cannot reach MongoDB server

**Solutions**:
- Ensure MongoDB service is running
- Check firewall settings
- Verify connection string format
- Try connecting from another machine

#### 4. Authentication Errors (MongoAuthenticationError)
**Error**: Invalid username/password

**Solutions**:
- Verify MongoDB credentials
- Check user permissions
- Ensure database name is correct
- Try connecting with MongoDB Compass first

#### 5. Parse Errors (MongoParseError)
**Error**: Invalid connection string format

**Solutions**:
- Check MONGODB_URI format
- Ensure proper URI encoding
- Verify username/password format
- Use URL encoding for special characters

#### 6. Connection Timeouts
**Error**: Connection times out

**Solutions**:
- Check network speed
- Increase timeout values in connection options
- Verify MongoDB server isn't overloaded
- Try connecting from a different network

## 📊 Database Status Endpoint

The `/api/db-status` endpoint provides detailed information:

```json
{
  "connected": false,
  "connecting": false,
  "retryCount": 3,
  "hasUri": true,
  "lastError": "MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017",
  "connectionDuration": "5000ms",
  "connectionAttempts": [...],
  "maxRetries": 10,
  "retryDelay": 3000,
  "connectionTimeout": 10000,
  "environment": "development"
}
```

## 🔧 Common Connection String Formats

### Local MongoDB
```
MONGODB_URI=mongodb://localhost:27017/glydus_digicard
```

### MongoDB Atlas
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/glydus_digicard
```

### With Authentication
```
MONGODB_URI=mongodb://username:password@host:port/database
```

### Local MongoDB with Authentication
```
MONGODB_URI=mongodb://username:password@localhost:27017/glydus_digicard
```

## 🛠️ Troubleshooting Steps

### Step 1: Environment Check
1. Verify `.env` file exists in server directory
2. Check MONGODB_URI is properly set
3. Ensure no extra spaces or quotes around the URI

### Step 2: Test Connection
1. Run the test script: `node test-db-connection.js`
2. Check the detailed error output
3. Follow the specific troubleshooting suggestions

### Step 3: Verify MongoDB
1. Ensure MongoDB is installed and running
2. Check MongoDB service status
3. Verify port 27017 is open (or your custom port)

### Step 4: Network Check
1. Try pinging the MongoDB host
2. Check firewall settings
3. Verify network connectivity

### Step 5: Credentials Check
1. Verify username and password
2. Check user permissions
3. Ensure database exists

## 📝 Log Analysis

### Successful Connection
```
🚀 Starting initial database connection...
🔌 Database connection attempt 1703123456789 started
📡 Attempting to connect to: cluster.mongodb.net/glydus_digicard
⚙️  Connection options configured
🔄 Attempting database connection...
✅ Database connection established successfully!
🎉 Mongoose connected to MongoDB
```

### Failed Connection
```
🚀 Starting initial database connection...
🔌 Database connection attempt 1703123456789 started
📡 Attempting to connect to: localhost:27017/glydus_digicard
⚙️  Connection options configured
🔄 Attempting database connection...
❌ Database connection failed with error: connect ECONNREFUSED 127.0.0.1:27017
🌐 Network error - check your internet connection and MongoDB server status
🔄 Scheduling retry 1/10 in 3000ms
```

## 🔄 Automatic Retry System

The system automatically retries failed connections:
- **Max Retries**: 10 attempts
- **Retry Delay**: 3 seconds between attempts
- **Connection Timeout**: 10 seconds per attempt

## 🚨 Emergency Fallback

If database connection fails completely:
- The app continues to work with in-memory storage
- Cards are stored temporarily in memory
- Data persists until server restart
- Short URLs still work with in-memory data

## 📞 Getting Help

If you're still having issues:

1. **Check the logs** for specific error messages
2. **Run the test script** for detailed diagnostics
3. **Verify your MongoDB setup** with MongoDB Compass
4. **Check the database status endpoint** for current state
5. **Review this troubleshooting guide** for specific error types

## 🔗 Useful Endpoints

- **Health Check**: `GET /api/health`
- **Database Status**: `GET /api/db-status`
- **Manual Retry**: `POST /api/db-retry`
- **API Documentation**: `GET /api-docs`
