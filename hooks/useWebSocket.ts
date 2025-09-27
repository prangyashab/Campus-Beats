import { useState, useEffect, useCallback, useRef } from 'react';
import webSocketService, { 
  WebSocketEventType, 
  EventCallback, 
  PlaybackUpdate, 
  ParticipantUpdate, 
  QueueUpdate, 
  VoteUpdate, 
  ChatMessage,
  PlaylistUpdate 
} from '../services/websocketService';

interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  reconnectAttempts: number;
}

// Main WebSocket hook
export function useWebSocket(userId?: string) {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    reconnectAttempts: 0,
  });

  const isInitialized = useRef(false);

  const connect = useCallback(async () => {
    if (state.connecting || state.connected) return;

    setState(prev => ({ ...prev, connecting: true, error: null }));
    
    try {
      await webSocketService.connect(userId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        connecting: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
    }
  }, [userId, state.connecting, state.connected]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Listen for connection status changes
    const handleConnectionStatus = (data: any) => {
      setState(prev => ({
        ...prev,
        connected: data.connected,
        connecting: false,
        error: data.error || null,
        reconnectAttempts: data.reconnectAttempts || 0,
      }));
    };

    webSocketService.on('connection-status', handleConnectionStatus);

    // Auto-connect if userId is provided
    if (userId) {
      connect();
    }

    return () => {
      webSocketService.off('connection-status', handleConnectionStatus);
      disconnect();
    };
  }, [userId, connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    isConnected: state.connected,
  };
}

// Hook for listening room functionality
export function useListeningRoom(roomId: string | null, userId?: string) {
  const [playbackState, setPlaybackState] = useState<PlaybackUpdate | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [votes, setVotes] = useState<Map<string, number>>(new Map());

  const { connected } = useWebSocket(userId);

  // Subscribe to room when connected and roomId is available
  useEffect(() => {
    if (!connected || !roomId) return;

    webSocketService.subscribeToRoom(roomId);

    return () => {
      if (roomId) {
        webSocketService.unsubscribeFromRoom(roomId);
      }
    };
  }, [connected, roomId]);

  // Set up event listeners
  useEffect(() => {
    if (!connected || !roomId) return;

    const handlePlaybackUpdate = (data: PlaybackUpdate) => {
      if (data.roomId === roomId) {
        setPlaybackState(data);
      }
    };

    const handleParticipantUpdate = (data: ParticipantUpdate) => {
      if (data.roomId === roomId) {
        setParticipants(prev => {
          if (data.type === 'PARTICIPANT_JOINED') {
            return [...prev.filter(p => p.id !== data.participant.id), data.participant];
          } else if (data.type === 'PARTICIPANT_LEFT') {
            return prev.filter(p => p.id !== data.participant.id);
          }
          return prev;
        });
      }
    };

    const handleQueueUpdate = (data: QueueUpdate) => {
      if (data.roomId === roomId) {
        setQueue(data.queue);
      }
    };

    const handleVoteUpdate = (data: VoteUpdate) => {
      setVotes(prev => {
        const newVotes = new Map(prev);
        newVotes.set(data.queueItemId, data.voteCount);
        return newVotes;
      });
    };

    const handleChatMessage = (data: ChatMessage) => {
      if (data.roomId === roomId) {
        setChatMessages(prev => [...prev, data]);
      }
    };

    webSocketService.on('playback-update', handlePlaybackUpdate);
    webSocketService.on('participant-update', handleParticipantUpdate);
    webSocketService.on('queue-update', handleQueueUpdate);
    webSocketService.on('vote-update', handleVoteUpdate);
    webSocketService.on('chat-message', handleChatMessage);

    return () => {
      webSocketService.off('playback-update', handlePlaybackUpdate);
      webSocketService.off('participant-update', handleParticipantUpdate);
      webSocketService.off('queue-update', handleQueueUpdate);
      webSocketService.off('vote-update', handleVoteUpdate);
      webSocketService.off('chat-message', handleChatMessage);
    };
  }, [connected, roomId]);

  // Room actions
  const joinRoom = useCallback(() => {
    if (roomId && userId) {
      webSocketService.joinRoom(roomId, userId);
    }
  }, [roomId, userId]);

  const leaveRoom = useCallback(() => {
    if (roomId && userId) {
      webSocketService.leaveRoom(roomId, userId);
    }
  }, [roomId, userId]);

  const updatePlayback = useCallback((isPlaying: boolean, position: number) => {
    if (roomId) {
      webSocketService.updatePlayback(roomId, isPlaying, position);
    }
  }, [roomId]);

  const addToQueue = useCallback((trackId: string) => {
    if (roomId && userId) {
      webSocketService.addToQueue(roomId, trackId, userId);
    }
  }, [roomId, userId]);

  const sendChatMessage = useCallback((message: string) => {
    if (roomId && userId) {
      webSocketService.sendChatMessage(roomId, message, userId);
    }
  }, [roomId, userId]);

  const syncPlayback = useCallback(() => {
    if (roomId && userId) {
      webSocketService.syncPlayback(roomId, userId);
    }
  }, [roomId, userId]);

  return {
    playbackState,
    participants,
    queue,
    chatMessages,
    votes,
    joinRoom,
    leaveRoom,
    updatePlayback,
    addToQueue,
    sendChatMessage,
    syncPlayback,
    connected,
  };
}

