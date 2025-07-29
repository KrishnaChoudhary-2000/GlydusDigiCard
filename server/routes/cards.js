import express from 'express';
import Card from '../models/Card.js';

const router = express.Router();

// In-memory storage for short URLs (in production, use a database)
let shortUrls = new Map();
let urlCounter = 0;

// Export shortUrls for server access
router.shortUrls = shortUrls;

// Generate a very short ID (6 characters for ~80 bits)
function generateShortId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Create short URL
router.post('/shorten', async (req, res) => {
    try {
        const { cardId } = req.body;
        
        if (!cardId) {
            return res.status(400).json({ error: 'Card ID is required' });
        }

        // Find the card
        let card;
        try {
            card = await Card.findById(cardId);
        } catch (error) {
            // Fallback to in-memory if database fails
            card = null;
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        // Generate short ID
        const shortId = generateShortId();
        
        // Store the mapping
        shortUrls.set(shortId, cardId);
        
        // Create short URL - use production domain for shared links
        const getFrontendUrl = () => {
            // In production, use the same domain as the request
            if (req.get('host') && req.get('host') !== 'localhost:5000') {
                return `https://${req.get('host')}`;
            }
            // In development, use localhost
            return 'http://localhost:5173';
        };
        
        const frontendUrl = getFrontendUrl();
        const shortUrl = `${frontendUrl}/?shortId=${shortId}`;
        
        res.json({ 
            shortUrl, 
            shortId,
            cardId 
        });
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Failed to create short URL' });
    }
});

// Resolve short ID to card data
router.get('/resolve/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        
        // Get card ID from short URL
        const cardId = shortUrls.get(shortId);
        
        if (!cardId) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        // Find the card
        let card;
        try {
            card = await Card.findById(cardId);
        } catch (error) {
            // Fallback to in-memory if database fails
            card = null;
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        // Return the card data
        res.json(card);
    } catch (error) {
        console.error('Error resolving short URL:', error);
        res.status(500).json({ error: 'Failed to resolve short URL' });
    }
});

// Redirect short URL to card
router.get('/card/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        
        // Get card ID from short URL
        const cardId = shortUrls.get(shortId);
        
        if (!cardId) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        // Find the card
        let card;
        try {
            card = await Card.findById(cardId);
        } catch (error) {
            // Fallback to in-memory if database fails
            card = null;
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        // Redirect to the card page with the short ID
        res.redirect(`/?card=${shortId}`);
    } catch (error) {
        console.error('Error redirecting short URL:', error);
        res.status(500).json({ error: 'Failed to redirect' });
    }
});

// Get all cards
router.get('/', async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

// Get single card
router.get('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json(card);
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).json({ error: 'Failed to fetch card' });
    }
});

// Create new card
router.post('/', async (req, res) => {
    try {
        const card = new Card(req.body);
        const savedCard = await card.save();
        res.status(201).json(savedCard);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ error: 'Failed to create card' });
    }
});

// Update card
router.put('/:id', async (req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json(card);
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ error: 'Failed to update card' });
    }
});

// Delete card
router.delete('/:id', async (req, res) => {
    try {
        const card = await Card.findByIdAndDelete(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

export default router; 