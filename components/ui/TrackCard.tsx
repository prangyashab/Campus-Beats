
import React, { useContext } from 'react';
import { Track } from '../../types';
import { AppContext } from '../../App';
import { AppContextType } from '../../types';
import { ICONS } from '../../constants';
import SongMenu from './SongMenu';

interface TrackCardProps {
  track: Track;
  playlist: Track[];
}

const TrackCard: React.FC<TrackCardProps> = ({ track, playlist }) => {
  const { playTrack, currentTrack, isPlaying } = useContext(AppContext) as AppContextType;
  const isActive = currentTrack?.id === track.id;

  return (
    <div className={`group relative bg-transparent hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer rounded-lg p-3 ${isActive ? 'bg-purple-800/30' : ''}`}>
      {/* Album Art */}
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img src={track.coverArt} alt={track.title} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200 rounded-lg" />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center rounded-lg">
          <button 
            onClick={() => playTrack(track, playlist)} 
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-opacity duration-150 shadow-lg hover:bg-green-600"
          >
            {isActive && isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div>
        <h3 className="font-medium text-white text-sm truncate mb-1 leading-tight">{track.title}</h3>
        <p className="text-xs text-gray-400 truncate opacity-80">{track.artist}</p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <SongMenu track={track} />
      </div>
    </div>
  );
};

export default TrackCard;
