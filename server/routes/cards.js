import express from 'express';
import Card from '../models/Card.js';
import mongoose from 'mongoose';

const router = express.Router();

// In-memory storage for short URLs (fallback when DB is not connected)
let shortUrls = new Map();
let inMemoryCards = new Map();

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

// Check if MongoDB is connected
const isDbConnected = () => {
    return mongoose.connection.readyState === 1;
};

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all cards
 *     description: Retrieve all digital cards from the database
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of all cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        if (isDbConnected()) {
            // Use MongoDB
            const cards = await Card.find().sort({ createdAt: -1 });
            res.json(cards);
        } else {
            // Fallback to in-memory storage
            const cards = Array.from(inMemoryCards.values());
            res.json(cards);
        }
    } catch (error) {
        console.error('❌ Error fetching cards:', error);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new card
 *     description: Create a new digital business card
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    try {
        const cardData = req.body;
        
        if (isDbConnected()) {
            // Save to MongoDB
            const newCard = new Card(cardData);
            const savedCard = await newCard.save();
            console.log('✅ Card saved to MongoDB:', savedCard._id);
            res.status(201).json(savedCard);
        } else {
            // Save to in-memory storage
            const cardId = generateCardId();
            const newCard = {
                _id: cardId,
                ...cardData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            inMemoryCards.set(cardId, newCard);
            console.log('⚠️  Card saved to memory (not persistent):', cardId);
            res.status(201).json(newCard);
        }
    } catch (error) {
        console.error('❌ Error creating card:', error);
        res.status(500).json({ error: 'Failed to create card' });
    }
});

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get a card by ID
 *     description: Retrieve a specific digital card by its ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isDbConnected()) {
            // Get from MongoDB
            const card = await Card.findById(id);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            res.json(card);
        } else {
            // Get from in-memory storage
            const card = inMemoryCards.get(id);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            res.json(card);
        }
    } catch (error) {
        console.error('❌ Error fetching card:', error);
        res.status(500).json({ error: 'Failed to fetch card' });
    }
});

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update a card
 *     description: Update an existing digital card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: Card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        if (isDbConnected()) {
            // Update in MongoDB
            const updatedCard = await Card.findByIdAndUpdate(
                id, 
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            );
            if (!updatedCard) {
                return res.status(404).json({ error: 'Card not found' });
            }
            console.log('✅ Card updated in MongoDB:', id);
            res.json(updatedCard);
        } else {
            // Update in in-memory storage
            const card = inMemoryCards.get(id);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            const updatedCard = {
                ...card,
                ...updateData,
                updatedAt: new Date()
            };
            inMemoryCards.set(id, updatedCard);
            console.log('⚠️  Card updated in memory (not persistent):', id);
            res.json(updatedCard);
        }
    } catch (error) {
        console.error('❌ Error updating card:', error);
        res.status(500).json({ error: 'Failed to update card' });
    }
});

/**
 * @swagger
 * /api/cards/{id}:
 *   delete:
 *     summary: Delete a card
 *     description: Delete a digital card by its ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card deleted successfully
 *       404:
 *         description: Card not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isDbConnected()) {
            // Delete from MongoDB
            const deletedCard = await Card.findByIdAndDelete(id);
            if (!deletedCard) {
                return res.status(404).json({ error: 'Card not found' });
            }
            console.log('✅ Card deleted from MongoDB:', id);
            res.json({ message: 'Card deleted successfully' });
        } else {
            // Delete from in-memory storage
            const card = inMemoryCards.get(id);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            inMemoryCards.delete(id);
            console.log('⚠️  Card deleted from memory:', id);
            res.json({ message: 'Card deleted successfully' });
        }
    } catch (error) {
        console.error('❌ Error deleting card:', error);
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

// Short URL routes (compat: POST /shorten)
router.post('/shorten', async (req, res) => {
    try {
        const { cardId } = req.body;
        
        if (!cardId) {
            return res.status(400).json({ error: 'cardId is required' });
        }
        
        if (isDbConnected()) {
            const card = await Card.findById(cardId);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
        } else {
            const card = inMemoryCards.get(cardId);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
        }
        
        const shortId = generateShortId();
        shortUrls.set(shortId, cardId);
        // Use explicit public app URL in production if provided, else infer from request
        const publicAppUrl = (process.env.PUBLIC_APP_URL || '').replace(/\/$/, '');
        const base = publicAppUrl || `${req.protocol}://${req.get('host')}`;
        const shortUrl = `${base}/card/${shortId}`;
        res.json({ shortUrl, shortId, cardId });
    } catch (error) {
        console.error('❌ Error creating short URL (compat /shorten):', error);
        res.status(500).json({ error: 'Failed to create short URL' });
    }
});

// Short URL resolve (compat: GET /resolve/:shortId)
router.get('/resolve/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        const cardId = shortUrls.get(shortId);
        
        if (!cardId) {
            return res.status(404).json({ error: 'Short URL not found' });
            }
        
        if (isDbConnected()) {
            const card = await Card.findById(cardId);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            res.json(card);
        } else {
            const card = inMemoryCards.get(cardId);
            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }
            res.json(card);
        }
    } catch (error) {
        console.error('❌ Error resolving short URL (compat /resolve/:shortId):', error);
        res.status(500).json({ error: 'Failed to resolve short URL' });
    }
});

export default router; 