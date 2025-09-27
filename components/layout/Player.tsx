import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../App';
import { AppContextType, Track } from '../../types';
import { ICONS } from '../../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, Heart, List, Maximize, Minimize } from 'lucide-react';

// Queue Track Menu Component
interface QueueTrackMenuProps {
  track: Track;
  index: number;
}

const QueueTrackMenu: React.FC<QueueTrackMenuProps> = ({ track, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { addToQueue, playNextTrack, addToPlaylist, removeFromQueue } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    
    switch (action) {
      case 'playNext':
        playNextTrack(track);
        break;
      case 'addToQueue':
        addToQueue(track);
        break;
      case 'addToPlaylist':
        addToPlaylist(track);
        break;
      case 'remove':
        if (removeFromQueue) {
          removeFromQueue(index);
        }
        break;
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Determine if menu should open upward (for items near bottom)
  const shouldOpenUpward = index >= 3;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleMenuClick}
        className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 opacity-100"
        aria-label="Track options"
      >
        <svg className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path d="M10 4a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[99998]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Menu */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-gray-800/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-[99999]">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold text-center">Track Options</h3>
            </div>
            <div className="py-2">
              <button
                onClick={(e) => handleMenuAction('playNext', e)}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Play Next
              </button>
              
              <button
                onClick={(e) => handleMenuAction('addToQueue', e)}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add to Queue
              </button>
              
              <button
                onClick={(e) => handleMenuAction('addToPlaylist', e)}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 4h6" />
                </svg>
                Add to Playlist
              </button>
              
              <div className="border-t border-white/10 my-2"></div>
              
              <button
                onClick={(e) => handleMenuAction('remove', e)}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove from Queue
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Player: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    audioRef,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    likeTrack,
    queue,
    playTrack,
    playerMode,
    setPlayerMode
  } = useContext(AppContext) as AppContextType;
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const queueRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (queueRef.current && !queueRef.current.contains(event.target as Node)) {
        setShowQueue(false);
      }
    };

    if (showQueue) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQueue]);

  // Handle click outside overlay to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setShowFullscreenOverlay(false);
      }
    };

    if (showFullscreenOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFullscreenOverlay]);

  // Note: Removed fullscreen change handler since we're using overlay instead of browser fullscreen

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, playNext]);
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
        audioRef.current.currentTime = Number(e.target.value);
        setProgress(Number(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentTrack) {
    return null;
  }

  // Mini player mode
  if (playerMode === 'mini') {
    return (
      <>
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-3 z-50 w-80">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-700 rounded flex-shrink-0">
              {currentTrack.coverArt && (
                <img 
                  src={currentTrack.coverArt} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{currentTrack.title}</p>
              <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button 
                onClick={() => setPlayerMode('normal')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Maximize size={16} />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Fullscreen player mode
  if (playerMode === 'fullscreen') {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 via-slate-900 to-black z-50 flex flex-col overflow-hidden">
          {/* Background blur effect */}
          <div className="absolute inset-0 opacity-20">
            {currentTrack.coverArt && (
              <img 
                src={currentTrack.coverArt} 
                alt="Background"
                className="w-full h-full object-cover blur-3xl scale-110"
              />
            )}
          </div>
          
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50 backdrop-blur-sm"></div>
          
          {/* Mobile Layout (centered) */}
          <div className="relative flex-1 flex items-center justify-center p-8 lg:hidden">
            <div className="text-center max-w-lg">
              {/* Enhanced album artwork */}
              <div className="relative group mx-auto mb-8">
                <div className="w-80 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mx-auto shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                  {currentTrack.coverArt && (
                    <img 
                      src={currentTrack.coverArt} 
                      alt={currentTrack.title}
                      className="w-full h-full object-cover rounded-2xl shadow-2xl ring-1 ring-white/10"
                    />
                  )}
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
              
              {/* Track info with better typography */}
              <div className="mb-10">
                <h1 className="text-white text-3xl font-bold mb-3 tracking-tight leading-tight">{currentTrack.title}</h1>
                <p className="text-gray-300 text-xl font-medium opacity-90">{currentTrack.artist}</p>
              </div>

              {/* Mobile Progress Bar */}
              <div className="w-full mb-10">
                <div className="flex justify-between text-sm text-gray-300 font-medium mb-4">
                  <span className="bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm">{formatTime(progress)}</span>
                  <span className="bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm">{formatTime(duration)}</span>
                </div>
                <div className="relative group">
                  <div className="w-full h-2 bg-white/10 rounded-full backdrop-blur-sm shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300 shadow-lg"
                      style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={progress}
                    onChange={handleProgressChange}
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                  {/* Progress indicator */}
                  <div 
                    className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Mobile Controls */}
              <div className="flex items-center justify-center space-x-6 mb-12">
                <button 
                  onClick={toggleShuffle}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/10 ${
                    isShuffled 
                      ? 'text-green-400 bg-green-400/20 shadow-lg shadow-green-400/25' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Shuffle size={20} />
                </button>
                
                <button 
                  onClick={playPrevious}
                  className="p-3 rounded-full text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <SkipBack size={28} />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full p-5 hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 backdrop-blur-sm ring-2 ring-white/20"
                >
                  {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
                </button>
                
                <button 
                  onClick={playNext}
                  className="p-3 rounded-full text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <SkipForward size={28} />
                </button>
                
                <button 
                  onClick={toggleRepeat}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/10 ${
                    repeatMode !== 'off' 
                      ? 'text-green-400 bg-green-400/20 shadow-lg shadow-green-400/25' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
                </button>
              </div>
              
              {/* Mobile Bottom Controls */}
              <div className="flex items-center justify-between bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <button 
                  onClick={() => {
                    setPlayerMode('normal');
                    // Exit browser fullscreen
                    if (document.fullscreenElement && document.exitFullscreen) {
                      document.exitFullscreen();
                    }
                  }}
                  className="p-3 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  title="Exit Fullscreen"
                >
                  <Minimize size={20} />
                </button>
                
                <div className="flex items-center space-x-6">
                  {currentTrack && (
                    <button 
                      onClick={() => likeTrack(currentTrack)}
                      className="p-3 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                      title="Like Track"
                    >
                      <Heart size={20} />
                    </button>
                  )}
                  
                  <div className="flex items-center space-x-4 bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                    <button 
                      onClick={toggleMute}
                      className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    
                    <div className="w-28 h-2 bg-white/10 rounded-full relative group">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {/* Volume indicator */}
                      <div 
                        className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout (three columns) */}
          <div className="relative flex-1 hidden lg:grid lg:grid-cols-[2fr_3fr_2fr] lg:gap-12 p-8">
            {/* Left Column - Album Art & Track Info */}
            <div className="flex flex-col items-center justify-center space-y-8 bg-black/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              {/* Enhanced album artwork */}
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl blur-sm"></div>
                <img 
                  src={currentTrack.coverArt} 
                  alt={currentTrack.title} 
                  className="relative w-72 h-72 rounded-2xl shadow-2xl object-cover transform group-hover:scale-105 transition-transform duration-500 ring-2 ring-white/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl"></div>
                {/* Floating play indicator */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Enhanced Track Info */}
              <div className="text-center space-y-4 w-full">
                <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h1 className="text-2xl font-bold text-white mb-3 tracking-wide leading-tight">{currentTrack.title}</h1>
                  <p className="text-lg text-purple-300 font-medium mb-2">{currentTrack.artist}</p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">{currentTrack.album}</p>
                  
                  {/* Additional track details */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Duration</p>
                      <p className="text-sm text-white font-medium">{formatTime(duration)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Quality</p>
                      <p className="text-sm text-white font-medium">320kbps</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Format</p>
                      <p className="text-sm text-white font-medium">MP3</p>
                    </div>
                  </div>
                </div>
                
                {/* Like and Share buttons */}
                <div className="flex space-x-3 justify-center">
                  <button 
                    onClick={() => likeTrack(currentTrack)}
                    className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-red-500/30"
                  >
                    <Heart size={16} />
                    <span className="text-sm font-medium">Like</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-blue-500/30">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Center Column - Controls */}
            <div className="flex flex-col items-center justify-center space-y-10 bg-black/5 backdrop-blur-xl rounded-3xl p-8 border border-white/5">
              {/* Enhanced Progress Bar */}
              <div className="w-full max-w-lg">
                <div className="flex justify-between text-lg text-gray-300 font-semibold mb-6">
                  <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">{formatTime(progress)}</span>
                  <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">{formatTime(duration)}</span>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-all duration-500"></div>
                  <div className="relative w-full h-4 bg-black/40 backdrop-blur-sm rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-300 shadow-lg relative overflow-hidden"
                      style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
                      <div className="absolute right-0 top-0 w-1 h-full bg-white/60 shadow-lg"></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-full"></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={progress}
                    onChange={handleProgressChange}
                    className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                  />
                  {/* Progress indicator */}
                  <div 
                    className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-2xl transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 border-2 border-purple-400"
                    style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Enhanced Controls */}
              <div className="flex items-center justify-center space-x-6">
                <button 
                  onClick={toggleShuffle}
                  className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 border-2 shadow-xl ${
                    isShuffled 
                      ? 'text-purple-200 bg-purple-500/40 border-purple-400/60 shadow-purple-500/30' 
                      : 'text-gray-300 bg-black/30 border-white/20 hover:bg-white/20 hover:text-white hover:border-white/40'
                  }`}
                >
                  <Shuffle size={22} />
                </button>
                
                <button 
                  onClick={playPrevious}
                  className="p-5 rounded-2xl text-white bg-black/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 border-2 border-white/20 hover:shadow-2xl hover:border-white/40"
                >
                  <SkipBack size={26} />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-3xl p-8 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-purple-500/60 backdrop-blur-sm border-4 border-white/30 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isPlaying ? <Pause size={36} className="relative z-10" /> : <Play size={36} className="ml-1 relative z-10" />}
                </button>
                
                <button 
                  onClick={playNext}
                  className="p-5 rounded-2xl text-white bg-black/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 border-2 border-white/20 hover:shadow-2xl hover:border-white/40"
                >
                  <SkipForward size={26} />
                </button>
                
                <button 
                  onClick={toggleRepeat}
                  className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 border-2 shadow-xl ${
                    repeatMode !== 'off' 
                      ? 'text-purple-200 bg-purple-500/40 border-purple-400/60 shadow-purple-500/30' 
                      : 'text-gray-300 bg-black/30 border-white/20 hover:bg-white/20 hover:text-white hover:border-white/40'
                  }`}
                >
                  {repeatMode === 'one' ? <Repeat1 size={22} /> : <Repeat size={22} />}
                </button>
              </div>
              
              {/* Volume Controls */}
              <div className="flex items-center justify-center space-x-6 bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <button 
                  onClick={toggleMute}
                  className="p-3 rounded-xl bg-black/30 text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
                
                <div className="relative group flex-1 max-w-48">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-full h-3 bg-black/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/20">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 relative"
                      style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                  />
                  {/* Volume indicator */}
                  <div 
                    className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-xl transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 border-2 border-purple-400"
                    style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
                  ></div>
                </div>
                
                <div className="text-sm text-gray-300 font-medium min-w-[3rem] text-center bg-black/30 px-2 py-1 rounded-lg">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </div>
              </div>
              
              {/* Exit Fullscreen Button */}
              <button 
                onClick={() => {
                  setPlayerMode('normal');
                  // Exit browser fullscreen
                  if (document.fullscreenElement && document.exitFullscreen) {
                    document.exitFullscreen();
                  }
                }}
                className="flex items-center space-x-3 px-8 py-4 bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white rounded-2xl transition-all duration-300 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 hover:scale-105 shadow-xl"
                title="Exit Fullscreen"
              >
                <Minimize size={22} />
                <span className="font-semibold text-lg">Exit Fullscreen</span>
              </button>
            </div>
            
            {/* Right Column - Queue */}
            <div className="flex flex-col h-full">
              <div className="bg-black/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 h-full overflow-hidden flex flex-col">
                {/* Queue Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                      <List size={20} className="text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Up Next</h3>
                      <p className="text-sm text-gray-400">{queue.length} tracks</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-all duration-300 backdrop-blur-sm border border-purple-500/30 hover:scale-105 shadow-lg">
                      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586l-1.293-1.293z" />
                      </svg>
                      Save
                    </button>
                    <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-500/30 hover:scale-105 shadow-lg">
                      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Clear
                    </button>
                  </div>
                </div>

                {/* Queue Stats */}
                <div className="grid grid-cols-3 gap-4 py-4">
                  <div className="text-center bg-black/20 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Total Time</p>
                    <p className="text-sm text-white font-semibold">{formatTime(queue.reduce((acc, track) => acc + (track.duration || 0), 0))}</p>
                  </div>
                  <div className="text-center bg-black/20 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Remaining</p>
                    <p className="text-sm text-white font-semibold">{queue.length - (queue.findIndex(t => t.id === currentTrack.id) + 1)}</p>
                  </div>
                  <div className="text-center bg-black/20 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Quality</p>
                    <p className="text-sm text-white font-semibold">HD</p>
                  </div>
                </div>
                
                {/* Queue List */}
                <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
                  {queue.map((track, index) => (
                    <div 
                      key={`${track.id}-${index}`}
                      className={`group flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border cursor-pointer ${
                        currentTrack?.id === track.id 
                          ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/40 shadow-lg shadow-purple-500/20' 
                          : 'bg-black/20 border-white/10 hover:border-white/20 hover:shadow-lg'
                      }`}
                      onClick={() => playTrack(track, queue)}
                    >
                      <div className="flex-shrink-0 w-10 text-center">
                        {currentTrack?.id === track.id ? (
                          <div className="relative">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse mx-auto flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div className="absolute -inset-1 bg-purple-500/30 rounded-full blur-sm"></div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 font-semibold group-hover:text-white transition-colors duration-300">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="relative">
                        <img 
                          src={track.coverArt} 
                          alt={track.title}
                          className="w-14 h-14 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate group-hover:text-purple-200 transition-colors duration-300">{track.title}</h3>
                        <p className="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors duration-300">{track.artist}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded-full">{track.album}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            likeTrack(track);
                          }}
                          className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <Heart size={16} className="text-gray-400 hover:text-red-400 transition-colors duration-300" />
                        </button>
                        
                        <QueueTrackMenu track={track} index={index} />
                      </div>
                      
                      <span className="text-sm text-gray-400 font-medium min-w-[3rem] text-right">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Queue Actions */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105 shadow-lg">
                      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      Shuffle Queue
                    </button>
                    <button className="px-4 py-3 bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Normal player mode
  return (
    <>
    <footer className="h-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-600 shadow-2xl relative z-50">
      <audio ref={audioRef} />
      <div className="h-full px-2 sm:px-6 flex items-center justify-between">
        {/* Left Section - Track Info */}
        <div className={`flex items-center space-x-2 sm:space-x-4 w-1/4 sm:w-1/3 min-w-0 transition-all duration-500 ${showFullscreenOverlay ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          <div className="relative group">
            <img 
              src={currentTrack.coverArt} 
              alt={currentTrack.title} 
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg shadow-lg object-cover" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity duration-200"></div>
          </div>
          <div className="min-w-0 flex-1 hidden sm:block">
             <p className="text-white font-semibold text-sm truncate hover:text-green-400 transition-colors cursor-pointer">
               {currentTrack.title}
             </p>
             <p className="text-gray-400 text-xs truncate hover:text-gray-300 transition-colors cursor-pointer">
               {currentTrack.artist}
             </p>
           </div>
        </div>

        {/* Center Section - Player Controls */}
        <div className="flex flex-col items-center w-1/2 sm:w-1/3 max-w-md">
          <div className="flex items-center space-x-3 sm:space-x-6 mb-2">
            <button 
              onClick={toggleShuffle}
              className={`hidden sm:block transition-transform duration-200 hover:scale-110 ${
            isShuffled ? 'text-green-400' : 'text-gray-300 hover:text-white'
          }`}
            >
              <Shuffle size={20} />
            </button>
            
            <button 
              onClick={playPrevious}
              className="text-gray-300 hover:text-white transition-transform duration-200 hover:scale-110"
            >
              <SkipBack size={22} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-3 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
            </button>
            
            <button 
              onClick={playNext}
              className="text-gray-300 hover:text-white transition-transform duration-200 hover:scale-110"
            >
              <SkipForward size={22} />
            </button>
            
            <button 
              onClick={toggleRepeat}
              className={`hidden sm:block transition-transform duration-200 hover:scale-110 ${
                repeatMode !== 'off' ? 'text-green-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center space-x-2 sm:space-x-3">
            <span className="text-xs text-gray-400 font-mono w-8 sm:w-10 text-right">{formatTime(progress)}</span>
            <div className="flex-1 relative group">
              <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-width duration-150"
                  style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleProgressChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-xs text-gray-400 font-mono w-8 sm:w-10">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Right Section - Additional Controls */}
         <div className="flex items-center justify-end space-x-2 sm:space-x-4 w-1/4 sm:w-1/3">
           {/* Like Button */}
           {currentTrack && (
             <button 
               onClick={() => likeTrack(currentTrack)}
               className="hidden sm:block text-gray-400 hover:text-red-400 transition-colors duration-200 hover:scale-110"
             >
               <Heart size={16} />
             </button>
           )}
           
           {/* Queue Toggle Button */}
           <button 
             onClick={() => setShowQueue(!showQueue)}
             className={`transition-transform duration-200 hover:scale-110 ${
               showQueue ? 'text-green-400' : 'text-gray-400 hover:text-white'
             }`}
           >
             <List size={16} />
           </button>
          

          {/* Fullscreen Toggle Button */}
          <button 
            onClick={() => setShowFullscreenOverlay(!showFullscreenOverlay)}
            className="hidden sm:block text-gray-400 hover:text-white transition-transform duration-200 hover:scale-110"
            title={showFullscreenOverlay ? 'Close expanded view' : 'Expand player'}
          >
            {showFullscreenOverlay ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          
          {/* Volume Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            <button 
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-transform duration-200 hover:scale-110"
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            
            <div className="w-24 h-1 bg-gray-600 rounded-full relative group">
              <div 
                className="h-full bg-gradient-to-r from-gray-300 to-white rounded-full transition-width duration-150"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
       
      {/* Queue Display */}
      {showQueue && (
        <div ref={queueRef} className="fixed bottom-20 right-2 sm:right-4 w-64 sm:w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-80 z-[9999] overflow-visible">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Queue</h3>
          </div>
          <div className="p-2 pb-16 max-h-64 overflow-y-auto">
            {queue.length > 0 ? (
              queue.map((track, index) => (
                <div 
                  key={`${track.id}-${index}`}
                  className="group flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
                  onClick={() => playTrack(track, queue)}
                >
                  <div className="w-10 h-10 bg-gray-700 rounded mr-3 flex-shrink-0">
                    {track.coverArt && (
                      <img 
                        src={track.coverArt} 
                        alt={track.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{track.title}</p>
                    <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-400 text-xs">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </div>
                    <QueueTrackMenu track={track} index={index} />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                No tracks in queue
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Overlay */}
      {showFullscreenOverlay && (
        <div className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex flex-col ${isClosing ? 'overlay-exit' : 'overlay-enter'}`}>
          <div 
            ref={overlayRef}
            className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 pb-24 shadow-2xl border-0 backdrop-blur-xl overflow-hidden"
          >
            {/* Header with minimize button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Now Playing</h2>
              <button 
                onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setShowFullscreenOverlay(false);
                  setIsClosing(false);
                }, 500);
              }}
                className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
                title="Minimize"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Left Side - Song Image and Details */}
              <div className="flex flex-col items-center justify-start space-y-6 mt-12">
                {/* Album Art */}
                <div className="relative group image-enter">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl blur-xl transform scale-110"></div>
                  <img 
                    src={currentTrack.coverArt} 
                    alt={currentTrack.title}
                    className="relative w-48 h-48 rounded-xl shadow-2xl object-cover border-4 border-white/10 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl"></div>
                </div>

                {/* Track Info */}
                <div className="text-center space-y-3 max-w-sm details-enter">
                  <h1 className="text-3xl font-bold text-white leading-tight">{currentTrack.title}</h1>
                  <p className="text-lg text-gray-300">{currentTrack.artist}</p>
                  <p className="text-base text-gray-400">{currentTrack.album}</p>
                  


                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4 mt-6 mb-4">
                    <button 
                      onClick={() => likeTrack(currentTrack)}
                      className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                      <Heart size={20} />
                      <span>Like</span>
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105 shadow-lg flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Queue */}
              <div className="flex flex-col queue-enter">
                <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10 h-full">
                  {/* Queue Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Up Next</h3>
                    <span className="text-gray-400">{queue.length} tracks</span>
                  </div>

                  {/* Queue List */}
                  <div className="space-y-3 overflow-y-auto flex-1 max-h-96">
                    {queue.length > 0 ? (
                      queue.map((track, index) => (
                        <div 
                          key={`${track.id}-${index}`}
                          className="group flex items-center p-4 hover:bg-white/5 rounded-xl cursor-pointer transition-all duration-300 border border-transparent hover:border-white/10"
                          onClick={() => playTrack(track, queue)}
                        >
                          {/* Track Number/Play Icon */}
                          <div className="w-8 text-center mr-4">
                            <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                            <Play size={16} className="text-white hidden group-hover:block mx-auto" />
                          </div>
                          
                          {/* Album Art */}
                          <div className="relative mr-4">
                            <img 
                              src={track.coverArt} 
                              alt={track.title}
                              className="w-12 h-12 rounded-lg object-cover shadow-md"
                            />
                          </div>
                          
                          {/* Track Info */}
                          <div className="flex-1 min-w-0 mr-4">
                            <h4 className="text-white font-semibold truncate group-hover:text-purple-200 transition-colors duration-300">{track.title}</h4>
                            <p className="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors duration-300">{track.artist}</p>
                          </div>
                          
                          {/* Like Button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              likeTrack(track);
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 mr-2"
                          >
                            <Heart size={16} className="text-gray-400 hover:text-red-400 transition-colors duration-300" />
                          </button>
                          
                          {/* Duration */}
                          <span className="text-sm text-gray-400 font-medium min-w-[3rem] text-right">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <p>No tracks in queue</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Player;