package com.clearTier.backend.controllers;

import com.clearTier.backend.dto.client.ResourceResponseDTO;
import com.clearTier.backend.repository.IResourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"})
public class ResourceController {

    private final IResourceRepository resourceRepository;

    public ResourceController(IResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> getAll() {
        List<ResourceResponseDTO> resources = resourceRepository.findAll().stream()
                .map(resource -> new ResourceResponseDTO(resource.getName(), resource.getDescription()))
                .toList();
        return ResponseEntity.ok(resources);
    }
}