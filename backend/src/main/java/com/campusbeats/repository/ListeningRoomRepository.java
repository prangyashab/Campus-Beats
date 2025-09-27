package com.campusbeats.repository;

import com.campusbeats.entity.ListeningRoom;
import com.campusbeats.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeningRoomRepository extends JpaRepository<ListeningRoom, Long> {
    
    List<ListeningRoom> findByIsActiveTrueOrderByCreatedAtDesc();
    
    List<ListeningRoom> findByHostAndIsActiveTrue(User host);
    
    @Query("SELECT lr FROM ListeningRoom lr WHERE lr.name ILIKE %:query% AND lr.isActive = true")
    List<ListeningRoom> searchActiveRooms(@Param("query") String query);
    
    @Query("SELECT lr FROM ListeningRoom lr JOIN lr.participants p WHERE p.id = :userId AND lr.isActive = true")
    List<ListeningRoom> findRoomsByParticipant(@Param("userId") Long userId);
    
    @Query("SELECT lr FROM ListeningRoom lr WHERE lr.host.universityDomain = :domain AND lr.isActive = true ORDER BY lr.createdAt DESC")
    List<ListeningRoom> findByUniversityDomain(@Param("domain") String domain);
    
    @Query("SELECT lr FROM ListeningRoom lr WHERE lr.isActive = true ORDER BY SIZE(lr.participants) DESC")
    List<ListeningRoom> findMostPopularRooms();
}