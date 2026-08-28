package com.clearTier.backend.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ApiError {
    private int Status;
    private String message;
    private LocalDateTime timestamp;
}
