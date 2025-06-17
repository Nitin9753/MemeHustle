 # MemeHustle - Cyberpunk AI Meme Marketplace

A MERN stack application where users can create, trade, and upvote memes in a neon-drenched cyberpunk marketplace. Features Google Gemini API for AI-powered captions and vibe analysis.

## Project Structure

```
app/
├── backend/            # Node.js & Express backend
│   ├── config/         # Configuration files
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   └── index.js        # Server entry point
│
└── frontend/           # React frontend
    ├── public/         # Static assets
    └── src/
        ├── components/ # React components
        ├── context/    # Context providers
        ├── pages/      # Page components
        └── utils/      # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- Supabase account
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Set up Supabase:
   - Create a free account at [Supabase](https://supabase.com)
   - Create a new project
   - Run the SQL in `supabase-schema.sql` in the SQL Editor

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

1. **Meme Creation**: Users create memes with title, image URL, and tags
2. **Real-Time Bidding**: Users bid on memes with fake credits
3. **Upvote/Downvote**: Users vote on memes with a trending leaderboard
4. **AI Captions & Vibes**: Gemini API generates captions and vibe analysis
5. **Cyberpunk UI**: Glitchy, neon-soaked design with hacker-terminal aesthetics

## Technologies Used

- **Frontend**: React, Tailwind CSS, Socket.io client
- **Backend**: Node.js, Express, Socket.io
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API

## Deployment

1. Build the frontend:
```bash
cd frontend && npm run build
```

2. Deploy the backend and frontend to your preferred hosting service (e.g., Vercel, Render)

## Notes

- The application uses mock authentication with hardcoded users
- Real-time updates are implemented using WebSockets (Socket.io)
- The Gemini API is used for generating meme captions and vibe analysis