import React, { useContext, useRef, useState } from 'react';
import { MOCK_PLAYLISTS } from '../../constants';
import PlaylistCard from '../ui/PlaylistCard';
import SongMenu from '../ui/SongMenu';
import { usePlaylists, usePlaylistsByCategory } from '../../hooks/useApi';
import { AppContext } from '../../App';
import { AppContextType } from '../../types';
import youtubeService from '../../services/youtubeService';

const Home: React.FC = () => {
    const {
        user,
        tracks,
        playTrack,
        setCurrentPlaylist,
        tracksLoading,
        refetchTracks,
        recentlyPlayed,
    } = useContext(AppContext) as AppContextType;
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    
    // Refs for scroll containers
    const recentlyPlayedRef = useRef<HTMLDivElement>(null);
    const madeForYouRef = useRef<HTMLDivElement>(null);
    const featuredPlaylistsRef = useRef<HTMLDivElement>(null);
    const moodActivityRef = useRef<HTMLDivElement>(null);
    
    // Try to load playlists from API, fallback to mock data
    const { data: allPlaylists, loading: playlistsLoading, error: playlistsError } = usePlaylists();
    const { data: featuredPlaylistsAPI, loading: featuredLoading } = usePlaylistsByCategory('featured');
    
    // Use API data if available, otherwise fallback to mock data
    const playlists = (allPlaylists && allPlaylists.length > 0) ? allPlaylists : MOCK_PLAYLISTS;
    const featuredPlaylists = (featuredPlaylistsAPI && featuredPlaylistsAPI.length > 0) 
        ? featuredPlaylistsAPI 
        : MOCK_PLAYLISTS.filter(p => p.category === 'featured');
    const moodPlaylists = playlists.filter(p => p.category !== 'featured');
    const madeForYou = playlists.slice(2, 17); // Mock personalized content - up to 15 items
    
    // Get current time for greeting
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };
    
    // Search functionality
    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }
        
        setIsSearching(true);
        try {
            const results = await youtubeService.searchVideos(query);
            console.log('Search results:', results);
            // Transform results to match expected structure
            const transformedResults = results.map(video => ({
                id: { videoId: video.id },
                snippet: {
                    title: video.title,
                    channelTitle: video.channelTitle,
                    thumbnails: {
                        medium: { url: video.thumbnail }
                    }
                }
            }));
            setSearchResults(transformedResults);
            setShowSearchResults(true);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };
    
    const handlePlayVideo = (video: any) => {
        // Create a track object from the video
        const track = {
            id: video.id?.videoId || video.id,
            title: video.snippet?.title || 'Untitled',
            artist: video.snippet?.channelTitle || 'Unknown Artist',
            coverArt: video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || '',
            audioUrl: `https://www.youtube.com/watch?v=${video.id?.videoId || video.id}`,
            duration: 0 // We don't have duration from search
        };
        
        playTrack(track, [track]);
        setShowSearchResults(false);
        setSearchQuery('');
    };
    
    // Scroll functions - scroll by the visible container width
    const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            const scrollAmount = ref.current.clientWidth * 0.8; // Scroll 80% of visible width
            ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            const scrollAmount = ref.current.clientWidth * 0.8; // Scroll 80% of visible width
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

  // Show loading state
  if (playlistsLoading || featuredLoading) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">Home</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">Loading playlists...</div>
        </div>
      </div>
    );
  }

  // Show connection status
  const isOffline = playlistsError && (!allPlaylists || allPlaylists.length === 0);

  return (
    <div className="space-y-8">
        {/* Personalized Greeting with Search */}
        <div className="mb-6 flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    {getGreeting()}, {user?.name || 'Music Lover'}.
                </h1>
                <p className="text-gray-400 text-lg">What would you like to listen to today?</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
                <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2 w-80">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search for music..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (e.target.value.trim()) {
                                handleSearch(e.target.value);
                            } else {
                                setShowSearchResults(false);
                            }
                        }}
                        className="bg-transparent text-white placeholder-gray-400 outline-none flex-1"
                    />
                    {isSearching && (
                        <div className="ml-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                        {searchResults.slice(0, 10).map((video) => {
                            if (!video || !video.snippet || !video.id) return null;
                            return (
                                <div
                                    key={video.id.videoId || video.id}
                                    onClick={() => handlePlayVideo(video)}
                                    className="flex items-center p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                                >
                                    <img
                                        src={video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || ''}
                                        alt={video.snippet.title || 'Video thumbnail'}
                                        className="w-12 h-12 rounded object-cover mr-3"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">
                                            {video.snippet.title || 'Untitled'}
                                        </p>
                                        <p className="text-gray-400 text-xs truncate">
                                            {video.snippet.channelTitle || 'Unknown Channel'}
                                        </p>
                                     </div>
                                     <svg className="w-5 h-5 text-gray-400 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                     </svg>
                                 </div>
                             );
                         })}
                    </div>
                )}
            </div>
        </div>
        
        {isOffline && (
          <div className="mb-4 p-3 bg-yellow-600 text-white rounded-lg">
            <p className="text-sm">Backend connection failed - showing sample playlists</p>
          </div>
        )}

        {/* Recently Played Section */}
        <section className="mb-10 section-hover">
            <h2 className="text-xl font-bold text-white mb-5">Recently Played</h2>
            <div className="flex items-center">
                <div className="flex-shrink-0 w-8 flex justify-center">
                    <button 
                        onClick={() => scrollLeft(recentlyPlayedRef)}
                        className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                <div ref={recentlyPlayedRef} className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 flex-1 px-4">
                    {recentlyPlayed && recentlyPlayed.length > 0 ? (
                        recentlyPlayed.slice(0, 15).map(track => (
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
                        ))
                    ) : (
                        <div className="flex-1 text-center py-8">
                            <p className="text-gray-400">No recently played tracks yet. Start listening to see your history here!</p>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 w-8 flex justify-center">
                    <button 
                        onClick={() => scrollRight(recentlyPlayedRef)}
                        className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>

        {/* Made Just for You Section */}
        <section className="mb-10 section-hover">
            <h2 className="text-xl font-bold text-white mb-5">Made Just for You</h2>
            <div className="flex items-center">
                <div className="flex-shrink-0 w-8 flex justify-center">
                    <button 
                        onClick={() => scrollLeft(madeForYouRef)}
                        className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                <div ref={madeForYouRef} className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 flex-1 px-4">
                    {madeForYou.map(playlist => (
                        <div key={playlist.id} className="flex-shrink-0 w-32">
                            <PlaylistCard playlist={playlist} />
                        </div>
                    ))}
                </div>
                <div className="flex-shrink-0 w-8 flex justify-center">
                    <button 
                        onClick={() => scrollRight(madeForYouRef)}
                        className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>

        {/* Featured Playlists Section */}
        <section className="mb-10 section-hover">
            <h2 className="text-xl font-bold text-white mb-5">Featured Playlists</h2>
            <div className="flex items-center">
                <div className="flex-shrink-0 w-8 flex justify-center">
                    <button 
                        onClick={() => scrollLeft(featuredPlaylistsRef)}
                        className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                <div ref={featuredPlaylistsRef} className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 flex-1 px-4">
                    {featuredPlaylists.slice(0, 15).map(playlist => (
                        <div key={playlist.id} className="flex-shrink-0 w-32">
                            <PlaylistCard playlist={playlist} />
                        </div>
                    ))}
                </div>
                <div className="flex-shrink-0 w-8 flex justify-center">
                    <button 
                        onClick={() => scrollRight(featuredPlaylistsRef)}
                        className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>

        {/* Playlists by Mood & Activity Section */}
        <section className="mb-10 section-hover">
            <h2 className="text-xl font-bold text-white mb-5">Playlists by Mood & Activity</h2>
            <div className="flex items-center">
                <div className="flex-shrink-0 w-8 flex justify-center">
                    <button 
                        onClick={() => scrollLeft(moodActivityRef)}
                        className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                <div ref={moodActivityRef} className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 flex-1 px-4">
                    {moodPlaylists.slice(0, 15).map(playlist => (
                        <div key={playlist.id} className="flex-shrink-0 w-32">
                            <PlaylistCard playlist={playlist} />
                        </div>
                    ))}
                </div>
                <div className="flex-shrink-0 w-8 flex justify-center">
                    <button 
                        onClick={() => scrollRight(moodActivityRef)}
                        className="scroll-btn w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 transition-opacity duration-300"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    </div>
  );
};

export default Home;