package com.clearTier.backend.dto.client;

import com.clearTier.backend.enums.ActionEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

/*
    Datos que se llaman desde la base de datos para
    la vista pública del cliente en la pantalla.
    (Se usa DTO por tema de seguridad porque
    si se accede a la entidad de golpe es una mala
    práctica)
*/
public class PermissionsResponseDTO {

    private Long id;
    private String rol;
    private ResourceResponseDTO resource;
    private ActionEnum action;

}
