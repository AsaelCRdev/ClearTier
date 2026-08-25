package com.clearTier.backend.repository;


import com.clearTier.backend.entities.ResourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IResourceRepository extends JpaRepository<ResourceEntity, Long> {
}
