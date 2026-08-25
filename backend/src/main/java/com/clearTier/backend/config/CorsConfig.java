package com.clearTier.backend.config;

import jakarta.validation.constraints.NotNull;
<<<<<<< HEAD
import org.springframework.context.annotation.Bean;
=======
>>>>>>> feature/cristian
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

<<<<<<< HEAD
    @Bean
=======

>>>>>>> feature/cristian
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            public void addCorsMapping(@NotNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200") //Ruta para el front
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
