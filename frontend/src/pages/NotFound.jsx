import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-6xl font-bold mb-4">
        <span className="text-neon-pink">4</span>
        <span className="text-neon-blue">0</span>
        <span className="text-neon-pink">4</span>
      </h1>
      
      <div className="cyber-card max-w-md text-center p-8 mb-8">
        <h2 className="text-2xl font-bold text-neon-blue mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-6">
          The neural network couldn't locate the data you're looking for. It might have been deleted, moved, or never existed in the first place.
        </p>
        
        <div className="flex justify-center">
          <Link to="/" className="neon-button">
            Return to Home
          </Link>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-2">SYSTEM ERROR LOG:</p>
        <div className="font-mono text-xs text-neon-pink animate-pulse">
          ERR_NEURAL_PATHWAY_DISCONNECTED
        </div>
      </div>
      
      {/* Binary code background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5 z-[-1]">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute text-neon-pink text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'rotate(90deg)',
              fontSize: `${Math.random() * 10 + 8}px`
            }}
          >
            {Array.from({ length: 50 }).map(() => Math.round(Math.random())).join('')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;