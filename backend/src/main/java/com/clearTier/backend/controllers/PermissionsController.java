package com.clearTier.backend.controllers;

import com.clearTier.backend.dto.client.PermissionsResponseDTO;
import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.services.PermissionsService;

import jakarta.validation.Valid;
import com.clearTier.backend.utils.CaptureAction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class PermissionsController {

    private final PermissionsService permissionsService;

    public PermissionsController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @PostMapping("/permissions")
    @CaptureAction(
        action = "CREATE_PERMISSION", 
        targetType = "PERMISSION", 
        targetIdSpEL = "#nuevo.id"
    )
    public ResponseEntity<?> crear(@Valid @RequestBody PermissionsRequestDTO permissionsRequestDTO) {
        try {
            PermissionsResponseDTO nuevo = permissionsService.createPermission(permissionsRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);

        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/permissions")
    public ResponseEntity<?> obtenerTodos() {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(permissionsService.getPermission());

        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
