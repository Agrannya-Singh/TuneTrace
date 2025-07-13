
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SwipeCard from './components/SwipeCard';
import Login from './components/Login';
import DownloadButton from './components/DownloadButton';

const apiKey = process.env.YOUTUBE_API_KEY;


const YOUTUBE_API_KEY =apiKey ; 
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/videos';

function App() {
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => setUser(user));
  }, []);

  useEffect(() => {
    if (user) {
      const fetchTopSongs = async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            part: 'snippet',
            chart: 'mostPopular',
            videoCategoryId: '10', // Music category
            maxResults: '50',
            regionCode: 'US', // Use a major region for a stable "global" chart
            key: YOUTUBE_API_KEY,
          });

          const response = await fetch(`${YOUTUBE_API_BASE}?${params.toString()}`);
          const data = await response.json();

          if (data.items) {
            const fetchedTracks = data.items.map(item => ({
              id: item.id,
              name: item.snippet.title,
              artist: { name: item.snippet.channelTitle },
              image: item.snippet.thumbnails.high.url || 'https://placehold.co/300x300.png',
            }));
            // Shuffle tracks for variety
            setTracks(fetchedTracks.sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
          } else {
            console.error('No items found in YouTube API response:', data);
            setTracks([]);
          }
        } catch (err) {
          console.error('Error fetching YouTube top songs:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchTopSongs();
    }
  }, [user]);

  const handleSwipe = (direction, track) => {
    if (direction === 'right') {
      setLikedSongs(prev => [...prev, track]);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
     if (user) {
      setLoading(true);
      setCurrentIndex(0);
      setLikedSongs([]);
      // Just reshuffle existing tracks for now
      setTracks(prevTracks => [...prevTracks].sort(() => Math.random() - 0.5));
      setLoading(false);
     }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans">
      {!user ? (
        <Login />
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8 tracking-wider">TuneSwipe</h1>
          <div className="relative w-full max-w-md h-96 flex items-center justify-center">
            {loading ? (
              <p>Finding new music...</p>
            ) : tracks.length > currentIndex ? (
              tracks.slice(currentIndex, currentIndex + 5).reverse().map((track, index) => (
                <SwipeCard
                  key={track.id}
                  track={track}
                  onSwipe={handleSwipe}
                  active={index === (tracks.slice(currentIndex, currentIndex + 5).length - 1)}
                />
              ))
            ) : (
              <div className="text-center">
                <p className="text-xl mb-4">You've seen it all!</p>
                <button 
                  onClick={handleRestart}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
                  Restart
                </button>
              </div>
            )}
          </div>
          <DownloadButton likedSongs={likedSongs} />
        </>
      )}
    </div>
  );
}

export default App;
