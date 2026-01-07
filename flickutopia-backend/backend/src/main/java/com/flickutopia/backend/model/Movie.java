package com.flickutopia.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String genre;
    private String rentPrice;
    private String director;
    private String releaseDate;
    private String ageConsent;
    private String duration;
    private String trailerId;
    private String posterUrl;
    private Boolean inBanner = false;
    private String actors;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public String getRentPrice() { return rentPrice; }
    public void setRentPrice(String rentPrice) { this.rentPrice = rentPrice; }
    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }
    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }
    public String getAgeConsent() { return ageConsent; }
    public void setAgeConsent(String ageConsent) { this.ageConsent = ageConsent; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getTrailerId() { return trailerId; }
    public void setTrailerId(String trailerId) { this.trailerId = trailerId; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public Boolean getInBanner() { return inBanner; }
    public void setInBanner(Boolean inBanner) { this.inBanner = inBanner; }
    public String getActors() { return actors; }
    public void setActors(String actors) { this.actors = actors; }
}