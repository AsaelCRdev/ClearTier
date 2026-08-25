package com.clearTier.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChangeRequestDTO {

    @NotBlank(message = "Debe ingresar el mensaje")
    @JsonProperty("message")
    private String promptText;

}
