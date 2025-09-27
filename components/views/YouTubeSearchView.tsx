import React from 'react';
import YouTubeSearch from '../YouTubeSearch';

const YouTubeSearchView: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">YouTube Music Search</h1>
        <p className="text-gray-400">Search and play music from YouTube</p>
      </div>
      
      <YouTubeSearch className="max-w-4xl mx-auto" />
    </div>
  );
};

export default YouTubeSearchView;