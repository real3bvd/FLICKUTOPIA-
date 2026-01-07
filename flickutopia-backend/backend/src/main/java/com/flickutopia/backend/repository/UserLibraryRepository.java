package com.flickutopia.backend.repository;

import com.flickutopia.backend.model.UserLibrary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserLibraryRepository extends JpaRepository<UserLibrary, Long> {
    List<UserLibrary> findByUserId(String userId);
    List<UserLibrary> findByUserIdAndType(String userId, String type);
    Optional<UserLibrary> findByUserIdAndMovieId(String userId, Long movieId);
    void deleteByUserIdAndMovieId(String userId, Long movieId);
}