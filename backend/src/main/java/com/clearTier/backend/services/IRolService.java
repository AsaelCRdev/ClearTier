package com.clearTier.backend.services;

import com.clearTier.backend.dto.request.RolRequestDTO;
import com.clearTier.backend.dto.client.RolResponseDTO;
import java.util.List;

//Definición de la lógica de negocios
public interface IRolService {

    RolResponseDTO createRol(RolRequestDTO rolRequestDTO);
    List<RolResponseDTO> getAllRol();
    //int countUsers();

}
