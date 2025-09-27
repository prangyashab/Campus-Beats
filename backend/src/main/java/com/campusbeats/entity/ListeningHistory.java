package com.campusbeats.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "listening_history")
public class ListeningHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    @NotNull
    private Track track;
    
    @CreationTimestamp
    @Column(name = "played_at", updatable = false)
    private LocalDateTime playedAt;
    
    @Column(name = "play_duration")
    private Integer playDuration; // in seconds, how long the user listened
    
    @Column(name = "completion_percentage")
    private Double completionPercentage; // percentage of track completed
    
    // Constructors
    public ListeningHistory() {}
    
    public ListeningHistory(User user, Track track) {
        this.user = user;
        this.track = track;
    }
    
    public ListeningHistory(User user, Track track, Integer playDuration, Double completionPercentage) {
        this.user = user;
        this.track = track;
        this.playDuration = playDuration;
        this.completionPercentage = completionPercentage;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Track getTrack() { return track; }
    public void setTrack(Track track) { this.track = track; }
    
    public LocalDateTime getPlayedAt() { return playedAt; }
    public void setPlayedAt(LocalDateTime playedAt) { this.playedAt = playedAt; }
    
    public Integer getPlayDuration() { return playDuration; }
    public void setPlayDuration(Integer playDuration) { this.playDuration = playDuration; }
    
    public Double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
}