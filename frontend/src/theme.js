import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff00ff', // neon-pink
      light: '#ff66ff',
      dark: '#cc00cc',
      contrastText: '#000000',
    },
    secondary: {
      main: '#00ffff', // neon-blue
      light: '#66ffff',
      dark: '#00cccc',
      contrastText: '#000000',
    },
    error: {
      main: '#ff0000',
    },
    warning: {
      main: '#ffff00',
    },
    info: {
      main: '#9900ff', // neon-purple
    },
    success: {
      main: '#00ff00',
    },
    background: {
      default: '#0d0d0d', // cyber-black
      paper: '#1a1a1a', // cyber-gray
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
  typography: {
    fontFamily: '"Courier New", monospace',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          '&:hover': {
            boxShadow: '0 0 10px #ff00ff',
          },
        },
        containedPrimary: {
          backgroundColor: '#ff00ff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#ff66ff',
          },
        },
        containedSecondary: {
          backgroundColor: '#00ffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#66ffff',
          },
        },
        outlined: {
          borderWidth: 2,
        },
        outlinedPrimary: {
          borderColor: '#ff00ff',
          '&:hover': {
            borderColor: '#ff66ff',
            backgroundColor: 'rgba(255, 0, 255, 0.08)',
          },
        },
        outlinedSecondary: {
          borderColor: '#00ffff',
          '&:hover': {
            borderColor: '#66ffff',
            backgroundColor: 'rgba(0, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderRadius: 8,
          border: '1px solid #333333',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d0d0d',
          borderBottom: '1px solid #ff00ff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#333333',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#ff00ff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff00ff',
              boxShadow: '0 0 5px #ff00ff',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme; 