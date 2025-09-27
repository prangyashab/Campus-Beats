package com.campusbeats.repository;

import com.campusbeats.entity.ListeningHistory;
import com.campusbeats.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, Long> {
    
    // Get recently played tracks for a user (last 50 tracks)
    @Query("SELECT lh FROM ListeningHistory lh WHERE lh.user = :user ORDER BY lh.playedAt DESC")
    List<ListeningHistory> findRecentlyPlayedByUser(@Param("user") User user);
    
    // Get recently played tracks for a user with limit
    @Query("SELECT lh FROM ListeningHistory lh WHERE lh.user = :user ORDER BY lh.playedAt DESC LIMIT :limit")
    List<ListeningHistory> findRecentlyPlayedByUserWithLimit(@Param("user") User user, @Param("limit") int limit);
    
    // Get unique recently played tracks (no duplicates)
    @Query("SELECT DISTINCT lh FROM ListeningHistory lh WHERE lh.user = :user ORDER BY lh.playedAt DESC")
    List<ListeningHistory> findUniqueRecentlyPlayedByUser(@Param("user") User user);
    
    // Get listening history within a date range
    @Query("SELECT lh FROM ListeningHistory lh WHERE lh.user = :user AND lh.playedAt BETWEEN :startDate AND :endDate ORDER BY lh.playedAt DESC")
    List<ListeningHistory> findByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Get most played tracks by user
    @Query("SELECT lh.track, COUNT(lh) as playCount FROM ListeningHistory lh WHERE lh.user = :user GROUP BY lh.track ORDER BY playCount DESC")
    List<Object[]> findMostPlayedTracksByUser(@Param("user") User user);
    
    // Check if user has played a specific track
    @Query("SELECT COUNT(lh) > 0 FROM ListeningHistory lh WHERE lh.user = :user AND lh.track.id = :trackId")
    boolean hasUserPlayedTrack(@Param("user") User user, @Param("trackId") Long trackId);
    
    // Get listening history for a specific track
    @Query("SELECT lh FROM ListeningHistory lh WHERE lh.track.id = :trackId ORDER BY lh.playedAt DESC")
    List<ListeningHistory> findByTrackId(@Param("trackId") Long trackId);
    
    // Get total listening time for a user
    @Query("SELECT COALESCE(SUM(lh.playDuration), 0) FROM ListeningHistory lh WHERE lh.user = :user")
    Long getTotalListeningTimeByUser(@Param("user") User user);
}