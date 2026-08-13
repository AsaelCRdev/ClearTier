package com.clearTier.backend.dto.client;

import com.clearTier.backend.enums.ActionEnum;
import com.clearTier.backend.enums.PermissionStatusEnum;
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
public class PermissionsResponseDTO {

    private Long id;
    private String timestamp;
    private RoleEnum rol;
    private ResourceEnum resource;
    private PermissionStatusEnum status;
    private String actor;
    private ActionEnum action;
    private String target;

}
