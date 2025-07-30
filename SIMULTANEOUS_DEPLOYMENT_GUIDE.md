# Running Local and Vercel Deployment Simultaneously

## 🎯 **How to Run Both Environments Without Conflicts**

You can absolutely run both local development and Vercel deployment at the same time! They use different ports and domains, so there are no conflicts.

## 🌐 **Environment Separation**

### **Local Development**
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **Database**: MongoDB Atlas (shared)

### **Production (Vercel)**
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.vercel.app/api`
- **Database**: MongoDB Atlas (shared)

## 🚀 **Step-by-Step Setup**

### **Step 1: Start Local Development**

```bash
# Terminal 1 - Start Frontend
npm run dev

# Terminal 2 - Start Backend
cd server
node server.js
```

### **Step 2: Deploy to Vercel**

```bash
# Terminal 3 - Deploy to Vercel
vercel --prod
```

### **Step 3: Access Both Environments**

- **Local**: `http://localhost:5173`
- **Production**: `https://your-app.vercel.app`

## 🔧 **Configuration for Simultaneous Use**

### **1. Environment Variables**

**Local Development** (`server/config.env`):
```env
MONGODB_URI=mongodb+srv://Skullzie:HfuHo18E5C8ouy18@scrapingdemo.pim7ssv.mongodb.net/glydus-cards?retryWrites=true&w=majority&appName=ScrapingDemo
PORT=5000
NODE_ENV=development
```

**Production (Vercel Dashboard)**:
```env
MONGODB_URI=mongodb+srv://Skullzie:HfuHo18E5C8ouy18@scrapingdemo.pim7ssv.mongodb.net/glydus-cards?retryWrites=true&w=majority&appName=ScrapingDemo
NODE_ENV=production
```

### **2. API URL Detection**

The application automatically detects which environment it's running in:

```javascript
// services/api.ts
const getApiBaseUrl = () => {
  // In production (Vercel), use the same domain
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    const baseUrl = `${window.location.origin}/api`;
    console.log('Using production API URL:', baseUrl);
    return baseUrl;
  }
  // In development, use localhost
  console.log('Using development API URL: http://localhost:5000/api');
  return 'http://localhost:5000/api';
};
```

## 📊 **Data Sharing Between Environments**

### **How It Works**
- ✅ **Same Database**: Both environments connect to MongoDB Atlas
- ✅ **Real-time Sync**: Changes in one environment appear in the other
- ✅ **No Conflicts**: MongoDB handles concurrent access safely
- ✅ **Consistent Data**: Same data everywhere

### **Example Workflow**
1. **Create card locally**: `http://localhost:5173`
2. **Check production**: `https://your-app.vercel.app`
3. **Card appears**: Same card shows in both environments
4. **Edit in production**: Changes appear locally too

## 🛠️ **Terminal Setup**

### **Option 1: Multiple Terminal Windows**

**Terminal 1 - Frontend Development**:
```bash
# Start frontend development server
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Backend Development**:
```bash
# Start backend server
cd server
node server.js
# Runs on http://localhost:5000
```

**Terminal 3 - Vercel Deployment**:
```bash
# Deploy to Vercel
vercel --prod
# Deploys to https://your-app.vercel.app
```

### **Option 2: Single Terminal with Background Processes**

```bash
# Start frontend in background
npm run dev &

# Start backend in background
cd server && node server.js &

# Deploy to Vercel
vercel --prod
```

## 🔍 **Testing Both Environments**

### **Local Testing**
```bash
# Test local API
curl http://localhost:5000/api/health
curl http://localhost:5000/api/cards

# Test local frontend
# Open http://localhost:5173 in browser
```

### **Production Testing**
```bash
# Test production API
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/cards

# Test production frontend
# Open https://your-app.vercel.app in browser
```

## 📈 **Monitoring Both Environments**

### **Local Development Logs**
- **Frontend**: Terminal 1 shows Vite dev server logs
- **Backend**: Terminal 2 shows Express server logs
- **API Calls**: Browser Network tab

### **Production Logs**
- **Vercel Dashboard**: Function logs and deployment status
- **API Calls**: Browser Network tab
- **Database**: MongoDB Atlas dashboard

## 🎯 **Use Cases for Simultaneous Deployment**

### **Development Workflow**
1. **Develop locally**: Make changes and test
2. **Deploy to production**: Push changes to Vercel
3. **Test both**: Ensure both environments work
4. **Share production**: Share Vercel URL with others

### **Testing Scenarios**
1. **Local testing**: Quick development and debugging
2. **Production testing**: Real-world environment testing
3. **Cross-browser testing**: Test on different browsers
4. **Performance testing**: Compare local vs production performance

### **Collaboration**
1. **Local development**: You work on local environment
2. **Production sharing**: Others access Vercel deployment
3. **Real-time feedback**: See changes in both environments
4. **Data consistency**: Same data everywhere

## 🛠️ **Troubleshooting**

### **Issue: Port conflicts**
**Solution**: Different ports are used
- **Local Frontend**: Port 5173
- **Local Backend**: Port 5000
- **Production**: Vercel handles ports

### **Issue: Database conflicts**
**Solution**: Same database, different access patterns
- **Local**: Direct API calls to localhost:5000
- **Production**: API calls to Vercel domain
- **Database**: MongoDB Atlas handles concurrent access

### **Issue: Environment variables**
**Solution**: Separate configuration
- **Local**: `server/config.env`
- **Production**: Vercel dashboard environment variables

### **Issue: Caching conflicts**
**Solution**: Different domains
- **Local**: `localhost` domain
- **Production**: Vercel domain
- **Browser**: Treats as separate sites

## 📝 **Best Practices**

### **Development Workflow**
1. **Start local development** first
2. **Test functionality** locally
3. **Deploy to production** when ready
4. **Test production** deployment
5. **Monitor both** environments

### **Data Management**
1. **Create test data** locally
2. **Verify data** appears in production
3. **Test data operations** in both environments
4. **Monitor database** usage

### **Performance Monitoring**
1. **Compare response times** between environments
2. **Monitor database** performance
3. **Check Vercel** function logs
4. **Optimize** based on findings

## 🎉 **Benefits of Simultaneous Deployment**

### **Development Benefits**
- ✅ **Rapid iteration**: Test changes quickly
- ✅ **Real-world testing**: Production environment testing
- ✅ **Collaboration**: Share production URL with others
- ✅ **Data consistency**: Same data everywhere

### **Deployment Benefits**
- ✅ **Zero downtime**: Deploy while local dev continues
- ✅ **Rollback capability**: Keep local as backup
- ✅ **A/B testing**: Compare local vs production
- ✅ **Performance comparison**: Local vs production performance

---

## 📋 **Quick Start Checklist**

### **Local Development**
- [ ] Start frontend: `npm run dev`
- [ ] Start backend: `cd server && node server.js`
- [ ] Test local: `http://localhost:5173`
- [ ] Test API: `http://localhost:5000/api/health`

### **Production Deployment**
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Test production: `https://your-app.vercel.app`
- [ ] Test API: `https://your-app.vercel.app/api/health`
- [ ] Share URL with others

### **Simultaneous Testing**
- [ ] Create data locally
- [ ] Verify data in production
- [ ] Test functionality in both environments
- [ ] Monitor performance differences

**You can now develop locally while having a live production deployment!** 🚀 