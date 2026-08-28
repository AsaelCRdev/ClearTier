package com.clearTier.backend.repository;


import com.clearTier.backend.entities.ResourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface IResourceRepository extends JpaRepository<ResourceEntity, Long> {
	Optional<ResourceEntity> findByName(String name);
}
