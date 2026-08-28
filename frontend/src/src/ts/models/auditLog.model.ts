/*Una entrada del log de auditoría."actor" es el nombre de quien hizo el cambio, o 
 "System" para cambios automáticos, tal como se ve en la pantalla Audit Trail.
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
}
