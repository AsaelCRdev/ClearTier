package com.clearTier.backend.controllers;

import com.clearTier.backend.dto.request.RolRequestDTO;
import com.clearTier.backend.dto.client.RolResponseDTO;
import com.clearTier.backend.services.RolService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RolController {
    //Inyección de dependencia
    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    //Crear rol
    @PostMapping("/role")
    public ResponseEntity<?> CrearRol(@Valid @RequestBody RolRequestDTO rolRequestDTO) {
        try{
            RolResponseDTO newRol = rolService.createRol(rolRequestDTO);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(newRol);
        }catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/role")
    public ResponseEntity<?> ObtenerRoles() {
        try{
            List<RolResponseDTO> listRols = rolService.getAllRol();
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(listRols);
        }catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }



}
