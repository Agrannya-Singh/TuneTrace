
import React from 'react';
import TinderCard from 'react-tinder-card';

const SwipeCard = ({ track, onSwipe }) => {
  const handleSwipe = (direction) => {
    onSwipe(direction, track);
  };

  return (
    <TinderCard
      onSwipe={handleSwipe}
      preventSwipe={['up', 'down']}
      className="absolute"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 mx-auto">
        <img
          src={track.album.images[0]?.url || 'https://via.placeholder.com/150'}
          alt="Album art"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h2 className="text-xl font-semibold">{track.name}</h2>
        <p className="text-gray-600">{track.artists[0].name}</p>
        {track.preview_url ? (
          <audio controls className="w-full mt-4">
            <source src={track.preview_url} type="audio/mpeg" />
          </audio>
        ) : (
          <p className="text-gray-500 mt-4">No preview available</p>
        )}
      </div>
    </TinderCard>
  );
};

export default SwipeCard;
