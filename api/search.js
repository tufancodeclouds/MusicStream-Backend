import yts from "yt-search";

export default async function handler(req, res) {
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

    return res.json({ status: true, songs });
  } catch (err) {
    console.error("YT Search Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch songs" });
  }
}
