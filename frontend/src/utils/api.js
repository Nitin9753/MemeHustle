import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Meme API calls
export const getMemes = async () => {
  try {
    const response = await api.get('/memes');
    return response.data;
  } catch (error) {
    console.error('Error fetching memes:', error);
    throw error;
  }
};

export const getMemeById = async (id) => {
  try {
    const response = await api.get(`/memes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching meme ${id}:`, error);
    throw error;
  }
};

export const createMeme = async (memeData) => {
  try {
    const response = await api.post('/memes', memeData);
    return response.data;
  } catch (error) {
    console.error('Error creating meme:', error);
    throw error;
  }
};

export const voteMeme = async (id, voteType) => {
  try {
    const response = await api.post(`/memes/${id}/vote`, { type: voteType });
    return response.data;
  } catch (error) {
    console.error(`Error voting on meme ${id}:`, error);
    throw error;
  }
};

export const generateCaption = async (id) => {
  try {
    const response = await api.post(`/memes/${id}/caption`);
    return response.data;
  } catch (error) {
    console.error(`Error generating caption for meme ${id}:`, error);
    throw error;
  }
};

// Bid API calls
export const createBid = async (bidData) => {
  try {
    const response = await api.post('/bids', bidData);
    return response.data;
  } catch (error) {
    console.error('Error creating bid:', error);
    throw error;
  }
};

export const getBidsForMeme = async (memeId) => {
  try {
    const response = await api.get(`/bids/meme/${memeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bids for meme ${memeId}:`, error);
    throw error;
  }
};

export const getHighestBidForMeme = async (memeId) => {
  try {
    const response = await api.get(`/bids/meme/${memeId}/highest`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching highest bid for meme ${memeId}:`, error);
    throw error;
  }
};

// Leaderboard API calls
export const getTopMemes = async (limit = 10) => {
  try {
    const response = await api.get(`/leaderboard/top?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top memes:', error);
    throw error;
  }
};

export const getTrendingMemes = async (limit = 10) => {
  try {
    const response = await api.get(`/leaderboard/trending?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending memes:', error);
    throw error;
  }
};