package com.clearTier.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResourceEnum {
    DASHBOARD("dashboard"),
    USERS("users"),
    ROLES("roles"),
    SETTINGS("settings"),
    AUDIT_LOGS("audit_logs"),;

    private final String value;

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
