import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';

const SwipeCard = ({ track, onSwipe }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Select the largest available image or fallback
  useEffect(() => {
    if (track.image && Array.isArray(track.image) && track.image.length > 0) {
        const largestImage = track.image.reduce((largest, current) => 
        current['#text'] && current['#text'].length > (largest['#text'] || '').length ? current : largest, 
        { '#text': 'https://via.placeholder.com/150' }
        );
        setImageUrl(largestImage['#text']);
    } else {
        setImageUrl('https://via.placeholder.com/150');
    }
  }, [track.image]);

  const handlePreview = async () => {
    const query = `${track.name} ${track.artist.name} official audio site:youtube.com`;
    try {
      // IMPORTANT: Replace 'your-youtube-api-key' with your actual YouTube Data API key.
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=your-youtube-api-key&maxResults=1&type=video`
      );
      const data = await response.json();
      const videoId = data.items?.[0]?.id?.videoId;
      if (videoId) {
        setPreviewUrl(`https://www.youtube.com/embed/${videoId}`);
      } else {
        setPreviewUrl(''); // Clear if no video found
        alert('No preview available for this track.');
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
      setPreviewUrl('');
      alert('Error fetching preview. Check YouTube API key.');
    }
  };

  const handleSwipe = (direction) => {
    onSwipe(direction, track);
  };

  return (
    <TinderCard onSwipe={handleSwipe} preventSwipe={['up', 'down']} className="absolute">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 mx-auto">
        <img
          src={imageUrl}
          alt={`${track.name} poster`}
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} // Fallback on error
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
