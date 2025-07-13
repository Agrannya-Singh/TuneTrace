
import React, { useState, useEffect } from 'react';
import SwipeCard from './components/SwipeCard';
import Login from './components/Login';
import DownloadButton from './components/DownloadButton';

function App() {
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Check for token in URL after Spotify redirect
    const hash = window.location.hash;
    if (hash) {
      const token = hash.split('&')[0].split('=')[1];
      setToken(token);
      window.location.hash = '';
    }
  }, []);

  useEffect(() => {
    if (token) {
      // Fetch Global Top 50 playlist
      fetch('http://localhost:5000/api/spotify/playlist', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setTracks(data.tracks.items.map(item => item.track)))
        .catch(err => console.error('Error fetching playlist:', err));
    }
  }, [token]);

  const handleSwipe = (direction, track) => {
    if (direction === 'right') {
      setLikedSongs(prev => [...prev, track]);
    }
    setCurrentIndex(prev => prev + 1);

    // Fetch recommendations when tracks are running low
    if (currentIndex + 1 >= tracks.length) {
      fetchRecommendations();
    }
  };

  const fetchRecommendations = async () => {
    if (likedSongs.length === 0) return;
    try {
      const seedTracks = likedSongs.slice(-5).map(track => track.id).join(',');
      const response = await fetch(
        `http://localhost:5000/api/spotify/recommendations?seed_tracks=${seedTracks}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setTracks(prev => [...prev, ...data.tracks]);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!token ? (
        <Login />
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8">Swipefy</h1>
          <div className="relative w-full max-w-md">
            {tracks.length > currentIndex ? (
              <SwipeCard
                key={tracks[currentIndex].id}
                track={tracks[currentIndex]}
                onSwipe={handleSwipe}
              />
            ) : (
              <p className="text-center">No more songs. Retry?</p>
            )}
          </div>
          <DownloadButton likedSongs={likedSongs} />
        </>
      )}
    </div>
  );
}

export default App;
