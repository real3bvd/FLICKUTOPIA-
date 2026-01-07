package com.flickutopia.backend.repository;

import com.flickutopia.backend.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByInBannerTrue();
}