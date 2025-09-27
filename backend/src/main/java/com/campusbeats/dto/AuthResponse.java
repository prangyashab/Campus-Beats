package com.campusbeats.dto;

public class AuthResponse {
    
    private String token;
    private UserDTO user;
    private String message;
    private long expiresIn; // Token expiration time in milliseconds
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, UserDTO user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }
    
    public AuthResponse(String token, UserDTO user, String message, long expiresIn) {
        this.token = token;
        this.user = user;
        this.message = message;
        this.expiresIn = expiresIn;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDTO getUser() {
        return user;
    }
    
    public void setUser(UserDTO user) {
        this.user = user;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
}