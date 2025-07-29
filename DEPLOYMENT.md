# Deployment Guide - Glydus Digital Business Card Creator

## Vercel Deployment

### ✅ Fixed Issues
- **MIME Type Error**: Fixed by updating `vercel.json` to properly route static assets
- **Module Loading**: JavaScript files now serve with correct MIME types

### 🚀 Quick Deploy Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Configure Environment Variables**
   In your Vercel project dashboard → Settings → Environment Variables:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=production
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - The build process creates static files in `dist/` directory
   - API routes are handled by the Node.js server

### 📁 Project Structure
```
GlydusDigiCard/
├── dist/                    # Built static files (auto-generated)
│   ├── assets/             # JavaScript bundles
│   ├── index.html          # Main HTML file
│   └── sw.js              # Service worker
├── server/                 # Backend API
│   ├── server.js          # Express server
│   ├── routes/            # API routes
│   └── models/            # Database models
├── vercel.json            # Vercel configuration ✅ FIXED
└── package.json           # Build scripts
```

### 🔧 Configuration Details

#### vercel.json (Updated)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/card/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/shared/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/dist/assets/$1"
    },
    {
      "src": "/sw.js",
      "dest": "/dist/sw.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 🐛 Common Issues & Solutions

#### 1. MIME Type Error
**Error**: `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"`

**Solution**: ✅ Fixed in `vercel.json` by adding proper asset routes

#### 2. Build Failures
**Error**: Build process fails

**Solution**: 
- Ensure all dependencies are in `package.json`
- Check that `npm run build` works locally
- Verify environment variables are set in Vercel

#### 3. API Routes Not Working
**Error**: `/api/*` routes return 404

**Solution**:
- Ensure `server/server.js` is properly configured
- Check that MongoDB connection string is set
- Verify server routes are correctly defined

### 🧪 Testing Locally

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Test the server**:
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Verify static files**:
   - Check that `dist/` directory contains built files
   - Ensure `dist/assets/` contains JavaScript bundles
   - Verify `dist/index.html` exists

### 📊 Monitoring

After deployment:
1. Check Vercel function logs for API errors
2. Monitor MongoDB connection status
3. Test all API endpoints
4. Verify static assets load correctly

### 🔄 Continuous Deployment

- Vercel automatically deploys on git push
- Environment variables persist across deployments
- Build cache speeds up subsequent deployments

---

**Last Updated**: Fixed MIME type error and routing configuration
**Status**: ✅ Ready for deployment 