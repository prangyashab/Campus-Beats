import { Track, User, Playlist } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

// HTTP client configuration
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get error message from response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          // If we can't parse the error, use the default message
        }
        
        const error = new Error(errorMessage);
        (error as any).response = { data: { error: errorMessage }, status: response.status };
        throw error;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response.text() as unknown as T;
    } catch (error) {
      console.warn(`API request failed for ${endpoint}:`, error);
      console.warn('Backend server may not be running. Using fallback behavior.');
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// User API Service
export const userService = {
  getAllUsers: (): Promise<User[]> => 
    apiClient.get<User[]>('/users'),

  getUserById: (id: string): Promise<User> => 
    apiClient.get<User>(`/users/${id}`),

  getUserByEmail: (email: string): Promise<User> => 
    apiClient.get<User>(`/users/email/${email}`),

  getUsersByUniversity: (domain: string): Promise<User[]> => 
    apiClient.get<User[]>(`/users/university/${domain}`),

  searchUsers: (query: string): Promise<User[]> => 
    apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`),

  getTopUsers: (limit: number = 10): Promise<User[]> => 
    apiClient.get<User[]>(`/users/top?limit=${limit}`),

  createUser: (user: Omit<User, 'id'>): Promise<User> => 
    apiClient.post<User>('/users', user),

  updateUser: (id: string, user: Partial<User>): Promise<User> => 
    apiClient.put<User>(`/users/${id}`, user),

  deleteUser: (id: string): Promise<void> => 
    apiClient.delete<void>(`/users/${id}`),

  addPointsToUser: (id: string, points: number): Promise<User> => 
    apiClient.post<User>(`/users/${id}/points`, { points }),

  addBadgeToUser: (id: string, badge: string): Promise<User> => 
    apiClient.post<User>(`/users/${id}/badges`, { badge }),
};

// Track API Service
export const trackService = {
  getAllTracks: (): Promise<Track[]> => 
    apiClient.get<Track[]>('/tracks'),

  getTrackById: (id: string): Promise<Track> => 
    apiClient.get<Track>(`/tracks/${id}`),

  getTracksByGenre: (genre: string): Promise<Track[]> => 
    apiClient.get<Track[]>(`/tracks/genre/${genre}`),

  getTracksByUploader: (uploaderId: string): Promise<Track[]> => 
    apiClient.get<Track[]>(`/tracks/uploader/${uploaderId}`),

  getTracksByUniversity: (domain: string): Promise<Track[]> => 
    apiClient.get<Track[]>(`/tracks/university/${domain}`),

  searchTracks: (query: string): Promise<Track[]> => 
    apiClient.get<Track[]>(`/tracks/search?q=${encodeURIComponent(query)}`),

  getPopularTracks: (limit: number = 10): Promise<Track[]> => 
    apiClient.get<Track[]>(`/tracks/popular?limit=${limit}`),

  getRecentTracks: (limit: number = 10): Promise<Track[]> => 
    apiClient.get<Track[]>(`/tracks/recent?limit=${limit}`),

  getTopTracks: (limit: number = 10): Promise<Track[]> => 
    apiClient.get<Track[]>(`/tracks/top?limit=${limit}`),

  getAllGenres: (): Promise<string[]> => 
    apiClient.get<string[]>('/tracks/genres'),

  createTrack: (track: Omit<Track, 'id'>): Promise<Track> => 
    apiClient.post<Track>('/tracks', track),

  updateTrack: (id: string, track: Partial<Track>): Promise<Track> => 
    apiClient.put<Track>(`/tracks/${id}`, track),

  deleteTrack: (id: string): Promise<void> => 
    apiClient.delete<void>(`/tracks/${id}`),

  incrementPlayCount: (id: string): Promise<Track> => 
    apiClient.post<Track>(`/tracks/${id}/play`, {}),
};

// Playlist API Service
export const playlistService = {
  getAllPlaylists: (): Promise<Playlist[]> => 
    apiClient.get<Playlist[]>('/playlists'),

  getPlaylistById: (id: string): Promise<Playlist> => 
    apiClient.get<Playlist>(`/playlists/${id}`),

  getPlaylistsByCategory: (category: string): Promise<Playlist[]> => 
    apiClient.get<Playlist[]>(`/playlists/category/${category}`),

  getPlaylistsByCreator: (creatorId: string): Promise<Playlist[]> => 
    apiClient.get<Playlist[]>(`/playlists/creator/${creatorId}`),

  getPlaylistsByUniversity: (domain: string): Promise<Playlist[]> => 
    apiClient.get<Playlist[]>(`/playlists/university/${domain}`),

  searchPlaylists: (query: string): Promise<Playlist[]> => 
    apiClient.get<Playlist[]>(`/playlists/search?q=${encodeURIComponent(query)}`),

  getPlaylistsWithTrack: (trackId: string): Promise<Playlist[]> => 
    apiClient.get<Playlist[]>(`/playlists/track/${trackId}`),

  getPlaylistsByTrackCount: (minCount: number, maxCount?: number): Promise<Playlist[]> => {
    const params = maxCount ? `min=${minCount}&max=${maxCount}` : `min=${minCount}`;
    return apiClient.get<Playlist[]>(`/playlists/track-count?${params}`);
  },

  createPlaylist: (playlist: Omit<Playlist, 'id'>): Promise<Playlist> => 
    apiClient.post<Playlist>('/playlists', playlist),

  updatePlaylist: (id: string, playlist: Partial<Playlist>): Promise<Playlist> => 
    apiClient.put<Playlist>(`/playlists/${id}`, playlist),

  deletePlaylist: (id: string): Promise<void> => 
    apiClient.delete<void>(`/playlists/${id}`),

  addTrackToPlaylist: (playlistId: string, trackId: string): Promise<Playlist> => 
    apiClient.post<Playlist>(`/playlists/${playlistId}/tracks/${trackId}`, {}),

  removeTrackFromPlaylist: (playlistId: string, trackId: string): Promise<Playlist> => 
    apiClient.delete<Playlist>(`/playlists/${playlistId}/tracks/${trackId}`),

  // Recently played / listening history endpoints
  getRecentlyPlayed: (userId: string, limit: number = 20): Promise<any[]> => 
    apiClient.get<any[]>(`/listening-history/user/${userId}/recent?limit=${limit}`),

  getRecentlyPlayedTracks: (userId: string, limit: number = 20): Promise<Track[]> => 
    apiClient.get<Track[]>(`/listening-history/user/${userId}/recent-tracks?limit=${limit}`),

  recordListeningHistory: (userId: string, trackId: string, playDuration?: number, completionPercentage?: number): Promise<any> => 
    apiClient.post<any>('/listening-history/record', {
      userId,
      trackId,
      playDuration,
      completionPercentage
    }),

  recordSimpleListeningHistory: (userId: string, trackId: string): Promise<any> => 
    apiClient.post<any>('/listening-history/record-simple', {
      userId,
      trackId
    }),

  getTotalListeningTime: (userId: string): Promise<{totalListeningTime: number}> => 
    apiClient.get<{totalListeningTime: number}>(`/listening-history/user/${userId}/total-time`),

  hasUserPlayedTrack: (userId: string, trackId: string): Promise<{hasPlayed: boolean}> => 
    apiClient.get<{hasPlayed: boolean}>(`/listening-history/user/${userId}/has-played/${trackId}`),
};

// Listening Room API Service
export interface ListeningRoom {
  id: string;
  name: string;
  description: string;
  host: User;
  currentTrack?: Track;
  isPlaying: boolean;
  currentPosition: number;
  participants: User[];
  queue: QueueItem[];
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QueueItem {
  id: string;
  track: Track;
  addedBy: string;
  voteCount: number;
  queueOrder: number;
  hasUserVoted: boolean;
}

export const listeningRoomService = {
  getActiveRooms: (): Promise<ListeningRoom[]> => 
    apiClient.get<ListeningRoom[]>('/listening-rooms/active'),

  getRoomById: (id: string): Promise<ListeningRoom> => 
    apiClient.get<ListeningRoom>(`/listening-rooms/${id}`),

  getRoomsByHost: (hostId: string): Promise<ListeningRoom[]> => 
    apiClient.get<ListeningRoom[]>(`/listening-rooms/host/${hostId}`),

  getRoomsByParticipant: (participantId: string): Promise<ListeningRoom[]> => 
    apiClient.get<ListeningRoom[]>(`/listening-rooms/participant/${participantId}`),

  getRoomsByUniversity: (domain: string): Promise<ListeningRoom[]> => 
    apiClient.get<ListeningRoom[]>(`/listening-rooms/university/${domain}`),

  searchActiveRooms: (query: string): Promise<ListeningRoom[]> => 
    apiClient.get<ListeningRoom[]>(`/listening-rooms/search?q=${encodeURIComponent(query)}`),

  getPopularRooms: (limit: number = 10): Promise<ListeningRoom[]> => 
    apiClient.get<ListeningRoom[]>(`/listening-rooms/popular?limit=${limit}`),

  createRoom: (room: Omit<ListeningRoom, 'id' | 'participants' | 'queue' | 'participantCount' | 'createdAt' | 'updatedAt'>): Promise<ListeningRoom> => 
    apiClient.post<ListeningRoom>('/listening-rooms', room),

  updateRoom: (id: string, room: Partial<ListeningRoom>): Promise<ListeningRoom> => 
    apiClient.put<ListeningRoom>(`/listening-rooms/${id}`, room),

  deleteRoom: (id: string): Promise<void> => 
    apiClient.delete<void>(`/listening-rooms/${id}`),

  joinRoom: (roomId: string, userId: string): Promise<ListeningRoom> => 
    apiClient.post<ListeningRoom>(`/listening-rooms/${roomId}/join`, { userId }),

  leaveRoom: (roomId: string, userId: string): Promise<ListeningRoom> => 
    apiClient.post<ListeningRoom>(`/listening-rooms/${roomId}/leave`, { userId }),

  updatePlaybackState: (roomId: string, isPlaying: boolean, position: number): Promise<ListeningRoom> => 
    apiClient.post<ListeningRoom>(`/listening-rooms/${roomId}/playback`, { isPlaying, position }),

  addTrackToQueue: (roomId: string, trackId: string, userId: string): Promise<QueueItem> => 
    apiClient.post<QueueItem>(`/listening-rooms/${roomId}/queue`, { trackId, userId }),
};

// Queue Voting API Service
export const queueVotingService = {
  voteForTrack: (queueItemId: string, userId: string, roomId?: string): Promise<QueueItem> => 
    apiClient.post<QueueItem>(`/queue/${queueItemId}/vote`, { userId, roomId }),

  removeVoteForTrack: (queueItemId: string, userId: string, roomId?: string): Promise<QueueItem> => 
    apiClient.delete<QueueItem>(`/queue/${queueItemId}/vote`),

  getVoteStatus: (queueItemId: string, userId: string): Promise<{ hasVoted: boolean; voteCount: number }> => 
    apiClient.get<{ hasVoted: boolean; voteCount: number }>(`/queue/${queueItemId}/vote-status?userId=${userId}`),
};

// Authentication API Service
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
  expiresAt?: string;
}

export const authService = {
  login: (credentials: LoginRequest): Promise<AuthResponse> => 
    apiClient.post<AuthResponse>('/auth/login', credentials),

  register: (userData: RegisterRequest): Promise<AuthResponse> => 
    apiClient.post<AuthResponse>('/auth/register', userData),

  sendVerificationCode: (email: string): Promise<{ message: string }> => 
    apiClient.post<{ message: string }>('/auth/send-verification-code', { email }),

  verifyCode: (email: string, code: string): Promise<{ message: string; verified: boolean }> => 
    apiClient.post<{ message: string; verified: boolean }>('/auth/verify-code', { email, code }),

  completeRegistration: (email: string, name: string, password: string, confirmPassword: string): Promise<AuthResponse> => 
    apiClient.post<AuthResponse>('/auth/complete-registration', { email, name, password, confirmPassword }),

  logout: (): Promise<{ message: string }> => 
    apiClient.post<{ message: string }>('/auth/logout'),

  validateToken: (): Promise<{ valid: boolean; user?: User }> => 
    apiClient.get<{ valid: boolean; user?: User }>('/auth/validate'),

  refreshToken: (): Promise<AuthResponse> => 
    apiClient.post<AuthResponse>('/auth/refresh'),
};

export const apiService = {
  user: userService,
  track: trackService,
  playlist: playlistService,
  listeningRoom: listeningRoomService,
  queueVoting: queueVotingService,
  auth: authService,
  recordListeningHistory: (userId: string, trackId: number): Promise<void> => 
    apiClient.post<void>('/listening-history', { userId, trackId }),
  getRecentlyPlayedTracks: (userId: string): Promise<Track[]> => 
    apiClient.get<Track[]>(`/listening-history/${userId}/recent`),
};

export default apiService;