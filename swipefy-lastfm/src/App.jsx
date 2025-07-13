
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
      // IMPORTANT: Replace with your actual project ID
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

    // Recommendation logic would need to be adapted for Genius API
    // For now, we'll just go through the initial list.
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!user ? (
        <Login />
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8">Swipefy (Genius)</h1>
          <div className="relative w-full max-w-md h-96 flex items-center justify-center">
            {tracks.length > currentIndex ? (
              tracks.slice(currentIndex, currentIndex + 1).map(track => (
                <SwipeCard
                  key={track.id}
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
