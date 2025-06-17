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

## Environment Variables

The application uses the following environment variables:

- `VITE_API_URL`: The URL of your backend API
- `VITE_SOCKET_URL`: The URL of your WebSocket server (without protocol, e.g., `your-backend.vercel.app`)

You can set these variables in a `.env` file during development:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

For production, you can set them in your hosting platform (e.g., Vercel).

## Deployment to Vercel

1. Push your code to a GitHub repository

2. Create a new project in Vercel and connect to your repository

3. Configure the following settings:
   - Framework Preset: Vite
   - Root Directory: `app/frontend` (or `.` if deploying only the frontend)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. Add environment variables in Vercel project settings:
   - `VITE_API_URL`: URL of your backend API (e.g., `https://your-backend-api.vercel.app/api`)

5. Deploy!

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

- The frontend connects to the backend API using the URL specified in `VITE_API_URL` environment variable
- If no environment variable is provided, it defaults to `/api` in production and `http://localhost:5000/api` in development
- Mock authentication is implemented with hardcoded users
- For the grid background, replace `grid-bg.png` with an actual cyberpunk grid pattern image