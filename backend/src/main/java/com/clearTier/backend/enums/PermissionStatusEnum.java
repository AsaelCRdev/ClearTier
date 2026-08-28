package com.clearTier.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

//Enum de prueba
@Getter
@AllArgsConstructor
public enum PermissionStatusEnum {
    ALLOW("allow"),
    DENY("deny"),
    UNSET("--");

    private final String value;

    @JsonCreator
    public static PermissionStatusEnum fromValue(String value) {
        for (PermissionStatusEnum status : PermissionStatusEnum.values()) {
            if (status.getValue().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Estado de permiso inválido: " + value);
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
