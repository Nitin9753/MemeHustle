const supabase = require('../config/supabase');

const bidTable = 'bids';
const memeTable = 'memes';

// Create a new bid
const createBid = async (bidData) => {
  try {
    // Check if user already has a bid on this meme
    const { data: existingBids, error: fetchError } = await supabase
      .from(bidTable)
      .select('*')
      .eq('meme_id', bidData.meme_id)
      .eq('user_id', bidData.user_id);
    
    if (fetchError) throw fetchError;
    
    let result;
    
    if (existingBids && existingBids.length > 0) {
      // Update existing bid
      const { data, error } = await supabase
        .from(bidTable)
        .update({ credits: bidData.credits })
        .eq('id', existingBids[0].id)
        .select();
      
      if (error) throw error;
      result = data[0];
    } else {
      // Create new bid
      const { data, error } = await supabase
        .from(bidTable)
        .insert({
          meme_id: bidData.meme_id,
          user_id: bidData.user_id,
          credits: bidData.credits
        })
        .select();
      
      if (error) throw error;
      result = data[0];
    }
    
    return result;
  } catch (error) {
    console.error('Error creating/updating bid:', error);
    throw error;
  }
};

// Get all bids for a meme
const getBidsForMeme = async (memeId) => {
  try {
    const { data, error } = await supabase
      .from(bidTable)
      .select('*')
      .eq('meme_id', memeId)
      .order('credits', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error getting bids for meme ${memeId}:`, error);
    throw error;
  }
};

// Get highest bid for a meme
const getHighestBidForMeme = async (memeId) => {
  try {
    const { data, error } = await supabase
      .from(bidTable)
      .select('*')
      .eq('meme_id', memeId)
      .order('credits', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error getting highest bid for meme ${memeId}:`, error);
    throw error;
  }
};

module.exports = {
  createBid,
  getBidsForMeme,
  getHighestBidForMeme
};