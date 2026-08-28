package com.clearTier.backend.repository;

import com.clearTier.backend.entities.AiChangeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAutomationChatRepository extends JpaRepository<AiChangeEntity, Long> {
}
