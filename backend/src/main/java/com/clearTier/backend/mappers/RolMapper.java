package com.clearTier.backend.mappers;

import com.clearTier.backend.dto.request.RolRequestDTO;
import com.clearTier.backend.dto.client.RolResponseDTO;
import com.clearTier.backend.entities.RolEntity;
import org.springframework.stereotype.Component;

/*
    Mapper: Sirve para convertir un DTO a entity
    y viceversa por razones de seguridad
*/
@Component
public class RolMapper {

    //Mapear a entidad
    public RolEntity toEntity(RolRequestDTO rolRequestDTO) {
        if (rolRequestDTO == null) {
            return null;
        }else {
            return RolEntity.builder()
                    .name(rolRequestDTO.getName())
                    .description(rolRequestDTO.getDescription())
                    .isSystemRol(true)
                    .build();
        }
    }

    //mapear a response
    public RolResponseDTO toResponse(RolEntity rolEntity) {
        if (rolEntity == null) {
            return null;
        }else {
            return RolResponseDTO.builder()
                    .name(rolEntity.getName())
                    .description(rolEntity.getDescription())
                    .isSystemRol(rolEntity.getIsSystemRol())
                    //.usersCount(rolEntity.getUsersCount()) para hacer esta parte se necesita tener Users registrados
                    .build();
        }
    }
}
