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
@Table(name = "ROLES")
<<<<<<< HEAD
=======

/*
    Esta entidad la tiene que unir Adriangel
    a las clases User, aiChangeItems y
    rolePermission (Foreign Key)
 */
>>>>>>> feature/cristian
public class RolEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

<<<<<<< HEAD
    @Column(name = "description", nullable = false)
=======
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
>>>>>>> feature/cristian
    private String description;

    @Column(name = "isSystemRol")
    private Boolean isSystemRol;

<<<<<<< HEAD
    @Column(name = "usersCount")
    private int usersCount;

=======
>>>>>>> feature/cristian
}
