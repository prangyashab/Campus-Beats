package com.campusbeats.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "room_queue")
public class RoomQueue {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private ListeningRoom listeningRoom;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by_id", nullable = false)
    private User addedBy;
    
    @Column(name = "queue_order", nullable = false)
    private Integer queueOrder;
    
    @Column(name = "vote_count")
    private Integer voteCount = 0;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "queue_votes",
        joinColumns = @JoinColumn(name = "queue_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> voters = new HashSet<>();
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public RoomQueue() {}
    
    public RoomQueue(ListeningRoom listeningRoom, Track track, User addedBy, Integer queueOrder) {
        this.listeningRoom = listeningRoom;
        this.track = track;
        this.addedBy = addedBy;
        this.queueOrder = queueOrder;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public ListeningRoom getListeningRoom() { return listeningRoom; }
    public void setListeningRoom(ListeningRoom listeningRoom) { this.listeningRoom = listeningRoom; }
    
    public Track getTrack() { return track; }
    public void setTrack(Track track) { this.track = track; }
    
    public User getAddedBy() { return addedBy; }
    public void setAddedBy(User addedBy) { this.addedBy = addedBy; }
    
    public Integer getQueueOrder() { return queueOrder; }
    public void setQueueOrder(Integer queueOrder) { this.queueOrder = queueOrder; }
    
    public Integer getVoteCount() { return voteCount; }
    public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }
    
    public Set<User> getVoters() { return voters; }
    public void setVoters(Set<User> voters) { this.voters = voters; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    // Helper methods
    public void addVote(User user) {
        if (!this.voters.contains(user)) {
            this.voters.add(user);
            this.voteCount++;
        }
    }
    
    public void removeVote(User user) {
        if (this.voters.contains(user)) {
            this.voters.remove(user);
            this.voteCount--;
        }
    }
    
    public boolean hasUserVoted(User user) {
        return this.voters.contains(user);
    }
}