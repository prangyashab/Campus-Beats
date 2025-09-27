package com.campusbeats.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ListeningRoomDTO {
    
    private String id;
    private String name;
    private String description;
    private String host; // host name
    
    @JsonProperty("currentTrack")
    private TrackDTO currentTrack;
    
    @JsonProperty("currentPosition")
    private Long currentPosition; // in seconds
    
    @JsonProperty("isPlaying")
    private Boolean isPlaying;
    
    private List<UserDTO> participants;
    private List<QueueItemDTO> queue;
    
    @JsonProperty("participantCount")
    private Integer participantCount;
    
    @JsonProperty("maxParticipants")
    private Integer maxParticipants;
    
    // Constructors
    public ListeningRoomDTO() {}
    
    public ListeningRoomDTO(String id, String name, String description, String host) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.host = host;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }
    
    public TrackDTO getCurrentTrack() { return currentTrack; }
    public void setCurrentTrack(TrackDTO currentTrack) { this.currentTrack = currentTrack; }
    
    public Long getCurrentPosition() { return currentPosition; }
    public void setCurrentPosition(Long currentPosition) { this.currentPosition = currentPosition; }
    
    public Boolean getIsPlaying() { return isPlaying; }
    public void setIsPlaying(Boolean isPlaying) { this.isPlaying = isPlaying; }
    
    public List<UserDTO> getParticipants() { return participants; }
    public void setParticipants(List<UserDTO> participants) { this.participants = participants; }
    
    public List<QueueItemDTO> getQueue() { return queue; }
    public void setQueue(List<QueueItemDTO> queue) { this.queue = queue; }
    
    public Integer getParticipantCount() { return participantCount; }
    public void setParticipantCount(Integer participantCount) { this.participantCount = participantCount; }
    
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
}