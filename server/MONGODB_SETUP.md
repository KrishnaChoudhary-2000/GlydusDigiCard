# MongoDB Setup Guide

## 🚀 Fresh MongoDB Connection Setup

Your server has been completely reset with a clean, simple MongoDB connection. Here's how to set it up:

## 📝 Create Environment File

Create a file called `.env` in the `server` folder with your MongoDB connection string.

### **Option 1: MongoDB Atlas (Recommended)**
```ini
MONGODB_URI=mongodb+srv://<YOUR_USERNAME>:uoFwlkOGPH36hezI@<YOUR_CLUSTER_HOST>/glydus-card?retryWrites=true&w=majority
```

### **Option 2: Local MongoDB with Auth**
```ini
MONGODB_URI=mongodb://<YOUR_USERNAME>:uoFwlkOGPH36hezI@localhost:27017/glydus-card?authSource=admin
```

### **Option 3: Local MongoDB without Auth**
```ini
MONGODB_URI=mongodb://localhost:27017/glydus-card
```

## 🔧 What to Replace

- `<YOUR_USERNAME>` - Your MongoDB username
- `<YOUR_CLUSTER_HOST>` - Your MongoDB Atlas cluster hostname (e.g., `cluster0.abc123.mongodb.net`)

## 📊 Database Details

- **Database Name**: `glydus-card` (will be created automatically)
- **Collection Name**: `cards` (will be created automatically)
- **Model**: Uses Mongoose schema with timestamps

## ✅ Test Your Connection

1. Create the `.env` file with your connection string
2. Restart the server: `pnpm run dev:server`
3. Check connection status: `http://localhost:5000/api/db-status`
4. Check health: `http://localhost:5000/api/health`

## 🎯 Expected Output

When connected successfully, you should see:
```
🚀 Starting server on port 5000
🔌 Connecting to MongoDB...
✅ MongoDB connected successfully!
🗄️  Database: glydus-card
📊 Collections: cards
🎉 Server running on http://localhost:5000
```

## 🚨 Troubleshooting

- **"MONGODB_URI environment variable is not set"** - Check your `.env` file
- **"Authentication failed"** - Verify username/password
- **"Connection timeout"** - Check network/firewall settings
- **"Invalid connection string"** - Verify URI format

## 💡 Fallback Mode

If MongoDB connection fails, the server will start in "fallback mode" where cards are stored in memory (not persistent). You'll see a warning message about this.
