import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.log('Starting server without database connection...');
    // Continue without database for now
  }
};

connectDB();

// Routes
app.use('/api/cards', (await import('./routes/cards.js')).default);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Glydus API is running',
    timestamp: new Date().toISOString()
  });
});

// Handle short URL redirects
app.get('/card/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;
    
    // Import the cards router to access the shortUrls Map
    const cardsRouter = await import('./routes/cards.js');
    const shortUrls = cardsRouter.default.shortUrls || new Map();
    
    // Get card ID from short URL
    const cardId = shortUrls.get(shortId);
    
    if (!cardId) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Find the card
    let card;
    try {
      const Card = (await import('./models/Card.js')).default;
      card = await Card.findById(cardId);
    } catch (error) {
      card = null;
    }

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Redirect to a secure shared view route
    res.redirect(`/shared/${shortId}`);
  } catch (error) {
    console.error('Error redirecting short URL:', error);
    res.status(500).json({ error: 'Failed to redirect' });
  }
});

// Secure shared card view route
app.get('/shared/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;
    
    // Set security headers
    res.set({
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff'
    });
    
    // Import the cards router to access the shortUrls Map
    const cardsRouter = await import('./routes/cards.js');
    const shortUrls = cardsRouter.default.shortUrls || new Map();
    
    // Get card ID from short URL
    const cardId = shortUrls.get(shortId);
    
    if (!cardId) {
      return res.status(404).send(`
        <html>
          <head><title>Card Not Found</title></head>
          <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a1a; color: white;">
            <div style="text-align: center;">
              <h1>Card Not Found</h1>
              <p>The shared card link is invalid or has expired.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Find the card
    let card;
    try {
      const Card = (await import('./models/Card.js')).default;
      card = await Card.findById(cardId);
    } catch (error) {
      card = null;
    }

    if (!card) {
      return res.status(404).send(`
        <html>
          <head><title>Card Not Found</title></head>
          <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a1a; color: white;">
            <div style="text-align: center;">
              <h1>Card Not Found</h1>
              <p>The shared card could not be loaded.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Serve a secure HTML page that loads the card data
    const secureHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${card.name || 'Digital Business Card'}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="robots" content="noindex, nofollow">
          <meta name="googlebot" content="noindex, nofollow">
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            #root { width: 100%; height: 100vh; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            // Prevent access to admin dashboard
            window.history.pushState(null, '', window.location.href);
            window.addEventListener('popstate', function() {
              window.history.pushState(null, '', window.location.href);
            });
            
            // Prevent right-click context menu
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
            });
            
            // Prevent keyboard shortcuts for navigation
            document.addEventListener('keydown', function(e) {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
              }
            });
            
            // Load the card data securely
            window.cardData = ${JSON.stringify(card)};
            window.location.href = '/?shared=true&cardId=${cardId}';
          </script>
        </body>
      </html>
    `;
    
    res.send(secureHtml);
  } catch (error) {
    console.error('Error serving shared card:', error);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1a1a; color: white;">
          <div style="text-align: center;">
            <h1>Error</h1>
            <p>Failed to load the shared card.</p>
          </div>
        </body>
      </html>
    `);
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 