package com.example.demo.repository;

import com.example.demo.entity.Checkboxes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckboxesRepository extends JpaRepository<Checkboxes, Long> {
}
