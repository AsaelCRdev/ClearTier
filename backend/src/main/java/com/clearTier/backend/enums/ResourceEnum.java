package com.clearTier.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

//Enum de prueba
@Getter
@AllArgsConstructor
public enum ResourceEnum {
    DASHBOARD("dashboard", "Panel principal del sistema"),
    USERS("users", "Gestión de usuarios"),
    ROLES("roles", "Gestión de roles y permisos"),
    SETTINGS("settings", "Configuración del sistema"),
    AUDIT_LOGS("audit_logs", "Registro de auditoría"),;

    private final String value;
    private final String description;

    @JsonCreator
    public static ResourceEnum fromValue(String value) {
        for (ResourceEnum action : ResourceEnum.values()) {
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
