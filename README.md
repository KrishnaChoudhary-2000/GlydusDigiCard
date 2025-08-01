# Glydus Digital Business Card Creator

A modern, responsive web application for creating and sharing digital business cards with real-time editing capabilities.

## Features

- **Real-time Card Editor**: Create and customize digital business cards with live preview
- **Image Upload**: Upload profile pictures and company logos with drag-and-drop support
- **Social Media Integration**: Add LinkedIn, Instagram, WhatsApp, Facebook, X, and YouTube links
- **Customizable Styling**: Adjust colors, fonts, and layout to match your brand
- **Short URL Generation**: Create shareable links for your digital cards
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **VCard Export**: Save contact information directly to phone contacts

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **PostCSS** for CSS processing

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose (with in-memory fallback)
- **CORS** enabled for cross-origin requests

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (optional - app works with in-memory fallback)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GlydusDigiCard
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Create environment file for backend
   cp server/config.env.example server/config.env
   ```
   
   Edit `server/config.env`:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Start backend server
   cd server
   npm start
   
   # In another terminal, start frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server

### Project Structure

```
GlydusDigiCard/
├── components/          # React components
│   ├── AppUI.tsx       # Header, Toast, and UI components
│   ├── AppModals.tsx   # Modal components
│   ├── Card.tsx        # Card preview components
│   ├── EditorPanel.tsx # Card editor interface
│   └── PublicCardPage.tsx # Public card view
├── assets/             # Static assets
│   └── icons.tsx       # SVG icons
├── services/           # API services
│   └── api.ts         # API client
├── server/            # Backend server
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   └── server.js      # Express server
├── types.ts           # TypeScript type definitions
├── constants.ts       # Application constants
└── vercel.json        # Vercel deployment config
```

## Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Environment Variables**
   Set the following in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`

### Manual Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Deploy backend**
   ```bash
   cd server
   npm start
   ```

3. **Serve frontend**
   ```bash
   npm run preview
   ```

## API Endpoints

### Cards
- `GET /api/cards` - Get all cards
- `GET /api/cards/:id` - Get specific card
- `POST /api/cards` - Create new card
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card

### Short URLs
- `POST /api/cards/shorten` - Create short URL
- `GET /api/cards/short/:shortId` - Get card by short ID

### Health
- `GET /api/health` - Health check
- `GET /api/db-status` - Database status

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `MONGODB_URI` | MongoDB connection string | No | In-memory fallback |
| `NODE_ENV` | Environment mode | No | development |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team. 