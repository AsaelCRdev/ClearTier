package com.clearTier.backend.entities;

import com.clearTier.backend.enums.PermissionStatusEnum;
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
public class PermissionsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permissions")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "id_resource",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_resources")
    )
    private ResourceEntity resource;

    @Column(name = "action", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PermissionStatusEnum action;

    @Transient
    private String rol;
}
