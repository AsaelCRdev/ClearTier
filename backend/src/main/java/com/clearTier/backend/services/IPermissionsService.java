package com.clearTier.backend.services;

import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.dto.client.PermissionsResponseDTO;
import java.util.List;

public interface IPermissionsService {

    PermissionsResponseDTO createPermission(PermissionsRequestDTO rolRequestDTO);
    List<PermissionsResponseDTO> getPermission();

}
