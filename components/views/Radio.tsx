
import React, { useContext } from 'react';
import { MOCK_USERS, MOCK_TRACKS, ICONS } from '../../constants';
import { AppContext } from '../../App';
import { AppContextType } from '../../types';

const Radio: React.FC = () => {
    const { playTrack, isPlaying, currentTrack, togglePlay } = useContext(AppContext) as AppContextType;
    const dj = MOCK_USERS[0];
    const radioPlaylist = MOCK_TRACKS.slice(2, 7);
    const radioIsActive = currentTrack && radioPlaylist.some(t => t.id === currentTrack.id);

    const handlePlayRadio = () => {
        if(radioIsActive) {
            togglePlay();
        } else {
            playTrack(radioPlaylist[0], radioPlaylist);
        }
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-2">Virtual Campus Radio</h1>
            <p className="text-lg text-gray-400 mb-8">Live broadcast by your fellow students.</p>

            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 p-8 rounded-lg flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                    <img src="https://picsum.photos/seed/dj/200" alt="DJ Alex" className="w-48 h-48 rounded-full border-4 border-purple-400 shadow-lg"/>
                </div>
                <div>
                    <p className="text-purple-300 font-semibold">ON AIR</p>
                    <h2 className="text-5xl font-bold my-2">DJ {dj.name}'s Afternoon Mix</h2>
                    <p className="text-gray-300 max-w-xl">
                        Broadcasting live from the campus media center! Tune in for some chill vibes, campus announcements, and maybe a giveaway or two.
                    </p>
                    <button 
                        onClick={handlePlayRadio}
                        className="mt-6 flex items-center bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors text-lg"
                    >
                        <span className="mr-3">{radioIsActive && isPlaying ? ICONS.pause : ICONS.play}</span>
                        {radioIsActive && isPlaying ? 'PAUSE RADIO' : 'TUNE IN'}
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Now Playing on Campus Radio:</h3>
                <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                    {radioPlaylist.map(track => (
                        <div key={track.id} className={`flex items-center p-3 rounded-lg transition-colors ${currentTrack?.id === track.id ? 'bg-purple-600' : 'bg-gray-700'}`}>
                            <img src={track.coverArt} alt={track.title} className="w-10 h-10 rounded-lg mr-4"/>
                            <div>
                                <p className="font-semibold">{track.title}</p>
                                <p className="text-sm text-gray-400">{track.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Radio;
