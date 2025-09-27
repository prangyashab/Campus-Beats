import React from 'react';

export enum View {
    Home = 'Home',
    Playlist = 'Playlist',
    Leaderboard = 'Leaderboard',
    Radio = 'Radio',
    ListeningRoom = 'Listening Room',
    FocusTimer = 'Focus Timer',
    YouTubeSearch = 'YouTube Search',
}

export interface Track {
    id: string;
    title: string;
    artist: string;
    album?: string;
    coverArt: string;
    audioUrl: string;
    duration: number; // in seconds
    genre: string;
    uploadedBy: string;
    playCount: number;
    likes: number;
}

export type BadgeName = 'Early Listener' | 'Top DJ' | 'Playlist King' | 'Campus Legend';

export interface User {
    id: string;
    name: string;
    email: string;
    universityDomain: string;
    points: number;
    badges: BadgeName[];
    uploadedTracks: string[]; // Array of track IDs
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    coverArt: string;
    tracks: Track[];
    category: 'study' | 'featured' | 'party' | 'workout' | 'chill';
}

export interface AppContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    view: View;
    setView: (view: View) => void;
    tracks: Track[];
    setTracks: () => void; // Deprecated - use refetchTracks instead
    currentTrack: Track | null;
    setCurrentTrack: (track: Track | null) => void;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    currentPlaylist: Track[];
    setCurrentPlaylist: (playlist: Track[]) => void;
    selectedPlaylist: Playlist | null;
    setSelectedPlaylist: (playlist: Playlist | null) => void;
    playTrack: (track: Track, playlist?: Track[]) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    uploadTrack: (file: File) => Promise<void>;
    handleLogin: (userData: User, token: string) => Promise<void>;
    audioRef?: React.RefObject<HTMLAudioElement>;
    // Volume controls
    volume: number;
    setVolume: (volume: number) => void;
    isMuted: boolean;
    toggleMute: () => void;
    // Playback modes
    isShuffled: boolean;
    toggleShuffle: () => void;
    repeatMode: 'off' | 'one' | 'all';
    toggleRepeat: () => void;
    // Player display modes
    playerMode: 'normal' | 'mini' | 'fullscreen';
    setPlayerMode: (mode: 'normal' | 'mini' | 'fullscreen') => void;
    // Queue functionality
    queue: Track[];
    addToQueue: (track: Track) => void;
    playNextTrack: (track: Track) => void;
    addPlaylistToQueue: (tracks: Track[]) => void;
    playPlaylistNext: (tracks: Track[]) => void;
    removeFromQueue?: (index: number) => void;
    addToPlaylist: (track: Track, playlistId?: string) => void;
    likeTrack: (track: Track) => void;
    // API-related state
    tracksLoading: boolean;
    createTrackLoading: boolean;
    userLoading: boolean;
    refetchTracks: () => void;
    // WebSocket state
    isConnected: boolean;
    // Recently played
    recentlyPlayed: Track[];
    // YouTube streaming states
    isLoadingYouTube: boolean;
    youTubeError: string | null;
}