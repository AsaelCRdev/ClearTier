package com.clearTier.backend.services;

import com.clearTier.backend.contracts.IRolService;
import com.clearTier.backend.dto.request.RolRequestDTO;
import com.clearTier.backend.dto.client.RolResponseDTO;
import com.clearTier.backend.entities.RolEntity;
import com.clearTier.backend.mappers.RolMapper;
import com.clearTier.backend.repository.IRolRepository;
import com.clearTier.backend.utils.CaptureAction;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RolService implements IRolService {

    private final IRolRepository rolRepository;
    private final RolMapper rolMapper;

    public RolService(IRolRepository rolRepository, RolMapper rolMapper) {
        this.rolRepository = rolRepository;
        this.rolMapper = rolMapper;
    }

    @Override
    @CaptureAction(action = "CREATE_ROLE", targetType = "ROLE", targetIdSpEL = "#result.id")
    public RolResponseDTO createRol(RolRequestDTO rolRequestDTO) {
        RolEntity rolEntity = rolMapper.toEntity(rolRequestDTO);
        RolEntity save= rolRepository.save(rolEntity);
        return rolMapper.toResponse(save);
    }

    @Override
    public List<RolResponseDTO> getAllRol() {
        return rolRepository.findAll()
                .stream()
                .map(rolMapper::toResponse)
                .collect(Collectors.toList());
    }

    //Se completará con el funcionamiento de los usuarios
    /*
    @Override
    public int countUsers() {
        return 0;
    }

     */


}
