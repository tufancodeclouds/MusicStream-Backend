import express from "express";
import cors from "cors";
import yts from "yt-search";

const app = express();
const PORT = 5000;

app.use(cors());

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
    console.error(err);
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch songs" });
  }
});

app.get('/', (req, res) => {
  res.send('MusicStream Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
});
