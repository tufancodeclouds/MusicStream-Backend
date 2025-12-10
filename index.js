import express from "express";
import cors from "cors";
import yts from "yt-search";

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins
const allowedOrigins = [
  'https://music-stream-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000'
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manual CORS headers for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'MusicStream Backend is running!' });
});

app.get("/api/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ status: false, message: "Query is required" });
  }

  try {
    const searchResult = await yts(query);
    const videos = searchResult.videos || [];

    const songs = videos.map((video) => ({
      id: video.videoId,
      name: video.title,
      primaryArtists: video.author?.name || "Unknown Artist",
      image: [video.thumbnail],
      videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    }));

    res.json({ status: true, songs });
  } catch (err) {
    console.error('Search error:', err);
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch songs" });
  }
});

// Local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Local server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;
