import { useState, useEffect } from 'react';
import { getTopMemes, getTrendingMemes } from '../utils/api';
import LeaderboardTable from '../components/LeaderboardTable';
import { useSocket } from '../context/SocketContext';

const Leaderboard = () => {
  const [topMemes, setTopMemes] = useState([]);
  const [trendingMemes, setTrendingMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();
  
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch both leaderboards in parallel
        const [topData, trendingData] = await Promise.all([
          getTopMemes(10),
          getTrendingMemes(10)
        ]);
        
        setTopMemes(topData);
        setTrendingMemes(trendingData);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, []);
  
  // Listen for socket events to update leaderboards
  useEffect(() => {
    if (!socket) return;
    
    const handleVoteUpdate = (updatedMeme) => {
      // Update top memes if the meme is in that list
      setTopMemes(prevMemes => 
        prevMemes.map(meme => 
          meme.id === updatedMeme.id ? updatedMeme : meme
        ).sort((a, b) => b.upvotes - a.upvotes)
      );
      
      // Update trending memes if the meme is in that list
      setTrendingMemes(prevMemes => 
        prevMemes.map(meme => 
          meme.id === updatedMeme.id ? updatedMeme : meme
        )
      );
    };
    
    socket.on('vote-update', handleVoteUpdate);
    
    return () => {
      socket.off('vote-update', handleVoteUpdate);
    };
  }, [socket]);
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="text-neon-pink">Meme</span> <span className="text-neon-blue">Leaderboard</span>
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-neon-pink text-xl animate-pulse">Loading...</div>
        </div>
      ) : error ? (
        <div className="cyber-card text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="neon-button"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top memes by upvotes */}
          <LeaderboardTable 
            memes={topMemes} 
            title="Top Memes by Upvotes" 
          />
          
          {/* Trending memes */}
          <LeaderboardTable 
            memes={trendingMemes} 
            title="Trending Memes" 
          />
          
          {/* Leaderboard explanation */}
          <div className="cyber-card">
            <h2 className="text-xl font-bold text-neon-blue mb-4">About the Leaderboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-neon-pink font-bold mb-2">Top Memes</h3>
                <p className="text-gray-300 text-sm">
                  The top memes are ranked by total upvotes. These are the all-time most popular memes in the marketplace.
                </p>
              </div>
              <div>
                <h3 className="text-neon-pink font-bold mb-2">Trending Memes</h3>
                <p className="text-gray-300 text-sm">
                  Trending memes are recent uploads that are gaining popularity quickly. These are calculated based on recency and upvote velocity.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 border border-neon-blue rounded-md bg-cyber-black bg-opacity-50">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-neon-blue mr-2 animate-pulse"></div>
                <h3 className="text-neon-blue font-bold">SYSTEM NOTICE</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Leaderboards update in real-time as users vote. The cache refreshes every 60 seconds to ensure optimal performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;