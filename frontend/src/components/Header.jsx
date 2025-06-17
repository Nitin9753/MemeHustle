import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Avatar, 
  Box, 
  Menu, 
  MenuItem,
  Container,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const Header = () => {
  const { currentUser, getAllUsers, switchUser } = useAuth();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleSwitchUser = (userId) => {
    switchUser(userId);
    handleUserMenuClose();
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/create', label: 'Create', icon: <AddCircleIcon /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <LeaderboardIcon /> }
  ];
  
  return (
    <AppBar position="static" elevation={0} sx={{ 
      backgroundColor: 'background.default',
      borderBottom: '1px solid',
      borderColor: 'primary.main',
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            <Box component="span" sx={{ color: 'primary.main' }}>Meme</Box>
            <Box component="span" sx={{ color: 'secondary.main' }}>Hustle</Box>
          </Typography>

          {/* Mobile menu icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    mx: 1,
                    color: 'white',
                    borderBottom: location.pathname === item.path ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'primary.main',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* User Profile */}
          <Box sx={{ flexShrink: 0 }}>
            <Button
              onClick={handleUserMenuOpen}
              sx={{
                border: '1px solid',
                borderColor: 'secondary.main',
                borderRadius: 28,
                px: 2,
                py: 0.5,
                '&:hover': {
                  boxShadow: '0 0 8px #00ffff',
                }
              }}
            >
              <Avatar 
                src={currentUser?.avatar}
                alt={currentUser?.name}
                sx={{ 
                  width: 32, 
                  height: 32,
                  border: '1px solid',
                  borderColor: 'secondary.main',
                  mr: 1
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body2" sx={{ color: 'secondary.main' }}>
                  {currentUser?.name}
                </Typography>
                <Chip
                  label={`${currentUser?.credits} ¢`}
                  size="small"
                  sx={{
                    height: 20,
                    backgroundColor: 'transparent',
                    color: 'primary.main',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            </Button>

            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'secondary.main',
                  mt: 1.5,
                  width: 200,
                }
              }}
            >
              <MenuItem disabled sx={{ opacity: 0.7 }}>
                <Typography variant="body2">Switch User</Typography>
              </MenuItem>
              
              {getAllUsers().map((user) => (
                <MenuItem
                  key={user.id}
                  onClick={() => handleSwitchUser(user.id)}
                  selected={currentUser?.id === user.id}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 255, 0.2)',
                    }
                  }}
                >
                  <Avatar 
                    src={user.avatar} 
                    alt={user.name}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Typography variant="body2">{user.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            backgroundColor: 'background.default',
            width: 240,
            borderRight: '1px solid',
            borderColor: 'primary.main',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            <Box component="span" sx={{ color: 'primary.main' }}>Meme</Box>
            <Box component="span" sx={{ color: 'secondary.main' }}>Hustle</Box>
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={handleMobileMenuToggle}
                  selected={location.pathname === item.path}
                  sx={{
                    borderLeft: location.pathname === item.path ? '4px solid' : 'none',
                    borderColor: 'primary.main',
                    pl: location.pathname === item.path ? 2 : 3,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 0, 255, 0.1)',
                    }
                  }}
                >
                  <Box sx={{ mr: 2 }}>{item.icon}</Box>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;