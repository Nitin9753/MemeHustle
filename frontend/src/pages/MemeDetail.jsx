import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMemeById, voteMeme, generateCaption } from '../utils/api';
import { formatDate, getTagColor } from '../utils/helpers';
import BidForm from '../components/BidForm';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

// Helper function to clean up caption format for display
const cleanupCaptionForDisplay = (caption) => {
  if (!caption) return '';
  
  // Remove "**Caption:**" prefix if present
  caption = caption.replace(/^\*\*Caption:\*\*\s*/i, '');
  
  // Remove "**Tags:**" and everything after it
  caption = caption.replace(/\s*\*\*Tags:\*\*.*$/is, '');
  
  // Remove any trailing newlines and trim
  return caption.trim();
};

const MemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [captionError, setCaptionError] = useState(false);
  
  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const data = await getMemeById(id);
        setMeme(data);
      } catch (err) {
        console.error('Error fetching meme:', err);
        if (err.response && err.response.status === 404) {
          setError('Meme not found');
        } else {
          setError('Failed to load meme. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeme();
  }, [id]);
  
  // Listen for socket events
  useEffect(() => {
    if (!socket) return;
    
    // Meme vote updated
    const handleVoteUpdate = (updatedMeme) => {
      if (updatedMeme.id === id) {
        setMeme(prevMeme => ({
          ...prevMeme,
          ...updatedMeme
        }));
      }
    };
    
    // Caption updated
    const handleCaptionUpdate = (updatedMeme) => {
      if (updatedMeme.id === id) {
        setMeme(prevMeme => ({
          ...prevMeme,
          caption: updatedMeme.caption,
          vibe: updatedMeme.vibe
        }));
        setIsGeneratingCaption(false);
        
        // Check if there was an error during caption generation
        if (updatedMeme.captionError) {
          setCaptionError(true);
        } else {
          setCaptionError(false);
        }
      }
    };
    
    // New bid
    const handleNewBid = (bid) => {
      if (bid.meme_id === id) {
        setMeme(prevMeme => ({
          ...prevMeme,
          highest_bid: bid
        }));
      }
    };
    
    socket.on('vote-update', handleVoteUpdate);
    socket.on('caption-update', handleCaptionUpdate);
    socket.on('new-bid', handleNewBid);
    
    return () => {
      socket.off('vote-update', handleVoteUpdate);
      socket.off('caption-update', handleCaptionUpdate);
      socket.off('new-bid', handleNewBid);
    };
  }, [socket, id]);
  
  const handleVote = async (type) => {
    if (isVoting || !meme) return;
    
    setIsVoting(true);
    try {
      // Optimistic update
      setMeme(prevMeme => ({
        ...prevMeme,
        upvotes: type === 'up' ? prevMeme.upvotes + 1 : prevMeme.upvotes - 1
      }));
      
      // Send to API
      await voteMeme(id, type);
    } catch (error) {
      console.error('Error voting:', error);
      // Revert optimistic update on error
      setMeme(prevMeme => ({
        ...prevMeme,
        upvotes: type === 'up' ? prevMeme.upvotes - 1 : prevMeme.upvotes + 1
      }));
    } finally {
      setIsVoting(false);
    }
  };
  
  const handleGenerateCaption = async () => {
    if (isGeneratingCaption || !meme) return;
    
    setIsGeneratingCaption(true);
    setCaptionError(false); // Reset error state
    
    try {
      await generateCaption(id);
      // Socket will handle updating the UI
    } catch (error) {
      console.error('Error generating caption:', error);
      setIsGeneratingCaption(false);
      setCaptionError(true);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-neon-pink text-xl animate-pulse">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="cyber-card text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="neon-button"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  if (!meme) return null;
  
  // Clean up caption for display if needed
  const displayCaption = meme.caption ? cleanupCaptionForDisplay(meme.caption) : '';
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column - Meme details */}
      <div className="lg:col-span-2">
        <div className="cyber-card">
          {/* Navigation */}
          <div className="mb-4">
            <Link to="/" className="text-gray-400 hover:text-neon-blue transition-colors">
              ← Back to Gallery
            </Link>
          </div>
          
          {/* Meme title */}
          <h1 className="text-3xl font-bold text-neon-blue mb-2">
            {meme.title}
          </h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-400 text-sm">
              Created by <span className="text-neon-pink">{meme.owner_id}</span> • {formatDate(meme.created_at || new Date())}
            </div>
            
            {/* Upvotes */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className="text-gray-400 hover:text-neon-pink transition-colors p-1"
              >
                <span className="text-xl">▲</span>
              </button>
              <span className="text-neon-pink font-mono text-xl">{meme.upvotes}</span>
              <button 
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className="text-gray-400 hover:text-neon-blue transition-colors p-1"
              >
                <span className="text-xl">▼</span>
              </button>
            </div>
          </div>
          
          {/* Meme image */}
          <div className="relative rounded-md overflow-hidden mb-6 border border-gray-700">
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={meme.image_url} 
                alt={meme.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://picsum.photos/seed/error/800/600';
                }}
              />
            </div>
            
            {/* Vibe tag */}
            {meme.vibe && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-neon-pink px-3 py-1 rounded">
                {meme.vibe}
              </div>
            )}
          </div>
          
          {/* Caption */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-neon-blue">AI Caption</h3>
              <button
                onClick={handleGenerateCaption}
                disabled={isGeneratingCaption}
                className={`neon-blue-button text-sm ${captionError ? 'border-red-500' : ''}`}
              >
                {isGeneratingCaption ? 'Generating...' : 'Regenerate Caption'}
              </button>
            </div>
            
            <div className={`bg-cyber-black p-4 rounded-md border ${captionError ? 'border-red-500' : 'border-gray-700'}`}>
              {isGeneratingCaption ? (
                <div className="text-center py-2">
                  <span className="text-neon-blue animate-pulse">Generating new caption...</span>
                </div>
              ) : captionError ? (
                <div className="text-center py-2">
                  <p className="text-red-500 mb-1">Error generating caption</p>
                  <p className="text-gray-400 text-sm">Try again or check server logs</p>
                </div>
              ) : displayCaption ? (
                <p className="text-gray-300 italic text-lg">"{displayCaption}"</p>
              ) : (
                <p className="text-gray-500">No caption generated yet</p>
              )}
            </div>
          </div>
          
          {/* Tags */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-neon-blue mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {meme.tags && meme.tags.length > 0 ? (
                meme.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={`px-3 py-1 rounded ${getTagColor(tag)}`}
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No tags</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right column - Bidding */}
      <div>
        <BidForm memeId={id} />
      </div>
    </div>
  );
};

export default MemeDetail;