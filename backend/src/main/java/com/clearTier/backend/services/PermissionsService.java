package com.clearTier.backend.services;

import com.clearTier.backend.contracts.IPermissionsService;
import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.dto.client.PermissionsResponseDTO;
import com.clearTier.backend.entities.PermissionsEntity;
import com.clearTier.backend.mappers.PermissionsMapper;
import com.clearTier.backend.repository.IPermissionsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PermissionsService implements IPermissionsService {

    private final IPermissionsRepository permissionsRepository;
    private final PermissionsMapper permissionsMapper;

    public PermissionsService(IPermissionsRepository permissionsRepository, PermissionsMapper permissionsMapper) {
        this.permissionsRepository = permissionsRepository;
        this.permissionsMapper = permissionsMapper;
    }

    @Override
    public PermissionsResponseDTO createPermission(PermissionsRequestDTO permissionsRequestDTO) {
        PermissionsEntity nuevo = permissionsMapper.permissionsToEntity(permissionsRequestDTO);
        PermissionsEntity save = permissionsRepository.save(nuevo);
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
