
import React, { useContext } from 'react';
import { Playlist, View } from '../../types';
import { AppContext } from '../../App';
import { AppContextType } from '../../types';
import PlaylistMenu from './PlaylistMenu';

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
    const { setView, setSelectedPlaylist } = useContext(AppContext) as AppContextType;

    const handleCardClick = () => {
        setSelectedPlaylist(playlist);
        setView(View.Playlist);
    }

  return (
    <div 
        onClick={handleCardClick}
        className="group relative bg-transparent hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer rounded-lg p-3"
    >
      {/* Album Art */}
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img 
          src={playlist.coverArt} 
          alt={playlist.name} 
          className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200 rounded-lg" 
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center rounded-lg">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-opacity duration-150 shadow-lg">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div>
        <h3 className="font-medium text-white text-sm truncate mb-1 leading-tight">{playlist.name}</h3>
        <p className="text-xs text-gray-400 truncate opacity-80">{playlist.description}</p>
      </div>
      
      {/* Playlist Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlaylistMenu playlist={playlist} />
      </div>
    </div>
  );
};

export default PlaylistCard;
