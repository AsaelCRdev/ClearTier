package com.clearTier.backend.services;

import com.clearTier.backend.contracts.IPermissionsService;
import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.dto.client.PermissionsResponseDTO;
import com.clearTier.backend.entities.PermissionsEntity;
import com.clearTier.backend.entities.ResourceEntity;
import com.clearTier.backend.entities.RolePermissionEntity;
import com.clearTier.backend.entities.RolEntity;
import com.clearTier.backend.mappers.PermissionsMapper;
import com.clearTier.backend.repository.IPermissionsRepository;
import com.clearTier.backend.repository.IRolePermissionRepository;
import com.clearTier.backend.repository.IRolRepository;
import com.clearTier.backend.repository.IResourceRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PermissionsService implements IPermissionsService {

    private final IPermissionsRepository permissionsRepository;
    private final PermissionsMapper permissionsMapper;
    private final IResourceRepository resourceRepository;
    private final IRolRepository rolRepository;
    private final IRolePermissionRepository rolePermissionRepository;

    public PermissionsService(IPermissionsRepository permissionsRepository, PermissionsMapper permissionsMapper,
                              IResourceRepository resourceRepository, IRolRepository rolRepository,
                              IRolePermissionRepository rolePermissionRepository) {
        this.permissionsRepository = permissionsRepository;
        this.permissionsMapper = permissionsMapper;
        this.resourceRepository = resourceRepository;
        this.rolRepository = rolRepository;
        this.rolePermissionRepository = rolePermissionRepository;
    }

    @Override
    public PermissionsResponseDTO createPermission(PermissionsRequestDTO permissionsRequestDTO) {
        PermissionsEntity nuevo = permissionsMapper.permissionsToEntity(permissionsRequestDTO);
        ResourceEntity resource = resourceRepository.findByName(permissionsRequestDTO.getResource().getValue())
            .orElseThrow(() -> new IllegalArgumentException("El recurso no existe: " + permissionsRequestDTO.getResource().getValue()));
        RolEntity rol = rolRepository.findByName(permissionsRequestDTO.getRol())
            .orElseThrow(() -> new IllegalArgumentException("El rol no existe: " + permissionsRequestDTO.getRol()));
        nuevo.setResource(resource);
        PermissionsEntity save = permissionsRepository.save(nuevo);
        rolePermissionRepository.save(RolePermissionEntity.builder().rol(rol).permission(save).build());
        return permissionsMapper.permissionsToResponse(save);
    }

    @Override
    public List<PermissionsResponseDTO> getPermission() {
        return permissionsRepository.findAll()
                .stream()
                .map(permissionsMapper::permissionsToResponse)
                .collect(Collectors.toList());
    }

}
