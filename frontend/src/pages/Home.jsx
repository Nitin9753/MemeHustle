import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMemes } from '../utils/api';
import MemeCard from '../components/MemeCard';
import { useSocket } from '../context/SocketContext';
import {
  Typography,
  Box,
  Container,
  Grid,
  Button,
  CircularProgress,
  Paper,
  Alert,
  Stack,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();
  const theme = useTheme();
  
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const data = await getMemes();
        setMemes(data);
      } catch (err) {
        console.error('Error fetching memes:', err);
        setError('Failed to load memes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMemes();
  }, []);
  
  // Listen for socket events
  useEffect(() => {
    if (!socket) return;
    
    // New meme created
    const handleNewMeme = (meme) => {
      setMemes(prevMemes => [meme, ...prevMemes]);
    };
    
    // Meme vote updated
    const handleVoteUpdate = (updatedMeme) => {
      setMemes(prevMemes => 
        prevMemes.map(meme => 
          meme.id === updatedMeme.id ? updatedMeme : meme
        )
      );
    };
    
    socket.on('new-meme', handleNewMeme);
    socket.on('vote-update', handleVoteUpdate);
    
    return () => {
      socket.off('new-meme', handleNewMeme);
      socket.off('vote-update', handleVoteUpdate);
    };
  }, [socket]);
  
  // Handle local vote updates
  const handleVoteUpdate = (memeId, voteType) => {
    setMemes(prevMemes => 
      prevMemes.map(meme => {
        if (meme.id === memeId) {
          return {
            ...meme,
            upvotes: voteType === 'up' ? meme.upvotes + 1 : meme.upvotes - 1
          };
        }
        return meme;
      })
    );
  };
  
  return (
    <Container maxWidth="lg">
      {/* Hero section */}
      <Box 
        sx={{
          textAlign: 'center',
          mb: 6,
          py: 6,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
            zIndex: -1,
          }
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 900,
            letterSpacing: 1,
            mb: 2,
          }}
        >
          <Box component="span" sx={{ color: 'primary.main' }}>Meme</Box>
          <Box component="span" sx={{ color: 'secondary.main' }}>Hustle</Box>
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            maxWidth: 700, 
            mx: 'auto', 
            mb: 4,
            color: 'text.secondary',
            fontWeight: 400
          }}
        >
          The cyberpunk marketplace for AI-powered memes. Create, trade, and upvote in a neon-drenched digital wasteland.
        </Typography>

        <Button 
          variant="contained" 
          color="primary"
          size="large"
          component={Link}
          to="/create"
          startIcon={<AddIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: `0 0 20px ${theme.palette.primary.main}`,
          }}
        >
          Create a Meme
        </Button>
      </Box>
      
      {/* Meme gallery */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              color: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              '&::after': {
                content: '""',
                display: 'block',
                width: 60,
                height: 3,
                backgroundColor: 'secondary.main',
                marginLeft: 2,
                borderRadius: 1
              }
            }}
          >
            Latest Memes
          </Typography>
          
          <Button
            component={Link}
            to="/leaderboard"
            color="primary"
            endIcon={<EmojiEventsIcon />}
            sx={{ 
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              }
            }}
          >
            View Leaderboard
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress color="primary" size={60} thickness={4} />
          </Box>
        ) : error ? (
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'error.main',
              borderRadius: 2
            }}
          >
            <Alert 
              severity="error" 
              sx={{ mb: 3, backgroundColor: 'transparent', fontSize: '1rem' }}
            >
              {error}
            </Alert>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => window.location.reload()}
              startIcon={<RefreshIcon />}
            >
              Try Again
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {memes.map(meme => (
              <Grid item xs={12} sm={6} md={4} key={meme.id}>
                <MemeCard 
                  meme={meme} 
                  onVoteUpdate={handleVoteUpdate}
                />
              </Grid>
            ))}
            
            {memes.length === 0 && (
              <Grid item xs={12}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 6, 
                    textAlign: 'center',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No memes found
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/create"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    Create the First Meme
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Home;