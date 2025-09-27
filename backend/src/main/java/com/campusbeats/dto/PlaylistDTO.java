package com.campusbeats.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class PlaylistDTO {
    
    private String id;
    private String name;
    private String description;
    
    @JsonProperty("coverArt")
    private String coverArt;
    
    private List<TrackDTO> tracks;
    private String category; // study, featured, party, workout, chill
    private String creator; // creator name
    
    @JsonProperty("trackCount")
    private Integer trackCount;
    
    // Constructors
    public PlaylistDTO() {}
    
    public PlaylistDTO(String id, String name, String description, String coverArt, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.coverArt = coverArt;
        this.category = category;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCoverArt() { return coverArt; }
    public void setCoverArt(String coverArt) { this.coverArt = coverArt; }
    
    public List<TrackDTO> getTracks() { return tracks; }
    public void setTracks(List<TrackDTO> tracks) { this.tracks = tracks; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }
    
    public Integer getTrackCount() { return trackCount; }
    public void setTrackCount(Integer trackCount) { this.trackCount = trackCount; }
}