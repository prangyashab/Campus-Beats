import React from 'react';
import { Track, User, Playlist, BadgeName } from './types';

export const BOLLYWOOD_TRACKS: Track[] = [
  { id: 'track-9', title: 'Dil Se Re', artist: 'A. R. Rahman', coverArt: 'https://picsum.photos/seed/bollywood1/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', duration: 412, genre: 'Bollywood', uploadedBy: 'user-1', playCount: 150, likes: 25 },
  { id: 'track-10', title: 'Chaiyya Chaiyya', artist: 'Sukhwinder Singh, Sapna Awasthi', coverArt: 'https://picsum.photos/seed/bollywood2/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', duration: 415, genre: 'Bollywood', uploadedBy: 'user-2', playCount: 200, likes: 40 },
  { id: 'track-11', title: 'Tujhe Dekha Toh', artist: 'Lata Mangeshkar, Kumar Sanu', coverArt: 'https://picsum.photos/seed/bollywood3/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', duration: 302, genre: 'Bollywood', uploadedBy: 'user-3', playCount: 180, likes: 35 },
  { id: 'track-12', title: 'Kal Ho Naa Ho', artist: 'Sonu Nigam', coverArt: 'https://picsum.photos/seed/bollywood4/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', duration: 321, genre: 'Bollywood', uploadedBy: 'user-1', playCount: 220, likes: 50 },
  { id: 'track-13', title: 'Jai Ho', artist: 'A. R. Rahman, Sukhwinder Singh', coverArt: 'https://picsum.photos/seed/bollywood5/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', duration: 342, genre: 'Bollywood', uploadedBy: 'user-2', playCount: 300, likes: 60 },
];

