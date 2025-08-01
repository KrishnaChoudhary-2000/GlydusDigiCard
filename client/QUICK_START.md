# Quick Start Guide - Glydus Digital Business Card Creator

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Start the Backend Server

```bash
cd server
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

**Note:** If you don't have MongoDB installed locally, the server will still work but will show:
```
Error connecting to MongoDB: connect ECONNREFUSED 127.0.0.1:27017
Starting server without database connection...
```

### 3. Start the Frontend Development Server

In a new terminal window:
```bash
npm run dev
```

**Expected Output:**
```
  VITE v6.3.5  ready in 2.17s

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Access the Application

- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:5000/api/health

## 🔧 Troubleshooting

### Connection Refused Errors

**Error:** `Failed to load resource: net::ERR_CONNECTION_REFUSED`

**Solution:**
1. Make sure the backend server is running on port 5000
2. Check that no other application is using port 5000
3. Verify the server started without errors

### MongoDB Connection Issues

**Error:** `Error connecting to MongoDB`

**Solutions:**
1. **For local development**: The server will work without MongoDB
2. **For production**: Set up MongoDB Atlas and update `server/config.env`

### Port Conflicts

**Error:** `EADDRINUSE`

**Solution:**
```bash
# Find processes using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## 📁 Project Structure

```
GlydusDigiCard/
├── server/                 # Backend API
│   ├── server.js          # Express server
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── config.env         # Environment variables
├── components/            # React components
├── services/             # API service layer
├── index.html            # Main HTML file
├── index.tsx             # React entry point
└── package.json          # Frontend dependencies
```

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `GET /api/cards` - Get all cards
- `POST /api/cards` - Create new card
- `GET /api/cards/:id` - Get specific card
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card
- `POST /api/cards/shorten` - Create short URL

## 🚀 Production Deployment

See `DEPLOYMENT.md` for Vercel deployment instructions.

---

**Status**: ✅ Ready for development
**Last Updated**: Fixed connection issues and server startup 