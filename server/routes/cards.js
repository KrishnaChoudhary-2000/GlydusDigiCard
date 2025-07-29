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
        // Try to use MongoDB first
        try {
            const cards = await Card.find();
            return res.json(cards);
        } catch (dbError) {
            console.log('Database connection failed, using in-memory storage');
            // Fallback to in-memory data if database fails
            const fallbackCards = Array.from(inMemoryCards.values());
            if (fallbackCards.length === 0) {
                // Add a sample card if no cards exist
                const sampleCard = {
                    _id: 'card-1753786588098',
                    cardName: 'Sample Business Card',
                    name: 'John Doe',
                    title: 'CEO',
                    email: 'john@example.com',
                    phone: '+1 (555) 123-4567',
                    address: '123 Business St, City, State 12345',
                    profilePicture: '',
                    companyLogo: '',
                    cardBackLogoUrl: '',
                    socials: {
                        linkedin: { url: '', enabled: false },
                        instagram: { url: '', enabled: false },
                        whatsapp: { url: '', enabled: false },
                        facebook: { url: '', enabled: false },
                        twitter: { url: '', enabled: false },
                        youtube: { url: '', enabled: false }
                    },
                    accentColor: '#00D1A6',
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                inMemoryCards.set(sampleCard._id, sampleCard);
                return res.json([sampleCard]);
            }
            return res.json(fallbackCards);
        }
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

// Get single card
router.get('/:id', async (req, res) => {
    try {
        // Try to use MongoDB first
        try {
            const card = await Card.findById(req.params.id);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            return res.json(card);
        } catch (dbError) {
            console.log('Database connection failed, using in-memory storage');
            // Fallback to in-memory data if database fails
            const card = inMemoryCards.get(req.params.id);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            return res.json(card);
        }
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).json({ error: 'Failed to fetch card' });
    }
});

// Create new card
router.post('/', async (req, res) => {
    try {
        // Try to use MongoDB first
        try {
            const card = new Card(req.body);
            const savedCard = await card.save();
            return res.status(201).json(savedCard);
        } catch (dbError) {
            console.log('Database connection failed, using in-memory storage');
            // Fallback: store in memory
            const cardId = generateCardId();
            const fallbackCard = {
                ...req.body,
                _id: cardId,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            inMemoryCards.set(cardId, fallbackCard);
            return res.status(201).json(fallbackCard);
        }
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ error: 'Failed to create card' });
    }
});

// Update card
router.put('/:id', async (req, res) => {
    try {
        // Try to use MongoDB first
        try {
            const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            return res.json(card);
        } catch (dbError) {
            console.log('Database connection failed, using in-memory storage');
            // Fallback: update in memory
            const existingCard = inMemoryCards.get(req.params.id);
            if (!existingCard) {
                return res.status(404).json({ error: 'Card not found' });
            }
            const updatedCard = {
                ...existingCard,
                ...req.body,
                _id: req.params.id,
                updatedAt: new Date()
            };
            inMemoryCards.set(req.params.id, updatedCard);
            return res.json(updatedCard);
        }
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ error: 'Failed to update card' });
    }
});

// Delete card
router.delete('/:id', async (req, res) => {
    try {
        // Try to use MongoDB first
        try {
            const card = await Card.findByIdAndDelete(req.params.id);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            return res.json({ message: 'Card deleted successfully' });
        } catch (dbError) {
            console.log('Database connection failed, using in-memory storage');
            // Fallback: delete from memory
            const card = inMemoryCards.get(req.params.id);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            inMemoryCards.delete(req.params.id);
            return res.json({ message: 'Card deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

export default router; 