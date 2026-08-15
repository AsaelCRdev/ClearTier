package com.clearTier.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RoleEnum {
    SUPER_ADMIN("super_admin"),
    MANAGER("manager"),
    EDITOR("editor"),
    VIEWER("viewer"),;

    private final String value;

    @JsonCreator
    public static RoleEnum fromValue(String value) {
        for (RoleEnum action : RoleEnum.values()) {
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