export const MOCK_TRACKS: Track[] = [
  ...BOLLYWOOD_TRACKS,
  { id: 'track-1', title: 'Campus Loop', artist: 'Student DJ', coverArt: 'https://picsum.photos/seed/music1/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 222, genre: 'Lo-fi', uploadedBy: 'user-1', playCount: 120, likes: 15 },
  { id: 'track-2', title: 'Library Echoes', artist: 'The Bookworms', coverArt: 'https://picsum.photos/seed/music2/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 292, genre: 'Ambient', uploadedBy: 'user-2', playCount: 95, likes: 12 },
  { id: 'track-3', title: 'Quad Anthem', artist: 'The Grads', coverArt: 'https://picsum.photos/seed/music3/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: 233, genre: 'Indie Rock', uploadedBy: 'user-3', playCount: 180, likes: 28 },
  { id: 'track-4', title: 'Finals Week Funk', artist: 'Cram Session', coverArt: 'https://picsum.photos/seed/music4/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 324, genre: 'Funk', uploadedBy: 'user-1', playCount: 210, likes: 35 },
  { id: 'track-5', title: 'Lecture Hall Haze', artist: 'Prof. Groove', coverArt: 'https://picsum.photos/seed/music5/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration: 278, genre: 'Chillwave', uploadedBy: 'user-2', playCount: 160, likes: 22 },
  { id: 'track-6', title: 'Dorm Room Dreams', artist: 'Late Nighters', coverArt: 'https://picsum.photos/seed/music6/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration: 198, genre: 'Bedroom Pop', uploadedBy: 'user-3', playCount: 140, likes: 18 },
  { id: 'track-7', title: 'Spring Break Beats', artist: 'DJ Sunny', coverArt: 'https://picsum.photos/seed/music7/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', duration: 250, genre: 'EDM', uploadedBy: 'user-1', playCount: 250, likes: 45 },
  { id: 'track-8', title: 'After Class', artist: 'The Slackers', coverArt: 'https://picsum.photos/seed/music8/200', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', duration: 215, genre: 'Acoustic', uploadedBy: 'user-2', playCount: 110, likes: 14 },
];

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alex', email: 'alex@stateu.edu', universityDomain: 'stateu.edu', points: 2500, badges: ['Top DJ', 'Playlist King'], uploadedTracks: ['track-6', 'track-8'] },
  { id: 'user-2', name: 'Brenda', email: 'brenda@tech.edu', universityDomain: 'tech.edu', points: 1800, badges: ['Early Listener'], uploadedTracks: [] },
  { id: 'user-3', name: 'Carlos', email: 'carlos@stateu.edu', universityDomain: 'stateu.edu', points: 3200, badges: ['Campus Legend', 'Top DJ'], uploadedTracks: ['track-7'] },
];

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: 'pl-1', name: 'Study Vibes', description: 'Lo-fi beats and ambient sounds for focus.', coverArt: 'https://picsum.photos/seed/playlist1/400', tracks: [MOCK_TRACKS[5], MOCK_TRACKS[6], MOCK_TRACKS[9], MOCK_TRACKS[10]], category: 'study' },
  { id: 'pl-2', name: 'Fest Hits', description: 'Get hyped with these campus festival anthems.', coverArt: 'https://picsum.photos/seed/playlist2/400', tracks: [MOCK_TRACKS[7], MOCK_TRACKS[8], MOCK_TRACKS[11]], category: 'featured' },
  { id: 'pl-3', name: 'After Exam Chill', description: 'Relax and unwind after a long week of exams.', coverArt: 'https://picsum.photos/seed/playlist3/400', tracks: [MOCK_TRACKS[6], MOCK_TRACKS[9], MOCK_TRACKS[12]], category: 'chill' },
  { id: 'pl-4', name: 'Bollywood Beats', description: 'Iconic hits from Hindi cinema.', coverArt: 'https://picsum.photos/seed/playlist4/400', tracks: BOLLYWOOD_TRACKS, category: 'featured' },
  { id: 'pl-5', name: 'Gym Power', description: 'High-energy beats for your workout.', coverArt: 'https://picsum.photos/seed/playlist5/400', tracks: [MOCK_TRACKS[11], MOCK_TRACKS[8], MOCK_TRACKS[7]], category: 'workout' },
  { id: 'pl-6', name: 'Meditation Zone', description: 'Calm your mind with these ambient sounds.', coverArt: 'https://picsum.photos/seed/playlist6/400', tracks: [MOCK_TRACKS[6], MOCK_TRACKS[9]], category: 'chill' },
  { id: 'pl-7', name: 'Relax & Unwind', description: 'Chill tracks to help you de-stress.', coverArt: 'https://picsum.photos/seed/playlist7/400', tracks: [MOCK_TRACKS[5], MOCK_TRACKS[10], MOCK_TRACKS[12]], category: 'chill' },
  { id: 'pl-8', name: 'Campus Party', description: 'The ultimate soundtrack for your next party.', coverArt: 'https://picsum.photos/seed/playlist8/400', tracks: [MOCK_TRACKS[11], MOCK_TRACKS[8], MOCK_TRACKS[1]], category: 'party' },
  { id: 'pl-9', name: 'Late Night Study', description: 'Perfect for those midnight cramming sessions.', coverArt: 'https://picsum.photos/seed/playlist9/400', tracks: [MOCK_TRACKS[1], MOCK_TRACKS[5], MOCK_TRACKS[6]], category: 'study' },
  { id: 'pl-10', name: 'Morning Motivation', description: 'Start your day with energy and positivity.', coverArt: 'https://picsum.photos/seed/playlist10/400', tracks: [MOCK_TRACKS[3], MOCK_TRACKS[7], MOCK_TRACKS[11]], category: 'featured' },
  { id: 'pl-11', name: 'Coffee Shop Vibes', description: 'Acoustic melodies for your coffee break.', coverArt: 'https://picsum.photos/seed/playlist11/400', tracks: [MOCK_TRACKS[8], MOCK_TRACKS[2], MOCK_TRACKS[6]], category: 'chill' },
  { id: 'pl-12', name: 'Weekend Warriors', description: 'High-energy tracks for weekend adventures.', coverArt: 'https://picsum.photos/seed/playlist12/400', tracks: [MOCK_TRACKS[7], MOCK_TRACKS[11], MOCK_TRACKS[3]], category: 'workout' },
  { id: 'pl-13', name: 'Indie Discoveries', description: 'Hidden gems from independent artists.', coverArt: 'https://picsum.photos/seed/playlist13/400', tracks: [MOCK_TRACKS[3], MOCK_TRACKS[8], MOCK_TRACKS[2]], category: 'featured' },
  { id: 'pl-14', name: 'Rainy Day Blues', description: 'Mellow tunes for cloudy weather.', coverArt: 'https://picsum.photos/seed/playlist14/400', tracks: [MOCK_TRACKS[2], MOCK_TRACKS[6], MOCK_TRACKS[5]], category: 'chill' },
  { id: 'pl-15', name: 'Dance Floor Hits', description: 'Get the party started with these bangers.', coverArt: 'https://picsum.photos/seed/playlist15/400', tracks: [MOCK_TRACKS[7], MOCK_TRACKS[11], MOCK_TRACKS[4]], category: 'party' },
  { id: 'pl-16', name: 'Focus Flow', description: 'Instrumental tracks to boost concentration.', coverArt: 'https://picsum.photos/seed/playlist16/400', tracks: [MOCK_TRACKS[1], MOCK_TRACKS[2], MOCK_TRACKS[5]], category: 'study' },
  { id: 'pl-17', name: 'Sunset Sessions', description: 'Perfect soundtrack for golden hour.', coverArt: 'https://picsum.photos/seed/playlist17/400', tracks: [MOCK_TRACKS[4], MOCK_TRACKS[8], MOCK_TRACKS[6]], category: 'chill' },
];

export const BADGE_COLORS: Record<BadgeName, string> = {
  'Early Listener': 'bg-blue-500 text-white',
  'Top DJ': 'bg-purple-500 text-white',
  'Playlist King': 'bg-green-500 text-white',
  'Campus Legend': 'bg-yellow-400 text-gray-900',
};

export const ICONS = {
  home: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  playlist: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  leaderboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  radio: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m-2.828 9.9a5 5 0 01-7.072 0" /></svg>,
  listeningRoom: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.39-2.142 3.002 3.002 0 013.39 2.142m-6.78 0a3.002 3.002 0 00-3.39-2.142 3.002 3.002 0 00-3.39 2.142m6.78 0L9 12m9 4.857A3 3 0 0115.356 18M9 12a3 3 0 11-6 0 3 3 0 016 0zm12 0a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  focusTimer: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  play: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>,
  pause: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
  next: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.168V14a1 1 0 002 0V6a1 1 0 00-2 0v2.832L4.555 5.168zM15 6a1 1 0 00-1 1v6a1 1 0 102 0V7a1 1 0 00-1-1z" /></svg>,
  prev: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 5.168A1 1 0 007 6v8a1 1 0 001.445.894L14 11.168V14a1 1 0 102 0V6a1 1 0 10-2 0v2.832L8.445 5.168zM6 6a1 1 0 00-1 1v6a1 1 0 102 0V7a1 1 0 00-1-1z" /></svg>,
  upload: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  crown: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11.05 3.001a1 1 0 00-2.1 0L6.402 8.355A2 2 0 008.304 11h3.392a2 2 0 001.902-2.645l-2.548-5.354z" /><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 5a1 1 0 011-1h2a1 1 0 110 2H4a1 1 0 01-1-1zM15 5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
  close: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  youtube: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 12l4.5-2.25L18 12l-4.5 2.25L9 12z" /></svg>,
};