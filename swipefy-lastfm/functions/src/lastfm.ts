
import * as functions from 'firebase-functions';
import axios from 'axios';
import * as cors from 'cors';

const corsHandler = cors({ origin: true });

// It's recommended to set your API key in Firebase environment configuration
// firebase functions:config:set lastfm.api_key="YOUR_API_KEY"
const LASTFM_API_KEY = functions.config().lastfm?.api_key || 'c55cf346b9e31fc1264620b866e0739b'; // Fallback for local testing

export const getTopTracks = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const response = await axios.get(
        'https://ws.audioscrobbler.com/2.0/',
        {
          params: {
            method: 'chart.gettoptracks',
            api_key: LASTFM_API_KEY,
            format: 'json',
            limit: 50,
          },
        }
      );
      const tracks = response.data.tracks.track.map((track: any) => ({
        name: track.name,
        artist: { name: track.artist.name },
        mbid: track.mbid,
        image: track.image,
      }));
      res.json({ tracks });
    } catch (error) {
      console.error('Error in getTopTracks:', error);
      res.status(500).json({ error: 'Failed to fetch top tracks' });
    }
  });
});

export const getSimilarTracks = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { artist, track } = req.query;
      if (!artist || !track) {
        return res.status(400).json({ error: 'Artist and track parameters are required' });
      }

      const response = await axios.get(
        'https://ws.audioscrobbler.com/2.0/',
        {
          params: {
            method: 'track.getsimilar',
            artist,
            track,
            api_key: LASTFM_API_KEY,
            format: 'json',
            limit: 10,
          },
        }
      );
      const tracks = response.data.similartracks.track.map((track: any) => ({
        name: track.name,
        artist: { name: track.artist.name },
        mbid: track.mbid,
        image: track.image,
      }));
      res.json({ tracks });
    } catch (error) {
      console.error('Error in getSimilarTracks:', error);
      res.status(500).json({ error: 'Failed to fetch similar tracks' });
    }
  });
});
