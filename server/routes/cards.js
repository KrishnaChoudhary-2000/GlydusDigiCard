import express from 'express';
import Card from '../models/Card.js';

const router = express.Router();

// In-memory storage for short URLs (in production, use a database)
let shortUrls = new Map();
let urlCounter = 0;

// In-memory storage for cards (fallback when MongoDB is not available)
let inMemoryCards = new Map();

// Export shortUrls for server access
router.shortUrls = shortUrls;

// Database connection state (imported from server.js)
let dbState = {
  isConnected: false,
  isConnecting: false,
  retryCount: 0,
  lastError: null
};

// Update database state from server
export const updateDbState = (newState) => {
  dbState = { ...dbState, ...newState };
};

// Generate a very short ID (6 characters for ~80 bits)
function generateShortId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Generate a unique ID for new cards (fallback when MongoDB is not available)
function generateCardId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `card-${timestamp}-${random}`;
}

// Safe database operation wrapper
const safeDbOperation = async (operation, fallback = null) => {
    try {
        if (!dbState.isConnected) {
            console.log('⚠️ Database not connected, using fallback');
            return fallback;
        }
        return await operation();
    } catch (error) {
        console.error('❌ Database operation failed:', error.message);
        return fallback;
    }
};

// Create short URL
router.post('/shorten', async (req, res) => {
    try {
        const { cardId } = req.body;
        
        if (!cardId) {
            return res.status(400).json({ error: 'Card ID is required' });
        }

        console.log('Looking for card with ID:', cardId);

        // Find the card - try MongoDB first, then in-memory fallback
        let card = null;
        
        // Try MongoDB first
        card = await safeDbOperation(
            () => Card.findById(cardId),
            null
        );

        // If not found in MongoDB, try in-memory storage
        if (!card) {
            card = inMemoryCards.get(cardId);
            console.log('Card found in memory:', card ? 'Yes' : 'No');
        }

        if (!card) {
            console.log('Card not found in database or memory. Available cards:');
            try {
                const mongoCards = await safeDbOperation(
                    () => Card.find().then(cards => cards.map(c => c._id)),
                    []
                );
                console.log('MongoDB cards:', mongoCards);
            } catch (mongoError) {
                console.log('MongoDB query failed:', mongoError.message);
            }
            console.log('Memory cards:', Array.from(inMemoryCards.keys()));
            return res.status(404).json({ error: 'Card not found. Please save the card first before creating a short URL.' });
        }

        // Generate short ID
        const shortId = generateShortId();
        
        // Store the mapping
        shortUrls.set(shortId, cardId);
        
        // Create short URL - use environment-based URL
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : process.env.NODE_ENV === 'production'
                ? 'https://your-domain.vercel.app'
                : 'http://localhost:5173';
        const shortUrl = `${baseUrl}/?shortId=${shortId}`;
        
        console.log('Short URL created:', shortUrl);
        
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

        // Find the card - try MongoDB first, then in-memory fallback
        let card = await safeDbOperation(
            () => Card.findById(cardId),
            null
        );

        // If not found in MongoDB, try in-memory storage
        if (!card) {
            card = inMemoryCards.get(cardId);
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(card);
    } catch (error) {
        console.error('Error resolving short URL:', error);
        res.status(500).json({ error: 'Failed to resolve short URL' });
    }
});

// Get all cards
router.get('/', async (req, res) => {
    try {
        // Try MongoDB first
        let cards = await safeDbOperation(
            () => Card.find().sort({ createdAt: -1 }),
            []
        );

        // If no cards in MongoDB, use in-memory storage
        if (cards.length === 0) {
            cards = Array.from(inMemoryCards.values());
        }

        res.json(cards);
    } catch (error) {
        console.error('Error getting cards:', error);
        res.status(500).json({ error: 'Failed to get cards' });
    }
});

// Get a specific card
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Try MongoDB first
        let card = await safeDbOperation(
            () => Card.findById(id),
            null
        );

        // If not found in MongoDB, try in-memory storage
        if (!card) {
            card = inMemoryCards.get(id);
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(card);
    } catch (error) {
        console.error('Error getting card:', error);
        res.status(500).json({ error: 'Failed to get card' });
    }
});

// Create a new card
router.post('/', async (req, res) => {
    try {
        const cardData = req.body;
        
        // Try to save to MongoDB first
        let card = await safeDbOperation(
            () => Card.create(cardData),
            null
        );

        // If MongoDB fails, save to in-memory storage
        if (!card) {
            const cardId = generateCardId();
            card = {
                _id: cardId,
                ...cardData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            inMemoryCards.set(cardId, card);
            console.log('Card saved to in-memory storage');
        }

        res.status(201).json(card);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ error: 'Failed to create card' });
    }
});

// Update a card
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Try to update in MongoDB first
        let card = await safeDbOperation(
            () => Card.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
            null
        );

        // If MongoDB fails, update in-memory storage
        if (!card) {
            const existingCard = inMemoryCards.get(id);
            if (existingCard) {
                card = {
                    ...existingCard,
                    ...updateData,
                    updatedAt: new Date()
                };
                inMemoryCards.set(id, card);
                console.log('Card updated in in-memory storage');
            }
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(card);
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ error: 'Failed to update card' });
    }
});

// Delete a card
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Try to delete from MongoDB first
        let deleted = await safeDbOperation(
            () => Card.findByIdAndDelete(id),
            null
        );

        // If MongoDB fails, delete from in-memory storage
        if (!deleted) {
            deleted = inMemoryCards.delete(id);
            console.log('Card deleted from in-memory storage');
        }

        if (!deleted) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

// Database status endpoint
router.get('/status/db', (req, res) => {
    res.json({
        connected: dbState.isConnected,
        connecting: dbState.isConnecting,
        retryCount: dbState.retryCount,
        lastError: dbState.lastError,
        memoryCards: inMemoryCards.size,
        shortUrls: shortUrls.size
    });
});

export default router;  