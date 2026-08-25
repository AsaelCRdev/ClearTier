package com.clearTier.backend.mappers;

import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.dto.client.PermissionsResponseDTO;
import com.clearTier.backend.entities.PermissionsEntity;
<<<<<<< HEAD
import com.clearTier.backend.utils.TransformDataUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
=======
import org.springframework.stereotype.Component;

/*
    Mapper: Sirve para convertir un DTO a entity
    y viceversa por razones de seguridad
*/
>>>>>>> feature/cristian

@Component
public class PermissionsMapper {

<<<<<<< HEAD
=======
    //Mapear a entidad
>>>>>>> feature/cristian
    public PermissionsEntity permissionsToEntity(PermissionsRequestDTO permission) {
        if(permission == null) {
            return null;
        }else {
            return PermissionsEntity
                .builder()
<<<<<<< HEAD
                    .timestamp(LocalDateTime.now())
                    .actor(permission.getActor())
                    .resource(permission.getResource())
                    .role(permission.getRol())
                    .status(permission.getStatus())
                    .action(permission.getAction())
                    .target(permission.getTarget())
=======
                    .resource(permission.getResource())
                    .action(permission.getAction())
                    .rolePermissions(permission.getRol())
>>>>>>> feature/cristian
                    .build();
        }
    }

<<<<<<< HEAD
=======
    //mapear a response
>>>>>>> feature/cristian
    public PermissionsResponseDTO permissionsToResponse(PermissionsEntity permission) {
        if(permission == null) {
            return null;
        }else {
            return PermissionsResponseDTO
                    .builder()
                    .id(permission.getId())
<<<<<<< HEAD
                    .timestamp(TransformDataUtil.transformToString(permission.getTimestamp()))
                    .actor(permission.getActor())
                    .action(permission.getAction())
                    .resource(permission.getResource())
                    .rol(permission.getRole())
                    .status(permission.getStatus())
                    .target(permission.getTarget())
=======
                    .action(permission.getAction())
                    .resource(permission.getResource())
                    .rol(permission.getRolePermissions())
>>>>>>> feature/cristian
                    .build();
        }
    }
}
