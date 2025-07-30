# Vercel Deployment Guide for Glydus Digital Business Card

## Overview
This guide will help you deploy your digital business card application to Vercel with proper database connectivity and API functionality.

## Prerequisites
1. A Vercel account (free at vercel.com)
2. MongoDB Atlas account (free tier available)
3. Git repository with your code

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier)
4. Set up database access:
   - Create a database user with read/write permissions
   - Note down username and password
5. Set up network access:
   - Add IP address `0.0.0.0/0` to allow all connections
6. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

## Step 2: Deploy Backend to Vercel

1. Create a new Vercel project for your backend:
   ```bash
   # Create a new directory for backend
   mkdir glydus-backend
   cd glydus-backend
   ```

2. Copy the `api/` folder contents to this new directory

3. Deploy to Vercel:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add environment variable: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/glydus-cards?retryWrites=true&w=majority`

## Step 3: Deploy Frontend to Vercel

1. In your main project directory, deploy to Vercel:
   ```bash
   vercel
   ```

2. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add environment variable: `REACT_APP_API_URL`
   - Value: Your backend Vercel URL (e.g., `https://your-backend.vercel.app`)

## Step 4: Update API Configuration

The application is now configured to:
- Use localhost for development
- Use production URLs when deployed
- Fall back to in-memory storage if database is unavailable

## Step 5: Test Your Deployment

1. Visit your frontend URL (e.g., `https://your-app.vercel.app`)
2. Create a new business card
3. Test the sharing functionality
4. Verify data persistence

## Troubleshooting

### Database Connection Issues
- Check your MongoDB Atlas connection string
- Ensure network access allows all IPs (`0.0.0.0/0`)
- Verify database user has correct permissions

### API Connection Issues
- Check that `REACT_APP_API_URL` is set correctly
- Verify your backend is deployed and accessible
- Check Vercel function logs for errors

### Environment Variables
- Ensure all environment variables are set in Vercel dashboard
- Redeploy after changing environment variables
- Check that variable names match exactly

## Alternative: Local Development

To run locally:

1. Start the backend:
   ```bash
   cd server
   npm install
   npm start
   ```

2. Start the frontend:
   ```bash
   npm install
   npm run dev
   ```

3. Access at `http://localhost:5173`

## File Structure After Deployment

```
GlydusDigiCard/
├── api/                    # Backend for Vercel
│   ├── index.js
│   ├── models/
│   ├── routes/
│   └── package.json
├── server/                 # Local development backend
├── components/             # Frontend components
├── services/
│   └── api.ts             # Updated for production
├── vercel.json            # Vercel configuration
└── package.json
```

## Environment Variables Summary

### Backend (Vercel)
- `MONGODB_URI`: Your MongoDB Atlas connection string

### Frontend (Vercel)
- `REACT_APP_API_URL`: Your backend Vercel URL

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection 