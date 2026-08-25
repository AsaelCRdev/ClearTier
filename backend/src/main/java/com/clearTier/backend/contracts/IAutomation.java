package com.clearTier.backend.contracts;

import com.clearTier.backend.dto.client.AiChangeResponseDTO;
import com.clearTier.backend.dto.request.AiChangeRequestDTO;

import java.util.List;

public interface IAutomation {
    void saveConfirmedRequest(AiChangeRequestDTO aiChangeRequestDTO);
    public List<AiChangeResponseDTO> getRecordsAutomation();
}
