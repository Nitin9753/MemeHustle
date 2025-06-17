 # MemeHustle Frontend

Cyberpunk-themed React frontend for the MemeHustle meme marketplace.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

- **Meme Gallery**: Browse and vote on memes
- **Meme Creation**: Create new memes with AI-generated captions
- **Real-Time Bidding**: Bid on memes with fake credits
- **Leaderboard**: View top and trending memes
- **Cyberpunk UI**: Neon-soaked design with glitch effects

## Technologies Used

- React with Vite
- React Router for navigation
- Socket.io for real-time updates
- Tailwind CSS for styling
- Axios for API requests

## Notes

- The frontend assumes the backend API is running on `http://localhost:5000`
- Mock authentication is implemented with hardcoded users
- For the grid background, replace `grid-bg.png` with an actual cyberpunk grid pattern image