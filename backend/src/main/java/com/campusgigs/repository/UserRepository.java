package com.campusgigs.repository;

import com.campusgigs.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByInstitutionalEmail(String institutionalEmail);
    boolean existsByInstitutionalEmail(String institutionalEmail);
}
