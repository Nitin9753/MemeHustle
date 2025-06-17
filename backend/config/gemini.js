const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY || 'your-gemini-api-key';

const genAI = new GoogleGenerativeAI(apiKey);

const aiResponseCache = new Map();

if (apiKey === 'your-gemini-api-key') {
  console.warn('Warning: Using placeholder Gemini API key. Set GEMINI_API_KEY in .env file for production use.');
}

const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

const generateMemeCaption = async (tags) => {
  const cacheKey = `caption-${tags.join('-')}`;
  
  if (aiResponseCache.has(cacheKey)) {
    return aiResponseCache.get(cacheKey);
  }
  
  try {
    if (apiKey === 'your-gemini-api-key') {
      throw new Error('Using placeholder API key');
    }
    
    const model = getGeminiModel();
    const prompt = `Generate a single funny caption for a meme with tags: ${tags.join(', ')}. Keep it short, witty, and on a single line. Do not include options, numbering, or markdown formatting. Just return a single caption.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const caption = response.text();
    
    aiResponseCache.set(cacheKey, caption);
    return caption;
  } catch (error) {
    console.error('Error generating caption:', error);

    const fallbackCaptions = [
      "YOLO to the moon!",
      "Hack the planet!",
      "When the code finally compiles",
      "HODL the vibes!",
      "404: Brain not found",
      "Cyberpunk dreams, meme reality"
    ];
    const randomCaption = fallbackCaptions[Math.floor(Math.random() * fallbackCaptions.length)];
    return randomCaption;
  }
};

const generateVibeAnalysis = async (tags) => {
  const cacheKey = `vibe-${tags.join('-')}`;

  if (aiResponseCache.has(cacheKey)) {
    return aiResponseCache.get(cacheKey);
  }
  
  try {
    if (apiKey === 'your-gemini-api-key') {
      throw new Error('Using placeholder API key');
    }
    
    const model = getGeminiModel();
    const prompt = `Describe the vibe of a meme with tags: ${tags.join(', ')} in a single word or very short phrase (max 3 words). Make it sound cyberpunk and trendy. No markdown, no newlines, no punctuation at the end.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const vibe = response.text();
    
    aiResponseCache.set(cacheKey, vibe);
    return vibe;
  } catch (error) {
    console.error('Error generating vibe analysis:', error);
    const fallbackVibes = [
      "Neon Crypto Chaos",
      "Retro Stonks Vibes",
      "Digital Doge Dreams",
      "Glitchy Tech Nostalgia",
      "Cybernetic Meme Energy",
      "Synthwave Humor Matrix"
    ];
    const randomVibe = fallbackVibes[Math.floor(Math.random() * fallbackVibes.length)];
    return randomVibe;
  }
};

module.exports = {
  generateMemeCaption,
  generateVibeAnalysis
};