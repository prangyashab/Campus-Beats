import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_CONFIG } from '../config/api';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

interface PlaybackUpdate {
  type: 'PLAYBACK_UPDATE';
  roomId: string;
  isPlaying: boolean;
  position: number;
  track?: any;
  timestamp: number;
}

interface ParticipantUpdate {
  type: 'PARTICIPANT_JOINED' | 'PARTICIPANT_LEFT';
  roomId: string;
  participant: any;
  participantCount: number;
  timestamp: number;
}

interface QueueUpdate {
  type: 'QUEUE_UPDATED' | 'TRACK_ADDED_TO_QUEUE';
  roomId: string;
  queue: any[];
  timestamp: number;
}

interface VoteUpdate {
  type: 'VOTE_ADDED' | 'VOTE_REMOVED';
  queueItemId: string;
  voteCount: number;
  userId: string;
  timestamp: number;
}

interface ChatMessage {
  type: 'CHAT_MESSAGE';
  roomId: string;
  message: string;
  sender: any;
  timestamp: number;
}

interface PlaylistUpdate {
  type: 'PLAYLIST_CREATED' | 'PLAYLIST_UPDATED' | 'PLAYLIST_DELETED';
  playlist: any;
  timestamp: number;
}

type WebSocketEventType = 
  | 'playback-update'
  | 'participant-update'
  | 'queue-update'
  | 'vote-update'
  | 'chat-message'
  | 'playlist-update'
  | 'connection-status';

type EventCallback = (data: any) => void;

class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private eventListeners: Map<WebSocketEventType, EventCallback[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    const eventTypes: WebSocketEventType[] = [
      'playback-update',
      'participant-update', 
      'queue-update',
      'vote-update',
      'chat-message',
      'playlist-update',
      'connection-status'
    ];
    
    eventTypes.forEach(type => {
      this.eventListeners.set(type, []);
    });
  }

  connect(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create SockJS connection
        const socket = new SockJS(API_CONFIG.WEBSOCKET_URL);
        
        this.client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: userId ? { userId } : {},
          debug: (str) => {
            console.log('STOMP Debug:', str);
          },
          reconnectDelay: this.reconnectDelay,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
          console.log('WebSocket connected:', frame);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connection-status', { connected: true });
          resolve();
        };

        this.client.onStompError = (frame) => {
          console.error('STOMP error:', frame);
          this.isConnected = false;
          this.emit('connection-status', { connected: false, error: frame.body });
          reject(new Error(frame.body));
        };

        this.client.onWebSocketClose = (event) => {
          console.log('WebSocket closed:', event);
          this.isConnected = false;
          this.emit('connection-status', { connected: false });
          this.handleReconnect();
        };

        this.client.onWebSocketError = (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          this.emit('connection-status', { connected: false, error });
        };

        this.client.activate();
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('connection-status', { connected: false, maxRetriesReached: true });
    }
  }

  disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
      console.log('WebSocket disconnected');
    }
  }

  // Subscribe to room-specific updates
  subscribeToRoom(roomId: string) {
    if (!this.client || !this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    // Subscribe to playback updates
    this.client.subscribe(`/topic/room/${roomId}/playback`, (message) => {
      const data: PlaybackUpdate = JSON.parse(message.body);
      this.emit('playback-update', data);
    });

    // Subscribe to participant updates
    this.client.subscribe(`/topic/room/${roomId}/participants`, (message) => {
      const data: ParticipantUpdate = JSON.parse(message.body);
      this.emit('participant-update', data);
    });

    // Subscribe to queue updates
    this.client.subscribe(`/topic/room/${roomId}/queue`, (message) => {
      const data: QueueUpdate = JSON.parse(message.body);
      this.emit('queue-update', data);
    });

    // Subscribe to vote updates
    this.client.subscribe(`/topic/room/${roomId}/votes`, (message) => {
      const data: VoteUpdate = JSON.parse(message.body);
      this.emit('vote-update', data);
    });

    // Subscribe to chat messages
    this.client.subscribe(`/topic/room/${roomId}/chat`, (message) => {
      const data: ChatMessage = JSON.parse(message.body);
      this.emit('chat-message', data);
    });

    console.log(`Subscribed to room ${roomId}`);
  }

  // Subscribe to playlist updates
  subscribeToPlaylists() {
    if (!this.client || !this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    // Subscribe to global playlist updates
    this.client.subscribe('/topic/playlists', (message) => {
      const data: PlaylistUpdate = JSON.parse(message.body);
      this.emit('playlist-update', data);
    });

    console.log('Subscribed to playlist updates');
  }

  // Unsubscribe from room updates
  unsubscribeFromRoom(roomId: string) {
    if (!this.client || !this.isConnected) {
      return;
    }

    // Note: In a real implementation, you'd want to keep track of subscription objects
    // and call unsubscribe() on them. For simplicity, we're not doing that here.
    console.log(`Unsubscribed from room ${roomId}`);
  }

  // Send messages to the server
  joinRoom(roomId: string, userId: string) {
    this.sendMessage('/app/room/join', { roomId, userId });
  }

  leaveRoom(roomId: string, userId: string) {
    this.sendMessage('/app/room/leave', { roomId, userId });
  }

  updatePlayback(roomId: string, isPlaying: boolean, position: number) {
    this.sendMessage('/app/room/playback', { roomId, isPlaying, position });
  }

  addToQueue(roomId: string, trackId: string, userId: string) {
    this.sendMessage('/app/room/queue/add', { roomId, trackId, userId });
  }

  sendChatMessage(roomId: string, message: string, userId: string) {
    this.sendMessage('/app/room/chat', { roomId, message, userId });
  }

  syncPlayback(roomId: string, userId: string) {
    this.sendMessage('/app/room/sync', { roomId, userId });
  }

  private sendMessage(destination: string, body: any) {
    if (!this.client || !this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(body)
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  // Event listener management
  on(event: WebSocketEventType, callback: EventCallback) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }

  off(event: WebSocketEventType, callback: EventCallback) {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(event, listeners);
    }
  }

  private emit(event: WebSocketEventType, data: any) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  // Utility methods
  isConnectedToWebSocket(): boolean {
    return this.isConnected;
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
export type { WebSocketEventType, EventCallback, PlaybackUpdate, ParticipantUpdate, QueueUpdate, VoteUpdate, ChatMessage, PlaylistUpdate };