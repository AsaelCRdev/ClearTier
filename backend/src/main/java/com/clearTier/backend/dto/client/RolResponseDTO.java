package com.clearTier.backend.dto.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolResponseDTO {

    private String name;
    private String description;
    private Boolean isSystemRol;
    private int usersCount;

}
