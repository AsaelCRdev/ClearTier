package com.clearTier.backend.mappers;

import com.clearTier.backend.dto.client.AiChangeResponseDTO;
import com.clearTier.backend.dto.request.AiChangeRequestDTO;
import com.clearTier.backend.entities.AiChangeEntity;
import com.clearTier.backend.utils.AutomationUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AiChangeMapper {

    private final AutomationUtil automationUtil;

    public AiChangeMapper(AutomationUtil automationUtil) {
        this.automationUtil = automationUtil;
    }

    // Crear el prompt completo con el contexto y el mensaje
    public String buildFullPrompt(String message) {
        return String.format(automationUtil.loadPrompt(), message);
    }

    // Mapea a entidad desde mensaje (para registrar la solicitud)
    public AiChangeEntity ChangeToEntity(String message) {
        return ChangeToEntity(message, false);
    }

    public AiChangeEntity ChangeToEntity(String message, boolean approved) {
        if (message == null) {
            return null;
        } else {
            String fullPrompt = buildFullPrompt(message);
            return AiChangeEntity
                    .builder()
                    .promptText(fullPrompt)
                    .isApproved(approved)
                    .createdAt(LocalDateTime.now())
                    .build();
        }
    }

    public AiChangeEntity approvedMessageToEntity(String message) {
        if (message == null) {
            return null;
        }

        return AiChangeEntity
                .builder()
                .promptText(message)
                .isApproved(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    // Mapear a entidad desde DTO de solicitud
    public AiChangeEntity ChangeToEntity(AiChangeRequestDTO request) {
        if (request == null) {
            return null;
        } else {
            return ChangeToEntity(request.getPromptText());
        }
    }

    // Mapea a response DTO desde entidad
    public AiChangeResponseDTO entityToResponse(AiChangeEntity entity) {
        if (entity == null) {
            return null;
        } else {
            return AiChangeResponseDTO
                    .builder()
                    .promptText(entity.getPromptText())
                    .isApproved(entity.isApproved())
                    .createdAt(entity.getCreatedAt())
                    .build();
        }
    }
}