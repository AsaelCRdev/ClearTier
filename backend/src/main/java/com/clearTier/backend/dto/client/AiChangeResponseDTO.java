package com.clearTier.backend.dto.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChangeResponseDTO {

    private String promptText;
    private boolean isApproved;
    private LocalDateTime createdAt;
}
