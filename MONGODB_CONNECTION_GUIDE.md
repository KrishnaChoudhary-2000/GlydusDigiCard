# 🔌 MongoDB Connection Guide - Ensuring Reliable Database Connectivity

## 🎯 Overview

This guide will help you ensure MongoDB is always connected and working properly with your Glydus Digital Business Card application.

## 📋 Quick Checklist

### ✅ Before Starting
- [ ] MongoDB Atlas cluster is running
- [ ] IP address is whitelisted in MongoDB Atlas
- [ ] Database user has correct permissions
- [ ] Connection string is properly formatted
- [ ] Network connection is stable

## 🧪 Testing Your MongoDB Connection

### Step 1: Run the Connection Test
```bash
cd server
node test-mongo.js
```

### Step 2: Check Expected Output
If successful, you should see:
```
🧪 Testing MongoDB Connection...

🔌 MongoDB URI found
📡 Attempting to connect...

✅ MongoDB connected successfully!
📊 Connection state: 1
🏠 Database: glydus-cards
🌐 Host: scrapingdemo.pim7ssv.mongodb.net
🔢 Port: 27017

🧪 Testing database operations...
✅ Write operation successful
✅ Read operation successful
✅ Delete operation successful

🎉 All MongoDB operations working correctly!
🔌 Connection closed

✅ MongoDB connection test PASSED
```

## 🔧 Troubleshooting Common Issues

### ❌ Authentication Failed
**Error:** `bad auth : authentication failed`

**Solutions:**
1. **Check MongoDB Atlas User:**
   - Go to MongoDB Atlas → Database Access
   - Verify username and password are correct
   - Ensure user has "Read and write to any database" permissions

2. **Reset Password:**
   - In MongoDB Atlas → Database Access
   - Click "Edit" on your user
   - Click "Reset Password"
   - Update your `config.env` file with the new password

### ❌ Network Error
**Error:** `ENOTFOUND` or `ETIMEDOUT`

**Solutions:**
1. **Check Internet Connection:**
   - Ensure you have a stable internet connection
   - Try accessing other websites

2. **Check MongoDB Atlas Status:**
   - Visit [MongoDB Atlas Status Page](https://status.cloud.mongodb.com/)
   - Ensure your cluster region is operational

3. **Check IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Add your current IP address or `0.0.0.0/0` for all IPs
   - Wait 1-2 minutes for changes to take effect

### ❌ Connection Timeout
**Error:** `Operation buffering timed out after 10000ms`

**Solutions:**
1. **Increase Timeout Settings:**
   - The server is already configured with proper timeouts
   - Check your network stability

2. **Check Firewall:**
   - Ensure port 27017 is not blocked
   - Check if your antivirus is blocking the connection

## 🚀 Ensuring Persistent Connection

### 1. Enhanced Server Configuration
The server now includes:
- ✅ Automatic reconnection attempts
- ✅ Connection state monitoring
- ✅ Detailed error logging
- ✅ Graceful fallback to in-memory storage

### 2. Health Check Endpoint
Monitor your MongoDB connection status:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Glydus API is running",
  "timestamp": "2025-07-30T07:29:14.300Z",
  "mongodb": {
    "connected": true,
    "connectionState": 1,
    "retries": 0
  }
}
```

### 3. Connection States
- `0` = disconnected
- `1` = connected
- `2` = connecting
- `3` = disconnecting

## 🔄 Automatic Reconnection

The server now automatically:
- ✅ Attempts to reconnect when disconnected
- ✅ Retries up to 5 times with 5-second intervals
- ✅ Logs all connection events
- ✅ Continues serving requests with in-memory fallback

## 📊 Monitoring Your Connection

### Real-time Monitoring
Watch the server logs for connection status:
```bash
node server/server.js
```

You'll see:
- `🔌 Attempting to connect to MongoDB...`
- `✅ MongoDB connected successfully`
- `⚠️ MongoDB disconnected` (if connection drops)
- `🔄 Attempting to reconnect to MongoDB (attempt 1/5)`

### Health Check Monitoring
Create a simple monitoring script:
```bash
# Check connection every 30 seconds
while true; do
  curl -s http://localhost:5000/api/health | jq '.mongodb.connected'
  sleep 30
done
```

## 🛠️ Manual Connection Testing

### Test Connection String
```bash
# Test your connection string directly
mongosh "mongodb+srv://Skullzie:HfuHo18E5C8ouy18@scrapingdemo.pim7ssv.mongodb.net/glydus-cards"
```

### Test with MongoDB Compass
1. Download MongoDB Compass
2. Use your connection string
3. Test read/write operations

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Never commit credentials to git
- ✅ Use `.env` files for local development
- ✅ Use environment variables in production

### 2. Database User Permissions
- ✅ Create dedicated users for your application
- ✅ Use least privilege principle
- ✅ Regularly rotate passwords

### 3. Network Security
- ✅ Whitelist only necessary IP addresses
- ✅ Use VPC peering for production
- ✅ Enable MongoDB Atlas security features

## 🚨 Emergency Procedures

### If MongoDB is Down
1. **Check Application Status:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Application Will Continue Working:**
   - ✅ Cards are stored in memory
   - ✅ All features remain functional
   - ✅ Data persists until server restart

3. **When MongoDB Returns:**
   - ✅ Server automatically reconnects
   - ✅ No data loss (if using in-memory fallback)
   - ✅ Seamless transition back to database

## 📈 Performance Monitoring

### Connection Metrics
Monitor these metrics:
- Connection success rate
- Reconnection attempts
- Response times
- Error rates

### Log Analysis
Look for patterns in logs:
- Frequent disconnections
- Authentication failures
- Network timeouts

## 🎯 Success Indicators

You'll know MongoDB is properly connected when:
- ✅ `node test-mongo.js` passes all tests
- ✅ Health check shows `"connected": true`
- ✅ Server logs show `✅ MongoDB connected successfully`
- ✅ No timeout errors in application logs
- ✅ Cards are being saved to database (not just memory)

## 📞 Getting Help

If you're still having issues:
1. Run the connection test: `node test-mongo.js`
2. Check MongoDB Atlas status page
3. Verify your connection string format
4. Test with MongoDB Compass
5. Check your network connectivity

---

**Remember:** The application is designed to work even without MongoDB, so your users won't experience downtime even if the database is temporarily unavailable. 