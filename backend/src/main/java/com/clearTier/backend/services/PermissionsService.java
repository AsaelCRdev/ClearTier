package com.clearTier.backend.services;

import com.clearTier.backend.contracts.IPermissionsService;
import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.dto.client.PermissionsResponseDTO;
import com.clearTier.backend.dto.client.PermissionMatrixCellDTO;
import com.clearTier.backend.enums.ActionEnum;
import com.clearTier.backend.entities.PermissionsEntity;
import com.clearTier.backend.entities.ResourceEntity;
import com.clearTier.backend.entities.RolePermissionEntity;
import com.clearTier.backend.entities.RolEntity;
import com.clearTier.backend.mappers.PermissionsMapper;
import com.clearTier.backend.repository.IPermissionsRepository;
import com.clearTier.backend.repository.IRolePermissionRepository;
import com.clearTier.backend.repository.IRolRepository;
import com.clearTier.backend.repository.IResourceRepository;
import com.clearTier.backend.utils.CaptureAction;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
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
    @CaptureAction(action = "CREATE_PERMISSION", targetType = "PERMISSION", targetIdSpEL = "#result.id")
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

    public List<PermissionMatrixCellDTO> getPermissionMatrix() {
        List<PermissionMatrixCellDTO> matrix = new ArrayList<>();
        rolRepository.findAll().forEach(role -> resourceRepository.findAll().forEach(resource -> {
            String effect = rolePermissionRepository
                    .findByRol_NameAndPermission_Resource_Name(role.getName(), resource.getName())
                    .map(RolePermissionEntity::getEffect)
                    .orElse("UNSET");
            matrix.add(new PermissionMatrixCellDTO(role.getName(), resource.getName(), effect));
        }));
        return matrix;
    }

    @CaptureAction(action = "UPDATE_PERMISSION", targetType = "PERMISSION", targetIdSpEL = "#result.id")
    public RolePermissionEntity togglePermission(String roleName, String resourceName) {
        RolePermissionEntity assignment = rolePermissionRepository
                .findByRol_NameAndPermission_Resource_Name(roleName, resourceName)
            .orElseGet(() -> {
                RolEntity role = rolRepository.findByName(roleName)
                    .orElseThrow(() -> new IllegalArgumentException("El rol no existe: " + roleName));
                ResourceEntity resource = resourceRepository.findByName(resourceName)
                    .orElseThrow(() -> new IllegalArgumentException("El recurso no existe: " + resourceName));
                PermissionsEntity permission = permissionsRepository
                    .findByResource_NameAndAction(resourceName, ActionEnum.READ)
                    .orElseGet(() -> permissionsRepository.save(PermissionsEntity.builder()
                        .resource(resource)
                        .action(ActionEnum.READ)
                        .build()));
                return RolePermissionEntity.builder()
                    .rol(role)
                    .permission(permission)
                    .effect("UNSET")
                    .build();
            });
        assignment.setEffect(switch (assignment.getEffect()) {
            case "ALLOW" -> "DENY";
            case "DENY" -> "UNSET";
            default -> "ALLOW";
        });
        if ("UNSET".equals(assignment.getEffect())) {
            rolePermissionRepository.delete(assignment);
        } else {
            rolePermissionRepository.save(assignment);
        }
        return assignment;
    }

}
