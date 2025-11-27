package com.campusbeats.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "listening_rooms")
public class ListeningRoom {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Room name is required")
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "room_participants",
        joinColumns = @JoinColumn(name = "room_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> participants = new HashSet<>();
    
    @OneToMany(mappedBy = "listeningRoom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("queueOrder ASC")
    private List<RoomQueue> queue = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_track_id")
    private Track currentTrack;
    
    @Column(name = "current_position")
    private Long currentPosition = 0L; // in seconds
    
    @Column(name = "is_playing")
    private Boolean isPlaying = false;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "max_participants")
    private Integer maxParticipants = 50;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public ListeningRoom() {}
    
    public ListeningRoom(String name, String description, User host) {
        this.name = name;
        this.description = description;
        this.host = host;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public User getHost() { return host; }
    public void setHost(User host) { this.host = host; }
    
    public Set<User> getParticipants() { return participants; }
    public void setParticipants(Set<User> participants) { this.participants = participants; }
    
    public List<RoomQueue> getQueue() { return queue; }
    public void setQueue(List<RoomQueue> queue) { this.queue = queue; }
    
    public Track getCurrentTrack() { return currentTrack; }
    public void setCurrentTrack(Track currentTrack) { this.currentTrack = currentTrack; }
    
    public Long getCurrentPosition() { return currentPosition; }
    public void setCurrentPosition(Long currentPosition) { this.currentPosition = currentPosition; }
    
    public Boolean getIsPlaying() { return isPlaying; }
    public void setIsPlaying(Boolean isPlaying) { this.isPlaying = isPlaying; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public void addParticipant(User user) {
        if (this.participants.size() < this.maxParticipants) {
            this.participants.add(user);
        }
    }
    
    public void removeParticipant(User user) {
        this.participants.remove(user);
    }
    
    public int getParticipantCount() {
        return this.participants.size();
    }
    
    public boolean isFull() {
        return this.participants.size() >= this.maxParticipants;
    }
}