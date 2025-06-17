import { useEffect, useState, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const TerminalOverlay = () => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const terminalRef = useRef(null);
  const theme = useTheme();
  
  const terminalLines = [
    '> INITIALIZING SYSTEM...',
    '> CONNECTING TO NEURAL NETWORK...',
    '> ACCESSING MEME DATABASE...',
    '> CALIBRATING CYBERPUNK INTERFACE...',
    '> ACTIVATING NEON PROTOCOLS...',
    '> WELCOME TO MEMEHUSTLE'
  ];
  
  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let isDeleting = false;
    let typingSpeed = 50;
    
    const type = () => {
      const line = terminalLines[currentLine];
      
      if (isDeleting) {
        setText(line.substring(0, currentChar - 1));
        currentChar--;
        
        if (currentChar === 0) {
          isDeleting = false;
          currentLine++;
          
          if (currentLine === terminalLines.length) {
            // Finished all lines, start fade out
            setTimeout(() => {
              setFadeOut(true);
            }, 500);
            return;
          }
        }
      } else {
        setText(line.substring(0, currentChar + 1));
        currentChar++;
        
        if (currentChar === line.length) {
          // Pause at end of line
          isDeleting = currentLine < terminalLines.length - 1;
          typingSpeed = isDeleting ? 30 : 1000;
        }
      }
      
      setTimeout(type, typingSpeed);
    };
    
    // Start typing effect
    setTimeout(type, 500);
    
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    
    return () => {
      clearInterval(cursorInterval);
    };
  }, []);
  
  return (
    <Box 
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'black',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 1s ease',
        opacity: fadeOut ? 0 : 1,
        fontFamily: 'monospace'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '600px', p: 4 }}>
        <Typography
          ref={terminalRef}
          variant="h5"
          component="div"
          sx={{
            color: '#00ff00',
            fontFamily: 'monospace',
            fontWeight: 400,
            letterSpacing: 0.5,
            textShadow: '0 0 5px #00ff00'
          }}
        >
          {text}
          <Box 
            component="span" 
            sx={{ 
              ml: 0.5,
              opacity: showCursor ? 1 : 0,
              transition: 'opacity 0.2s ease'
            }}
          >
            _
          </Box>
        </Typography>
      </Box>
      
      {/* Binary code background effect */}
      <Box 
        sx={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: 0.2
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Typography 
            key={i} 
            variant="caption"
            sx={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: '#00ff00',
              fontSize: '0.7rem',
              animation: 'pulse 2s infinite ease-in-out',
              animationDelay: `${Math.random() * 2}s`,
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.7 },
                '50%': { opacity: 0.3 }
              }
            }}
          >
            {Array.from({ length: 20 }).map(() => Math.round(Math.random())).join('')}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default TerminalOverlay;