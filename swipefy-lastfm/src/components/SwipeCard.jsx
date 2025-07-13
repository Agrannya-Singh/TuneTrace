
import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';

const SwipeCard = ({ track, onSwipe }) => {
  const [previewUrl, setPreviewUrl] = useState('');

  const handlePreview = async () => {
    // Note: This requires a YouTube Data API v3 key with quota.
    const query = `${track.name} ${track.artist.name} official audio`;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=your-youtube-api-key&maxResults=1&type=video`
    );
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0]?.id.videoId;
      if (videoId) {
        setPreviewUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    } else {
        console.error("No YouTube video found for this track.");
    }
  };

  const handleSwipe = (direction) => {
    onSwipe(direction, track);
  };

  return (
    <TinderCard onSwipe={handleSwipe} preventSwipe={['up', 'down']} className="absolute">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 mx-auto">
        <img
          src={track.image?.[3]?.['#text'] || 'https://placehold.co/600x400.png'}
          alt="Track poster"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h2 className="text-xl font-semibold">{track.name}</h2>
        <p className="text-gray-600">{track.artist.name}</p>
        <button
          onClick={handlePreview}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
