package com.clearTier.backend.services;

import com.clearTier.backend.contracts.IAiConversation;
import com.clearTier.backend.contracts.IAutomation;
import com.clearTier.backend.dto.client.AiChangeResponseDTO;
import com.clearTier.backend.dto.request.AiChangeRequestDTO;
import com.clearTier.backend.dto.request.ConfirmationRequestDTO;
import com.clearTier.backend.dto.request.PermissionsRequestDTO;
import com.clearTier.backend.dto.request.RolRequestDTO;
import com.clearTier.backend.entities.AiChangeEntity;
import com.clearTier.backend.mappers.AiChangeMapper;
import com.clearTier.backend.repository.IAutomationChatRepository;
import com.clearTier.backend.utils.AutomationUtil;
import org.springframework.ai.chat.client.AdvisorParams;
import org.springframework.ai.chat.client.ChatClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Transactional
public class AutomationService implements IAiConversation, IAutomation {

    private static final Logger logger = LoggerFactory.getLogger(AutomationService.class);

    //Inyecciones de dependencia
    private final AutomationUtil automationUtil;
    private final ChatClient chatClient;
    private final RolService rolService;
    private final IAutomationChatRepository automationRepository;
    private final AiChangeMapper aiChangeMapper;
    private final PermissionsService permissionsService;

    //Variables útiles
    private final AtomicInteger requestCounter = new AtomicInteger(0);
    private final Map<String, Object> previewCache = new ConcurrentHashMap<>();

    //Constructor para la inyección de dependencias
    public AutomationService(AutomationUtil automationUtil,
                             ChatClient.Builder chatClient,
                             RolService rolService,
                             IAutomationChatRepository automationRepository,
                             AiChangeMapper aiChangeMapper,
                             PermissionsService permissionsService) {
        this.automationUtil = automationUtil;
        this.chatClient = chatClient.build();
        this.rolService = rolService;
        this.permissionsService = permissionsService;
        this.automationRepository = automationRepository;
        this.aiChangeMapper = aiChangeMapper;
    }

    //Limpia el contenido guardado para otra petición
    @Override
    public void ClearUsefulVariables(){
        previewCache.clear();
        requestCounter.set(0);
    }

    //Genera el objeto con IA usando el mensaje del usuario
    @Override
    public <T> T createPromptObject(String message, Class<T> requestType) {
        try {
            T result = chatClient
                    .prompt()
                    .advisors(AdvisorParams.ENABLE_NATIVE_STRUCTURED_OUTPUT)
                    .user(automationUtil.saveCreationPrompt(message))
                    .call()
                    .entity(requestType,
                            spec -> spec
                                    .useProviderStructuredOutput()
                                    .validateSchema());
            return result;

        }catch (Exception e) {
            logger.error("Error al generar contenido con Gemini", e);
            throw new RuntimeException("Error al generar objeto: " + e.getMessage(), e);
        }
    }

    //Obtiene el paso actual del mensaje contado
    public int getNextStep() {
        int current = requestCounter.get();
        if (current == 0) {
            return 1;
        } else if (current == 1) {
            return 2;
        } else {
            return 0;
        }
    }

    //Obtiene la clase DTO según el tipo de clase
    private Class<?> getDtoClass(String type) {
        return switch (type.toLowerCase()) {
            case "role" -> RolRequestDTO.class;
            case "permission" -> PermissionsRequestDTO.class;
            default -> throw new IllegalArgumentException("Tipo no soportado. Use 'role' o 'permission'");
        };
    }

    //Guarda el mensaje de petición del usuario
    @Override
    public void saveConfirmedRequest(AiChangeRequestDTO aiChangeRequestDTO) {
        AiChangeEntity nuevo = aiChangeMapper.ChangeToEntity(aiChangeRequestDTO);
        AiChangeEntity save = automationRepository.save(nuevo);
        aiChangeMapper.entityToResponse(save);
    }

