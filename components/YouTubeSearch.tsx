import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import YouTubeService, { YouTubeVideo } from '../services/youtubeService';

interface YouTubeSearchProps {
  className?: string;
}

const YouTubeSearch: React.FC<YouTubeSearchProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // No YouTube API initialization needed

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting YouTube search for:', searchQuery);
      const results = await YouTubeService.searchVideos(searchQuery, 5);
      console.log('Search results received:', results);
      setSearchResults(results);
      if (results.length === 0) {
        setError('No videos found. Try a different search term.');
      }
    } catch (err) {
      console.error('Search error details:', err);
      if (err instanceof Error) {
        if (err.message.includes('403')) {
          setError('YouTube API quota exceeded. Please try again later.');
        } else if (err.message.includes('400')) {
          setError('Invalid search request. Please try a different search term.');
        } else if (err.message.includes('Network')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(`Search failed: ${err.message}`);
        }
      } else {
        setError('Failed to search videos. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const playVideo = (video: YouTubeVideo, index: number) => {
    console.log('Attempting to play video:', video.title, 'ID:', video.id);
    setCurrentVideo(video);
    setCurrentIndex(index);
    setError(null);
    
    // For now, we'll show a message that the video is selected
    // In a real implementation, you would need to integrate with a proper audio streaming service
    setIsPlaying(true);
    console.log('Video selected for playback. Audio streaming would require additional setup.');
  };

  const togglePlayPause = () => {
    if (currentVideo) {
      setIsPlaying(!isPlaying);
      console.log(isPlaying ? 'Paused' : 'Playing', currentVideo.title);
    } else {
      setError('Please select a video first.');
    }
  };

  const playNext = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentIndex + 1) % searchResults.length;
      playVideo(searchResults[nextIndex], nextIndex);
    }
  };

  return (
    <div className={`bg-transparent ${className}`}>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for songs on YouTube..."
            className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-xl pl-6 pr-14 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-gray-800/70 transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors duration-200 disabled:opacity-50"
          >
            <Search size={22} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-400 mt-4 text-lg">Searching YouTube...</p>
        </div>
      )}

      {/* Welcome Message */}
      {!isLoading && searchResults.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="mb-6">
            <svg className="w-20 h-20 text-green-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">Search YouTube Music</h2>
            <p className="text-gray-400 text-lg">Enter a song name, artist, or any music-related search term above</p>
          </div>
          <div className="bg-gray-800/20 border border-gray-700/30 rounded-xl p-6 max-w-md mx-auto backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-3">How to use:</h3>
            <ul className="text-gray-300 text-left space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Search for any song or artist
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Click on a result to play it
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Use controls to pause/play/skip
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h3 className="text-white text-xl font-semibold mb-6 flex items-center">
            <svg className="w-6 h-6 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
            </svg>
            Search Results ({searchResults.length} found)
          </h3>
          <div className="space-y-4">
            {searchResults.map((video, index) => (
              <div
                key={video.id}
                onClick={() => playVideo(video, index)}
                className={`group flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-800/30 hover:scale-[1.02] ${
                  currentVideo?.id === video.id 
                    ? 'bg-green-900/20 border border-green-500/30 shadow-lg shadow-green-500/10' 
                    : 'bg-gray-800/20 border border-gray-700/30 hover:border-gray-600/50'
                } backdrop-blur-sm`}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-15 rounded-lg object-cover mr-5 group-hover:scale-105 transition-transform duration-200"
                  />
                  {currentVideo?.id === video.id && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate text-lg mb-1 group-hover:text-green-100 transition-colors">{video.title}</h4>
                  <p className="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors">{video.channelTitle}</p>
                </div>
                {currentVideo?.id === video.id && (
                  <div className="ml-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Playing</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Audio Player */}
      {currentVideo && (
        <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={currentVideo.thumbnail}
                alt={currentVideo.title}
                className="w-16 h-16 rounded-xl object-cover shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold truncate text-lg mb-1">{currentVideo.title}</h4>
              <p className="text-gray-400 text-sm truncate">{currentVideo.channelTitle}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayPause}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-500/25"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                onClick={playNext}
                className="bg-gray-700/70 hover:bg-gray-600/70 text-white rounded-full p-3 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <SkipForward size={20} />
              </button>
              <div className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                <Volume2 size={22} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audio player placeholder - would need proper audio streaming implementation */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default YouTubeSearch;