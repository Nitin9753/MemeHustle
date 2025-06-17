const express = require('express');
const router = express.Router();
const memeModel = require('../models/memeModel');
const bidModel = require('../models/bidModel');
const leaderboardModel = require('../models/leaderboardModel');

// Create a new meme
router.post('/', async (req, res) => {
    try {
        const meme = await memeModel.createMeme(req.body);

        // Emit socket event for new meme
        req.io.emit('new-meme', meme);

        res.status(201).json(meme);
    } catch (error) {
        console.error('Error in POST /memes:', error);
        res.status(500).json({ error: 'Failed to create meme' });
    }
});

// Get all memes
router.get('/', async (req, res) => {
    try {
        const memes = await memeModel.getAllMemes();
        res.status(200).json(memes);
    } catch (error) {
        console.error('Error in GET /memes:', error);
        res.status(500).json({ error: 'Failed to get memes' });
    }
});

// Get a specific meme by ID
router.get('/:id', async (req, res) => {
    try {
        const meme = await memeModel.getMemeById(req.params.id);

        if (!meme) {
            return res.status(404).json({ error: 'Meme not found' });
        }

        // Get highest bid for this meme
        const highestBid = await bidModel.getHighestBidForMeme(req.params.id);

        // Combine meme and bid data
        const memeWithBid = {
            ...meme,
            highest_bid: highestBid
        };

        res.status(200).json(memeWithBid);
    } catch (error) {
        console.error(`Error in GET /memes/${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to get meme' });
    }
});

// Vote on a meme (upvote/downvote)
router.post('/:id/vote', async (req, res) => {
    try {
        const { type } = req.body; // 'up' or 'down'

        if (!type || (type !== 'up' && type !== 'down')) {
            return res.status(400).json({ error: 'Invalid vote type' });
        }

        const updatedMeme = await memeModel.updateMemeVotes(req.params.id, type);

        // Invalidate leaderboard cache
        leaderboardModel.invalidateCache();

        // Emit socket event for vote update
        req.io.emit('vote-update', updatedMeme);

        res.status(200).json(updatedMeme);
    } catch (error) {
        console.error(`Error in POST /memes/${req.params.id}/vote:`, error);
        res.status(500).json({ error: 'Failed to update vote' });
    }
});

// Generate or regenerate AI caption for a meme
router.post('/:id/caption', async (req, res) => {
    try {
        const updatedMeme = await memeModel.generateCaption(req.params.id);

        // Emit socket event for caption update
        req.io.emit('caption-update', updatedMeme);

        res.status(200).json(updatedMeme);
    } catch (error) {
        console.error(`Error in POST /memes/${req.params.id}/caption:`, error);
        
        // Even in case of error, try to get the current meme to send back to client
        try {
            const currentMeme = await memeModel.getMemeById(req.params.id);
            
            // If we can get the meme, send it back with a warning
            if (currentMeme) {
                // Add a flag to indicate there was an error
                currentMeme.captionError = true;
                
                // Emit socket event with the current meme and error flag
                req.io.emit('caption-update', currentMeme);
                
                return res.status(200).json(currentMeme);
            }
        } catch (secondaryError) {
            console.error('Secondary error trying to fetch meme:', secondaryError);
        }
        
        res.status(500).json({ error: 'Failed to generate caption' });
    }
});

module.exports = router;