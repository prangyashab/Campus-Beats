package com.campusbeats.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TrackDTO {
    
    private String id;
    private String title;
    private String artist;
    private String album;
    
    @JsonProperty("coverArt")
    private String coverArt;
    
    private String url;
    private Integer duration; // in seconds
    private String genre;
    
    @JsonProperty("playCount")
    private Long playCount;
    
    private String uploader; // uploader name
    
    // Constructors
    public TrackDTO() {}
    
    public TrackDTO(String id, String title, String artist, String coverArt, String url, Integer duration, String genre) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.coverArt = coverArt;
        this.url = url;
        this.duration = duration;
        this.genre = genre;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }
    
    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }
    
    public String getCoverArt() { return coverArt; }
    public void setCoverArt(String coverArt) { this.coverArt = coverArt; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    
    public Long getPlayCount() { return playCount; }
    public void setPlayCount(Long playCount) { this.playCount = playCount; }
    
    public String getUploader() { return uploader; }
    public void setUploader(String uploader) { this.uploader = uploader; }
}