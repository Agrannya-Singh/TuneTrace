import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from "cors";

const corsHandler = cors({ origin: true });

// Genius API access token
const GENIUS_ACCESS_TOKEN = "jef8tkQqUVDP_lSiA5UXbDGfE3yAeBlEsz16EkXhd4GXKYHzb7Zo_I-Q2QEFuZGd";
const GENIUS_API_BASE = "https://api.genius.com";

const mapTrackData = (hit: any) => ({
  id: hit.result.id,
  name: hit.result.title,
  artist: { name: hit.result.primary_artist.name },
  image: hit.result.song_art_image_url || 'https://placehold.co/300x300.png',
});

// This function will now get top tracks from Genius by searching for a popular term
export const getTopTracks = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const response = await axios.get(
        `${GENIUS_API_BASE}/search`,
        {
          headers: {
            Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
          },
          params: {
            q: 'top 100', // A generic query to get popular songs
          },
        }
      );
      
      const tracks = response.data.response.hits
        .filter((hit: any) => hit.type === 'song' && hit.result.song_art_image_url)
        .map(mapTrackData);

      res.json({ tracks });
    } catch (error: any) {
      console.error("Error fetching Genius top tracks:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Failed to fetch top tracks from Genius" });
    }
  });
});


// This function can be used to get more details, including song previews if available elsewhere
export const getSongDetails = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { songId } = req.query;
      if (!songId) {
        return res.status(400).json({ error: "Song ID is required" });
      }

      const response = await axios.get(
        `${GENIUS_API_BASE}/songs/${songId}`,
        {
          headers: {
            Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
          },
        }
      );
      
      const song = response.data.response.song;
      res.json({ song });

    } catch (error: any) {
      console.error("Error fetching Genius song details:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Failed to fetch song details from Genius" });
    }
  });
});
