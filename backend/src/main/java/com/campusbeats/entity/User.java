package com.campusbeats.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false)
    private String email;
    
    @JsonIgnore
    @Column(nullable = false)
    private String password;
    
    @NotBlank(message = "University domain is required")
    @Column(name = "university_domain", nullable = false)
    private String universityDomain;
    
    @Column(nullable = false)
    private Integer points = 0;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_badges", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "badge")
    private Set<BadgeType> badges = new HashSet<>();
    
    @OneToMany(mappedBy = "uploader", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Track> uploadedTracks = new ArrayList<>();
    
    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Playlist> createdPlaylists = new ArrayList<>();
    
    @ManyToMany(mappedBy = "participants")
    private Set<ListeningRoom> listeningRooms = new HashSet<>();
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "is_email_verified")
    private Boolean isEmailVerified = false;
    
    @Column(name = "verification_token")
    private String verificationToken;
    
    @Column(name = "verification_code")
    private String verificationCode;
    
    @Column(name = "verification_code_expiry")
    private LocalDateTime verificationCodeExpiry;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public User() {}
    
    public User(String name, String email, String password, String universityDomain) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.universityDomain = universityDomain;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getUniversityDomain() { return universityDomain; }
    public void setUniversityDomain(String universityDomain) { this.universityDomain = universityDomain; }
    
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    
    public Set<BadgeType> getBadges() { return badges; }
    public void setBadges(Set<BadgeType> badges) { this.badges = badges; }
    
    public List<Track> getUploadedTracks() { return uploadedTracks; }
    public void setUploadedTracks(List<Track> uploadedTracks) { this.uploadedTracks = uploadedTracks; }
    
    public List<Playlist> getCreatedPlaylists() { return createdPlaylists; }
    public void setCreatedPlaylists(List<Playlist> createdPlaylists) { this.createdPlaylists = createdPlaylists; }
    
    public Set<ListeningRoom> getListeningRooms() { return listeningRooms; }
    public void setListeningRooms(Set<ListeningRoom> listeningRooms) { this.listeningRooms = listeningRooms; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Boolean getIsEmailVerified() { return isEmailVerified; }
    public void setIsEmailVerified(Boolean isEmailVerified) { this.isEmailVerified = isEmailVerified; }
    
    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
    
    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
    
    public LocalDateTime getVerificationCodeExpiry() { return verificationCodeExpiry; }
    public void setVerificationCodeExpiry(LocalDateTime verificationCodeExpiry) { this.verificationCodeExpiry = verificationCodeExpiry; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public void addBadge(BadgeType badge) {
        this.badges.add(badge);
    }
    
    public void addPoints(Integer points) {
        this.points += points;
    }
    
    public void addUploadedTrack(Track track) {
        this.uploadedTracks.add(track);
        track.setUploader(this);
    }
    
    // Convenience method for email verification check
    public boolean isEmailVerified() {
        return this.isEmailVerified != null && this.isEmailVerified;
    }
}