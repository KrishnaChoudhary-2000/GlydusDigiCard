# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Database**: Set up a MongoDB Atlas cluster
3. **GitHub Repository**: Push your code to GitHub

## Environment Variables

Set these environment variables in your Vercel dashboard:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/glydus-cards?retryWrites=true&w=majority
IMGBB_API_KEY=a4ffb711bb7e22187e16d0a6398d35d0
NODE_ENV=production
```

## Deployment Steps

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add the variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

## Post-Deployment

1. **Update API URLs**:
   - Replace `your-vercel-app-name.vercel.app` in `services/api.ts` with your actual Vercel URL
   - Replace the URL in `server/routes/cards.js` with your actual Vercel URL

2. **Test the Application**:
   - Test card creation
   - Test short URL generation
   - Test sharing functionality

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update the URLs in the code with your custom domain

## Troubleshooting

- **Build Errors**: Check that all dependencies are in `package.json`
- **API Errors**: Verify MongoDB connection string
- **Short URLs**: Ensure the Vercel URL is correctly set in the code 