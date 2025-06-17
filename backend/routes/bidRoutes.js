const express = require('express');
const router = express.Router();
const bidModel = require('../models/bidModel');

// Create a new bid
router.post('/', async (req, res) => {
  try {
    const { meme_id, user_id, credits } = req.body;
    
    if (!meme_id || !user_id || !credits) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const bid = await bidModel.createBid({
      meme_id,
      user_id,
      credits: Number(credits)
    });
    
    // Emit socket event for new bid
    req.io.emit('new-bid', {
      ...bid,
      meme_id
    });
    
    res.status(201).json(bid);
  } catch (error) {
    console.error('Error in POST /bids:', error);
    res.status(500).json({ error: 'Failed to create bid' });
  }
});

// Get all bids for a specific meme
router.get('/meme/:memeId', async (req, res) => {
  try {
    const bids = await bidModel.getBidsForMeme(req.params.memeId);
    res.status(200).json(bids);
  } catch (error) {
    console.error(`Error in GET /bids/meme/${req.params.memeId}:`, error);
    res.status(500).json({ error: 'Failed to get bids' });
  }
});

// Get highest bid for a specific meme
router.get('/meme/:memeId/highest', async (req, res) => {
  try {
    const bid = await bidModel.getHighestBidForMeme(req.params.memeId);
    
    if (!bid) {
      return res.status(404).json({ error: 'No bids found for this meme' });
    }
    
    res.status(200).json(bid);
  } catch (error) {
    console.error(`Error in GET /bids/meme/${req.params.memeId}/highest:`, error);
    res.status(500).json({ error: 'Failed to get highest bid' });
  }
});

module.exports = router;