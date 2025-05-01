package com.example.demo.repository;

import com.example.demo.entity.User; // Import your User entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> { // Use your User entity here
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}