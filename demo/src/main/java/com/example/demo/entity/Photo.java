package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // Import JsonIgnore
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private byte[] data;

    private String contentType;

    @OneToOne
    @JoinColumn(name = "report_id", referencedColumnName = "id")
    @JsonIgnore // Add JsonIgnore here
    private Report report;
}