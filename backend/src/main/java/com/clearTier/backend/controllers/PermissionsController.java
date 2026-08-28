package com.clearTier.backend.controllers;

import com.clearTier.backend.dto.client.PermissionsResponseDTO;
import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.services.PermissionsService;
import com.clearTier.backend.dto.client.PermissionMatrixCellDTO;
import com.clearTier.backend.entities.RolePermissionEntity;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"})
public class PermissionsController {

    private final PermissionsService permissionsService;

    public PermissionsController(PermissionsService permissionsService) {
        this.permissionsService = permissionsService;
    }

    @PostMapping("/permissions")
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

    @GetMapping("/permissions/matrix")
    public ResponseEntity<java.util.List<PermissionMatrixCellDTO>> matrix() {
        return ResponseEntity.ok(permissionsService.getPermissionMatrix());
    }

    @PutMapping("/permissions/matrix/{roleName}/{resourceName}")
    public ResponseEntity<PermissionMatrixCellDTO> toggle(
            @PathVariable String roleName, @PathVariable String resourceName) {
        RolePermissionEntity assignment = permissionsService.togglePermission(roleName, resourceName);
        return ResponseEntity.ok(new PermissionMatrixCellDTO(
                roleName, resourceName, assignment.getEffect()));
    }
}
