
import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { generatePlaylistByMood } from '../../services/geminiService';
import { Track, Playlist } from '../../types';
import TrackCard from '../ui/TrackCard';
import PlaylistCard from '../ui/PlaylistCard';
import { AppContext } from '../../App';
import { AppContextType } from '../../types';
import { ICONS } from '../../constants';
import SongMenu from '../ui/SongMenu';
import { usePlaylistUpdates } from '../../hooks/useWebSocket';
import { usePlaylists } from '../../hooks/useApi';
import apiService from '../../services/apiService';

const PlaylistView: React.FC = () => {
  const { selectedPlaylist, playTrack, currentTrack, isPlaying, togglePlay, addToQueue, user, recentlyPlayed } = useContext(AppContext) as AppContextType;
  
  // Real-time playlist data
  const { data: realTimePlaylists, loading: playlistsLoading, refetch: refetchPlaylists } = usePlaylists();
  const { playlistUpdates } = usePlaylistUpdates();
  
  // State for AI Generator
  const [mood, setMood] = useState<string>('Late Night Study');
  const [generatedPlaylist, setGeneratedPlaylist] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Recently played tracks loading state (data comes from context)
  const [recentlyPlayedLoading, setRecentlyPlayedLoading] = useState<boolean>(false);
  
  // Predefined playlists state
  const [predefinedPlaylists, setPredefinedPlaylists] = useState<Playlist[]>([]);
  
  // Ref for recently played scroll container
  const recentlyPlayedRef = useRef<HTMLDivElement>(null);
  
  // Scroll functions for recently played
  const scrollLeft = () => {
    if (recentlyPlayedRef.current) {
      recentlyPlayedRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (recentlyPlayedRef.current) {
      recentlyPlayedRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  // Handle real-time playlist updates
  useEffect(() => {
    if (playlistUpdates.length > 0) {
      console.log('Playlist component received updates, refreshing data...');
      refetchPlaylists();
    }
  }, [playlistUpdates, refetchPlaylists]);
  
  // Recently played tracks are now managed in App context
  // No need to load separately
  
  // Load predefined playlists
  useEffect(() => {
    const loadPredefinedPlaylists = async () => {
      try {
        const playlists = await apiService.playlist.getAllPlaylists();
        setPredefinedPlaylists(playlists);
      } catch (error) {
        console.error('Failed to load predefined playlists:', error);
      }
    };
    
    loadPredefinedPlaylists();
  }, []);

  // Error handling for playlist operations
  const handlePlaylistError = (error: any, operation: string) => {
    console.error(`Playlist ${operation} failed:`, error);
    setError(`Failed to ${operation} playlist. Please try again.`);
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleGeneratePlaylist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPlaylist([]);
    try {
      const playlistData = await generatePlaylistByMood(mood);
      const fullTracks: Track[] = playlistData.map((track, index) => ({
        ...track,
        id: `gemini-${Date.now()}-${index}`,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', // Placeholder URL
        duration: 240, // Placeholder duration
      }));
      setGeneratedPlaylist(fullTracks);
      console.log('AI playlist generated successfully for mood:', mood);
    } catch (error) {
      handlePlaylistError(error, 'generate');
    } finally {
      setIsLoading(false);
    }
  }, [mood]);

  if (selectedPlaylist) {
    const handlePlayPlaylist = () => {
        if (selectedPlaylist.tracks.length > 0) {
            playTrack(selectedPlaylist.tracks[0], selectedPlaylist.tracks);
        }
    };
    
    const formatDuration = (d: number) => {
        if (isNaN(d) || d === 0) return '-:--';
        const minutes = Math.floor(d / 60);
        const seconds = Math.floor(d % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <img src={selectedPlaylist.coverArt} alt={selectedPlaylist.name} className="w-full md:w-64 h-64 object-cover rounded-lg shadow-lg flex-shrink-0"/>
                <div className="flex flex-col justify-end">
                    <p className="text-sm font-bold text-gray-400 uppercase">Playlist</p>
                    <h1 className="text-5xl lg:text-7xl font-bold break-words">{selectedPlaylist.name}</h1>
                    <p className="text-gray-300 mt-2">{selectedPlaylist.description}</p>
                    <button 
                        onClick={handlePlayPlaylist}
                        className="mt-6 flex items-center bg-purple-600 text-white font-bold py-3 px-6 rounded-full hover:bg-purple-700 transition-colors text-lg w-fit"
                    >
                         {React.cloneElement(ICONS.play, { className: "w-6 h-6"})}
                        <span className="ml-3">Play All</span>
                    </button>
                </div>
            </div>
            
            <div className="space-y-2">
                {selectedPlaylist.tracks.map((track, index) => {
                    const isCurrent = currentTrack?.id === track.id;
                    return (
                         <div key={track.id} className={`group flex items-center p-3 rounded-lg transition-colors ${isCurrent ? 'bg-purple-800/50' : 'hover:bg-gray-800'}`}>
                            <div className="w-8 text-gray-400 text-center mr-4 flex items-center justify-center">
                                <span className="group-hover:hidden">{index + 1}</span>
                                <button onClick={() => isCurrent ? togglePlay() : playTrack(track, selectedPlaylist.tracks)} className="hidden group-hover:block text-white">
                                    {isCurrent && isPlaying ? React.cloneElement(ICONS.pause, {className: "w-8 h-8"}) : React.cloneElement(ICONS.play, {className: "w-8 h-8"})}
                                </button>
                            </div>
                            <img src={track.coverArt} alt={track.title} className="w-12 h-12 rounded-lg mr-4"/>
                            <div className="flex-grow">
                                <p className={`font-semibold ${isCurrent ? 'text-purple-400' : ''}`}>{track.title}</p>
                                <p className="text-sm text-gray-400">{track.artist}</p>
                            </div>
                            <div className="w-20 text-gray-400 text-sm text-right">{formatDuration(track.duration)}</div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
                                <SongMenu track={track} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
  }

  // Render main playlist view if no playlist is selected
  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Playlists</h1>
      <p className="text-lg text-gray-400 mb-8">Discover your music, recently played tracks, and curated playlists.</p>
      
      {/* Recently Played Section */}
      <section className="mb-10 section-hover">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
           {React.cloneElement(ICONS.focusTimer, { className: "w-6 h-6 mr-2" })}
           Recently Played
         </h2>
        {recentlyPlayedLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-400">Loading recently played tracks...</div>
          </div>
        ) : recentlyPlayed.length > 0 ? (
          <div className="flex items-center section-hover">
            <div className="flex-shrink-0 w-8 flex justify-center">
              <button 
                onClick={scrollLeft}
                className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div ref={recentlyPlayedRef} className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 flex-1 px-4">
            {recentlyPlayed.slice(0, 15).map(track => (
              <div 
                 key={track.id} 
                 className="flex-shrink-0 w-32 cursor-pointer"
                 onClick={() => playTrack(track, recentlyPlayed)}
               >
                 <div className="bg-transparent hover:bg-gray-800/30 rounded-lg p-3 transition-colors duration-200 group will-change-transform transform-gpu relative">
                   <div className="relative">
                     <img 
                          src={track.coverArt} 
                          alt={track.title} 
                          className="w-full h-28 object-cover rounded-lg mb-2 will-change-transform transform-gpu" 
                          loading="lazy"
                          decoding="async"
                          style={{ imageRendering: 'auto' }}
                      />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 will-change-opacity transform-gpu">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-all duration-150 transform scale-75 group-hover:scale-100 will-change-transform transform-gpu translate3d-0">
                          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                   </div>
                   <h3 className="text-white text-sm font-medium truncate">{track.title}</h3>
                   <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <SongMenu track={track} />
                   </div>
                 </div>
               </div>
            ))}
          </div>
          <div className="flex-shrink-0 w-8 flex justify-center">
            <button 
              onClick={scrollRight}
              className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No recently played tracks yet. Start listening to see your history here!</p>
          </div>
        )}
      </section>
      
      {/* Predefined Playlists Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          {React.cloneElement(ICONS.playlist, { className: "w-6 h-6 mr-2" })}
          Curated Playlists
        </h2>
        {predefinedPlaylists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {predefinedPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">Loading curated playlists...</p>
          </div>
        )}
      </section>
      
      {/* AI Playlist Generator Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
           {React.cloneElement(ICONS.radio, { className: "w-6 h-6 mr-2" })}
           AI Playlist Generator
         </h2>
        <p className="text-gray-400 mb-6">Let AI curate the perfect vibe for you.</p>
      
      {/* Real-time connection status */}
      {playlistsLoading && (
        <div className="bg-blue-800/20 border border-blue-600 rounded-lg p-4 mb-6">
          <p className="text-blue-400">🔄 Loading real-time playlists...</p>
        </div>
      )}
      
      {realTimePlaylists && realTimePlaylists.length > 0 && (
        <div className="bg-green-800/20 border border-green-600 rounded-lg p-4 mb-6">
          <p className="text-green-400">✅ Connected to real-time playlist updates ({realTimePlaylists.length} playlists available)</p>
        </div>
      )}
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8 flex items-center space-x-4">
        <input 
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Enter a mood (e.g., 'Coffee Shop Morning')"
          className="flex-grow bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-purple-500 focus:border-purple-500"
        />
        <button 
          onClick={handleGeneratePlaylist}
          disabled={isLoading}
          className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Playlist'}
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      {isLoading && <p className="text-center text-gray-400">AI is thinking...</p>}

      {generatedPlaylist.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your '{mood}' Playlist</h2>
          <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4">
            {generatedPlaylist.map(track => (
              <div key={track.id} className="flex-shrink-0 w-32">
                <TrackCard key={track.id} track={track} playlist={generatedPlaylist} />
              </div>
            ))}
          </div>
        </div>
      )}
      </section>
    </div>
  );
};

export default PlaylistView;
