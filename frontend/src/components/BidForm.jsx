import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBid, getBidsForMeme } from '../utils/api';
import { formatNumber } from '../utils/helpers';
import { useSocket } from '../context/SocketContext';

const BidForm = ({ memeId }) => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const [bidAmount, setBidAmount] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState(null);
  
  // Fetch existing bids when component mounts
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const bidData = await getBidsForMeme(memeId);
        setBids(bidData);
        
        // Set highest bid
        if (bidData.length > 0) {
          const highest = bidData.reduce((max, bid) => 
            bid.credits > max.credits ? bid : max, bidData[0]);
          setHighestBid(highest);
          setBidAmount(highest.credits + 100); // Set default bid to highest + 100
        }
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };
    
    fetchBids();
  }, [memeId]);
  
  // Listen for new bids via socket
  useEffect(() => {
    if (!socket) return;
    
    const handleNewBid = (bid) => {
      if (bid.meme_id === memeId) {
        setBids(prevBids => {
          // Check if bid already exists
          const existingBidIndex = prevBids.findIndex(b => b.id === bid.id);
          
          if (existingBidIndex >= 0) {
            // Update existing bid
            const updatedBids = [...prevBids];
            updatedBids[existingBidIndex] = bid;
            return updatedBids;
          } else {
            // Add new bid
            return [...prevBids, bid];
          }
        });
        
        // Update highest bid if necessary
        if (!highestBid || bid.credits > highestBid.credits) {
          setHighestBid(bid);
          setBidAmount(bid.credits + 100); // Set default bid to highest + 100
        }
      }
    };
    
    socket.on('new-bid', handleNewBid);
    
    return () => {
      socket.off('new-bid', handleNewBid);
    };
  }, [socket, memeId, highestBid]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to place a bid');
      return;
    }
    
    if (bidAmount <= 0) {
      setError('Bid amount must be positive');
      return;
    }
    
    if (highestBid && bidAmount <= highestBid.credits) {
      setError(`Bid must be higher than the current highest bid (${highestBid.credits})`);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const bidData = {
        meme_id: memeId,
        user_id: currentUser.id,
        credits: bidAmount
      };
      
      await createBid(bidData);
      // Socket will handle updating the UI
    } catch (error) {
      console.error('Error placing bid:', error);
      setError('Failed to place bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="cyber-card">
      <h3 className="text-xl font-bold text-neon-blue mb-4">Place Your Bid</h3>
      
      {/* Current highest bid */}
      {highestBid ? (
        <div className="mb-4 p-3 bg-cyber-black rounded-md border border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Highest bid:</span>
            <span className="text-neon-pink font-mono text-xl">{formatNumber(highestBid.credits)} ¢</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            by {highestBid.user_id}
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-cyber-black rounded-md border border-gray-700">
          <p className="text-gray-400">No bids yet. Be the first!</p>
        </div>
      )}
      
      {/* Bid form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="bidAmount" className="block text-gray-400 mb-2">
            Your Bid (¢)
          </label>
          <div className="flex">
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
              className="w-full bg-cyber-black text-neon-pink border border-gray-700 rounded-l-md py-2 px-3 focus:outline-none focus:border-neon-pink"
              min="1"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="neon-button rounded-l-none"
            >
              {isSubmitting ? 'Processing...' : 'Place Bid'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          Your balance: <span className="text-neon-blue">{formatNumber(currentUser?.credits || 0)} ¢</span>
        </div>
      </form>
      
      {/* Recent bids */}
      {bids.length > 0 && (
        <div className="mt-6">
          <h4 className="text-gray-400 mb-2 text-sm">Recent Bids</h4>
          <div className="max-h-40 overflow-y-auto">
            {bids
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 5)
              .map((bid) => (
                <div 
                  key={bid.id} 
                  className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
                >
                  <span className="text-sm">{bid.user_id}</span>
                  <span className="text-neon-pink font-mono">{formatNumber(bid.credits)} ¢</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BidForm;