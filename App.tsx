
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppContextType, Track, User, View, Playlist } from './types';
import { MOCK_USERS, MOCK_TRACKS } from './constants';
import Login from './components/views/Login';
import EmailVerification from './components/views/EmailVerification';
import Layout from './components/layout/Layout';
import Home from './components/views/Home';
import Leaderboard from './components/views/Leaderboard';
import Radio from './components/views/Radio';
import ListeningRoom from './components/views/ListeningRoom';
import PlaylistView from './components/views/Playlist';
import FocusTimer from './components/views/FocusTimer';
import YouTubeSearchView from './components/views/YouTubeSearchView';
import { useTracks, useCreateTrack, useIncrementPlayCount, useUserByEmail } from './hooks/useApi';
import { useWebSocket, usePlaylistUpdates } from './hooks/useWebSocket';
import apiService from './services/apiService';
import ConnectionStatus from './components/common/ConnectionStatus';

export const AppContext = React.createContext<AppContextType | null>(null);

// Main App Content Component that uses routing
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Track[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);
  const [youTubeError, setYouTubeError] = useState<string | null>(null);

  // Get current view from URL path
  const getCurrentView = (): View => {
    const path = location.pathname;
    switch (path) {
      case '/home': return View.Home;
      case '/playlist': return View.Playlist;
      case '/focus-timer': return View.FocusTimer;
      case '/leaderboard': return View.Leaderboard;
      case '/radio': return View.Radio;
      case '/listening-room': return View.ListeningRoom;
      case '/youtube-search': return View.YouTubeSearch;
      default: return View.Home;
    }
  };

  const view = getCurrentView();

  // Navigation function that uses React Router
  const setView = (newView: View) => {
    switch (newView) {
      case View.Home:
        navigate('/home');
        break;
      case View.Playlist:
        navigate('/playlist');
        break;
      case View.FocusTimer:
        navigate('/focus-timer');
        break;
      case View.Leaderboard:
        navigate('/leaderboard');
        break;
      case View.Radio:
        navigate('/radio');
        break;
      case View.ListeningRoom:
        navigate('/listening-room');
        break;
      case View.YouTubeSearch:
        navigate('/youtube-search');
        break;
    }
  };
  
  // Volume and playback mode state
  const [volume, setVolumeState] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [playerMode, setPlayerMode] = useState<'normal' | 'mini' | 'fullscreen'>('normal');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // API hooks with fallback to mock data
  const { data: apiTracks, loading: tracksLoading, error: tracksError, refetch: refetchTracks } = useTracks();
  const { createTrack, loading: createTrackLoading } = useCreateTrack();
  const { incrementPlayCount } = useIncrementPlayCount();
  const { data: apiUser, loading: userLoading } = useUserByEmail(userEmail);
  
  // Use API data if available, otherwise fallback to mock data
  const tracks = (apiTracks && apiTracks.length > 0) ? apiTracks : MOCK_TRACKS;
  
  // Show connection status
  useEffect(() => {
    if (tracksError) {
      console.log('Backend connection failed - using offline mode with sample tracks');
    } else if (apiTracks && apiTracks.length > 0) {
      console.log('Connected to backend successfully');
    }
  }, [tracksError, apiTracks]);
  
  // WebSocket connection
  const { connect: connectWebSocket, disconnect: disconnectWebSocket, isConnected } = useWebSocket(user?.id);
  
  // Real-time playlist updates
  const { playlistUpdates, clearUpdates } = usePlaylistUpdates();
  
  // Handle playlist updates
  useEffect(() => {
    if (playlistUpdates.length > 0) {
      const latestUpdate = playlistUpdates[0];
      console.log('Received playlist update:', latestUpdate.type, latestUpdate.playlist);
      
      // Trigger a refresh of playlist data in components that use it
      // This will be handled by the individual components using playlist hooks
      
      // Clear the update after processing
      setTimeout(() => clearUpdates(), 1000);
    }
  }, [playlistUpdates, clearUpdates]);

  const handleLogin = async (userData: User, token: string) => {
    // Store the authentication token
    localStorage.setItem('authToken', token);
    
    // Set user data
    setUser(userData);
    setUserEmail(userData.email);
    setIsAuthLoading(false);
    
    console.log('User logged in successfully:', userData.name);
  };
  
  // Load recently played tracks from localStorage on app load
  useEffect(() => {
    const savedRecentlyPlayed = localStorage.getItem('recentlyPlayed');
    if (savedRecentlyPlayed) {
      try {
        const parsed = JSON.parse(savedRecentlyPlayed);
        setRecentlyPlayed(parsed);
      } catch (error) {
        console.error('Failed to parse recently played tracks:', error);
        localStorage.removeItem('recentlyPlayed');
      }
    }
  }, []);

  // Save recently played tracks to localStorage whenever it changes
  useEffect(() => {
    if (recentlyPlayed.length > 0) {
      localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    }
  }, [recentlyPlayed]);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await apiService.auth.validateToken();
          if (response.valid && response.user) {
            setUser(response.user);
            setUserEmail(response.user.email);
            console.log('User restored from token:', response.user.name);
          } else {
            localStorage.removeItem('authToken');
            console.log('Invalid token, removed from storage');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('authToken');
        }
      }
      setIsAuthLoading(false);
    };
    
    checkExistingAuth();
  }, []);
  
  // Update user when API user data changes
  useEffect(() => {
    if (apiUser && !userLoading) {
      setUser(apiUser);
    }
  }, [apiUser, userLoading]);
  
  // Connect/disconnect WebSocket when user changes
  useEffect(() => {
    if (user?.id) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }
    
    return () => {
      disconnectWebSocket();
    };
  }, [user?.id, connectWebSocket, disconnectWebSocket]);

  const addToRecentlyPlayed = useCallback((track: Track) => {
    setRecentlyPlayed(prev => {
      // Remove the track if it already exists to avoid duplicates
      const filtered = prev.filter(t => t.id !== track.id);
      // Add the track to the beginning and limit to 20 tracks
      return [track, ...filtered].slice(0, 20);
    });
  }, []);

  // Function to get YouTube video ID from URL
  const getYouTubeVideoId = useCallback((url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  }, []);

  // Function to get streaming URL for YouTube content
  const getYouTubeStreamUrl = useCallback((audioUrl: string) => {
    const videoId = getYouTubeVideoId(audioUrl);
    if (!videoId) return null;
    return `http://localhost:3001/stream/${videoId}`;
  }, [getYouTubeVideoId]);

  const playTrack = useCallback((track: Track, playlist: Track[] = []) => {
    console.log('🎵 playTrack called with:', {
      trackId: track.id,
      title: track.title,
      audioUrl: track.audioUrl,
      playlistLength: playlist.length
    });
    
    // Check if this is a YouTube URL
    const isYouTubeUrl = track.audioUrl.includes('youtube.com') || track.audioUrl.includes('youtu.be');
    
    if (isYouTubeUrl) {
      // For YouTube URLs, use the audio streaming service
      console.log('Playing YouTube track:', track.title, 'by', track.artist);
      
      // Set loading state
      setIsLoadingYouTube(true);
      setYouTubeError(null);
      
      // Get the streaming URL for this YouTube video
      const streamUrl = getYouTubeStreamUrl(track.audioUrl);
      console.log('🎵 Generated stream URL:', streamUrl);
      
      if (!streamUrl) {
        console.error('Failed to generate stream URL for YouTube video');
        setYouTubeError('Invalid YouTube URL');
        setIsLoadingYouTube(false);
        return;
      }
      
      console.log('🔗 YouTube stream URL:', streamUrl);
      
      // Test if the stream URL is accessible
      fetch(streamUrl, { method: 'HEAD' })
        .then(response => {
          console.log('🔍 Stream accessibility test:', response.status, response.statusText);
          console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (response.ok) {
            // Create a modified track with the streaming URL
            const modifiedTrack = {
              ...track,
              audioUrl: streamUrl
            };
            
            console.log('✅ Setting YouTube track:', modifiedTrack);
            setCurrentTrack(modifiedTrack);
            setCurrentPlaylist(playlist.length > 0 ? playlist.map(t => {
              if (t.audioUrl.includes('youtube.com') || t.audioUrl.includes('youtu.be')) {
                const playlistStreamUrl = getYouTubeStreamUrl(t.audioUrl);
                return playlistStreamUrl ? { ...t, audioUrl: playlistStreamUrl } : t;
              }
              return t;
            }) : [modifiedTrack]);
            setIsPlaying(true);
            setIsLoadingYouTube(false);
            
            // Add to recently played tracks
            addToRecentlyPlayed(track);
            
            // Log successful YouTube streaming
            console.info(`🎵 Now streaming live YouTube audio for "${track.title}" by ${track.artist}`);
          } else {
            console.error('❌ Stream URL not accessible:', response.status);
            setYouTubeError('YouTube streaming service unavailable');
            setIsLoadingYouTube(false);
          }
        })
        .catch(error => {
          console.error('❌ Stream URL test failed:', error);
          setYouTubeError('Failed to connect to streaming service');
          setIsLoadingYouTube(false);
        });
      
      return;
    }
    
    console.log('✅ Setting regular track:', track);
    setCurrentTrack(track);
    setCurrentPlaylist(playlist.length > 0 ? playlist : [track]);
    setIsPlaying(true);
    
    // Add to recently played tracks
    addToRecentlyPlayed(track);
    
    // Increment play count in the backend
    incrementPlayCount(track.id).catch(error => {
      console.error('Failed to increment play count:', error);
    });
    
    // Record listening history if user is logged in
    if (user?.id) {
      apiService.recordListeningHistory(user.id, parseInt(track.id)).catch(error => {
        console.error('Failed to record listening history:', error);
      });
    }
  }, [incrementPlayCount, user?.id, addToRecentlyPlayed]);



  const togglePlay = useCallback(() => {
    console.log('🎮 Toggle play clicked. Current state:', {
      isPlaying,
      currentTrack: currentTrack ? { id: currentTrack.id, title: currentTrack.title, audioUrl: currentTrack.audioUrl } : null
    });
    setIsPlaying(prev => !prev);
  }, [isPlaying, currentTrack]);
  
  const playNext = useCallback(() => {
    if (currentPlaylist.length === 0) return;
    
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack?.id);
    let nextTrack: Track | null = null;
    
    if (repeatMode === 'one' && currentTrack) {
      // Repeat current track
      nextTrack = currentTrack;
    } else if (isShuffled) {
      // Shuffle mode: pick random track
      const availableTracks = currentPlaylist.filter(track => track.id !== currentTrack?.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        nextTrack = availableTracks[randomIndex];
      }
    } else {
      // Normal mode
      const nextIndex = (currentIndex + 1) % currentPlaylist.length;
      nextTrack = currentPlaylist[nextIndex];
      
      // If we've reached the end and repeat is off, don't play
      if (repeatMode === 'off' && currentIndex === currentPlaylist.length - 1) {
        nextTrack = null;
      }
    }
    
    if (nextTrack) {
      playTrack(nextTrack, currentPlaylist);
    }
  }, [currentTrack, currentPlaylist, playTrack, repeatMode, isShuffled]);

  const playPrev = useCallback(() => {
    if (currentPlaylist.length === 0) return;
    
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack?.id);
    let prevTrack: Track | null = null;
    
    if (repeatMode === 'one' && currentTrack) {
      // Repeat current track
      prevTrack = currentTrack;
    } else if (isShuffled) {
      // Shuffle mode: pick random track
      const availableTracks = currentPlaylist.filter(track => track.id !== currentTrack?.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        prevTrack = availableTracks[randomIndex];
      }
    } else {
      // Normal mode
      const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
      prevTrack = currentPlaylist[prevIndex];
      
      // If we're at the beginning and repeat is off, don't play
      if (repeatMode === 'off' && currentIndex === 0) {
        prevTrack = null;
      }
    }
    
    if (prevTrack) {
      playTrack(prevTrack, currentPlaylist);
    }
  }, [currentTrack, currentPlaylist, playTrack, repeatMode, isShuffled]);

  // Queue functionality
  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
    console.log(`Added "${track.title}" to queue`);
  }, []);

  const playNextTrack = useCallback((track: Track) => {
    if (currentTrack) {
      // Insert the track as the next song in the current playlist
      const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack.id);
      const newPlaylist = [...currentPlaylist];
      newPlaylist.splice(currentIndex + 1, 0, track);
      setCurrentPlaylist(newPlaylist);
      console.log(`"${track.title}" will play next`);
    } else {
      // If no track is playing, play it immediately
      playTrack(track, [track]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  const addPlaylistToQueue = useCallback((tracks: Track[]) => {
    setQueue(prev => [...prev, ...tracks]);
    console.log(`Added ${tracks.length} tracks to queue`);
  }, []);

  const playPlaylistNext = useCallback((tracks: Track[]) => {
    if (currentTrack && tracks.length > 0) {
      // Insert all tracks after the current song in the playlist
      const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack.id);
      const newPlaylist = [...currentPlaylist];
      newPlaylist.splice(currentIndex + 1, 0, ...tracks);
      setCurrentPlaylist(newPlaylist);
      console.log(`${tracks.length} tracks will play next`);
    } else if (tracks.length > 0) {
      // If no track is playing, play the first track and add the rest to playlist
      playTrack(tracks[0], tracks);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => {
      const newQueue = [...prev];
      newQueue.splice(index, 1);
      return newQueue;
    });
    console.log(`Removed track at index ${index} from queue`);
  }, []);

  const addToPlaylist = useCallback((track: Track, playlistId?: string) => {
    // For now, just log the action. In a real app, this would call an API
    console.log(`Added "${track.title}" to playlist${playlistId ? ` (ID: ${playlistId})` : ''}`);
    // TODO: Implement actual playlist addition via API
  }, []);

  const likeTrack = useCallback((track: Track) => {
    // For now, just log the action. In a real app, this would call an API
    console.log(`Liked "${track.title}"`);
    // TODO: Implement actual like functionality via API
  }, []);

  // Volume control functions
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    // If volume is set to 0, consider it muted
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      // Unmute: restore previous volume or set to 0.5 if it was 0
      const newVolume = volume === 0 ? 0.5 : volume;
      setVolume(newVolume);
      setIsMuted(false);
    } else {
      // Mute: set volume to 0
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
      setIsMuted(true);
    }
  }, [isMuted, volume, setVolume]);

  // Playback mode functions
  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      switch (prev) {
        case 'off': return 'all';
        case 'all': return 'one';
        case 'one': return 'off';
        default: return 'off';
      }
    });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = async () => {
      try {
        console.log('▶️ Attempting to play audio...');
        console.log('🔍 Audio element state before play:', {
          src: audio.src,
          readyState: audio.readyState,
          networkState: audio.networkState,
          paused: audio.paused,
          currentTime: audio.currentTime,
          duration: audio.duration
        });
        await audio.play();
        console.log('✅ Audio play started successfully');
      } catch (error: any) {
        // The play() request was interrupted by a call to pause(), or some other error.
        // We only want to log errors that are not the expected AbortError.
        if (error.name !== 'AbortError') {
          console.error("❌ Audio play failed:", error);
          console.error("Error details:", {
            name: error.name,
            message: error.message,
            audioSrc: audio.src,
            audioReadyState: audio.readyState,
            audioNetworkState: audio.networkState
          });
        }
      }
    };

    if (isPlaying && currentTrack) {
      // If the track is different, update the source.
      // This will stop the current playback.
      if (audio.src !== currentTrack.audioUrl) {
        console.log('🎧 Setting audio source:', currentTrack.audioUrl);
        audio.src = currentTrack.audioUrl;
        console.log('✅ Audio source set successfully');
      }
      // Then, try to play it.
      playAudio();
    } else {
      // If not playing, or no track, pause.
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    const handleLoadStart = () => {
      console.log('🔄 Audio loading started');
    };

    const handleCanPlay = () => {
      console.log('✅ Audio can start playing');
    };

    const handleError = (e: any) => {
      console.error('❌ Audio error:', e);
      console.error('Audio error details:', {
        error: audio.error,
        networkState: audio.networkState,
        readyState: audio.readyState,
        src: audio.src,
        errorCode: audio.error?.code,
        errorMessage: audio.error?.message
      });
      
      // Check if this is a YouTube streaming error
      if (audio.src.includes('localhost:3001/stream/')) {
        console.error('🚨 YouTube streaming service error detected');
        console.error('Stream URL:', audio.src);
        
        // Test if the streaming service is still available
        fetch('http://localhost:3001/health')
          .then(response => {
            if (response.ok) {
              console.log('✅ Streaming service is running');
              return response.json();
            } else {
              console.error('❌ Streaming service health check failed:', response.status);
            }
          })
          .catch(healthError => {
            console.error('❌ Cannot reach streaming service:', healthError);
          });
      }
    };

    const handleLoadedData = () => {
      console.log('📊 Audio data loaded');
    };

    const handlePlay = () => {
      console.log('▶️ Audio started playing');
    };

    const handlePause = () => {
      console.log('⏸️ Audio paused');
    };

    const handleTimeUpdate = () => {
      // Only log every 10 seconds to reduce console spam
      if (audio.currentTime > 0 && Math.floor(audio.currentTime) % 10 === 0) {
        console.log(`🕐 Audio playing at ${audio.currentTime.toFixed(2)}s`);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [playNext]);

  // Initialize audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          event.preventDefault();
          playNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          playPrev();
          break;
        case 'ArrowUp':
          event.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          event.preventDefault();
          toggleMute();
          break;
        case 'KeyS':
          event.preventDefault();
          toggleShuffle();
          break;
        case 'KeyR':
          event.preventDefault();
          toggleRepeat();
          break;
        case 'KeyL':
          if (currentTrack) {
            event.preventDefault();
            likeTrack(currentTrack);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, playNext, playPrev, setVolume, volume, toggleMute, toggleShuffle, toggleRepeat, currentTrack, likeTrack]);


  const uploadTrack = useCallback(async (file: File) => {
    if (!user) return;

    try {
      const newTrack = await createTrack({
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: user.name,
        duration: 180, // Mock duration - in real app, get from file metadata
        genre: 'Unknown',
        uploadedBy: user.id,
        playCount: 0,
        likes: 0,
        coverArt: '/api/placeholder/300/300',
        audioUrl: URL.createObjectURL(file), // In real app, upload file to server
      });

      // Refresh tracks list
      refetchTracks();
      
      // Award points to user (update in backend)
      try {
        await apiService.user.updateUser(user.id, {
          ...user,
          points: user.points + 10,
          uploadedTracks: [...user.uploadedTracks, newTrack.id]
        });
        
        // Update local user state
        setUser(prev => prev ? {
          ...prev,
          points: prev.points + 10,
          uploadedTracks: [...prev.uploadedTracks, newTrack.id]
        } : null);
      } catch (updateError) {
        console.error('Failed to update user points:', updateError);
      }
    } catch (error) {
      console.error('Failed to upload track:', error);
    }
  }, [user, createTrack, refetchTracks]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    view,
    setView,
    tracks,
    setTracks: () => {}, // Deprecated - use refetchTracks instead
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying,
    currentPlaylist,
    setCurrentPlaylist,
    selectedPlaylist,
    setSelectedPlaylist,
    playTrack,
    togglePlay,
    playNext,
    playPrevious: playPrev,
    uploadTrack,
    handleLogin,
    audioRef,
    // Volume controls
    volume,
    setVolume,
    isMuted,
    toggleMute,
    // Playback modes
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    // Player display modes
    playerMode,
    setPlayerMode,
    // Queue functionality
    queue,
    addToQueue,
    playNextTrack,
    addPlaylistToQueue,
    playPlaylistNext,
    removeFromQueue,
    addToPlaylist,
    likeTrack,
    // API-related state
    tracksLoading,
    createTrackLoading,
    userLoading,
    refetchTracks,
    // WebSocket state
    isConnected,
    // Recently played
    recentlyPlayed,
    // YouTube streaming states
    isLoadingYouTube,
    youTubeError,
  }), [user, view, tracks, uploadTrack, playTrack, togglePlay, isPlaying, currentTrack, playNext, playPrev, audioRef, selectedPlaylist, handleLogin, volume, setVolume, isMuted, toggleMute, isShuffled, toggleShuffle, repeatMode, toggleRepeat, playerMode, setPlayerMode, queue, addToQueue, playNextTrack, removeFromQueue, addToPlaylist, likeTrack, tracksLoading, createTrackLoading, userLoading, refetchTracks, isConnected, recentlyPlayed, isLoadingYouTube, youTubeError]);



  return (
    <AppContext.Provider value={contextValue}>
      <Routes>
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={
           isAuthLoading ? (
             <div>Loading...</div>
           ) : user ? (
             <Navigate to="/home" replace />
           ) : (
             <Navigate to="/login" replace />
           )
         } />
         <Route path="/home" element={
           isAuthLoading ? (
             <div>Loading...</div>
           ) : user ? (
             <Layout>
               <ConnectionStatus isOffline={!!tracksError} />
               <Home />
             </Layout>
           ) : (
             <Navigate to="/login" replace />
           )
         } />
         <Route path="/playlist" element={
           isAuthLoading ? (
             <div>Loading...</div>
           ) : user ? (
             <Layout>
               <ConnectionStatus isOffline={!!tracksError} />
               <PlaylistView />
             </Layout>
           ) : (
             <Navigate to="/login" replace />
           )
         } />
         <Route path="/focus-timer" element={
           isAuthLoading ? (
             <div>Loading...</div>
           ) : user ? (
             <Layout>
               <ConnectionStatus isOffline={!!tracksError} />
               <FocusTimer />
             </Layout>
           ) : (
             <Navigate to="/login" replace />
           )
         } />
         <Route path="/leaderboard" element={
           isAuthLoading ? (
             <div>Loading...</div>
           ) : user ? (
             <Layout>
               <ConnectionStatus isOffline={!!tracksError} />
               <Leaderboard />
             </Layout>
           ) : (
             <Navigate to="/login" replace />
           )
         } />
         <Route path="/radio" element={
           isAuthLoading ? (
             <div>Loading...</div>
           ) : user ? (
             <Layout>
               <ConnectionStatus isOffline={!!tracksError} />
               <Radio />
             </Layout>
           ) : (
             <Navigate to="/login" replace />
           )
         } />
         <Route path="/listening-room" element={
           isAuthLoading ? (
             <div>Loading...</div>
           ) : user ? (
             <Layout>
               <ConnectionStatus isOffline={!!tracksError} />
               <ListeningRoom />
             </Layout>
           ) : (
             <Navigate to="/login" replace />
           )
         } />
         <Route path="/youtube-search" element={
           isAuthLoading ? (
             <div>Loading...</div>
           ) : user ? (
             <Layout>
               <ConnectionStatus isOffline={!!tracksError} />
               <YouTubeSearchView />
             </Layout>
           ) : (
             <Navigate to="/login" replace />
           )
         } />
      </Routes>
      <audio ref={audioRef} crossOrigin="anonymous" />
    </AppContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

// Test function for debugging audio
const testAudioDirectly = async () => {
  console.log('🧪 Testing audio directly...');
  const testVideoId = 'dQw4w9WgXcQ'; // Rick Roll for testing
  const testUrl = `http://localhost:3001/stream/${testVideoId}`;
  console.log('🔗 Test URL:', testUrl);
  
  const testAudio = new Audio();
  testAudio.crossOrigin = 'anonymous';
  
  testAudio.addEventListener('loadstart', () => console.log('🔄 Test: Loading started'));
  testAudio.addEventListener('canplay', () => console.log('✅ Test: Can play'));
  testAudio.addEventListener('error', (e) => {
    console.error('❌ Test: Audio error:', e);
    console.error('Test error details:', {
      error: testAudio.error,
      networkState: testAudio.networkState,
      readyState: testAudio.readyState,
      src: testAudio.src
    });
  });
  testAudio.addEventListener('loadeddata', () => console.log('📊 Test: Data loaded'));
  
  testAudio.src = testUrl;
  testAudio.load();
  
  try {
    await testAudio.play();
    console.log('✅ Test: Audio playing successfully!');
  } catch (error) {
    console.error('❌ Test: Play failed:', error);
  }
};



export default App;
