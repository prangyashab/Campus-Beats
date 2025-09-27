import React, { useState, useRef, useEffect, useContext } from 'react';
import { Playlist } from '../../types';
import { AppContext } from '../../App';
import { AppContextType } from '../../types';

interface PlaylistMenuProps {
  playlist: Playlist;
  className?: string;
}

const PlaylistMenu: React.FC<PlaylistMenuProps> = ({ playlist, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { addPlaylistToQueue, playPlaylistNext, tracks } = useContext(AppContext) as AppContextType;

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

  const getPlaylistTracks = () => {
    // Return tracks that belong to this playlist
    return playlist.tracks;
  };

  const handleMenuAction = (action: string) => {
    setIsOpen(false);
    const playlistTracks = getPlaylistTracks();
    
    switch (action) {
      case 'playNext':
        playPlaylistNext(playlistTracks);
        break;
      case 'addToQueue':
        addPlaylistToQueue(playlistTracks);
        break;
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleMenuClick}
        className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
        aria-label="Playlist options"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleMenuAction('playNext'); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Play Next
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); handleMenuAction('addToQueue'); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Queue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistMenu;