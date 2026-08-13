package com.clearTier.backend.entities;

import com.clearTier.backend.enums.ActionEnum;
import com.clearTier.backend.enums.PermissionStatusEnum;
import com.clearTier.backend.enums.ResourceEnum;
import com.clearTier.backend.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PERMISSIONS")
public class PermissionsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    @Column(name = "resource", nullable = false)
    @Enumerated(EnumType.STRING)
    private ResourceEnum resource;

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
}
