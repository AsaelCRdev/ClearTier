package com.clearTier.backend.repository;

import com.clearTier.backend.entities.RolePermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRolePermissionRepository extends JpaRepository<RolePermissionEntity, Long> {
}