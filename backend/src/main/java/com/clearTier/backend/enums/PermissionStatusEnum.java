package com.clearTier.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

<<<<<<< HEAD
=======
//Enum de prueba
>>>>>>> feature/cristian
@Getter
@AllArgsConstructor
public enum PermissionStatusEnum {
    ALLOW("allow"),
    DENY("deny"),
    UNSET("--");

    private final String value;

    @JsonCreator
    public static PermissionStatusEnum fromValue(String value) {
        for (PermissionStatusEnum action : PermissionStatusEnum.values()) {
            if (action.getValue().equalsIgnoreCase(value)) {
                return action;
            }
        }
        throw new IllegalArgumentException("Acción inválida: " + value);
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
