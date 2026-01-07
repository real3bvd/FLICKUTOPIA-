package com.flickutopia.backend.controller;

import com.flickutopia.backend.model.Movie;
import com.flickutopia.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @GetMapping("/banner")
    public List<Movie> getBannerMovies() {
        return movieRepository.findByInBannerTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovie(@PathVariable Long id) {
        return movieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Movie createMovie(@RequestBody Movie movie) {
        return movieRepository.save(movie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie movieDetails) {
        return movieRepository.findById(id)
                .map(movie -> {
                    movie.setTitle(movieDetails.getTitle());
                    movie.setDescription(movieDetails.getDescription());
                    movie.setGenre(movieDetails.getGenre());
                    movie.setRentPrice(movieDetails.getRentPrice());
                    movie.setDirector(movieDetails.getDirector());
                    movie.setReleaseDate(movieDetails.getReleaseDate());
                    movie.setAgeConsent(movieDetails.getAgeConsent());
                    movie.setDuration(movieDetails.getDuration());
                    movie.setTrailerId(movieDetails.getTrailerId());
                    movie.setPosterUrl(movieDetails.getPosterUrl());
                    movie.setInBanner(movieDetails.getInBanner());
                    movie.setActors(movieDetails.getActors());
                    return ResponseEntity.ok(movieRepository.save(movie));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        return movieRepository.findById(id)
                .map(movie -> {
                    movieRepository.delete(movie);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}