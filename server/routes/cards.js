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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/cards/shorten:
 *   post:
 *     summary: Create a short URL for a card
 *     description: Generate a short URL for sharing a specific card
 *     tags: [Short URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *             properties:
 *               cardId:
 *                 type: string
 *                 description: ID of the card to create short URL for
 *     responses:
 *       200:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShortUrlResponse'
 *       400:
 *         description: Bad request - cardId is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/cards/short/{shortId}:
 *   get:
 *     summary: Get card by short ID
 *     description: Retrieve a card using its short URL identifier
 *     tags: [Short URLs]
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *         description: Short URL identifier
 *     responses:
 *       200:
 *         description: Card retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Card'
 *       404:
 *         description: Short URL or card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get card by ID
 *     description: Retrieve a specific card by its ID
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
 *         description: Card retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update a card
 *     description: Update an existing card's information
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/cards/{id}:
 *   delete:
 *     summary: Delete a card
 *     description: Delete a card from the database
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card deleted successfully"
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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