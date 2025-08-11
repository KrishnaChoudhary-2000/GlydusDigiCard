# Port Configuration

This project is configured to run the frontend and backend on separate ports for development.

## 🚀 Quick Setup

The project uses pnpm workspaces for managing the monorepo structure. The workspace configuration is defined in `pnpm-workspace.yaml`.

## Port Configuration

### Frontend (React + Vite)
- **Port**: 3000
- **URL**: http://localhost:3000
- **Configuration**: Set in `client/vite.config.ts`

### Backend (Express.js)
- **Port**: 5000
- **URL**: http://localhost:5000
- **API Endpoint**: http://localhost:5000/api
- **Configuration**: Set in `server/server.js`

## Development Setup

1. **Start both services simultaneously**:
   ```bash
   pnpm run dev
   ```

2. **Start services individually**:
   ```bash
   # Start backend only (port 5000)
   pnpm run dev:server
   
   # Start frontend only (port 3000)
   pnpm run dev:client
   ```

## API Proxy Configuration

The frontend is configured with a proxy that automatically forwards API requests from the frontend to the backend:

- Frontend makes requests to `/api/*`
- Vite proxy forwards these to `http://localhost:5000/api/*`
- This eliminates CORS issues during development

## Environment Variables

### Backend Environment Variables
- `PORT`: Backend port (default: 5000)
- `MONGODB_URI`: MongoDB connection string

### Frontend Environment Variables
- `VITE_PORT`: Frontend port (default: 3000)
- `VITE_API_URL`: API base URL for production

## Production Deployment

In production, the frontend and backend can be deployed separately:
- Frontend: Deployed to Vercel, Netlify, or similar
- Backend: Deployed to Vercel, Railway, or similar
- Update `VITE_API_URL` in production to point to your deployed backend URL
