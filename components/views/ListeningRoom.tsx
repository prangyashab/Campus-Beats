
import React, { useState, useContext } from 'react';
import { MOCK_TRACKS, MOCK_USERS } from '../../constants';
import { AppContext } from '../../App';
import { AppContextType } from '../../types';

const ListeningRoom: React.FC = () => {
    const { playTrack, currentTrack, isPlaying } = useContext(AppContext) as AppContextType;
    const roomPlaylist = MOCK_TRACKS.slice(0, 4);
    const [votes, setVotes] = useState<Record<string, number>>({
        [roomPlaylist[1].id]: 3,
        [roomPlaylist[2].id]: 5,
        [roomPlaylist[3].id]: 1,
    });

    const handleVote = (trackId: string) => {
        setVotes(prev => ({
            ...prev,
            [trackId]: (prev[trackId] || 0) + 1,
        }));
    };
    
    const isRoomPlaying = currentTrack?.id === roomPlaylist[0].id;

    return (
        <div>
            <h1 className="text-4xl font-bold mb-2">'Study Vibes' Live Listening Room</h1>
            <p className="text-lg text-gray-400 mb-8">Listen together with your classmates.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Now Playing Section */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Now Playing</h2>
                    <div className="flex items-center bg-gray-700 p-4 rounded-lg">
                        <img src={roomPlaylist[0].coverArt} alt={roomPlaylist[0].title} className="w-32 h-32 rounded-lg mr-6"/>
                        <div>
                            <h3 className="text-3xl font-bold">{roomPlaylist[0].title}</h3>
                            <p className="text-xl text-gray-400 mb-4">{roomPlaylist[0].artist}</p>
                            <button 
                                onClick={() => playTrack(roomPlaylist[0], roomPlaylist)}
                                className="bg-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                            >
                                {isRoomPlaying && isPlaying ? 'Pause' : 'Listen Along'}
                            </button>
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Vote for the Next Song</h2>
                    <div className="space-y-3">
                        {roomPlaylist.slice(1).map(track => (
                            <div key={track.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                                <div className="flex items-center">
                                    <img src={track.coverArt} alt={track.title} className="w-12 h-12 rounded-lg mr-4"/>
                                    <div>
                                        <p className="font-semibold">{track.title}</p>
                                        <p className="text-sm text-gray-400">{track.artist}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-bold text-lg">{votes[track.id] || 0}</span>
                                    <button 
                                        onClick={() => handleVote(track.id)}
                                        className="bg-green-500 px-4 py-1 rounded-full font-semibold hover:bg-green-600 transition-colors text-sm"
                                    >
                                        Vote
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Participants Section */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Listeners ({MOCK_USERS.length + 1})</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {[...MOCK_USERS, {id: 'user-4', name: 'You', universityDomain: 'your.edu', points: 120, badges: [], uploadedTracks: []}].map(user => (
                            <div key={user.id} className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold mr-3">{user.name[0]}</div>
                                <p>{user.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListeningRoom;
