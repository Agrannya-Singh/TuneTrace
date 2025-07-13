
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000';

app.get('/api/spotify/login', (req, res) => {
  const scope = 'user-read-private playlist-read-private';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'token',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
      })
  );
});

app.get('/api/spotify/playlist', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF',
      {
        headers: { Authorization: req.headers.authorization },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

app.get('/api/spotify/recommendations', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations',
      {
        headers: { Authorization: req.headers.authorization },
        params: {
          seed_tracks: req.query.seed_tracks,
          limit: 10,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
