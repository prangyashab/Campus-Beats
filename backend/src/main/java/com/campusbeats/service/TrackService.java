package com.campusbeats.service;

import com.campusbeats.dto.TrackDTO;
import com.campusbeats.entity.Track;
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
public class TrackService {
    
    @Autowired
    private TrackRepository trackRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<TrackDTO> getAllTracks() {
        return trackRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<TrackDTO> getTrackById(String id) {
        Long idLong = Long.parseLong(id);
        return trackRepository.findById(idLong)
                .map(this::convertToDTO);
    }
    
    public List<TrackDTO> getActiveTracksByGenre(String genre) {
        return trackRepository.findByGenreAndIsActiveTrueOrderByPlayCountDesc(genre).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TrackDTO> getTracksByUploader(String uploaderId) {
        Long uploaderIdLong = Long.parseLong(uploaderId);
        Optional<com.campusbeats.entity.User> uploaderOpt = userRepository.findById(uploaderIdLong);
        if (uploaderOpt.isPresent()) {
            return trackRepository.findByUploaderAndIsActiveTrue(uploaderOpt.get()).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
    
    public List<TrackDTO> getPopularTracks(int limit) {
        return trackRepository.findMostPopularTracks().stream()
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TrackDTO> getRecentTracks(int limit) {
        return trackRepository.findLatestTracks().stream()
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TrackDTO> searchTracks(String query) {
        return trackRepository.searchTracks(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TrackDTO> getTracksByUniversityDomain(String domain) {
        return trackRepository.findByUniversityDomain(domain).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<String> getAllGenres() {
        return trackRepository.findAllGenres();
    }
    
    public List<TrackDTO> getTopTracksByGenre(String genre, int limit) {
        return trackRepository.findTopTracksByGenre(genre, limit).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TrackDTO createTrack(Track track) {
        track.setCreatedAt(LocalDateTime.now());
        track.setUpdatedAt(LocalDateTime.now());
        track.setIsActive(true);
        track.setPlayCount(0L);
        
        Track savedTrack = trackRepository.save(track);
        return convertToDTO(savedTrack);
    }
    
    public Track getTrackEntityById(String id) {
        Long idLong = Long.parseLong(id);
        return trackRepository.findById(idLong).orElse(null);
    }
    
    public TrackDTO updateTrack(String id, Track trackDetails) {
        Long idLong = Long.parseLong(id);
        Track track = trackRepository.findById(idLong).orElse(null);
        if (track != null) {
            if (trackDetails.getTitle() != null) track.setTitle(trackDetails.getTitle());
            if (trackDetails.getArtist() != null) track.setArtist(trackDetails.getArtist());
            if (trackDetails.getAlbum() != null) track.setAlbum(trackDetails.getAlbum());
            if (trackDetails.getGenre() != null) track.setGenre(trackDetails.getGenre());
            if (trackDetails.getCoverArt() != null) track.setCoverArt(trackDetails.getCoverArt());
            if (trackDetails.getUrl() != null) track.setUrl(trackDetails.getUrl());
            track.setUpdatedAt(LocalDateTime.now());
            return convertToDTO(trackRepository.save(track));
        }
        return null;
    }
    
    public boolean deleteTrack(String id) {
        Long idLong = Long.parseLong(id);
        return trackRepository.findById(idLong)
                .map(track -> {
                    track.setIsActive(false);
                    track.setUpdatedAt(LocalDateTime.now());
                    trackRepository.save(track);
                    return true;
                })
                .orElse(false);
    }
    
    public Optional<TrackDTO> incrementPlayCount(String id) {
        Long idLong = Long.parseLong(id);
        return trackRepository.findById(idLong)
                .map(track -> {
                    track.incrementPlayCount();
                    return convertToDTO(trackRepository.save(track));
                });
    }
    
    private TrackDTO convertToDTO(Track track) {
        TrackDTO dto = new TrackDTO();
        dto.setId(track.getId().toString());
        dto.setTitle(track.getTitle());
        dto.setArtist(track.getArtist());
        dto.setAlbum(track.getAlbum());
        dto.setCoverArt(track.getCoverArt());
        dto.setUrl(track.getUrl());
        dto.setDuration(track.getDuration());
        dto.setGenre(track.getGenre());
        dto.setPlayCount(track.getPlayCount());
        
        if (track.getUploader() != null) {
            dto.setUploader(track.getUploader().getName());
        }
        
        return dto;
    }
}