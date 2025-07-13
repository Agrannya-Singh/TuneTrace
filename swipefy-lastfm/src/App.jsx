
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SwipeCard from './components/SwipeCard';
import Login from './components/Login';
import DownloadButton from './components/DownloadButton';

function App() {
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => setUser(user));
  }, []);

  useEffect(() => {
    if (user) {
      // Replace with your actual project ID
      fetch('https://us-central1-your-project-id.cloudfunctions.net/getTopTracks')
        .then(res => res.json())
        .then(data => {
            if (data.tracks) {
                setTracks(data.tracks);
                setCurrentIndex(0);
            }
        })
        .catch(err => console.error('Error fetching tracks:', err));
    }
  }, [user]);

  const handleSwipe = (direction, track) => {
    if (direction === 'right') {
      setLikedSongs(prev => [...prev, track]);
    }
    setCurrentIndex(prev => prev + 1);

    if (currentIndex + 5 >= tracks.length) {
      fetchRecommendations();
    }
  };

  const fetchRecommendations = async () => {
    if (likedSongs.length === 0) return;
    const lastLikedSong = likedSongs[likedSongs.length - 1];
    if (!lastLikedSong || !lastLikedSong.artist || !lastLikedSong.name) return;
    
    const response = await fetch(
      // Replace with your actual project ID
      `https://us-central1-your-project-id.cloudfunctions.net/getSimilarTracks?artist=${encodeURIComponent(lastLikedSong.artist.name)}&track=${encodeURIComponent(lastLikedSong.name)}`
    );
    const data = await response.json();
    if(data.tracks) {
        setTracks(prev => [...prev, ...data.tracks]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!user ? (
        <Login />
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8">Swipefy (Last.fm)</h1>
          <div className="relative w-full max-w-md h-96 flex items-center justify-center">
            {tracks.length > currentIndex ? (
              tracks.slice(currentIndex, currentIndex + 1).map(track => (
                <SwipeCard
                  key={track.mbid || track.name}
                  track={track}
                  onSwipe={handleSwipe}
                />
              ))
            ) : (
              <p className="text-center">No more tracks. Retry?</p>
            )}
          </div>
          <DownloadButton likedSongs={likedSongs} />
        </>
      )}
    </div>
  );
}

export default App;