// Hook for real-time playlist updates
export function usePlaylistUpdates() {
  const [playlistUpdates, setPlaylistUpdates] = useState<PlaylistUpdate[]>([]);
  const { connected } = useWebSocket();

  useEffect(() => {
    if (!connected) return;

    // Subscribe to playlist updates
    webSocketService.subscribeToPlaylists();

    const handlePlaylistUpdate = (data: PlaylistUpdate) => {
      setPlaylistUpdates(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 updates
    };

    webSocketService.on('playlist-update', handlePlaylistUpdate);

    return () => {
      webSocketService.off('playlist-update', handlePlaylistUpdate);
    };
  }, [connected]);

  const clearUpdates = useCallback(() => {
    setPlaylistUpdates([]);
  }, []);

  return {
    playlistUpdates,
    clearUpdates,
    connected,
  };
}

// Hook for real-time notifications
export function useRealTimeNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { connected } = useWebSocket(userId);

  useEffect(() => {
    if (!connected || !userId) return;

    // Subscribe to user-specific notifications
    // This would require additional backend support
    // For now, we'll just track general events

    const handleParticipantUpdate = (data: ParticipantUpdate) => {
      if (data.participant.id !== userId) {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'participant',
          message: `${data.participant.name} ${data.type === 'PARTICIPANT_JOINED' ? 'joined' : 'left'} a room`,
          timestamp: data.timestamp,
        }]);
      }
    };

    const handleChatMessage = (data: ChatMessage) => {
      if (data.sender.id !== userId) {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'chat',
          message: `New message from ${data.sender.name}`,
          timestamp: data.timestamp,
        }]);
      }
    };

    webSocketService.on('participant-update', handleParticipantUpdate);
    webSocketService.on('chat-message', handleChatMessage);

    return () => {
      webSocketService.off('participant-update', handleParticipantUpdate);
      webSocketService.off('chat-message', handleChatMessage);
    };
  }, [connected, userId]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    clearNotifications,
    removeNotification,
  };
}

// Hook for WebSocket event listening
export function useWebSocketEvent<T = any>(
  event: WebSocketEventType,
  callback: (data: T) => void,
  dependencies: any[] = []
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = (data: T) => {
      callbackRef.current(data);
    };

    webSocketService.on(event, handler);

    return () => {
      webSocketService.off(event, handler);
    };
  }, [event, ...dependencies]);
}

// Hook for connection status
export function useWebSocketStatus() {
  const [status, setStatus] = useState(webSocketService.getConnectionStatus());

  useEffect(() => {
    const handleStatusChange = (data: any) => {
      setStatus({
        connected: data.connected,
        reconnectAttempts: data.reconnectAttempts || 0,
      });
    };

    webSocketService.on('connection-status', handleStatusChange);

    return () => {
      webSocketService.off('connection-status', handleStatusChange);
    };
  }, []);

  return status;
}