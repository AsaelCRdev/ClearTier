package com.clearTier.backend.utils;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class AutomationUtil {

    private static final String PROMPT_ROLE_AUTOMATION = "static/AutomationContext.txt";

    //Carga el prompt que tiene por defecto dependiendo la clase a automatizar
    public String loadPrompt() {
        try {
            ClassPathResource resource = new ClassPathResource(PROMPT_ROLE_AUTOMATION);

            if (!resource.exists()) {
                throw new RuntimeException(PROMPT_ROLE_AUTOMATION);
            }

            return Files.readString(
                    Paths.get(resource.getURI()),
                    StandardCharsets.UTF_8);

        }catch (Exception e) {
            throw new RuntimeException(PROMPT_ROLE_AUTOMATION);
        }
    }

    //Guarda el prompt con el request del cliente para pasarlo a la ia
    public String savePrompt(String message) {
        return String.format(loadPrompt(), message);
    }

    public String saveConfirmationPrompt(String message) {
        return savePrompt(message)
                .replace("{{MODE}}",
                        "CONFIRMACION");
    }

    public String saveCreationPrompt(String message) {
        return savePrompt(message)
                .replace("{{MODE}}",
                        "CREACION");
    }

}
