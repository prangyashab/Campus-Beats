package com.campusbeats.repository;

import com.campusbeats.entity.Playlist;
import com.campusbeats.entity.PlaylistCategory;
import com.campusbeats.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    
    List<Playlist> findByIsPublicTrueAndIsActiveTrueOrderByCreatedAtDesc();
    
    List<Playlist> findByCategoryAndIsPublicTrueAndIsActiveTrueOrderByCreatedAtDesc(PlaylistCategory category);
    
    List<Playlist> findByCreatorAndIsActiveTrue(User creator);
    
    @Query("SELECT p FROM Playlist p WHERE p.name ILIKE %:query% AND p.isPublic = true AND p.isActive = true")
    List<Playlist> searchPublicPlaylists(@Param("query") String query);
    
    @Query("SELECT p FROM Playlist p WHERE p.creator.universityDomain = :domain AND p.isPublic = true AND p.isActive = true ORDER BY p.createdAt DESC")
    List<Playlist> findByUniversityDomain(@Param("domain") String domain);
    
    @Query("SELECT p FROM Playlist p JOIN p.tracks t WHERE t.id = :trackId AND p.isPublic = true AND p.isActive = true")
    List<Playlist> findPlaylistsContainingTrack(@Param("trackId") Long trackId);
    
    @Query("SELECT p FROM Playlist p WHERE p.isPublic = true AND p.isActive = true ORDER BY SIZE(p.tracks) DESC")
    List<Playlist> findPlaylistsOrderByTrackCount();
}