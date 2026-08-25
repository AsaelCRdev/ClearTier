package com.clearTier.backend.dto.request;

import com.clearTier.backend.enums.ActionEnum;
import com.clearTier.backend.enums.ResourceEnum;
import com.clearTier.backend.enums.RoleEnum;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

/*
    Datos que ingresa el cliente en la
    pantalla para convertirlos en entidad.
    (Las anotaciones simplifican las validaciones)
*/
public class PermissionsRequestDTO {

    @NotNull(message = "Debe ingresar el nombre del rol")
    private RoleEnum rol;

    @NotNull(message = "Debe ingresar el nombre del recurso")
    private ResourceEnum resource;

    @NotNull(message = "Debe ingresar la acción a ejecutar")
    private ActionEnum action;
}