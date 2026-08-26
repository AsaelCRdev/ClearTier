package com.clearTier.backend.dto.client;

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
public class RolResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean isSystemRol;

}
