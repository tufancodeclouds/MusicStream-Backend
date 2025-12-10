import express from "express";
import cors from "cors";
import yts from "yt-search";

const app = express();
const PORT = process.env.PORT || 5000;

// Simple CORS - allow all origins for testing
app.use(cors());

// Set headers manually for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
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

export default app;