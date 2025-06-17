const express = require('express');
const router = express.Router();
const leaderboardModel = require('../models/leaderboardModel');

router.get('/top', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const memes = await leaderboardModel.getTopMemes(limit);
    res.status(200).json(memes);
  } catch (error) {
    console.error('Error in GET /leaderboard/top:', error);
    res.status(500).json({ error: 'Failed to get top memes' });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const memes = await leaderboardModel.getTrendingMemes(limit);
    res.status(200).json(memes);
  } catch (error) {
    console.error('Error in GET /leaderboard/trending:', error);
    res.status(500).json({ error: 'Failed to get trending memes' });
  }
});

module.exports = router;