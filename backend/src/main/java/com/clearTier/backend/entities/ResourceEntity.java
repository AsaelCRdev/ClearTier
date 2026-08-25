package com.clearTier.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "RESOURCES")
/*
    Esta entidad la tiene que unir Adriangel
    remplazando el Enum de permissions por
    esta clase (Foreign Key).
 */
public class ResourceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String nameResource;

    @Column(name = "description", nullable = false)
    private String descriptionResource;
}
