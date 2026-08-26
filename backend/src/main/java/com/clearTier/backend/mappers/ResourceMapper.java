package com.clearTier.backend.mappers;

import com.clearTier.backend.dto.client.ResourceResponseDTO;
import com.clearTier.backend.dto.request.ResourceRequestDTO;
import com.clearTier.backend.entities.ResourceEntity;
import org.springframework.stereotype.Component;

/*
    Mapper: Sirve para convertir un DTO a entity
    y viceversa por razones de seguridad
*/
@Component
public class ResourceMapper {

    //Mapear a entidad
    public ResourceEntity toEntity(ResourceRequestDTO resourceRequestDTORequestDTO) {
        if (resourceRequestDTORequestDTO == null) {
            return null;
        }else {
            return ResourceEntity.builder()
                    .name(resourceRequestDTORequestDTO.getNameResource())
                    .description(resourceRequestDTORequestDTO.getDescriptionResource())
                    .build();
        }
    }

    //mapear a response
    public ResourceResponseDTO toResponse(ResourceEntity rolEntity) {
        if (rolEntity == null) {
            return null;
        }else {
            return ResourceResponseDTO.builder()
                    .nameResource(rolEntity.getName())
                    .descriptionResource(rolEntity.getDescription())
                    .build();
        }
    }
}
