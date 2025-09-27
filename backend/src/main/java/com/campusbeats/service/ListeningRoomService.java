package com.campusbeats.service;

import com.campusbeats.dto.ListeningRoomDTO;
import com.campusbeats.dto.QueueItemDTO;
import com.campusbeats.dto.UserDTO;
import com.campusbeats.dto.TrackDTO;
import com.campusbeats.entity.ListeningRoom;
import com.campusbeats.entity.RoomQueue;
import com.campusbeats.entity.User;
import com.campusbeats.entity.Track;
import com.campusbeats.repository.ListeningRoomRepository;
import com.campusbeats.repository.RoomQueueRepository;
import com.campusbeats.repository.UserRepository;
import com.campusbeats.repository.TrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ListeningRoomService {
    
    @Autowired
    private ListeningRoomRepository listeningRoomRepository;
    
    @Autowired
    private RoomQueueRepository roomQueueRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TrackRepository trackRepository;
    
    public List<ListeningRoomDTO> getAllActiveRooms() {
        return listeningRoomRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<ListeningRoomDTO> getRoomById(String id) {
        Long idLong = Long.parseLong(id);
        return listeningRoomRepository.findById(idLong)
                .map(this::convertToDTO);
    }
    
    public List<ListeningRoomDTO> getRoomsByHost(String hostId) {
        Long hostIdLong = Long.parseLong(hostId);
        Optional<User> hostOpt = userRepository.findById(hostIdLong);
        if (hostOpt.isPresent()) {
            return listeningRoomRepository.findByHostAndIsActiveTrue(hostOpt.get()).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
    
    public List<ListeningRoomDTO> searchActiveRooms(String query) {
        return listeningRoomRepository.searchActiveRooms(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ListeningRoomDTO> getRoomsByParticipant(String userId) {
        Long userIdLong = Long.parseLong(userId);
        return listeningRoomRepository.findRoomsByParticipant(userIdLong).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ListeningRoomDTO> getRoomsByUniversityDomain(String domain) {
        return listeningRoomRepository.findByUniversityDomain(domain).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ListeningRoomDTO> getMostPopularRooms(int limit) {
        return listeningRoomRepository.findMostPopularRooms().stream()
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ListeningRoomDTO createRoom(ListeningRoom room) {
        room.setCreatedAt(LocalDateTime.now());
        room.setUpdatedAt(LocalDateTime.now());
        room.setIsActive(true);
        room.setIsPlaying(false);
        room.setCurrentPosition(0L);
        
        ListeningRoom savedRoom = listeningRoomRepository.save(room);
        return convertToDTO(savedRoom);
    }
    
    public Optional<ListeningRoomDTO> updateRoom(String id, ListeningRoom roomDetails) {
        Long idLong = Long.parseLong(id);
        return listeningRoomRepository.findById(idLong)
                .map(room -> {
                    room.setName(roomDetails.getName());
                    room.setDescription(roomDetails.getDescription());
                    room.setMaxParticipants(roomDetails.getMaxParticipants());
                    room.setUpdatedAt(LocalDateTime.now());
                    return convertToDTO(listeningRoomRepository.save(room));
                });
    }
    
    public boolean deleteRoom(String id) {
        Long idLong = Long.parseLong(id);
        return listeningRoomRepository.findById(idLong)
                .map(room -> {
                    room.setIsActive(false);
                    room.setUpdatedAt(LocalDateTime.now());
                    listeningRoomRepository.save(room);
                    return true;
                })
                .orElse(false);
    }
    
    public Optional<ListeningRoomDTO> joinRoom(String roomId, String userId) {
        Long roomIdLong = Long.parseLong(roomId);
        Long userIdLong = Long.parseLong(userId);
        Optional<ListeningRoom> roomOpt = listeningRoomRepository.findById(roomIdLong);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (roomOpt.isPresent() && userOpt.isPresent()) {
            ListeningRoom room = roomOpt.get();
            User user = userOpt.get();
            
            if (room.getParticipants().size() < room.getMaxParticipants()) {
                room.addParticipant(user);
                room.setUpdatedAt(LocalDateTime.now());
                return Optional.of(convertToDTO(listeningRoomRepository.save(room)));
            }
        }
        
        return Optional.empty();
    }
    
    public Optional<ListeningRoomDTO> leaveRoom(String roomId, String userId) {
        Long roomIdLong = Long.parseLong(roomId);
        Long userIdLong = Long.parseLong(userId);
        Optional<ListeningRoom> roomOpt = listeningRoomRepository.findById(roomIdLong);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (roomOpt.isPresent() && userOpt.isPresent()) {
            ListeningRoom room = roomOpt.get();
            User user = userOpt.get();
            
            room.removeParticipant(user);
            room.setUpdatedAt(LocalDateTime.now());
            
            return Optional.of(convertToDTO(listeningRoomRepository.save(room)));
        }
        
        return Optional.empty();
    }
    
    public Optional<ListeningRoomDTO> updatePlaybackState(String roomId, String trackId, Long position, Boolean isPlaying) {
        Long roomIdLong = Long.parseLong(roomId);
        Optional<ListeningRoom> roomOpt = listeningRoomRepository.findById(roomIdLong);
        
        if (roomOpt.isPresent()) {
            ListeningRoom room = roomOpt.get();
            
            if (trackId != null) {
                Long trackIdLong = Long.parseLong(trackId);
                trackRepository.findById(trackIdLong).ifPresent(room::setCurrentTrack);
            }
            
            if (position != null) {
                room.setCurrentPosition(position);
            }
            
            if (isPlaying != null) {
                room.setIsPlaying(isPlaying);
            }
            
            room.setUpdatedAt(LocalDateTime.now());
            return Optional.of(convertToDTO(listeningRoomRepository.save(room)));
        }
        
        return Optional.empty();
    }
    
    public Optional<QueueItemDTO> addTrackToQueue(String roomId, String trackId, String userId) {
        Long roomIdLong = Long.parseLong(roomId);
        Long trackIdLong = Long.parseLong(trackId);
        Long userIdLong = Long.parseLong(userId);
        Optional<ListeningRoom> roomOpt = listeningRoomRepository.findById(roomIdLong);
        Optional<Track> trackOpt = trackRepository.findById(trackIdLong);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (roomOpt.isPresent() && trackOpt.isPresent() && userOpt.isPresent()) {
            ListeningRoom room = roomOpt.get();
            Track track = trackOpt.get();
            User user = userOpt.get();
            
            // Get next queue order
            Optional<Integer> maxOrderOpt = roomQueueRepository.findMaxQueueOrderByRoom(roomIdLong);
            int nextOrder = maxOrderOpt.orElse(0) + 1;

            RoomQueue queueItem = new RoomQueue();
            queueItem.setListeningRoom(room);
            queueItem.setTrack(track);
            queueItem.setAddedBy(user);
            queueItem.setQueueOrder(nextOrder);
            queueItem.setVoteCount(0);
            
            RoomQueue savedQueueItem = roomQueueRepository.save(queueItem);
            return Optional.of(convertQueueToDTO(savedQueueItem, userId));
        }
        
        return Optional.empty();
    }
    
    public List<QueueItemDTO> getRoomQueue(String roomId, String userId) {
        Long roomIdLong = Long.parseLong(roomId);
        return roomQueueRepository.findQueueByRoomOrderByVotes(roomIdLong).stream()
                .map(queueItem -> convertQueueToDTO(queueItem, userId))
                .collect(Collectors.toList());
    }
    
    private ListeningRoomDTO convertToDTO(ListeningRoom room) {
        ListeningRoomDTO dto = new ListeningRoomDTO();
        dto.setId(room.getId().toString());
        dto.setName(room.getName());
        dto.setDescription(room.getDescription());
        dto.setCurrentPosition(room.getCurrentPosition());
        dto.setIsPlaying(room.getIsPlaying());
        dto.setParticipantCount(room.getParticipants().size());
        dto.setMaxParticipants(room.getMaxParticipants());
        
        if (room.getHost() != null) {
            dto.setHost(room.getHost().getName());
        }
        
        if (room.getCurrentTrack() != null) {
            Track track = room.getCurrentTrack();
            TrackDTO trackDTO = new TrackDTO();
            trackDTO.setId(track.getId().toString());
            trackDTO.setTitle(track.getTitle());
            trackDTO.setArtist(track.getArtist());
            trackDTO.setCoverArt(track.getCoverArt());
            trackDTO.setUrl(track.getUrl());
            trackDTO.setDuration(track.getDuration());
            trackDTO.setGenre(track.getGenre());
            dto.setCurrentTrack(trackDTO);
        }
        
        // Convert participants to DTOs
        if (room.getParticipants() != null) {
            List<UserDTO> participantDTOs = room.getParticipants().stream()
                    .map(user -> {
                        UserDTO userDTO = new UserDTO();
                        userDTO.setId(user.getId().toString());
                        userDTO.setName(user.getName());
                        userDTO.setUniversityDomain(user.getUniversityDomain());
                        userDTO.setPoints(user.getPoints());
                        return userDTO;
                    })
                    .collect(Collectors.toList());
            dto.setParticipants(participantDTOs);
        }
        
        return dto;
    }
    
    private QueueItemDTO convertQueueToDTO(RoomQueue queueItem, String currentUserId) {
        QueueItemDTO dto = new QueueItemDTO();
        dto.setId(queueItem.getId().toString());
        dto.setVoteCount(queueItem.getVoteCount());
        dto.setQueueOrder(queueItem.getQueueOrder());
        
        if (queueItem.getAddedBy() != null) {
            dto.setAddedBy(queueItem.getAddedBy().getName());
        }
        
        if (queueItem.getTrack() != null) {
            Track track = queueItem.getTrack();
            TrackDTO trackDTO = new TrackDTO();
            trackDTO.setId(track.getId().toString());
            trackDTO.setTitle(track.getTitle());
            trackDTO.setArtist(track.getArtist());
            trackDTO.setCoverArt(track.getCoverArt());
            trackDTO.setUrl(track.getUrl());
            trackDTO.setDuration(track.getDuration());
            trackDTO.setGenre(track.getGenre());
            dto.setTrack(trackDTO);
        }
        
        // Check if current user has voted
        if (currentUserId != null && queueItem.getVoters() != null) {
            Long currentUserIdLong = Long.parseLong(currentUserId);
            boolean hasVoted = queueItem.getVoters().stream()
                    .anyMatch(voter -> voter.getId().equals(currentUserIdLong));
            dto.setHasUserVoted(hasVoted);
        }
        
        return dto;
    }
}