# Glydus Digital Business Card - Deployment Guide

## Overview

This application is designed to work seamlessly with or without a database connection. It includes robust fallback mechanisms to ensure the application never fails due to database connection issues.

## Key Features

- **Graceful Database Fallback**: If MongoDB is unavailable, the app continues to work using in-memory storage
- **Automatic Retry Logic**: Database connection attempts with exponential backoff
- **Environment-Based Configuration**: Works in both development and production
- **Health Monitoring**: Built-in health checks and database status endpoints

## Deployment to Vercel

### 1. Prerequisites

- Vercel account
- MongoDB Atlas account (optional but recommended)
- Git repository with your code

### 2. Environment Variables Setup

In your Vercel project settings, add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
NODE_ENV=production
```

### 3. MongoDB Atlas Setup (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and add it to Vercel environment variables

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to link your project
```

### 5. Verify Deployment

After deployment, check these endpoints:

- **Health Check**: `https://your-domain.vercel.app/api/health`
- **Database Status**: `https://your-domain.vercel.app/api/db-status`
- **Cards API**: `https://your-domain.vercel.app/api/cards`

## Local Development

### 1. Start the Backend

```bash
cd server
npm install
npm start
```

### 2. Start the Frontend

```bash
npm install
npm run dev
```

### 3. Test Database Connection

```bash
# Check health endpoint
curl http://localhost:5000/api/health

# Check database status
curl http://localhost:5000/api/db-status
```

## Database Connection States

The application handles these database states:

1. **Connected**: MongoDB is available and working
2. **Connecting**: Attempting to connect to MongoDB
3. **Disconnected**: MongoDB is not available, using in-memory storage
4. **Error**: Connection failed, using in-memory storage

## Monitoring and Debugging

### Health Check Endpoint

```
GET /api/health
```

Returns:
```json
{
  "status": "OK",
  "message": "Glydus API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": "5m 30s",
  "memory": {
    "rss": "45MB",
    "heapUsed": "12MB",
    "heapTotal": "20MB"
  },
  "mongodb": {
    "connected": true,
    "connecting": false,
    "connectionState": 1,
    "retryCount": 0,
    "lastError": null,
    "connectionTime": 1500
  },
  "environment": {
    "nodeEnv": "production",
    "port": 5000,
    "hasMongoUri": true
  }
}
```

### Database Status Endpoint

```
GET /api/db-status
```

Returns:
```json
{
  "connected": true,
  "connecting": false,
  "retryCount": 0,
  "lastError": null,
  "connectionState": 1,
  "hasUri": true
}
```

## Troubleshooting

### Database Connection Issues

1. **Check Environment Variables**: Ensure `MONGODB_URI` is set in Vercel
2. **Verify MongoDB Atlas**: Check cluster status and network access
3. **Check Logs**: Use Vercel function logs to debug connection issues
4. **Test Locally**: Verify connection works in local development

### Application Still Works Without Database

If MongoDB is unavailable, the application will:
- Store cards in memory
- Continue to function normally
- Show appropriate status in health checks
- Automatically retry database connection

### Common Issues

1. **CORS Errors**: Check origin configuration in server.js
2. **Timeout Errors**: Increase function timeout in vercel.json
3. **Memory Issues**: Monitor memory usage in health checks
4. **Cold Starts**: Vercel functions may have cold start delays

## Performance Optimization

1. **Connection Pooling**: Optimized for serverless environments
2. **Compression**: Enabled for MongoDB connections
3. **Timeout Handling**: Proper timeout configuration
4. **Memory Management**: Efficient in-memory storage

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS Configuration**: Properly configured for production
3. **Input Validation**: All inputs are validated
4. **Error Handling**: No sensitive data in error messages

## Support

If you encounter issues:

1. Check the health endpoint for system status
2. Review Vercel function logs
3. Test database connection locally
4. Verify environment variables are set correctly

The application is designed to be resilient and will continue working even if the database is unavailable. 