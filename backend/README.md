 # MemeHustle Backend

Cyberpunk-themed API for the MemeHustle meme marketplace.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

3. Set up Supabase:
   - Create a free account at [Supabase](https://supabase.com)
   - Create a new project
   - Run the SQL in `supabase-schema.sql` in the SQL Editor

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Memes
- `POST /api/memes` - Create a new meme
- `GET /api/memes` - Get all memes
- `GET /api/memes/:id` - Get a specific meme
- `POST /api/memes/:id/vote` - Vote on a meme (upvote/downvote)
- `POST /api/memes/:id/caption` - Generate AI caption for a meme

### Bids
- `POST /api/bids` - Create a new bid
- `GET /api/bids/meme/:memeId` - Get all bids for a meme
- `GET /api/bids/meme/:memeId/highest` - Get highest bid for a meme

### Leaderboard
- `GET /api/leaderboard/top?limit=10` - Get top memes by upvotes
- `GET /api/leaderboard/trending?limit=10` - Get trending memes

## WebSocket Events

- `new-meme` - Emitted when a new meme is created
- `vote-update` - Emitted when a meme receives a vote
- `new-bid` - Emitted when a new bid is placed
- `caption-update` - Emitted when a meme caption is updated

## Technologies Used
- Node.js & Express
- Socket.io for real-time updates
- Supabase for database
- Google Gemini API for AI captions and vibes