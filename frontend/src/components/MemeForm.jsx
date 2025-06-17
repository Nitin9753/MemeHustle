import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMeme } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { getRandomImageUrl } from '../utils/helpers';

const MemeForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    tags: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [useRandomImage, setUseRandomImage] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a meme');
      return;
    }
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Process tags into array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Use random image if checked or no image provided
      const imageUrl = useRandomImage || !formData.image_url.trim()
        ? getRandomImageUrl(formData.title)
        : formData.image_url;
      
      const memeData = {
        title: formData.title,
        image_url: imageUrl,
        tags: tagsArray,
        owner_id: currentUser.id
      };
      
      const newMeme = await createMeme(memeData);
      
      // Navigate to the new meme
      navigate(`/meme/${newMeme.id}`);
    } catch (error) {
      console.error('Error creating meme:', error);
      setError('Failed to create meme. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="cyber-card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-neon-pink mb-6">Create New Meme</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-300 mb-2">
            Title <span className="text-neon-pink">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-cyber-black text-white border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:border-neon-pink"
            placeholder="Enter a catchy title..."
            required
          />
        </div>
        
        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="block text-gray-300 mb-2">
            Image URL {useRandomImage && <span className="text-xs text-gray-500">(Random image will be used)</span>}
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            disabled={useRandomImage}
            className={`w-full bg-cyber-black text-white border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:border-neon-pink ${useRandomImage ? 'opacity-50' : ''}`}
            placeholder="https://example.com/image.jpg"
          />
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="useRandomImage"
              checked={useRandomImage}
              onChange={() => setUseRandomImage(prev => !prev)}
              className="mr-2"
            />
            <label htmlFor="useRandomImage" className="text-sm text-gray-400">
              Use random image
            </label>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mb-6">
          <label htmlFor="tags" className="block text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full bg-cyber-black text-white border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:border-neon-pink"
            placeholder="crypto, funny, tech..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Tags help generate better AI captions and vibes
          </p>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="neon-button"
          >
            {isSubmitting ? 'Creating...' : 'Create Meme'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemeForm;