package com.clearTier.backend.dto.client;

import com.clearTier.backend.enums.ActionEnum;
<<<<<<< HEAD
import com.clearTier.backend.enums.PermissionStatusEnum;
=======
>>>>>>> feature/cristian
import com.clearTier.backend.enums.ResourceEnum;
import com.clearTier.backend.enums.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< HEAD
public class PermissionsResponseDTO {

    private Long id;
    private String timestamp;
    private RoleEnum rol;
    private ResourceEnum resource;
    private PermissionStatusEnum status;
    private String actor;
    private ActionEnum action;
    private String target;
=======

/*
    Datos que se llaman desde la base de datos para
    la vista pública del cliente en la pantalla.
    (Se usa DTO por tema de seguridad porque
    si se accede a la entidad de golpe es una mala
    práctica)
*/
public class PermissionsResponseDTO {

    private Long id;
    private RoleEnum rol;
    private ResourceEnum resource;
    private ActionEnum action;
>>>>>>> feature/cristian

}