    private void saveApprovedRequest(String originalMessage) {
        AiChangeEntity nuevo = aiChangeMapper.approvedMessageToEntity(originalMessage);
        automationRepository.save(nuevo);
    }

    //Muestra la lista de peticiones confirmadas de la bd
    @Override
    public List<AiChangeResponseDTO> getRecordsAutomation() {
        return automationRepository.findAll()
                .stream()
                .map(aiChangeMapper::entityToResponse)
                .toList();
    }

    //Confirmación del segundo mensaje para guardar el objeto
    private boolean isSave(String message) {
        return chatClient
                .prompt()
                .advisors(AdvisorParams.ENABLE_NATIVE_STRUCTURED_OUTPUT)
                .user(automationUtil.saveConfirmationPrompt(message))
                .call()
                .entity(ConfirmationRequestDTO.class,
                spec -> spec
                        .useProviderStructuredOutput()
                        .validateSchema())
                .isSave();
    }

    //SEGUNDA PETICIÓN: Usa el objeto del caché para crear
    //Usa el preview guardado después de que la IA interpreta la confirmación
    @Override
    public String createAutomatedRequest(String message, Class<?> type) {

        Object responseDto = previewCache
                .values()
                .stream()
                .findFirst()
                .orElse(null);

        if (responseDto == null) {
            return "No se encontró preview, Envíe mensaje para confirmar la acción.";
        }

        try {
            // Crear el registro usando el objeto del caché
            if (responseDto instanceof RolRequestDTO) {
                rolService.createRol((RolRequestDTO) responseDto);
            } else if (responseDto instanceof PermissionsRequestDTO) {
                permissionsService.createPermission((PermissionsRequestDTO) responseDto);
            } else {
                return "Tipo de DTO no soportado";
            }

            previewCache.clear();
            return "Se creó con éxito";

        } catch (Exception e) {
            return "Error al crear: " + e.getMessage();
        }
    }

    //Procesa la petición del chat
    public Map<String, Object> processChatRequest(String type, String message, AiChangeRequestDTO request) {

        try {
            Class<?> dtoClass = getDtoClass(type);
            int step = getNextStep();

            //Generar Preview
            if (step == 1) {
                Object response = createPromptObject(message, dtoClass);

                if (response == null) {
                    return Map.of("error", "No se pudo generar la vista previa");
                }

                //Guardar en caché y avanzar al paso 2
                requestCounter.incrementAndGet();
                previewCache.put(message, response);

                return Map.of(
                        "step", "preview",
                        "preview", response,
                        "message", "¿Desea guardar los cambios?"
                );
            }

            //Crear usando el Preview guardado
            else if (step == 2) {
                // El preview existe aunque el segundo mensaje sea distinto al primero.
                if (previewCache.isEmpty()) {
                    requestCounter.set(0);
                    return Map.of(
                            "error", "No se encontró preview. Envíe el mensaje nuevamente."
                    );
                }

                if (!isSave(message)) {
                    ClearUsefulVariables();
                    return Map.of(
                            "step", "cancelled",
                            "result", "Operación no guardada"
                    );
                }

                String originalMessage = previewCache.keySet().stream()
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("No se encontró el mensaje original"));
                saveApprovedRequest(originalMessage);
                String result = createAutomatedRequest(message, dtoClass);
                requestCounter.set(0);

                return Map.of(
                        "step", "created",
                        "result", result
                );
            }

            //Reiniciar el contador de mensajes
            else {
                ClearUsefulVariables();
                return Map.of(
                        "message", "Ciclo reiniciado." +
                                "Envíe un mensaje para generar preview."
                );
            }

        } catch (IllegalArgumentException e) {
            ClearUsefulVariables();
            return Map.of("error", e.getMessage());

        } catch (Exception e) {
            requestCounter.set(0);
            previewCache.clear();
            return Map.of(
                    "error", "Error al procesar la solicitud: "
                            + e.getMessage()
            );
        }
    }
}