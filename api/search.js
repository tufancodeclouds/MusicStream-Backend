import yts from "yt-search";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ 
      status: false, 
      message: "Query is required" 
    });
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

    res.status(200).json({ status: true, songs });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ 
      status: false, 
      message: "Failed to fetch songs" 
    });
  }
}