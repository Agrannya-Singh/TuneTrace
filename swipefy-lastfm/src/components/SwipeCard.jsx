
import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';

const SwipeCard = ({ track, onSwipe }) => {
  const [previewUrl, setPreviewUrl] = useState('');

  // Genius API does not provide audio previews directly.
  // This function uses the YouTube API to find a preview.
  const handlePreview = async () => {
    const YOUTUBE_API_KEY = "AIzaSyCVSyC30V9I9OOlUZEGH_ot_Zzq3_a27FQ"; 

    const query = `${track.name} ${track.artist.name} official audio`;
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`
      );
      const data = await response.json();
      const videoId = data.items?.[0]?.id?.videoId;
      if (videoId) {
        setPreviewUrl(`https://www.youtube.com/embed/${videoId}`);
      } else {
        alert('No preview available for this track.');
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
      alert('Error fetching preview. Check your console and ensure your YouTube API key is valid and has the YouTube Data API v3 enabled.');
    }
  };

  const handleSwipe = (direction) => {
    onSwipe(direction, track);
  };

  return (
    <TinderCard onSwipe={handleSwipe} preventSwipe={['up', 'down']} className="absolute">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 mx-auto">
        <img
          src={track.image}
          alt={`${track.name} poster`}
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300.png'; }}
        />
        <h2 className="text-xl font-semibold">{track.name}</h2>
        <p className="text-gray-600">{track.artist.name}</p>
        <button
          onClick={handlePreview}
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
        >
          Preview Song
        </button>
        {previewUrl && (
          <iframe
            src={previewUrl}
            title="Song Preview"
            className="w-full h-32 mt-2"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </TinderCard>
  );
};

export default SwipeCard;
