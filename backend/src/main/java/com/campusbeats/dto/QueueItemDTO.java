package com.campusbeats.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class QueueItemDTO {
    
    private String id;
    private TrackDTO track;
    
    @JsonProperty("addedBy")
    private String addedBy; // user name who added the track
    
    @JsonProperty("voteCount")
    private Integer voteCount;
    
    @JsonProperty("queueOrder")
    private Integer queueOrder;
    
    @JsonProperty("hasUserVoted")
    private Boolean hasUserVoted; // whether current user has voted
    
    // Constructors
    public QueueItemDTO() {}
    
    public QueueItemDTO(String id, TrackDTO track, String addedBy, Integer voteCount, Integer queueOrder) {
        this.id = id;
        this.track = track;
        this.addedBy = addedBy;
        this.voteCount = voteCount;
        this.queueOrder = queueOrder;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public TrackDTO getTrack() { return track; }
    public void setTrack(TrackDTO track) { this.track = track; }
    
    public String getAddedBy() { return addedBy; }
    public void setAddedBy(String addedBy) { this.addedBy = addedBy; }
    
    public Integer getVoteCount() { return voteCount; }
    public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }
    
    public Integer getQueueOrder() { return queueOrder; }
    public void setQueueOrder(Integer queueOrder) { this.queueOrder = queueOrder; }
    
    public Boolean getHasUserVoted() { return hasUserVoted; }
    public void setHasUserVoted(Boolean hasUserVoted) { this.hasUserVoted = hasUserVoted; }
}