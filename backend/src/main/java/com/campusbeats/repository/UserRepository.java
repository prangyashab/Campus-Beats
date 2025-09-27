package com.campusbeats.repository;

import com.campusbeats.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndIsActiveTrue(String email);
    
    List<User> findByUniversityDomainAndIsActiveTrue(String universityDomain);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true ORDER BY u.points DESC")
    List<User> findTopUsersByPoints();
    
    @Query("SELECT u FROM User u WHERE u.universityDomain = :domain AND u.isActive = true ORDER BY u.points DESC")
    List<User> findTopUsersByPointsAndDomain(@Param("domain") String domain);
    
    @Query("SELECT u FROM User u WHERE u.name ILIKE %:name% AND u.isActive = true")
    List<User> findByNameContainingIgnoreCase(@Param("name") String name);
    
    boolean existsByEmail(String email);
    
    Optional<User> findByVerificationToken(String verificationToken);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.universityDomain = :domain AND u.isActive = true")
    Long countByUniversityDomain(@Param("domain") String domain);
}