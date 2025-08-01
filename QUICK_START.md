# Glydus Digital Card - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will get you up and running with the Glydus Digital Card application quickly.

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

## Quick Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd GlydusDigiCard

# Option 1: Use installation script (recommended)
./install.bat          # Windows
./install.sh           # Unix/Linux

# Option 2: Manual installation
pnpm install           # Root dependencies
cd client && pnpm install && cd ..  # Client dependencies
cd server && pnpm install && cd ..  # Server dependencies
```

### 2. Environment Setup

#### Backend (.env file)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=development
PORT=5000
```

#### Frontend (.env file)
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Servers

#### Terminal 1 - Backend
```bash
cd server
pnpm run dev
```

#### Terminal 2 - Frontend
```bash
cd client
pnpm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

## 🎯 What You Can Do

### Create Digital Cards
1. Fill in your information (name, title, company, etc.)
2. Upload a profile picture
3. Add social media links
4. Customize the theme
5. Save your card

### Share Cards
1. Create a short URL for your card
2. Share the link with others
3. Recipients can view your card instantly

### Manage Cards
- Edit existing cards
- Delete cards
- View all your cards

## 📁 Project Structure

```
GlydusDigiCard/
├── client/                 # React frontend
│   ├── components/         # React components
│   ├── services/          # API services
│   ├── assets/            # Static assets
│   └── ...
├── server/                # Express backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── ...
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json
```

## 🔧 Available Scripts

### Root Level
```bash
pnpm install          # Install all dependencies
pnpm run dev:all      # Start both frontend and backend
```

### Backend (server/)
```bash
pnpm run dev          # Start development server
pnpm run start        # Start production server
```

### Frontend (client/)
```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
```

## 🌐 API Endpoints

### Cards
- `GET /api/cards` - Get all cards
- `POST /api/cards` - Create new card
- `GET /api/cards/:id` - Get card by ID
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card

### Short URLs
- `POST /api/cards/shorten` - Create short URL
- `GET /api/cards/short/:shortId` - Get card by short ID

### System
- `GET /api/health` - Health check
- `GET /api/db-status` - Database status
- `GET /api-docs` - Swagger documentation

## 🚀 Deploy to Production

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment
1. Set up MongoDB Atlas
2. Configure environment variables
3. Build frontend: `cd client && pnpm run build`
4. Deploy backend to your preferred platform

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check if port 5000 is available
- Verify MongoDB URI is correct
- Check Node.js version (18+)

#### Frontend Won't Connect to Backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in client/.env
- Verify CORS settings

#### Database Connection Issues
- Check MongoDB Atlas status
- Verify network access settings
- Test connection string

### Debug Commands
```bash
# Check Node.js version
node --version

# Check pnpm version
pnpm --version

# Test backend health
curl http://localhost:5000/api/health

# Test database status
curl http://localhost:5000/api/db-status
```

## 📚 Next Steps

1. **Customize**: Modify themes and styling
2. **Extend**: Add new features and endpoints
3. **Deploy**: Set up production deployment
4. **Monitor**: Add analytics and monitoring
5. **Scale**: Optimize for high traffic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Documentation**: Check the full deployment guide
- **Issues**: Report bugs on GitHub
- **Questions**: Open a discussion

## 🎉 You're All Set!

Your digital card application is now running locally. Start creating and sharing your digital business cards! 