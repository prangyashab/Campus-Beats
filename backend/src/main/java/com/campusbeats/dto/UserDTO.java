package com.campusbeats.dto;

import com.campusbeats.entity.BadgeType;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Set;

public class UserDTO {
    
    private String id;
    private String name;
    private String email;
    
    @JsonProperty("universityDomain")
    private String universityDomain;
    
    private Integer points;
    private Set<String> badges;
    
    @JsonProperty("isEmailVerified")
    private Boolean isEmailVerified;
    
    @JsonProperty("uploadedTracks")
    private List<TrackDTO> uploadedTracks;
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(String id, String name, String email, String universityDomain, Integer points, Set<String> badges, Boolean isEmailVerified) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.universityDomain = universityDomain;
        this.points = points;
        this.badges = badges;
        this.isEmailVerified = isEmailVerified;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getUniversityDomain() { return universityDomain; }
    public void setUniversityDomain(String universityDomain) { this.universityDomain = universityDomain; }
    
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    
    public Set<String> getBadges() { return badges; }
    public void setBadges(Set<String> badges) { this.badges = badges; }
    
    public Boolean getIsEmailVerified() { return isEmailVerified; }
    public void setIsEmailVerified(Boolean isEmailVerified) { this.isEmailVerified = isEmailVerified; }
    
    public List<TrackDTO> getUploadedTracks() { return uploadedTracks; }
    public void setUploadedTracks(List<TrackDTO> uploadedTracks) { this.uploadedTracks = uploadedTracks; }
}