import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MemeDetail from './pages/MemeDetail';
import CreateMeme from './pages/CreateMeme';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import TerminalOverlay from './components/TerminalOverlay';

function App() {
  const [showTerminal, setShowTerminal] = useState(true);

  useEffect(() => {
    // Hide terminal overlay after 3 seconds
    const timer = setTimeout(() => {
      setShowTerminal(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {showTerminal && <TerminalOverlay />}
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meme/:id" element={<MemeDetail />} />
          <Route path="/create" element={<CreateMeme />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;