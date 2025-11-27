package com.campusbeats.service;

import com.campusbeats.dto.PlaylistDTO;
import com.campusbeats.dto.TrackDTO;
import com.campusbeats.entity.Playlist;
import com.campusbeats.entity.Track;
import com.campusbeats.entity.PlaylistCategory;
import com.campusbeats.repository.PlaylistRepository;
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
public class PlaylistService {
    
    @Autowired
    private PlaylistRepository playlistRepository;
    
    @Autowired
    private TrackRepository trackRepository;
    
    
    @Autowired
    private UserRepository userRepository;
    
    public List<PlaylistDTO> getAllPlaylists() {
        return playlistRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<PlaylistDTO> getPlaylistById(String id) {
        Long idLong = Long.parseLong(id);
        return playlistRepository.findById(idLong)
                .map(this::convertToDTO);
    }
    
    public List<PlaylistDTO> getPublicPlaylists() {
        return playlistRepository.findByIsPublicTrueAndIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PlaylistDTO> getPlaylistsByCategory(PlaylistCategory category) {
        return playlistRepository.findByCategoryAndIsPublicTrueAndIsActiveTrueOrderByCreatedAtDesc(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PlaylistDTO> getPlaylistsByCreator(String creatorId) {
        Long creatorIdLong = Long.parseLong(creatorId);
        Optional<com.campusbeats.entity.User> creatorOpt = userRepository.findById(creatorIdLong);
        if (creatorOpt.isPresent()) {
            return playlistRepository.findByCreatorAndIsActiveTrue(creatorOpt.get()).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
    
    public List<PlaylistDTO> searchPlaylists(String query) {
        return playlistRepository.searchPublicPlaylists(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PlaylistDTO> getPlaylistsByUniversityDomain(String domain) {
        return playlistRepository.findByUniversityDomain(domain).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PlaylistDTO> getPlaylistsContainingTrack(String trackId) {
        Long trackIdLong = Long.parseLong(trackId);
        return playlistRepository.findPlaylistsContainingTrack(trackIdLong).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PlaylistDTO> getPlaylistsByTrackCount(int minTracks, int maxTracks) {
        return playlistRepository.findPlaylistsOrderByTrackCount().stream()
                .filter(p -> p.getTracks().size() >= minTracks && p.getTracks().size() <= maxTracks)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public PlaylistDTO createPlaylist(Playlist playlist) {
        playlist.setCreatedAt(LocalDateTime.now());
        playlist.setUpdatedAt(LocalDateTime.now());
        
        Playlist savedPlaylist = playlistRepository.save(playlist);
        return convertToDTO(savedPlaylist);
    }
    
    public Optional<PlaylistDTO> updatePlaylist(String id, Playlist playlistDetails) {
        Long idLong = Long.parseLong(id);
        return playlistRepository.findById(idLong)
                .map(playlist -> {
                    playlist.setName(playlistDetails.getName());
                    playlist.setDescription(playlistDetails.getDescription());
                    playlist.setCoverArt(playlistDetails.getCoverArt());
                    playlist.setCategory(playlistDetails.getCategory());
                    playlist.setIsPublic(playlistDetails.getIsPublic());
                    playlist.setUpdatedAt(LocalDateTime.now());
                    return convertToDTO(playlistRepository.save(playlist));
                });
    }
    
    public boolean deletePlaylist(String id) {
        Long idLong = Long.parseLong(id);
        if (playlistRepository.existsById(idLong)) {
            playlistRepository.deleteById(idLong);
            return true;
        }
        return false;
    }
    
    public Optional<PlaylistDTO> addTrackToPlaylist(String playlistId, String trackId) {
        Long playlistIdLong = Long.parseLong(playlistId);
        Long trackIdLong = Long.parseLong(trackId);
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistIdLong);
        Optional<Track> trackOpt = trackRepository.findById(trackIdLong);
        
        if (playlistOpt.isPresent() && trackOpt.isPresent()) {
            Playlist playlist = playlistOpt.get();
            Track track = trackOpt.get();
            
            playlist.addTrack(track);
            playlist.setUpdatedAt(LocalDateTime.now());
            
            return Optional.of(convertToDTO(playlistRepository.save(playlist)));
        }
        
        return Optional.empty();
    }
    
    public Optional<PlaylistDTO> removeTrackFromPlaylist(String playlistId, String trackId) {
        Long playlistIdLong = Long.parseLong(playlistId);
        Long trackIdLong = Long.parseLong(trackId);
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistIdLong);
        Optional<Track> trackOpt = trackRepository.findById(trackIdLong);
        
        if (playlistOpt.isPresent() && trackOpt.isPresent()) {
            Playlist playlist = playlistOpt.get();
            Track track = trackOpt.get();
            
            playlist.removeTrack(track);
            playlist.setUpdatedAt(LocalDateTime.now());
            
            return Optional.of(convertToDTO(playlistRepository.save(playlist)));
        }
        
        return Optional.empty();
    }
    
    private PlaylistDTO convertToDTO(Playlist playlist) {
        PlaylistDTO dto = new PlaylistDTO();
        dto.setId(playlist.getId().toString());
        dto.setName(playlist.getName());
        dto.setDescription(playlist.getDescription());
        dto.setCoverArt(playlist.getCoverArt());
        dto.setCategory(playlist.getCategory().name().toLowerCase());
        dto.setTrackCount(playlist.getTrackCount());
        
        if (playlist.getCreator() != null) {
            dto.setCreator(playlist.getCreator().getName());
        }
        
        // Convert tracks to DTOs
        if (playlist.getTracks() != null) {
            List<TrackDTO> trackDTOs = playlist.getTracks().stream()
                    .map(track -> {
                        TrackDTO trackDTO = new TrackDTO();
                        trackDTO.setId(track.getId().toString());
                        trackDTO.setTitle(track.getTitle());
                        trackDTO.setArtist(track.getArtist());
                        trackDTO.setAlbum(track.getAlbum());
                        trackDTO.setCoverArt(track.getCoverArt());
                        trackDTO.setUrl(track.getUrl());
                        trackDTO.setDuration(track.getDuration());
                        trackDTO.setGenre(track.getGenre());
                        trackDTO.setPlayCount(track.getPlayCount());
                        if (track.getUploader() != null) {
                            trackDTO.setUploader(track.getUploader().getName());
                        }
                        return trackDTO;
                    })
                    .collect(Collectors.toList());
            dto.setTracks(trackDTOs);
        }
        
        return dto;
    }
}