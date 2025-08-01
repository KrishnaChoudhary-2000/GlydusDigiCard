import express from 'express';
import Card from '../models/Card.js';

const router = express.Router();

// In-memory storage for short URLs (in production, use a database)
let shortUrls = new Map();
let inMemoryCards = new Map();

// Database connection state
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

// Generate a very short ID (6 characters)
function generateShortId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Generate a unique ID for new cards
function generateCardId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `card-${timestamp}-${random}`;
}

// Safe database operation wrapper
const safeDbOperation = async (operation, fallback = null) => {
    try {
        if (!dbState.isConnected) {
            return fallback;
        }
        return await operation();
    } catch (error) {
        return fallback;
    }
};

// Get all cards - MUST come first
router.get('/', async (req, res) => {
    try {
        let cards = await safeDbOperation(
            () => Card.find().sort({ createdAt: -1 }),
            []
        );

        if (!dbState.isConnected) {
            cards = Array.from(inMemoryCards.values());
        }

        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cards' });
    }
});

// Create new card
router.post('/', async (req, res) => {
    try {
        const cardData = req.body;
        
        let card = await safeDbOperation(
            async () => {
                const newCard = new Card(cardData);
                return await newCard.save();
            },
            null
        );

        if (!card) {
            const cardId = generateCardId();
            card = {
                _id: cardId,
                id: cardId,
                ...cardData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            inMemoryCards.set(cardId, card);
        }

        res.status(201).json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create card' });
    }
});

// Create short URL
router.post('/shorten', async (req, res) => {
    try {
        const { cardId } = req.body;
        
        if (!cardId) {
            return res.status(400).json({ error: 'Card ID is required' });
        }

        let card = await safeDbOperation(
            () => Card.findById(cardId),
            null
        );

        if (!card) {
            card = inMemoryCards.get(cardId);
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found. Please save the card first before creating a short URL.' });
        }

        const shortId = generateShortId();
        const shortUrl = `${req.protocol}://${req.get('host')}/api/cards/short/${shortId}`;
        
        shortUrls.set(shortId, cardId);
        
        res.json({ 
            success: true, 
            shortUrl,
            shortId,
            originalId: cardId
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to create short URL' });
    }
});

// Get card by short ID - MUST come before /:id route
router.get('/short/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        const cardId = shortUrls.get(shortId);
        
        if (!cardId) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        let card = await safeDbOperation(
            () => Card.findById(cardId),
            null
        );

        if (!card) {
            card = inMemoryCards.get(cardId);
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json({ success: true, data: card });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve card' });
    }
});

// Get card by ID - MUST come after specific routes
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        let card = await safeDbOperation(
            () => Card.findById(id),
            null
        );

        if (!card) {
            card = inMemoryCards.get(id);
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve card' });
    }
});

// Update card
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        let card = await safeDbOperation(
            () => Card.findByIdAndUpdate(id, updateData, { new: true }),
            null
        );

        if (!card) {
            const existingCard = inMemoryCards.get(id);
            if (existingCard) {
                card = {
                    ...existingCard,
                    ...updateData,
                    updatedAt: new Date()
                };
                inMemoryCards.set(id, card);
            }
        }

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update card' });
    }
});

// Delete card
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedFromMongo = await safeDbOperation(
            () => Card.findByIdAndDelete(id),
            null
        );

        const deletedFromMemory = inMemoryCards.delete(id);

        if (!deletedFromMongo && !deletedFromMemory) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

export default router; 