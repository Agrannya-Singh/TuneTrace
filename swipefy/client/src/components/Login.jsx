
import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/spotify/login';
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to Swipefy</h2>
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
