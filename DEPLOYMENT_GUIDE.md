# Glydus Digital Card - Deployment Guide

## Overview
This is a full-stack digital business card application with React frontend and Express.js backend, designed to be deployed on Vercel.

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + MongoDB + Mongoose
- **Deployment**: Vercel (Full-stack)

## Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB Atlas account
- Vercel account

## Environment Variables

### Backend (.env in server directory)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel Environment Variables)
```env
VITE_API_URL=https://your-backend-domain.vercel.app
```

## Local Development

### 1. Clone and Setup
```bash
git clone <repository-url>
cd GlydusDigiCard
pnpm install
```

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI
pnpm run dev
```

### 3. Frontend Setup
```bash
cd client
pnpm run dev
```

## Vercel Deployment

### 1. Project Structure
The project is configured for Vercel's monorepo deployment:
```
/
├── client/          # Frontend (React)
├── server/          # Backend (Express)
├── vercel.json      # Vercel configuration
└── package.json     # Root package.json
```

### 2. Vercel Configuration
The `vercel.json` file handles:
- Frontend routing (client directory)
- Backend API routes (server directory)
- Build commands for both
- Environment variable mapping

### 3. Deployment Steps

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Connect your GitHub repository
2. Vercel will auto-detect the configuration
3. Set environment variables in Vercel dashboard
4. Deploy

### 4. Environment Variables in Vercel
Set these in your Vercel project settings:

**Backend Variables:**
- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: `production`

**Frontend Variables:**
- `VITE_API_URL`: Your backend API URL (will be auto-generated)

## Build Process

### Frontend Build
- **Framework**: Vite
- **Output**: `client/dist`
- **Entry**: `client/index.html`

### Backend Build
- **Framework**: Express.js
- **Entry**: `server/server.js`
- **Output**: Serverless functions

## API Endpoints

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.vercel.app/api`

### Available Endpoints
- `GET /api/cards` - Get all cards
- `POST /api/cards` - Create new card
- `GET /api/cards/:id` - Get card by ID
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card
- `POST /api/cards/shorten` - Create short URL
- `GET /api/cards/short/:shortId` - Get card by short ID
- `GET /api/health` - Health check
- `GET /api/db-status` - Database status
- `GET /api-docs` - Swagger documentation

## Custom Domain Setup

### 1. Add Custom Domain in Vercel
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain

### 2. DNS Configuration
Configure your DNS provider:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### 3. Update Environment Variables
Update `VITE_API_URL` to use your custom domain:
```
VITE_API_URL=https://your-domain.com/api
```

## Monitoring and Logs

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor performance and errors

### Function Logs
- View serverless function logs in Vercel dashboard
- Monitor API performance and errors

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access
- Ensure database user has proper permissions

#### 2. CORS Issues
- Backend CORS is configured for production domains
- Update CORS origins in `server/server.js` if needed

#### 3. Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

#### 4. API 404 Errors
- Verify API routes are properly configured
- Check Vercel function deployment
- Ensure environment variables are set

### Debug Commands
```bash
# Check Vercel deployment status
vercel ls

# View function logs
vercel logs

# Test local build
vercel build
```

## Performance Optimization

### Frontend
- Vite build optimization
- Tailwind CSS purging
- Image optimization
- Code splitting

### Backend
- MongoDB connection pooling
- Serverless function optimization
- Response caching
- Error handling

## Security Considerations

### Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable system
- Rotate database credentials regularly

### API Security
- CORS configuration
- Input validation
- Rate limiting (consider adding)
- HTTPS enforcement

## Maintenance

### Regular Tasks
- Monitor Vercel function performance
- Update dependencies regularly
- Check MongoDB Atlas usage
- Review and rotate API keys

### Backup Strategy
- MongoDB Atlas automated backups
- Code repository backup
- Environment variable documentation

## Support

For issues and questions:
1. Check Vercel documentation
2. Review MongoDB Atlas guides
3. Check project GitHub issues
4. Contact development team 