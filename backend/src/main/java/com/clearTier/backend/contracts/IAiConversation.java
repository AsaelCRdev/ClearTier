package com.clearTier.backend.contracts;

import com.clearTier.backend.dto.request.AiChangeRequestDTO;

import java.util.Map;

public interface IAiConversation {

    <T> T createPromptObject(String message, Class<T> requestType);
    String createAutomatedRequest(String message, Class<?> type);
    Map<String, Object> processChatRequest(String type, String message, AiChangeRequestDTO request);
    void ClearUsefulVariables();
}
