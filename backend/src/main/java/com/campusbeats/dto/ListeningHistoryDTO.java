package com.campusbeats.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class ListeningHistoryDTO {
    
    private String id;
    
    @JsonProperty("userId")
    private String userId;
    
    @JsonProperty("track")
    private TrackDTO track;
    
    @JsonProperty("playedAt")
    private LocalDateTime playedAt;
    
    @JsonProperty("playDuration")
    private Integer playDuration;
    
    @JsonProperty("completionPercentage")
    private Double completionPercentage;
    
    // Constructors
    public ListeningHistoryDTO() {}
    
    public ListeningHistoryDTO(String id, String userId, TrackDTO track, LocalDateTime playedAt) {
        this.id = id;
        this.userId = userId;
        this.track = track;
        this.playedAt = playedAt;
    }
    
    public ListeningHistoryDTO(String id, String userId, TrackDTO track, LocalDateTime playedAt, Integer playDuration, Double completionPercentage) {
        this.id = id;
        this.userId = userId;
        this.track = track;
        this.playedAt = playedAt;
        this.playDuration = playDuration;
        this.completionPercentage = completionPercentage;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public TrackDTO getTrack() { return track; }
    public void setTrack(TrackDTO track) { this.track = track; }
    
    public LocalDateTime getPlayedAt() { return playedAt; }
    public void setPlayedAt(LocalDateTime playedAt) { this.playedAt = playedAt; }
    
    public Integer getPlayDuration() { return playDuration; }
    public void setPlayDuration(Integer playDuration) { this.playDuration = playDuration; }
    
    public Double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
}