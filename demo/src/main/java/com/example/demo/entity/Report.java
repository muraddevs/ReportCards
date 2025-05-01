// Report.java

package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "report")
@Getter
@Setter
@NoArgsConstructor
@JsonFormat
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String category;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Checkboxes> checkboxes = new ArrayList<>();

    @OneToOne(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Photo photo;

    @Column
    private boolean isAnonymous;

    @Column
    private String nameAndSurname;

    @Column
    private String occupation;

    @Column
    private String department;

    @Column
    private String workingAt;

    @Column
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ", timezone = "UTC")
    private Date date;

    @Column
    private String observation;

    @Column
    private String actions;

    @Column
    private String needAdditionalWork;

    @Column
    private String additionalDescription;
}