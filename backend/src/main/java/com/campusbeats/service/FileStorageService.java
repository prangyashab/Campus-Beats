package com.campusbeats.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    @Value("${server.port:8081}")
    private String serverPort;
    
    private static final String AUDIO_SUBDIR = "audio";
    private static final String IMAGE_SUBDIR = "images";
    
    public String storeAudioFile(MultipartFile file, String uploaderId) throws IOException {
        return storeFile(file, AUDIO_SUBDIR, uploaderId);
    }
    
    public String storeImageFile(MultipartFile file, String entityId) throws IOException {
        return storeFile(file, IMAGE_SUBDIR, entityId);
    }
    
    private String storeFile(MultipartFile file, String subDir, String entityId) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, subDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String uniqueFilename = entityId + "_" + UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFilename);
        
        // Store file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Return URL to access the file
        return "http://localhost:" + serverPort + "/api/files/" + subDir + "/" + uniqueFilename;
    }
    
    public void deleteFile(String fileUrl) {
        try {
            // Extract filename from URL
            String[] urlParts = fileUrl.split("/");
            if (urlParts.length >= 3) {
                String subDir = urlParts[urlParts.length - 2];
                String filename = urlParts[urlParts.length - 1];
                
                Path filePath = Paths.get(uploadDir, subDir, filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Failed to delete file: " + fileUrl + ", Error: " + e.getMessage());
        }
    }
    
    public boolean fileExists(String fileUrl) {
        try {
            String[] urlParts = fileUrl.split("/");
            if (urlParts.length >= 3) {
                String subDir = urlParts[urlParts.length - 2];
                String filename = urlParts[urlParts.length - 1];
                
                Path filePath = Paths.get(uploadDir, subDir, filename);
                return Files.exists(filePath);
            }
        } catch (Exception e) {
            System.err.println("Error checking file existence: " + fileUrl + ", Error: " + e.getMessage());
        }
        return false;
    }
}