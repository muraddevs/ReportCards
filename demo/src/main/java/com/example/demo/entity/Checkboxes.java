// Checkboxes.java

package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "checkboxes")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Checkboxes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String title;

    @ElementCollection
    @CollectionTable(name = "checkbox_checked_labels", joinColumns = @JoinColumn(name = "checkbox_id"))
    @OrderColumn(name = "label_order")
    private List<LabelWithGroup> checkedLabels = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "report_id")
    @JsonBackReference
    private Report report;

    @Column
    private String description;

    @Column(name = "group_title")
    private String groupTitle;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LabelWithGroup {

        @Column(name = "label")
        private String label;

        @Column(name = "group_title")
        private String groupTitle;
    }
}