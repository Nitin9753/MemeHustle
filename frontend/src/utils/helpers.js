 // Format date to a readable string
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Generate a random placeholder image URL
  export const getRandomImageUrl = (seed = Math.random().toString(36).substring(7)) => {
    return `https://picsum.photos/seed/${seed}/400/300`;
  };
  
  // Format number with commas for thousands
  export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // Truncate text with ellipsis
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Get random item from array
  export const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
  // Debounce function for input handlers
  export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  // Cyberpunk-themed tag colors
  export const getTagColor = (tag) => {
    const colors = {
      crypto: 'bg-purple-900 text-purple-200',
      funny: 'bg-pink-900 text-pink-200',
      tech: 'bg-blue-900 text-blue-200',
      hacker: 'bg-green-900 text-green-200',
      finance: 'bg-yellow-900 text-yellow-200',
      default: 'bg-gray-800 text-gray-200'
    };
    
    return colors[tag.toLowerCase()] || colors.default;
  };
  
  // Terminal typing effect text generator
  export const typeText = (text, speed = 50) => {
    return new Promise((resolve) => {
      let i = 0;
      const container = document.createElement('div');
      const interval = setInterval(() => {
        if (i < text.length) {
          container.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(interval);
          resolve(container.textContent);
        }
      }, speed);
    });
  };