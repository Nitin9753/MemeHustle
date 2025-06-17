import { useSocket } from '../context/SocketContext';
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CodeIcon from '@mui/icons-material/Code';

const Footer = () => {
  const { connected } = useSocket();
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'info.main',
        py: 3,
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems="center" 
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} MemeHustle | Cyberpunk AI Meme Marketplace
          </Typography>
          
          <Stack direction="row" spacing={3} alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <FiberManualRecordIcon 
                sx={{ 
                  color: connected ? 'success.main' : 'error.main',
                  fontSize: '0.8rem'
                }} 
              />
              <Typography variant="caption" color="text.secondary">
                {connected ? 'Connected' : 'Disconnected'}
              </Typography>
            </Stack>
            
            <Stack direction="row" alignItems="center" spacing={1}>
              <CodeIcon sx={{ color: theme.palette.secondary.main, fontSize: '1rem' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.secondary.main,
                  fontFamily: 'monospace',
                  animation: 'pulse 2s infinite ease-in-out',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.6 }
                  }
                }}
              >
                SYSTEM: ONLINE
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        
        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Typography 
          variant="caption" 
          color="text.disabled" 
          align="center" 
          sx={{ 
            display: 'block',
            fontStyle: 'italic'
          }}
        >
          Hack the planet! Break all the rules. Make it work.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;