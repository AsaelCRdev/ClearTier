package com.clearTier.backend.entities;

import com.clearTier.backend.enums.ActionEnum;
import com.clearTier.backend.enums.ResourceEnum;
import com.clearTier.backend.enums.RoleEnum;
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
@Table(name = "PERMISSIONS")

/*
    Esta entidad la tiene que unir Adriangel
    remplazando los Enum de prueba por
    las clases correspondientes (Foreign Key).
 */
public class PermissionsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private RoleEnum rolePermissions;

    @Column(name = "resource", nullable = false)
    @Enumerated(EnumType.STRING)
    private ResourceEnum resource;

    @Column(name = "action")
    @Enumerated(EnumType.STRING)
    private ActionEnum action;
}
