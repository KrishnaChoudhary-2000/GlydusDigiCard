# 🃏 Glydus Digital Card

A modern, full-stack digital business card application built with React, Express.js, and MongoDB. Create, customize, and share your professional digital business cards instantly.

![Glydus Digital Card](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Express.js](https://img.shields.io/badge/Express.js-4.18.2-green?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8.17.0-green?style=for-the-badge&logo=mongodb)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)

## ✨ Features

- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- 📱 **Mobile-First**: Optimized for all devices
- 🔗 **Short URLs**: Generate shareable links for your cards
- 🎯 **Customizable**: Multiple themes and styling options
- 📊 **Real-time**: Instant updates and live preview
- 🔒 **Secure**: Built-in security features and validation
- 📚 **API Documentation**: Complete Swagger UI documentation
- 🚀 **Vercel Ready**: Optimized for serverless deployment

## 🏗️ Architecture

```
GlydusDigiCard/
├── client/                 # React Frontend
│   ├── components/         # React Components
│   ├── services/          # API Services
│   ├── assets/            # Static Assets
│   └── ...
├── server/                # Express Backend
│   ├── routes/            # API Routes
│   ├── models/            # Database Models
│   └── ...
├── vercel.json            # Vercel Configuration
└── package.json           # Root Package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- MongoDB Atlas account

### 1. Clone & Install
```bash
git clone https://github.com/your-username/GlydusDigiCard.git
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
```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your MongoDB URI

# Frontend
cd ../client
cp .env.example .env
# Edit .env with your API URL
```

### 3. Start Development
```bash
# Start both frontend and backend
pnpm run dev

# Or start individually
pnpm run dev:client  # Frontend only
pnpm run dev:server  # Backend only
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

> 📖 **Port Configuration**: See [PORT_CONFIGURATION.md](PORT_CONFIGURATION.md) for detailed port setup information.

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[API Documentation](http://localhost:5000/api-docs)** - Interactive Swagger docs

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

## 🚀 Deployment

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
3. Build frontend: `pnpm run build:client`
4. Deploy backend to your preferred platform

## 🛠️ Development

### Available Scripts

#### Root Level
```bash
pnpm run dev          # Start both frontend and backend
pnpm run build        # Build both frontend and backend
pnpm run clean        # Clean all node_modules and dist
```

#### Frontend (client/)
```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
```

#### Backend (server/)
```bash
pnpm run dev          # Start development server
pnpm run start        # Start production server
```

### Tech Stack

#### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation

#### Backend
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Swagger** - API Documentation
- **CORS** - Cross-Origin Support

#### Deployment
- **Vercel** - Hosting Platform
- **MongoDB Atlas** - Cloud Database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Express.js](https://expressjs.com/) - Web Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Deployment Platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework

## 📞 Support

- **Documentation**: Check the guides in this repository
- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/GlydusDigiCard/issues)
- **Questions**: Open a [GitHub Discussion](https://github.com/your-username/GlydusDigiCard/discussions)

---

**Made with ❤️ by the Glydus Team** 