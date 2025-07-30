# 🚀 Quick Start Guide - Glydus Digital Business Card

## 🎯 Overview
This guide will help you get your digital business card application running both locally and on Vercel with proper database connectivity.

## 📋 Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Vercel account (for deployment)
- MongoDB Atlas account (for production database)

## 🏠 Local Development

### Option 1: Quick Start (Windows)
1. Double-click `start-app.bat` or run `start-app.ps1`
2. Wait for both servers to start
3. Open http://localhost:5173 in your browser

### Option 2: Manual Start
1. **Start Backend Server:**
   ```bash
   cd server
   npm install
   npm start
   ```
   Backend will run on http://localhost:5000

2. **Start Frontend Server:**
   ```bash
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:5173

3. **Test the Setup:**
   ```bash
   node test-local-setup.js
   ```

## 🌐 Vercel Deployment

### Step 1: Prepare Your Environment
1. **Set up MongoDB Atlas:**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Set network access to `0.0.0.0/0`
   - Create database user with read/write permissions
   - Get your connection string

2. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

### Step 2: Deploy Backend
1. **Create backend project:**
   ```bash
   mkdir glydus-backend
   cd glydus-backend
   # Copy contents from api/ folder
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```

3. **Set environment variables:**
   - Go to Vercel dashboard → Project Settings → Environment Variables
   - Add: `MONGODB_URI` = Your MongoDB Atlas connection string

### Step 3: Deploy Frontend
1. **Deploy main project:**
   ```bash
   vercel
   ```

2. **Set environment variables:**
   - Add: `REACT_APP_API_URL` = Your backend Vercel URL

## 🔧 Configuration Files

### Environment Variables
- **Local Development:** Uses `server/config.env`
- **Vercel Backend:** Set `MONGODB_URI` in Vercel dashboard
- **Vercel Frontend:** Set `REACT_APP_API_URL` in Vercel dashboard

### API Configuration
The application automatically detects:
- **Local:** Uses `http://localhost:5000/api`
- **Production:** Uses environment variable or deployed backend URL

## 🧪 Testing

### Local Testing
```bash
# Test backend connectivity
node test-local-setup.js

# Test API endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/cards
```

### Production Testing
1. Visit your Vercel frontend URL
2. Create a new business card
3. Test sharing functionality
4. Verify data persistence

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check if port 5000 is available
- Verify MongoDB connection string
- Check server logs for errors

**Frontend not connecting to backend:**
- Verify backend is running on port 5000
- Check CORS settings
- Test API endpoints directly

**Database connection issues:**
- Verify MongoDB Atlas connection string
- Check network access settings
- Ensure database user has correct permissions

**Vercel deployment issues:**
- Check environment variables are set correctly
- Verify function logs in Vercel dashboard
- Test API endpoints directly

### Debug Commands
```bash
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Test API directly
curl -X GET http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/cards -H "Content-Type: application/json" -d "{\"name\":\"Test\"}"
```

## 📁 Project Structure
```
GlydusDigiCard/
├── api/                    # Vercel backend
├── server/                 # Local backend
├── components/             # React components
├── services/
│   └── api.ts             # API configuration
├── start-app.bat          # Windows quick start
├── start-app.ps1          # PowerShell quick start
├── test-local-setup.js    # Local testing
└── vercel.json            # Vercel configuration
```

## 🎉 Success Indicators

### Local Development
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173
- ✅ Can create and save business cards
- ✅ Can share cards via short URLs

### Vercel Deployment
- ✅ Frontend accessible at your Vercel URL
- ✅ Backend API responding correctly
- ✅ Database storing card data
- ✅ Sharing functionality working

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel function logs
3. Test API endpoints directly
4. Verify environment variables

## 🔄 Updates

The application includes:
- ✅ Automatic environment detection
- ✅ Fallback to in-memory storage
- ✅ Error handling and logging
- ✅ Production-ready configuration 