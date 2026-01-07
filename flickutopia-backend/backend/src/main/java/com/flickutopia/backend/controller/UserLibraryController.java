package com.flickutopia.backend.controller;

import com.flickutopia.backend.model.UserLibrary;
import com.flickutopia.backend.repository.UserLibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@RestController
@RequestMapping("/api/library")
@CrossOrigin(origins = "*")
public class UserLibraryController {

    @Autowired
    private UserLibraryRepository repository;

    // Get all library items for a user
    @GetMapping("/{userId}")
    public List<UserLibrary> getUserLibrary(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    // Get watchlist only
    @GetMapping("/{userId}/watchlist")
    public List<UserLibrary> getWatchlist(@PathVariable String userId) {
        return repository.findByUserIdAndType(userId, "WATCHLIST");
    }

    // Get rented only
    @GetMapping("/{userId}/rented")
    public List<UserLibrary> getRented(@PathVariable String userId) {
        return repository.findByUserIdAndType(userId, "RENTED");
    }

    // Add to library
    @PostMapping
    public UserLibrary addToLibrary(@RequestBody UserLibrary item) {
        var existing = repository.findByUserIdAndMovieId(item.getUserId(), item.getMovieId());
        if (existing.isPresent()) {
            UserLibrary lib = existing.get();
            lib.setType(item.getType());
            return repository.save(lib);
        }
        return repository.save(item);
    }

    // Remove from library
    @DeleteMapping("/{userId}/{movieId}")
    @Transactional
    public void removeFromLibrary(@PathVariable String userId, @PathVariable Long movieId) {
        repository.deleteByUserIdAndMovieId(userId, movieId);
    }
}