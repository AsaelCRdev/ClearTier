package com.clearTier.backend.mappers;

import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.dto.client.PermissionsResponseDTO;
import com.clearTier.backend.entities.PermissionsEntity;
import com.clearTier.backend.dto.client.ResourceResponseDTO;
import org.springframework.stereotype.Component;

/*
    Mapper: Sirve para convertir un DTO a entity
    y viceversa por razones de seguridad
*/

@Component
public class PermissionsMapper {

    //Mapear a entidad
    public PermissionsEntity permissionsToEntity(PermissionsRequestDTO permission) {
        if(permission == null) {
            return null;
        }else {
            return PermissionsEntity
                .builder()
                    .rol(permission.getRol())
                    .action(permission.getAction())
                    .build();
        }
    }

    //mapear a response
    public PermissionsResponseDTO permissionsToResponse(PermissionsEntity permission) {
        if(permission == null) {
            return null;
        }else {
            return PermissionsResponseDTO
                    .builder()
                    .id(permission.getId())
                    .rol(permission.getRol())
                    .action(permission.getAction())
                        .resource(ResourceResponseDTO.builder()
                            .nameResource(permission.getResource().getName())
                            .descriptionResource(permission.getResource().getDescription())
                            .build())
                    .build();
        }
    }
}
