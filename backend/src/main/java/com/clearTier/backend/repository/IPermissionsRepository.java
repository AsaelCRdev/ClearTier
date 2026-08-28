package com.clearTier.backend.repository;

import com.clearTier.backend.entities.PermissionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPermissionsRepository extends JpaRepository<PermissionsEntity, Long> {
	java.util.Optional<PermissionsEntity> findByResource_NameAndAction(String resourceName, com.clearTier.backend.enums.ActionEnum action);
}
