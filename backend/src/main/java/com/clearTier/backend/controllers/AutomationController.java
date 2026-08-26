package com.clearTier.backend.controllers;

import com.clearTier.backend.dto.request.AiChangeRequestDTO;
import com.clearTier.backend.services.AutomationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"})
public class AutomationController {

    private final AutomationService automationService;

    public AutomationController(AutomationService automationService) {
        this.automationService = automationService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> createAutomation(@RequestParam String type,
                                  @Valid @RequestBody AiChangeRequestDTO request) {
        String message = request.getPromptText();
        try {
            Map<String, Object> response = automationService.processChatRequest(type, message, request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("success", false,
                            "error", "Error en el servidor: " + e.getMessage()));
        }
    }

    @GetMapping("/chat")
    public ResponseEntity<?> getAllAutomation() {
        try{
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(automationService.getRecordsAutomation());
        }catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


}