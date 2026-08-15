package com.clearTier.backend.utils;

import com.clearTier.backend.entities.AuditLog;
import com.clearTier.backend.repository.AuditLogRepository;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


@Aspect
@Component

public class AuditAspect {
    private final AuditLogRepository auditLogRepository;
    private final ExpressionParser parser = new SpelExpressionParser() ;

    public AuditAspect(AuditLogRepository auditLogRepository){
        this.auditLogRepository = auditLogRepository;
    }

    @Around("@annotation(captureAction)")
    public Object auditprocess(ProceedingJoinPoint joinPoint,CaptureAction captureAction)throws Throwable{
        Integer actorId = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if(auth != null && auth.isAuthenticated()){
        String identifier = auth.getName();
            try {
                actorId =Integer.parseInt(identifier);
            } catch (Exception e) {
               
            }
     }
        String action = captureAction.action();
        String targetType = captureAction.targetType();

    
        Integer targetId = evaluarTargetIdDinamico(joinPoint, captureAction.targetIdSpEL());

        
        Object resultado = joinPoint.proceed(); 

        AuditLog log = AuditLog.builder()
        .actorId(actorId)
        .action(action)
        .targetType(targetType)
        .targetId(targetId)
        .createdAt(LocalDateTime.now())
        .build();

        auditLogRepository.save(log);
        return resultado;
    }

     private Integer evaluarTargetIdDinamico(ProceedingJoinPoint joinPoint, String expressionStr) {
        if (expressionStr == null || expressionStr.isEmpty()) {
            return null;
        }
        try {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String[] parameterNames = signature.getParameterNames();
            Object[] args = joinPoint.getArgs();

            StandardEvaluationContext context = new StandardEvaluationContext();
            for (int i = 0; i < parameterNames.length; i++) {
                context.setVariable(parameterNames[i], args[i]);
            }

            return parser.parseExpression(expressionStr).getValue(context, Integer.class);
        } catch (Exception e) {
            System.err.println("Error al procesar el targetId de auditoría: " + e.getMessage());
            return null;
        }
    }

}
