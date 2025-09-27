package com.campusbeats.entity;

public enum PlaylistCategory {
    STUDY("Study", "Perfect for focusing and studying"),
    FEATURED("Featured", "Handpicked by our curators"),
    PARTY("Party", "Get the party started with these beats"),
    WORKOUT("Workout", "High-energy tracks for your fitness routine"),
    CHILL("Chill", "Relaxing vibes for unwinding");
    
    private final String displayName;
    private final String description;
    
    PlaylistCategory(String displayName, String description) {
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