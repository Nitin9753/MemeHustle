import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getTagColor } from '../utils/helpers';
import { voteMeme } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
  Tooltip,
  alpha
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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

const MemeCard = ({ meme, onVoteUpdate }) => {
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const [isVoting, setIsVoting] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(meme.upvotes);
  const [imageError, setImageError] = useState(false);
  
  const handleVote = async (type) => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      // Optimistic update
      if (type === 'up') {
        setLocalUpvotes(prev => prev + 1);
      } else {
        setLocalUpvotes(prev => prev - 1);
      }
      
      // Send to API
      await voteMeme(meme.id, type);
      
      // Notify parent component
      if (onVoteUpdate) {
        onVoteUpdate(meme.id, type);
      }
    } catch (error) {
      console.error('Error voting:', error);
      // Revert optimistic update on error
      setLocalUpvotes(meme.upvotes);
    } finally {
      setIsVoting(false);
    }
  };

  // Convert Tailwind tag colors to MUI colors
  const getMuiTagColor = (tag) => {
    const baseColors = {
      'bg-blue-100 text-blue-800': {
        bgcolor: alpha('#3b82f6', 0.2),
        color: '#1e40af'
      },
      'bg-green-100 text-green-800': {
        bgcolor: alpha('#10b981', 0.2),
        color: '#065f46'
      },
      'bg-red-100 text-red-800': {
        bgcolor: alpha('#ef4444', 0.2),
        color: '#991b1b'
      },
      'bg-yellow-100 text-yellow-800': {
        bgcolor: alpha('#f59e0b', 0.2),
        color: '#92400e'
      },
      'bg-purple-100 text-purple-800': {
        bgcolor: alpha('#8b5cf6', 0.2),
        color: '#5b21b6'
      },
      'bg-pink-100 text-pink-800': {
        bgcolor: alpha('#ec4899', 0.2),
        color: '#9d174d'
      },
      'bg-indigo-100 text-indigo-800': {
        bgcolor: alpha('#6366f1', 0.2),
        color: '#3730a3'
      }
    };
    
    const tailwindColor = getTagColor(tag);
    return baseColors[tailwindColor] || {
      bgcolor: alpha('#9900ff', 0.2),
      color: '#9900ff'
    };
  };
  
  // Clean up caption for display
  const displayCaption = meme.caption ? cleanupCaptionForDisplay(meme.caption) : '';
  
  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://picsum.photos/seed/error/400/300';
    setImageError(true);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
    >
      {/* Image */}
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9 aspect ratio
          overflow: 'hidden'
        }}
      >
        <CardMedia
          component="img"
          image={meme.image_url}
          alt={meme.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
          onError={handleImageError}
        />
        
        {/* Vibe tag */}
        {meme.vibe && (
          <Chip
            label={meme.vibe}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'primary.main',
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          />
        )}
        
        <Box
          component={Link}
          to={`/meme/${meme.id}`}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'black'
            }
          }}
        >
          <OpenInNewIcon fontSize="small" />
        </Box>
      </Box>
      
      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 1,
          height: '2.5rem' // Fixed height for title area
        }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to={`/meme/${meme.id}`}
            sx={{
              color: 'secondary.main',
              textDecoration: 'none',
              fontWeight: 'bold',
              '&:hover': {
                color: 'primary.main',
              },
              // Ensure title doesn't break layout
              maxWidth: '70%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {meme.title}
          </Typography>
          
          {/* Upvotes */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Upvote">
              <IconButton 
                onClick={() => handleVote('up')}
                disabled={isVoting}
                size="small"
                sx={{ color: 'grey.500', '&:hover': { color: 'primary.main' } }}
              >
                <ThumbUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'monospace', 
                color: 'primary.main',
                fontWeight: 'bold',
                mx: 0.5
              }}
            >
              {localUpvotes}
            </Typography>
            <Tooltip title="Downvote">
              <IconButton 
                onClick={() => handleVote('down')}
                disabled={isVoting}
                size="small"
                sx={{ color: 'grey.500', '&:hover': { color: 'secondary.main' } }}
              >
                <ThumbDownIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Caption - fixed height container */}
        <Box sx={{ height: '4.5rem', mb: 2 }}>
          {displayCaption && (
            <Typography 
              variant="body2" 
              sx={{ 
                fontStyle: 'italic', 
                color: 'text.secondary',
                fontSize: '0.85rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.2em'
              }}
            >
              "{displayCaption}"
            </Typography>
          )}
        </Box>
        
        {/* Tags */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 0.5, 
            mb: 2,
            minHeight: '22px', // Ensure consistent height even without tags
            height: '22px',
            overflow: 'hidden'
          }}
        >
          {meme.tags && meme.tags.map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag}`}
              size="small"
              sx={{
                ...getMuiTagColor(tag),
                fontSize: '0.7rem',
                height: 22
              }}
            />
          ))}
        </Box>
      </CardContent>
      
      <Divider />
      
      {/* Footer */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
        <Typography variant="caption" color="text.secondary">
          By {meme.owner_id}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDate(meme.created_at || new Date())}
        </Typography>
      </CardActions>
      
      {/* Highest bid if any */}
      {meme.highest_bid && (
        <>
          <Divider />
          <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Highest bid:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'monospace', 
                color: 'primary.main',
                fontWeight: 'bold'
              }}
            >
              {meme.highest_bid.credits} ¢
            </Typography>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default MemeCard;