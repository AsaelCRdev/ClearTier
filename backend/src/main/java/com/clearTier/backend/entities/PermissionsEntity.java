package com.clearTier.backend.entities;

import com.clearTier.backend.enums.ActionEnum;
<<<<<<< HEAD
import com.clearTier.backend.enums.PermissionStatusEnum;
=======
>>>>>>> feature/cristian
import com.clearTier.backend.enums.ResourceEnum;
import com.clearTier.backend.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
<<<<<<< HEAD
import java.time.LocalDateTime;
=======
>>>>>>> feature/cristian

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PERMISSIONS")
<<<<<<< HEAD
=======

/*
    Esta entidad la tiene que unir Adriangel
    remplazando los Enum de prueba por
    las clases correspondientes (Foreign Key).
 */
>>>>>>> feature/cristian
public class PermissionsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
<<<<<<< HEAD
    private RoleEnum role;
=======
    private RoleEnum rolePermissions;
>>>>>>> feature/cristian

    @Column(name = "resource", nullable = false)
    @Enumerated(EnumType.STRING)
    private ResourceEnum resource;

<<<<<<< HEAD
    @Column(name = "PermissionStatus", nullable = false)
    @Enumerated(EnumType.STRING)
    private PermissionStatusEnum status;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "actor", nullable = false)
    private String actor;

    @Column(name = "action")
    @Enumerated(EnumType.STRING)
    private ActionEnum action;

    @Column(name = "target")
    private String target;
=======
    @Column(name = "action")
    @Enumerated(EnumType.STRING)
    private ActionEnum action;
>>>>>>> feature/cristian
}
