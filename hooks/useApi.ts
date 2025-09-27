import { useState, useEffect, useCallback } from 'react';
import { Track, User, Playlist } from '../types';
import apiService, { ListeningRoom, QueueItem } from '../services/apiService';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

// Generic hook for API calls
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): ApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Generic hook for API list calls
export function useApiList<T>(
  apiCall: () => Promise<T[]>,
  dependencies: any[] = []
): ApiListState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiListState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'An error occurred' });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Specific hooks for different entities

// User hooks
export function useUsers() {
  return useApiList(() => apiService.user.getAllUsers());
}

export function useUser(id: string | null) {
  return useApiCall(
    () => id ? apiService.user.getUserById(id) : Promise.reject(new Error('No user ID provided')),
    [id]
  );
}

export function useUserByEmail(email: string | null) {
  return useApiCall(
    () => email ? apiService.user.getUserByEmail(email) : Promise.reject(new Error('No email provided')),
    [email]
  );
}

export function useTopUsers(limit: number = 10) {
  return useApiList(() => apiService.user.getTopUsers(limit), [limit]);
}

export function useSearchUsers(query: string) {
  return useApiList(
    () => query ? apiService.user.searchUsers(query) : Promise.resolve([]),
    [query]
  );
}

// Track hooks
export function useTracks() {
  return useApiList(() => apiService.track.getAllTracks());
}

export function useTrack(id: string | null) {
  return useApiCall(
    () => id ? apiService.track.getTrackById(id) : Promise.reject(new Error('No track ID provided')),
    [id]
  );
}

export function useTracksByGenre(genre: string | null) {
  return useApiList(
    () => genre ? apiService.track.getTracksByGenre(genre) : Promise.resolve([]),
    [genre]
  );
}

export function usePopularTracks(limit: number = 10) {
  return useApiList(() => apiService.track.getPopularTracks(limit), [limit]);
}

export function useRecentTracks(limit: number = 10) {
  return useApiList(() => apiService.track.getRecentTracks(limit), [limit]);
}

export function useTopTracks(limit: number = 10) {
  return useApiList(() => apiService.track.getTopTracks(limit), [limit]);
}

export function useSearchTracks(query: string) {
  return useApiList(
    () => query ? apiService.track.searchTracks(query) : Promise.resolve([]),
    [query]
  );
}

export function useGenres() {
  return useApiList(() => apiService.track.getAllGenres());
}

// Playlist hooks
export function usePlaylists() {
  return useApiList(() => apiService.playlist.getAllPlaylists());
}

export function usePlaylist(id: string | null) {
  return useApiCall(
    () => id ? apiService.playlist.getPlaylistById(id) : Promise.reject(new Error('No playlist ID provided')),
    [id]
  );
}

export function usePlaylistsByCategory(category: string | null) {
  return useApiList(
    () => category ? apiService.playlist.getPlaylistsByCategory(category) : Promise.resolve([]),
    [category]
  );
}

export function usePlaylistsByCreator(creatorId: string | null) {
  return useApiList(
    () => creatorId ? apiService.playlist.getPlaylistsByCreator(creatorId) : Promise.resolve([]),
    [creatorId]
  );
}

export function useSearchPlaylists(query: string) {
  return useApiList(
    () => query ? apiService.playlist.searchPlaylists(query) : Promise.resolve([]),
    [query]
  );
}

// Listening Room hooks
export function useActiveRooms() {
  return useApiList(() => apiService.listeningRoom.getActiveRooms());
}

export function useListeningRoom(id: string | null) {
  return useApiCall(
    () => id ? apiService.listeningRoom.getRoomById(id) : Promise.reject(new Error('No room ID provided')),
    [id]
  );
}

export function useRoomsByHost(hostId: string | null) {
  return useApiList(
    () => hostId ? apiService.listeningRoom.getRoomsByHost(hostId) : Promise.resolve([]),
    [hostId]
  );
}

export function usePopularRooms(limit: number = 10) {
  return useApiList(() => apiService.listeningRoom.getPopularRooms(limit), [limit]);
}

export function useSearchRooms(query: string) {
  return useApiList(
    () => query ? apiService.listeningRoom.searchActiveRooms(query) : Promise.resolve([]),
    [query]
  );
}

// Mutation hooks for creating/updating data
export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (userData: Omit<User, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.user.createUser(userData);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return { createUser, loading, error };
}

export function useCreateTrack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTrack = useCallback(async (trackData: Omit<Track, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.track.createTrack(trackData);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create track';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return { createTrack, loading, error };
}

export function useCreatePlaylist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlaylist = useCallback(async (playlistData: Omit<Playlist, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.playlist.createPlaylist(playlistData);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create playlist';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return { createPlaylist, loading, error };
}

export function useCreateListeningRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = useCallback(async (roomData: Omit<ListeningRoom, 'id' | 'participants' | 'queue' | 'participantCount' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.listeningRoom.createRoom(roomData);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create listening room';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return { createRoom, loading, error };
}

// Utility hook for incrementing play count
export function useIncrementPlayCount() {
  const incrementPlayCount = useCallback(async (trackId: string) => {
    try {
      await apiService.track.incrementPlayCount(trackId);
    } catch (error) {
      console.error('Failed to increment play count:', error);
    }
  }, []);

  return { incrementPlayCount };
}