package com.campusbeats.entity;

public enum BadgeType {
    EARLY_LISTENER("Early Listener", "One of the first to discover new tracks"),
    TOP_DJ("Top DJ", "Consistently creates popular playlists"),
    PLAYLIST_KING("Playlist King", "Master of curating amazing playlists"),
    CAMPUS_LEGEND("Campus Legend", "Legendary status in the campus music scene");
    
    private final String displayName;
    private final String description;
    
    BadgeType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getDescription() {
        return description;
    }
}