package com.clearTier.backend.mappers;

import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.dto.client.PermissionsResponseDTO;
import com.clearTier.backend.entities.PermissionsEntity;
import com.clearTier.backend.utils.TransformDataUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PermissionsMapper {

    public PermissionsEntity permissionsToEntity(PermissionsRequestDTO permission) {
        if(permission == null) {
            return null;
        }else {
            return PermissionsEntity
                .builder()
                    .timestamp(LocalDateTime.now())
                    .actor(permission.getActor())
                    .resource(permission.getResource())
                    .role(permission.getRol())
                    .status(permission.getStatus())
                    .action(permission.getAction())
                    .target(permission.getTarget())
                    .build();
        }
    }

    public PermissionsResponseDTO permissionsToResponse(PermissionsEntity permission) {
        if(permission == null) {
            return null;
        }else {
            return PermissionsResponseDTO
                    .builder()
                    .id(permission.getId())
                    .timestamp(TransformDataUtil.transformToString(permission.getTimestamp()))
                    .actor(permission.getActor())
                    .action(permission.getAction())
                    .resource(permission.getResource())
                    .rol(permission.getRole())
                    .status(permission.getStatus())
                    .target(permission.getTarget())
                    .build();
        }
    }
}
