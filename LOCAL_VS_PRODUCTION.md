# Local vs Production: Understanding Your Application

## 🔍 **Why You're Seeing Localhost**

When you run `npm run dev`, you're starting a **local development server** that runs on your computer. This is completely separate from your Vercel deployment.

### Local Development
- **URL**: `http://localhost:5173`
- **Server**: Runs on your computer
- **Database**: Connects to your local MongoDB Atlas
- **Purpose**: Development and testing

### Production Deployment (Vercel)
- **URL**: `https://your-app-name.vercel.app`
- **Server**: Runs on Vercel's servers
- **Database**: Same MongoDB Atlas (shared)
- **Purpose**: Live application for users

## 🌐 **How to Access Your Deployed Application**

### 1. Find Your Vercel URL
After deploying to Vercel, you'll get a URL like:
```
https://glydus-digi-card.vercel.app
```

### 2. Access Your Production App
- **Stop local development**: Press `Ctrl+C` in terminal
- **Open browser**: Go to your Vercel URL
- **Test functionality**: Create cards, edit, share

### 3. Check Deployment Status
```bash
# Check if you have Vercel CLI installed
vercel --version

# List your deployments
vercel ls

# Get your project URL
vercel info
```

## 🔄 **Environment Differences**

### Local Development (`localhost:5173`)
```javascript
// API calls go to local server
const API_URL = 'http://localhost:5000/api'

// Database: Your MongoDB Atlas
// Environment: Development
// Caching: Disabled for development
```

### Production (Vercel)
```javascript
// API calls go to same domain
const API_URL = 'https://your-app.vercel.app/api'

// Database: Same MongoDB Atlas
// Environment: Production
// Caching: Enabled for performance
```

## 🚀 **How to Deploy to Vercel**

### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project? Yes
# - Set up and deploy? Yes
```

### Option 2: Using GitHub Integration
1. **Push to GitHub**
2. **Connect Vercel to GitHub**
3. **Automatic deployments** on every push

### Option 3: Manual Upload
1. **Build the project**: `npm run build`
2. **Upload to Vercel dashboard**
3. **Configure environment variables**

## ⚙️ **Environment Variables**

### Local Development
```env
# server/config.env
MONGODB_URI=mongodb+srv://Skullzie:HfuHo18E5C8ouy18@scrapingdemo.pim7ssv.mongodb.net/glydus-cards?retryWrites=true&w=majority&appName=ScrapingDemo
PORT=5000
```

### Production (Vercel)
1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add the same variables**:
   ```
   MONGODB_URI=mongodb+srv://Skullzie:HfuHo18E5C8ouy18@scrapingdemo.pim7ssv.mongodb.net/glydus-cards?retryWrites=true&w=majority&appName=ScrapingDemo
   NODE_ENV=production
   ```

## 🔍 **How to Check Your Deployment**

### 1. Check Vercel Dashboard
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Find your project
- Check deployment status

### 2. Test Your Production URL
```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test cards endpoint
curl https://your-app.vercel.app/api/cards
```

### 3. Check Browser Console
- Open your Vercel URL in browser
- Open Developer Tools (F12)
- Check Console for any errors
- Look for API calls to your Vercel domain

## 🛠️ **Troubleshooting**

### Issue: Still seeing localhost
**Solution**: You're accessing the wrong URL
- ❌ `http://localhost:5173` (local development)
- ✅ `https://your-app.vercel.app` (production)

### Issue: Production not working
**Solutions**:
1. **Check Vercel deployment logs**
2. **Verify environment variables**
3. **Test API endpoints**
4. **Check database connection**

### Issue: Database connection errors in production
**Solutions**:
1. **Verify MongoDB Atlas network access**
2. **Check environment variables in Vercel**
3. **Test database connection**
4. **Check server logs**

## 📊 **Monitoring Your Application**

### Local Development
- **Server logs**: Terminal output
- **API calls**: Browser Network tab
- **Database**: MongoDB Atlas dashboard

### Production (Vercel)
- **Server logs**: Vercel dashboard → Functions
- **API calls**: Browser Network tab
- **Database**: MongoDB Atlas dashboard
- **Performance**: Vercel Analytics

## 🎯 **Quick Test Checklist**

### Local Development
- [ ] `npm run dev` starts successfully
- [ ] `http://localhost:5173` loads
- [ ] API calls work (`localhost:5000`)
- [ ] Database connection works
- [ ] Can create/edit cards

### Production Deployment
- [ ] Vercel deployment successful
- [ ] Production URL loads
- [ ] API calls work (same domain)
- [ ] Database connection works
- [ ] Can create/edit cards
- [ ] Shared links work

## 🔗 **Your URLs**

### Development
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **Database**: MongoDB Atlas

### Production
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.vercel.app/api`
- **Database**: Same MongoDB Atlas

---

## 📝 **Next Steps**

1. **Find your Vercel URL** in the dashboard
2. **Access your production app** using that URL
3. **Test all functionality** in production
4. **Share the production URL** with others
5. **Monitor logs** for any issues

**Remember**: Local development and production are completely separate environments! 