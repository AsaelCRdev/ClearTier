package com.clearTier.backend.repository;

import com.clearTier.backend.entities.RolePermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRolePermissionRepository extends JpaRepository<RolePermissionEntity, Long> {
	java.util.Optional<RolePermissionEntity> findByRol_NameAndPermission_Resource_Name(String roleName, String resourceName);
}