package com.clearTier.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class RolRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "debe tener entre 3 a 100 caracteres")
    private String name;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 3, max = 1000, message = "debe tener entre 3 a 100 caracteres")
    private String description;
}
