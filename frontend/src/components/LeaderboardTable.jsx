import { Link } from 'react-router-dom';
import { formatNumber, formatDate, getTagColor } from '../utils/helpers';

const LeaderboardTable = ({ memes, title }) => {
  if (!memes || memes.length === 0) {
    return (
      <div className="cyber-card">
        <h2 className="text-xl font-bold text-neon-blue mb-4">{title}</h2>
        <p className="text-gray-400">No memes found</p>
      </div>
    );
  }
  
  return (
    <div className="cyber-card overflow-hidden">
      <h2 className="text-xl font-bold text-neon-blue mb-4">{title}</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-cyber-black">
              <th className="py-2 px-4 text-left text-gray-400">#</th>
              <th className="py-2 px-4 text-left text-gray-400">Meme</th>
              <th className="py-2 px-4 text-left text-gray-400">Tags</th>
              <th className="py-2 px-4 text-right text-gray-400">Upvotes</th>
              <th className="py-2 px-4 text-right text-gray-400">Creator</th>
            </tr>
          </thead>
          <tbody>
            {memes.map((meme, index) => (
              <tr 
                key={meme.id} 
                className="border-t border-gray-800 hover:bg-cyber-black transition-colors"
              >
                {/* Rank */}
                <td className="py-3 px-4">
                  <span className="text-neon-pink font-mono">{index + 1}</span>
                </td>
                
                {/* Meme info */}
                <td className="py-3 px-4">
                  <Link 
                    to={`/meme/${meme.id}`} 
                    className="flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded">
                      <img 
                        src={meme.image_url} 
                        alt={meme.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://picsum.photos/seed/error/100/100';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-white hover:text-neon-blue transition-colors">
                        {meme.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(meme.created_at || new Date())}
                      </p>
                    </div>
                  </Link>
                </td>
                
                {/* Tags */}
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {meme.tags && meme.tags.slice(0, 2).map((tag, i) => (
                      <span 
                        key={i} 
                        className={`text-xs px-1.5 py-0.5 rounded ${getTagColor(tag)}`}
                      >
                        #{tag}
                      </span>
                    ))}
                    {meme.tags && meme.tags.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{meme.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Upvotes */}
                <td className="py-3 px-4 text-right">
                  <span className="text-neon-pink font-mono">
                    {formatNumber(meme.upvotes)}
                  </span>
                </td>
                
                {/* Creator */}
                <td className="py-3 px-4 text-right text-gray-400 text-sm">
                  {meme.owner_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;