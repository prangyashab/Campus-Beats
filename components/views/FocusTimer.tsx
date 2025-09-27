import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { AppContext } from '../../App';
import { AppContextType } from '../../types';
import { MOCK_PLAYLISTS } from '../../constants';
import { Playlist as PlaylistType } from '../../types';

type TimerMode = 'Focus' | 'Break' | 'Idle';

const FocusTimer: React.FC = () => {
    const { playTrack, togglePlay, isPlaying, currentTrack } = useContext(AppContext) as AppContextType;

    // Timer settings
    const [focusDuration, setFocusDuration] = useState(25); // in minutes
    const [breakDuration, setBreakDuration] = useState(5); // in minutes

    // Playlist settings
    const [focusPlaylistId, setFocusPlaylistId] = useState(MOCK_PLAYLISTS.find(p => p.name.includes('Study'))?.id || MOCK_PLAYLISTS[0].id);
    const [breakPlaylistId, setBreakPlaylistId] = useState(MOCK_PLAYLISTS.find(p => p.name.includes('Party'))?.id || MOCK_PLAYLISTS[1].id);

    // Timer state
    const [mode, setMode] = useState<TimerMode>('Idle');
    const [timeLeft, setTimeLeft] = useState(focusDuration * 60); // in seconds
    const [isActive, setIsActive] = useState(false);

    const focusPlaylist = useMemo(() => MOCK_PLAYLISTS.find(p => p.id === focusPlaylistId), [focusPlaylistId]);
    const breakPlaylist = useMemo(() => MOCK_PLAYLISTS.find(p => p.id === breakPlaylistId), [breakPlaylistId]);

    const startPlaylist = useCallback((playlist: PlaylistType | undefined) => {
        if (playlist && playlist.tracks.length > 0) {
            playTrack(playlist.tracks[0], playlist.tracks);
        }
    }, [playTrack]);

    useEffect(() => {
        // Fix: Use ReturnType<typeof setInterval> for interval timer type to be environment-agnostic (browser vs. node).
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            if (mode === 'Focus') {
                setMode('Break');
                setTimeLeft(breakDuration * 60);
                startPlaylist(breakPlaylist);
            } else if (mode === 'Break') {
                setMode('Focus');
                setTimeLeft(focusDuration * 60);
                startPlaylist(focusPlaylist);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode, focusDuration, breakDuration, focusPlaylist, breakPlaylist, startPlaylist]);

    useEffect(() => {
        if (mode === 'Idle') {
            setTimeLeft(focusDuration * 60);
        }
    }, [focusDuration, mode]);

    const handleStartClick = () => {
        setMode('Focus');
        setIsActive(true);
        startPlaylist(focusPlaylist);
    };
    
    const handlePauseResumeClick = () => {
        setIsActive(prev => {
            const nextIsActive = !prev;
            if (nextIsActive) { 
                if(!isPlaying && currentTrack) togglePlay();
            } else {
                if(isPlaying) togglePlay();
            }
            return nextIsActive;
        });
    }

    const handleReset = () => {
        setIsActive(false);
        setMode('Idle');
        setTimeLeft(focusDuration * 60);
        if (isPlaying) {
            togglePlay();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const progressPercentage = () => {
        const totalDuration = (mode === 'Focus' || mode === 'Idle') ? focusDuration * 60 : breakDuration * 60;
        if (totalDuration === 0 || !isActive) return 0;
        return ((totalDuration - timeLeft) / totalDuration) * 100;
    };
    
    return (
        <div className="flex flex-col items-center justify-start h-full text-center p-4">
            <h1 className="text-4xl font-bold mb-4">Focus & Break Timer</h1>
            <p className="text-lg text-gray-400 mb-8">Use the Pomodoro technique to boost your productivity.</p>

            <div className={`relative w-72 h-72 rounded-full flex items-center justify-center bg-gray-800 shadow-lg mb-8 ${isActive ? 'animate-pulse-beat' : ''}`}>
                 <div className="absolute inset-0 z-0 rounded-full transition-opacity duration-1000" style={{ background: `conic-gradient(rgb(139 92 246) ${progressPercentage()}%, transparent ${progressPercentage()}%)` }}></div>
                <div className="relative w-64 h-64 rounded-full bg-gray-900 flex flex-col items-center justify-center z-10">
                    <p className="text-lg font-semibold text-purple-400">{mode}</p>
                    <p className="text-6xl font-mono font-bold">{formatTime(timeLeft)}</p>
                </div>
            </div>

            <div className="flex space-x-4 mb-12">
                <button
                    onClick={mode === 'Idle' ? handleStartClick : handlePauseResumeClick}
                    className="w-32 bg-purple-600 text-white font-bold py-3 px-6 rounded-full hover:bg-purple-700 transition-colors text-lg"
                >
                    {isActive ? 'Pause' : (mode === 'Idle' ? 'Start' : 'Resume')}
                </button>
                <button
                    onClick={handleReset}
                    className="w-32 bg-gray-600 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-700 transition-colors text-lg"
                >
                    Reset
                </button>
            </div>

            <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">Customize Your Session</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Focus Duration: {focusDuration} min</label>
                            <input
                                type="range" min="5" max="60" step="5" value={focusDuration}
                                onChange={(e) => setFocusDuration(Number(e.target.value))}
                                disabled={isActive}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Break Duration: {breakDuration} min</label>
                            <input
                                type="range" min="1" max="30" step="1" value={breakDuration}
                                onChange={(e) => setBreakDuration(Number(e.target.value))}
                                disabled={isActive}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="mb-4">
                            <label htmlFor="focus-playlist" className="block text-gray-300 mb-2">Focus Playlist</label>
                            <select
                                id="focus-playlist" value={focusPlaylistId}
                                onChange={(e) => setFocusPlaylistId(e.target.value)}
                                disabled={isActive}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                            >
                                {MOCK_PLAYLISTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="break-playlist" className="block text-gray-300 mb-2">Break Playlist</label>
                             <select
                                id="break-playlist" value={breakPlaylistId}
                                onChange={(e) => setBreakPlaylistId(e.target.value)}
                                disabled={isActive}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                            >
                                {MOCK_PLAYLISTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusTimer;