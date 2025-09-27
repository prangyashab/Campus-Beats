package com.campusbeats.service;

import com.campusbeats.dto.ListeningHistoryDTO;
import com.campusbeats.dto.TrackDTO;
import com.campusbeats.entity.ListeningHistory;
import com.campusbeats.entity.Track;
import com.campusbeats.entity.User;
import com.campusbeats.repository.ListeningHistoryRepository;
import com.campusbeats.repository.TrackRepository;
import com.campusbeats.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ListeningHistoryService {
    
    @Autowired
    private ListeningHistoryRepository listeningHistoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TrackRepository trackRepository;
    
    @Autowired
    private TrackService trackService;
    
    public List<ListeningHistoryDTO> getRecentlyPlayedByUser(String userId, int limit) {
        Long userIdLong = Long.parseLong(userId);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (userOpt.isPresent()) {
            List<ListeningHistory> histories = listeningHistoryRepository.findRecentlyPlayedByUserWithLimit(userOpt.get(), limit);
            return histories.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
    
    public List<TrackDTO> getRecentlyPlayedTracksOnly(String userId, int limit) {
        Long userIdLong = Long.parseLong(userId);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (userOpt.isPresent()) {
            List<ListeningHistory> histories = listeningHistoryRepository.findRecentlyPlayedByUserWithLimit(userOpt.get(), limit);
            return histories.stream()
                    .map(history -> convertTrackToDTO(history.getTrack()))
                    .distinct() // Remove duplicates
                    .collect(Collectors.toList());
        }
        return List.of();
    }
    
    public ListeningHistoryDTO recordListeningHistory(String userId, String trackId, Integer playDuration, Double completionPercentage) {
        Long userIdLong = Long.parseLong(userId);
        Long trackIdLong = Long.parseLong(trackId);
        
        Optional<User> userOpt = userRepository.findById(userIdLong);
        Optional<Track> trackOpt = trackRepository.findById(trackIdLong);
        
        if (userOpt.isPresent() && trackOpt.isPresent()) {
            ListeningHistory history = new ListeningHistory(
                userOpt.get(), 
                trackOpt.get(), 
                playDuration, 
                completionPercentage
            );
            
            ListeningHistory savedHistory = listeningHistoryRepository.save(history);
            return convertToDTO(savedHistory);
        }
        
        throw new RuntimeException("User or Track not found");
    }
    
    public ListeningHistoryDTO recordSimpleListeningHistory(String userId, String trackId) {
        return recordListeningHistory(userId, trackId, null, null);
    }
    
    public List<ListeningHistoryDTO> getListeningHistoryByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        Long userIdLong = Long.parseLong(userId);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (userOpt.isPresent()) {
            List<ListeningHistory> histories = listeningHistoryRepository.findByUserAndDateRange(userOpt.get(), startDate, endDate);
            return histories.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
    
    public Long getTotalListeningTime(String userId) {
        Long userIdLong = Long.parseLong(userId);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (userOpt.isPresent()) {
            return listeningHistoryRepository.getTotalListeningTimeByUser(userOpt.get());
        }
        return 0L;
    }
    
    public boolean hasUserPlayedTrack(String userId, String trackId) {
        Long userIdLong = Long.parseLong(userId);
        Long trackIdLong = Long.parseLong(trackId);
        Optional<User> userOpt = userRepository.findById(userIdLong);
        
        if (userOpt.isPresent()) {
            return listeningHistoryRepository.hasUserPlayedTrack(userOpt.get(), trackIdLong);
        }
        return false;
    }
    
    private ListeningHistoryDTO convertToDTO(ListeningHistory history) {
        TrackDTO trackDTO = convertTrackToDTO(history.getTrack());
        
        return new ListeningHistoryDTO(
            history.getId().toString(),
            history.getUser().getId().toString(),
            trackDTO,
            history.getPlayedAt(),
            history.getPlayDuration(),
            history.getCompletionPercentage()
        );
    }
    
    private TrackDTO convertTrackToDTO(Track track) {
        TrackDTO dto = new TrackDTO();
        dto.setId(track.getId().toString());
        dto.setTitle(track.getTitle());
        dto.setArtist(track.getArtist());
        dto.setAlbum(track.getAlbum());
        dto.setCoverArt(track.getCoverArt());
        dto.setUrl(track.getUrl());
        dto.setDuration(track.getDuration());
        dto.setGenre(track.getGenre());
        dto.setUploader(track.getUploader() != null ? track.getUploader().getName() : "Unknown");
        dto.setPlayCount(track.getPlayCount());
        // Note: TrackDTO doesn't have setLikes method, removing this line
        return dto;
    }
}