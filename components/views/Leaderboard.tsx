
import React, { useContext } from 'react';
import { MOCK_USERS, MOCK_TRACKS, ICONS } from '../../constants';
import Badge from '../ui/Badge';
import { AppContext } from '../../App';
import { AppContextType } from '../../types';

const Leaderboard: React.FC = () => {
    const { playTrack } = useContext(AppContext) as AppContextType;
    const sortedUsers = [...MOCK_USERS].sort((a, b) => b.points - a.points);
    // Let's create a mock "most played" leaderboard
    const mostPlayedTracks = MOCK_TRACKS.slice(0, 5).map((track, index) => ({...track, plays: 150 - (index * 15)}));

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Campus Leaderboards</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Most Active Listeners */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Most Active Listeners</h2>
                    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                        {sortedUsers.map((user, index) => (
                            <div key={user.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-lg font-bold w-8">{index + 1}{index === 0 && ICONS.crown}</span>
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <div className="flex space-x-2 mt-1">
                                            {user.badges.map(badge => <Badge key={badge} name={badge} />)}
                                        </div>
                                    </div>
                                </div>
                                <p className="font-bold text-purple-400">{user.points} pts</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Most Played Songs */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Top Student Tracks</h2>
                    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                        {mostPlayedTracks.map((track, index) => (
                            <div key={track.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg group">
                                <div className="flex items-center">
                                    <span className="text-lg font-bold w-8">{index + 1}</span>
                                    <img src={track.coverArt} alt={track.title} className="w-12 h-12 rounded-lg mr-4" />
                                    <div>
                                        <p className="font-semibold">{track.title}</p>
                                        <p className="text-sm text-gray-400">{track.artist}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-bold text-gray-400 mr-4">{track.plays} plays</p>
                                    <button 
                                        onClick={() => playTrack(track, mostPlayedTracks)}
                                        className="text-white bg-purple-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {ICONS.play}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
