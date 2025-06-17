import { createContext, useContext, useState, useEffect } from 'react';

// Mock user data
const MOCK_USERS = [
  { id: 'cyberpunk420', name: 'CyberPunk420', credits: 1000, avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'neo_hacker', name: 'Neo Hacker', credits: 1500, avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'wallstreetcyber', name: 'WallStreetCyber', credits: 2000, avatar: 'https://picsum.photos/seed/user3/100/100' },
];

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from localStorage
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      const user = MOCK_USERS.find(u => u.id === storedUserId);
      setCurrentUser(user || MOCK_USERS[0]);
    } else {
      // Default to first user if none stored
      setCurrentUser(MOCK_USERS[0]);
      localStorage.setItem('userId', MOCK_USERS[0].id);
    }
    
    setLoading(false);
  }, []);

  const login = (userId) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('userId', user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userId');
  };

  const switchUser = (userId) => {
    return login(userId);
  };

  const getAllUsers = () => {
    return MOCK_USERS;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      login, 
      logout, 
      switchUser, 
      getAllUsers 
    }}>
      {children}
    </AuthContext.Provider>
  );
};