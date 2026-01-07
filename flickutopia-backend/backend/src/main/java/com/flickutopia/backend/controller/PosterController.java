package com.flickutopia.backend.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api/posters")
@CrossOrigin(origins = "http://localhost:5175")
public class PosterController {

    private final Path posterStorageLocation = Paths.get("uploads/posters");

    public PosterController() {
        try {
            Files.createDirectories(this.posterStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create poster upload directory!", ex);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPoster(@RequestParam("file") MultipartFile file,
                                          @RequestParam("filename") String filename) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }

            // Ensure filename ends with .jpg
            if (!filename.endsWith(".jpg")) {
                filename = filename + ".jpg";
            }

            Path targetLocation = this.posterStorageLocation.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok().body(filename);
        } catch (IOException ex) {
            return ResponseEntity.status(500).body("Failed to upload file: " + ex.getMessage());
        }
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getPoster(@PathVariable String filename) {
        try {
            Path filePath = this.posterStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }
}