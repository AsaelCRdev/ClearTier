package com.clearTier.backend.config;

import com.clearTier.backend.entities.ResourceEntity;
import com.clearTier.backend.enums.ResourceEnum;
import com.clearTier.backend.repository.IResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ResourceDataInitializer implements CommandLineRunner {

    private final IResourceRepository resourceRepository;

    public ResourceDataInitializer(IResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public void run(String... args) {
        for (ResourceEnum resource : ResourceEnum.values()) {
            resourceRepository.findByName(resource.getValue())
                    .map(existingResource -> {
                        if (!resource.getDescription().equals(existingResource.getDescription())) {
                            existingResource.setDescription(resource.getDescription());
                            return resourceRepository.save(existingResource);
                        }
                        return existingResource;
                    })
                    .orElseGet(() -> resourceRepository.save(ResourceEntity.builder()
                                .name(resource.getValue())
                                .description(resource.getDescription())
                                .build()));
        }
    }
}