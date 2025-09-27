package com.campusbeats.service;

import com.campusbeats.dto.QueueItemDTO;
import com.campusbeats.entity.RoomQueue;
import com.campusbeats.entity.User;
import com.campusbeats.repository.RoomQueueRepository;
import com.campusbeats.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class QueueVotingService {
    
    @Autowired
    private RoomQueueRepository roomQueueRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Optional<QueueItemDTO> voteForTrack(String queueItemId, String userId) {
        Long queueItemIdLong = Long.parseLong(queueItemId);
        Long userIdLong = Long.parseLong(userId);
        Optional<RoomQueue> queueItemOpt = roomQueueRepository.findById(queueItemIdLong);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (queueItemOpt.isPresent() && userOpt.isPresent()) {
            RoomQueue queueItem = queueItemOpt.get();
            User user = userOpt.get();
            
            // Check if user hasn't already voted
            if (!queueItem.hasUserVoted(user)) {
                queueItem.addVote(user);
                RoomQueue savedQueueItem = roomQueueRepository.save(queueItem);
                return Optional.of(convertToDTO(savedQueueItem, userId));
            }
        }
        
        return Optional.empty();
    }
    
    public Optional<QueueItemDTO> removeVoteForTrack(String queueItemId, String userId) {
        Long queueItemIdLong = Long.parseLong(queueItemId);
        Long userIdLong = Long.parseLong(userId);
        Optional<RoomQueue> queueItemOpt = roomQueueRepository.findById(queueItemIdLong);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (queueItemOpt.isPresent() && userOpt.isPresent()) {
            RoomQueue queueItem = queueItemOpt.get();
            User user = userOpt.get();
            
            // Check if user has voted
            if (queueItem.hasUserVoted(user)) {
                queueItem.removeVote(user);
                RoomQueue savedQueueItem = roomQueueRepository.save(queueItem);
                return Optional.of(convertToDTO(savedQueueItem, userId));
            }
        }
        
        return Optional.empty();
    }
    
    public boolean hasUserVoted(String queueItemId, String userId) {
        Long queueItemIdLong = Long.parseLong(queueItemId);
        Long userIdLong = Long.parseLong(userId);
        Optional<RoomQueue> queueItemOpt = roomQueueRepository.findById(queueItemIdLong);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (queueItemOpt.isPresent() && userOpt.isPresent()) {
            RoomQueue queueItem = queueItemOpt.get();
            User user = userOpt.get();
            return queueItem.hasUserVoted(user);
        }
        
        return false;
    }
    
    public int getVoteCount(String queueItemId) {
        Long queueItemIdLong = Long.parseLong(queueItemId);
        return roomQueueRepository.findById(queueItemIdLong)
                .map(RoomQueue::getVoteCount)
                .orElse(0);
    }
    
    private QueueItemDTO convertToDTO(RoomQueue queueItem, String currentUserId) {
        QueueItemDTO dto = new QueueItemDTO();
        dto.setId(queueItem.getId().toString());
        dto.setVoteCount(queueItem.getVoteCount());
        dto.setQueueOrder(queueItem.getQueueOrder());
        
        if (queueItem.getAddedBy() != null) {
            dto.setAddedBy(queueItem.getAddedBy().getName());
        }
        
        if (queueItem.getTrack() != null) {
            // Create a simple track DTO
            com.campusbeats.dto.TrackDTO trackDTO = new com.campusbeats.dto.TrackDTO();
            trackDTO.setId(queueItem.getTrack().getId().toString());
            trackDTO.setTitle(queueItem.getTrack().getTitle());
            trackDTO.setArtist(queueItem.getTrack().getArtist());
            trackDTO.setCoverArt(queueItem.getTrack().getCoverArt());
            trackDTO.setUrl(queueItem.getTrack().getUrl());
            trackDTO.setDuration(queueItem.getTrack().getDuration());
            trackDTO.setGenre(queueItem.getTrack().getGenre());
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