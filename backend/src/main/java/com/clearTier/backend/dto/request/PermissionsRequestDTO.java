package com.clearTier.backend.dto.request;

import com.clearTier.backend.enums.ActionEnum;
<<<<<<< HEAD
import com.clearTier.backend.enums.PermissionStatusEnum;
import com.clearTier.backend.enums.ResourceEnum;
import com.clearTier.backend.enums.RoleEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
=======
import com.clearTier.backend.enums.ResourceEnum;
import com.clearTier.backend.enums.RoleEnum;
import jakarta.validation.constraints.NotNull;
>>>>>>> feature/cristian
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< HEAD
=======

/*
    Datos que ingresa el cliente en la
    pantalla para convertirlos en entidad.
    (Las anotaciones simplifican las validaciones)
*/
>>>>>>> feature/cristian
public class PermissionsRequestDTO {

    @NotNull(message = "Debe ingresar el nombre del rol")
    private RoleEnum rol;

    @NotNull(message = "Debe ingresar el nombre del recurso")
    private ResourceEnum resource;

<<<<<<< HEAD
    @NotNull(message = "Debe ingresar el estado del permiso")
    private PermissionStatusEnum status;

    @NotNull(message = "Debe ingresar la acción a ejecutar")
    private ActionEnum action;

    @NotBlank(message = "Debe ingresar el nombre del actor")
    @Size(min = 3, max = 100, message = "Debe ingresar entre 3 a 100 caracteres")
    private String actor;

    @NotBlank(message = "Debe ingresar el objetivo")
    @Size(min = 3, max = 100, message = "Debe ingresar entre 3 a 100 caracteres")
    private String target;
=======
    @NotNull(message = "Debe ingresar la acción a ejecutar")
    private ActionEnum action;
>>>>>>> feature/cristian
}