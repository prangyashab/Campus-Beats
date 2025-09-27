package com.campusbeats.repository;

import com.campusbeats.entity.Track;
import com.campusbeats.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {
    
    List<Track> findByIsActiveTrueOrderByCreatedAtDesc();
    
    List<Track> findByGenreAndIsActiveTrueOrderByPlayCountDesc(String genre);
    
    List<Track> findByUploaderAndIsActiveTrue(User uploader);
    
    @Query("SELECT t FROM Track t WHERE t.isActive = true ORDER BY t.playCount DESC")
    List<Track> findMostPopularTracks();
    
    @Query("SELECT t FROM Track t WHERE t.isActive = true ORDER BY t.createdAt DESC")
    List<Track> findLatestTracks();
    
    @Query("SELECT t FROM Track t WHERE (t.title ILIKE %:query% OR t.artist ILIKE %:query% OR t.genre ILIKE %:query%) AND t.isActive = true")
    List<Track> searchTracks(@Param("query") String query);
    
    @Query("SELECT t FROM Track t WHERE t.uploader.universityDomain = :domain AND t.isActive = true ORDER BY t.createdAt DESC")
    List<Track> findByUniversityDomain(@Param("domain") String domain);
    
    @Query("SELECT DISTINCT t.genre FROM Track t WHERE t.isActive = true ORDER BY t.genre")
    List<String> findAllGenres();
    
    @Query("SELECT t FROM Track t WHERE t.genre = :genre AND t.isActive = true ORDER BY t.playCount DESC LIMIT :limit")
    List<Track> findTopTracksByGenre(@Param("genre") String genre, @Param("limit") int limit);
}