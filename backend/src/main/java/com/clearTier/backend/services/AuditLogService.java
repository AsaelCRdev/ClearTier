package com.clearTier.backend.services;

import com.clearTier.backend.entities.AuditLog;
import com.clearTier.backend.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService( AuditLogRepository auditLogRepository ){
        this.auditLogRepository = auditLogRepository;
    }

     @Transactional(readOnly = true)
     public Page<AuditLog>obtenerTodosLosLogs(int page,int size){
        Pageable pageable = PageRequest.of(page, size,Sort.by("createdAt").descending());
        return auditLogRepository.findAll(pageable);
    }
    
}