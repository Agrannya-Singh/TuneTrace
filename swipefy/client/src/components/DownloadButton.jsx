
import React from 'react';

const DownloadButton = ({ likedSongs }) => {
  const handleDownload = () => {
    const content = likedSongs
      .map(song => `${song.name} by ${song.artists[0].name} - ${song.external_urls.spotify}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liked_songs.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={likedSongs.length === 0}
      className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg disabled:bg-gray-400 hover:bg-blue-600"
    >
      Download Liked Songs
    </button>
  );
};

export default DownloadButton;
