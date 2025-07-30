# Local Development Setup

## 🎯 **Simple Local Development**

Your application is now restored to a simple local development setup without Vercel complexity.

## 🚀 **How to Run**

### **Step 1: Start the Backend Server**
```bash
# Navigate to server directory
cd server

# Start the server
node server.js
```

**Expected Output**:
```
Environment: development
Port: 5000
MongoDB URI: Set
Server running on port 5000
```

### **Step 2: Start the Frontend**
```bash
# In a new terminal, from the root directory
npm run dev
```

**Expected Output**:
```
VITE v6.3.5  ready in 383 ms
➜  Local:   http://localhost:5173/
```

### **Step 3: Access Your Application**
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

## 🔧 **Configuration**

### **Database Configuration** (`server/config.env`)
```env
MONGODB_URI=mongodb+srv://Skullzie:HfuHo18E5C8ouy18@scrapingdemo.pim7ssv.mongodb.net/glydus-cards?retryWrites=true&w=majority&appName=ScrapingDemo
PORT=5000
```

### **API Configuration** (`services/api.ts`)
```typescript
// Simple local API configuration
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📊 **What's Working**

### ✅ **Backend Features**
- **Health Check**: `http://localhost:5000/api/health`
- **Cards API**: `http://localhost:5000/api/cards`
- **Database**: MongoDB Atlas connection
- **In-memory Fallback**: Works without database

### ✅ **Frontend Features**
- **Card Creation**: Create new business cards
- **Card Editing**: Edit existing cards
- **Card Sharing**: Generate shareable links
- **Data Migration**: Automatic data structure updates

## 🧪 **Testing Your Application**

### **Test API Endpoints**
```bash
# Health check
curl http://localhost:5000/api/health

# Get all cards
curl http://localhost:5000/api/cards

# Create a card
curl -X POST http://localhost:5000/api/cards \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","title":"Developer"}'
```

### **Test Frontend**
1. **Open browser**: `http://localhost:5173`
2. **Create a card**: Fill in the form and save
3. **Edit a card**: Modify details and save
4. **Share a card**: Generate a shareable link

## 🔍 **Troubleshooting**

### **Issue: Server not starting**
**Solution**:
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <process_id>

# Start server again
cd server && node server.js
```

### **Issue: Frontend not connecting to API**
**Check**:
1. **Backend running**: `http://localhost:5000/api/health`
2. **Browser console**: Check for API errors
3. **Network tab**: Verify API calls to localhost:5000

### **Issue: Database connection failed**
**Solution**: Application will use in-memory fallback
- ✅ **Data persists**: During server runtime
- ⚠️ **Data resets**: When server restarts
- ✅ **All features work**: Create, edit, share cards

## 📝 **Development Workflow**

### **Daily Development**
1. **Start backend**: `cd server && node server.js`
2. **Start frontend**: `npm run dev`
3. **Make changes**: Edit code as needed
4. **Test changes**: Refresh browser to see updates
5. **Create data**: Test with real card data

### **Testing Features**
1. **Create cards**: Test card creation
2. **Edit cards**: Test card editing
3. **Share cards**: Test sharing functionality
4. **Data persistence**: Test data saving

## 🎉 **Benefits of Local-Only Setup**

### **Simplicity**
- ✅ **No deployment complexity**: Just run locally
- ✅ **Fast development**: Instant feedback
- ✅ **Easy debugging**: Direct access to logs
- ✅ **No environment issues**: Consistent setup

### **Reliability**
- ✅ **Stable environment**: No external dependencies
- ✅ **Predictable behavior**: Same setup every time
- ✅ **Easy troubleshooting**: Clear error messages
- ✅ **Fast iteration**: Quick development cycle

### **Data Management**
- ✅ **Local database**: MongoDB Atlas connection
- ✅ **In-memory fallback**: Works without database
- ✅ **Data persistence**: During development session
- ✅ **Easy reset**: Restart server to clear data

## 📋 **Quick Start Checklist**

### **Backend Setup**
- [ ] Navigate to server directory: `cd server`
- [ ] Start server: `node server.js`
- [ ] Verify running: Check console output
- [ ] Test API: `curl http://localhost:5000/api/health`

### **Frontend Setup**
- [ ] Start frontend: `npm run dev`
- [ ] Open browser: `http://localhost:5173`
- [ ] Test application: Create and edit cards
- [ ] Verify functionality: All features working

### **Database Setup**
- [ ] Check connection: Server logs show MongoDB status
- [ ] Test fallback: Works without database
- [ ] Verify data: Cards save and load correctly
- [ ] Test sharing: Generate shareable links

---

## 🎯 **Summary**

Your application is now in a **simple, stable local development state**:

- ✅ **No Vercel complexity**: Pure local development
- ✅ **Simple configuration**: Easy to understand and modify
- ✅ **Reliable operation**: Consistent behavior
- ✅ **Fast development**: Quick iteration cycle
- ✅ **Easy debugging**: Clear error messages

**You can now focus on developing features without deployment complications!** 🚀 