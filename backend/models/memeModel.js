const supabase = require('../config/supabase');
const { generateMemeCaption, generateVibeAnalysis } = require('../config/gemini');

const memeTable = 'memes';

// Create a new meme
const createMeme = async (memeData) => {
  try {
    // Generate AI caption and vibe if tags are provided
    let caption = null;
    let vibe = null;
    
    if (memeData.tags && memeData.tags.length > 0) {
      caption = await generateMemeCaption(memeData.tags);
      vibe = await generateVibeAnalysis(memeData.tags);
      
      // Clean up caption and vibe formats
      caption = cleanupCaptionFormat(caption);
      vibe = cleanupVibeFormat(vibe);
    }
    
    // Set default image URL if not provided
    if (!memeData.image_url) {
      memeData.image_url = `https://picsum.photos/seed/${Math.random()}/400/300`;
    }
    
    // Insert meme into Supabase
    const { data, error } = await supabase
      .from(memeTable)
      .insert({
        title: memeData.title,
        image_url: memeData.image_url,
        tags: memeData.tags || [],
        caption: caption,
        vibe: vibe,
        upvotes: 0,
        owner_id: memeData.owner_id || 'anonymous'
      })
      .select();
    
    if (error) throw error;
    console.log(data[0]);
    return data[0];
  } catch (error) {
    console.error('Error creating meme:', error);
    throw error;
  }
};

// Get all memes
const getAllMemes = async () => {
  try {
    const { data, error } = await supabase
      .from(memeTable)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting memes:', error);
    throw error;
  }
};

// Get meme by ID
const getMemeById = async (id) => {
  try {
    const { data, error } = await supabase
      .from(memeTable)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error getting meme with ID ${id}:`, error);
    throw error;
  }
};

// Update meme upvotes
const updateMemeVotes = async (id, voteType) => {
  try {
    // Get current meme to get current upvotes
    const { data: meme, error: fetchError } = await supabase
      .from(memeTable)
      .select('upvotes')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Calculate new upvotes value
    let newUpvotes = meme.upvotes;
    if (voteType === 'up') {
      newUpvotes += 1;
    } else if (voteType === 'down') {
      newUpvotes -= 1;
    }
    
    // Update meme with new upvotes
    const { data, error } = await supabase
      .from(memeTable)
      .update({ upvotes: newUpvotes })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error(`Error updating votes for meme ${id}:`, error);
    throw error;
  }
};

// Fallback captions and vibes
const fallbackCaptions = [
  "YOLO to the moon!",
  "Hack the planet!",
  "When the code finally compiles",
  "HODL the vibes!",
  "404: Brain not found",
  "Cyberpunk dreams, meme reality",
  "Neural networks and chill",
  "This meme is quantum-encrypted",
  "Glitch in the matrix detected",
  "Running on blockchain technology"
];

const fallbackVibes = [
  "Neon Crypto Chaos",
  "Retro Stonks Vibes",
  "Digital Doge Dreams",
  "Glitchy Tech Nostalgia",
  "Cybernetic Meme Energy",
  "Synthwave Humor Matrix",
  "Neo Tokyo Laughter",
  "Quantum Meme State"
];

// Get random item from array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate or update AI caption for a meme
const generateCaption = async (id) => {
  try {
    // Get meme to access tags
    const { data: meme, error: fetchError } = await supabase
      .from(memeTable)
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Generate new caption and vibe
    let caption, vibe;
    
    try {
      // Try to generate with AI
      caption = await generateMemeCaption(meme.tags);
      vibe = await generateVibeAnalysis(meme.tags);
      
      // Clean up caption format - remove "**Caption:**" and "**Tags:**" markers
      caption = cleanupCaptionFormat(caption);
      vibe = cleanupVibeFormat(vibe);
    } catch (aiError) {
      // If AI fails, use fallbacks
      console.error('AI generation failed, using fallbacks:', aiError);
      caption = getRandomItem(fallbackCaptions);
      vibe = getRandomItem(fallbackVibes);
    }
    
    // Update meme with new caption and vibe
    const { data, error } = await supabase
      .from(memeTable)
      .update({ caption, vibe })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    console.log(data[0]);
    return data[0];
  } catch (error) {
    console.error(`Error generating caption for meme ${id}:`, error);
    throw error;
  }
};

// Helper function to clean up caption format
const cleanupCaptionFormat = (caption) => {
  if (!caption) return caption;
  
  // Remove "**Caption:**" prefix if present
  caption = caption.replace(/^\*\*Caption:\*\*\s*/i, '');
  
  // Remove "**Tags:**" and everything after it
  caption = caption.replace(/\s*\*\*Tags:\*\*.*$/is, '');
  
  // Remove any trailing newlines and trim
  return caption.trim();
};

// Helper function to clean up vibe format
const cleanupVibeFormat = (vibe) => {
  if (!vibe) return vibe;
  
  // Remove any markdown formatting
  vibe = vibe.replace(/\*\*/g, '');
  
  // Remove any newlines and trim
  return vibe.replace(/\n/g, ' ').trim();
};

module.exports = {
  createMeme,
  getAllMemes,
  getMemeById,
  updateMemeVotes,
  generateCaption
};