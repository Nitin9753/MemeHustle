import MemeForm from '../components/MemeForm';

const CreateMeme = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="text-neon-pink">Create</span> a New <span className="text-neon-blue">Meme</span>
      </h1>
      
      <MemeForm />
      
      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-neon-blue mb-4">Tips for Creating Great Memes</h2>
        
        <div className="cyber-card">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-neon-pink mr-2">•</span>
              <span>Add relevant tags to get better AI-generated captions and vibes.</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-pink mr-2">•</span>
              <span>If you don't have an image URL, use the random image generator.</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-pink mr-2">•</span>
              <span>Cyberpunk-themed memes tend to get more upvotes in this marketplace.</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-pink mr-2">•</span>
              <span>After creating your meme, you can regenerate the AI caption if you're not satisfied.</span>
            </li>
          </ul>
        </div>
        
        <div className="mt-6 p-4 border border-neon-pink rounded-md bg-cyber-black bg-opacity-50">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-neon-pink mr-2 animate-pulse"></div>
            <h3 className="text-neon-pink font-bold">SYSTEM NOTICE</h3>
          </div>
          <p className="text-gray-400 text-sm">
            All memes are stored on the Supabase neural network. The AI will analyze your meme's vibe and generate a caption based on the tags provided. The more specific your tags, the better the AI response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateMeme;