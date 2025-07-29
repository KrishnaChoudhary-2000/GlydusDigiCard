# Shared Card Fix Guide

## 🐛 Problem Description

When sharing digital cards, users encounter these issues:
1. **Vercel Login Prompt**: Users are asked to login to Vercel
2. **Network Errors**: "Network error occurred" when loading shared cards
3. **Broken Links**: Shared cards don't load properly

## 🔍 Root Cause Analysis

The issue occurs because:

1. **API URL Configuration**: The frontend is hardcoded to use `localhost:5000` for API calls
2. **Production vs Development**: In production (Vercel), the API should use the same domain
3. **Short URL Resolution**: Shared links try to call the API but fail due to incorrect URL

## ✅ Solutions Implemented

### 1. Dynamic API URL Detection

**File**: `services/api.ts`
```typescript
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

### 2. Enhanced Error Handling

**File**: `services/api.ts`
- Added detailed logging for API requests
- Better error messages with HTTP status codes
- Console debugging for troubleshooting

### 3. Production URL Generation

**File**: `server/routes/cards.js`
```javascript
const getFrontendUrl = () => {
    // In production, use the same domain as the request
    if (req.get('host') && req.get('host') !== 'localhost:5000') {
        return `https://${req.get('host')}`;
    }
    // In development, use localhost
    return 'http://localhost:5173';
};
```

## 🚀 Deployment Steps

### 1. Update Environment Variables

In your Vercel dashboard → Settings → Environment Variables:

```
GEMINI_API_KEY=your_actual_api_key_here
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
VITE_API_URL=https://your-vercel-app-name.vercel.app/api
```

### 2. Deploy the Changes

```bash
git add .
git commit -m "Fix shared card API URL configuration"
git push
```

### 3. Test the Fix

1. **Create a card** in your application
2. **Generate a short URL** using the share feature
3. **Test the shared link** in an incognito browser
4. **Verify** the card loads without errors

## 🔧 Testing Locally

### Start Both Servers

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

### Test API Endpoints

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test cards endpoint
curl http://localhost:5000/api/cards
```

## 📊 Monitoring

After deployment, check:

1. **Browser Console**: Look for API URL logs
2. **Network Tab**: Verify API requests are going to correct URLs
3. **Vercel Logs**: Check for any server-side errors

## 🐛 Troubleshooting

### Issue: Still getting network errors

**Solution**:
1. Check browser console for API URL logs
2. Verify environment variables are set in Vercel
3. Ensure the server is running and accessible

### Issue: Vercel login prompt

**Solution**:
1. This is likely a caching issue
2. Clear browser cache and cookies
3. Try in incognito mode

### Issue: Short URLs not working

**Solution**:
1. Check that the server routes are properly configured
2. Verify the short URL generation is using correct domain
3. Test the `/api/cards/resolve/:shortId` endpoint

## 📝 Expected Behavior

After the fix:

✅ **Shared links work** without login prompts
✅ **API calls use correct URLs** in production
✅ **Short URLs resolve properly** to card data
✅ **No network errors** when loading shared cards
✅ **Console logs show** correct API URLs being used

## 🔄 Rollback Plan

If issues persist:

1. **Revert to previous version**:
   ```bash
   git revert HEAD
   git push
   ```

2. **Use environment variable approach**:
   - Set `VITE_API_URL` in Vercel
   - Update `services/api.ts` to use `import.meta.env.VITE_API_URL`

---

**Status**: ✅ Ready for deployment
**Last Updated**: Fixed API URL configuration for shared cards 