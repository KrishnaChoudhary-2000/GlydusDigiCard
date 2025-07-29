# Quick Start Guide

Get your digital business card creator running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm run setup
```

### 2. Start MongoDB (Choose One)

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition first, then:
mongod
```

**Option B: MongoDB Atlas (Free Cloud)**
- Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create free account
- Create cluster (FREE tier)
- Get connection string
- Update `server/config.env` with your connection string

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Open Your Browser
Visit: `http://localhost:5173`

## ✅ You're Done!

Your digital business card creator is now running with MongoDB database integration!

## 🔧 Troubleshooting

- **Backend won't start?** Check if MongoDB is running
- **Frontend won't load?** Check if backend is running on port 5000
- **Database errors?** Verify your MongoDB connection string

## 📖 Need More Help?

See the full [README.md](README.md) for detailed instructions. 