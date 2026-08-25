package com.clearTier.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

//Enum de prueba
@Getter
@AllArgsConstructor
public enum ActionEnum {
    CREATE("create"),
    READ ("read"),
    UPDATE("update"),
    DELETE("delete"),
    FULL_ACCESS ("full_access"),;

    private final String value;

    @JsonCreator
    public static ActionEnum fromValue(String value) {
        for (ActionEnum action : ActionEnum.values()) {
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
