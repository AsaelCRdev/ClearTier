package com.clearTier.backend.repository;

import com.clearTier.backend.entities.RolEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRolRepository extends JpaRepository<RolEntity, Long> {
}
