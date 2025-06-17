const supabase = require('../config/supabase');

const memeTable = 'memes';

// In-memory cache for leaderboard
let leaderboardCache = {
  data: null,
  timestamp: null,
  ttl: 60000 // 1 minute TTL
};

// Get top memes by upvotes
const getTopMemes = async (limit = 10) => {
  try {
    // Check if we have a valid cache
    const now = Date.now();
    if (leaderboardCache.data && leaderboardCache.timestamp && 
        (now - leaderboardCache.timestamp < leaderboardCache.ttl)) {
      return leaderboardCache.data.slice(0, limit);
    }
    
    // No valid cache, fetch from Supabase
    const { data, error } = await supabase
      .from(memeTable)
      .select('*')
      .order('upvotes', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Update cache
    leaderboardCache = {
      data,
      timestamp: now,
      ttl: 60000
    };
    
    return data;
  } catch (error) {
    console.error('Error getting top memes:', error);
    throw error;
  }
};

// Get trending memes (recent with good upvotes)
const getTrendingMemes = async (limit = 10) => {
  try {
    // For a real app, we'd use a more sophisticated algorithm
    // For now, we'll just get recent memes with at least 1 upvote
    const { data, error } = await supabase
      .from(memeTable)
      .select('*')
      .gt('upvotes', 0)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting trending memes:', error);
    throw error;
  }
};

// Invalidate cache (call this when votes change)
const invalidateCache = () => {
  leaderboardCache = {
    data: null,
    timestamp: null,
    ttl: 60000
  };
};

module.exports = {
  getTopMemes,
  getTrendingMemes,
  invalidateCache
};