import { delay } from './apiClient';
import { dbGetAiQuota, dbConsumeAiQuota, dbCreateAiDraft, dbCommitAiDraft, dbRejectAiDraft, dbGetResources } from './mockBackend';
import type { AiChangeRequest, AiChangeItem } from '../models/aiChange.model';

const MAX_PROMPT_LENGTH = 4000; // Restricción exacta de la Historia "Automatización de tareas"

// Palabras que delimitan el alcance del asistente (regla de negocio / RNF 2.5.3):
// si el prompt no contiene ninguna de ellas, se considera fuera de alcance.
const IN_SCOPE_KEYWORDS = ['rol', 'permiso', 'acceso', 'usuario', 'dashboard', 'auditoria', 'auditoría', 'ver', 'bloquea', 'bloquear', 'edicion', 'edición', 'denie', 'niega'];

export async function fetchAiQuota() {
  return delay(dbGetAiQuota());
}

/**
 * =========================================================================
 * INTÉRPRETE SIMULADO ("Mock Gemini")
 * =========================================================================
 * Esta función IMITA lo que hará el backend real: el administrador de TI
 * escribe una instrucción, un modelo de lenguaje la interpreta y devuelve
 * una lista estructurada de cambios (AiChangeItem[]). Aquí, en vez de
 * llamar a Gemini, se usa una heurística simple basada en palabras clave
 * SOLO para que el frontend tenga algo real que mostrar en el diff.
 *
 * Esta función se elimina por completo cuando el backend esté listo: la
 * página de AI Assistant seguirá llamando a `interpretPrompt()`, pero esa
 * función pasará a hacer un `apiFetch('/ai/interpret', { method: 'POST', ... })`
 * que le pega al endpoint de Spring AI + Gemini.
 * =========================================================================
 */
export async function interpretPrompt(promptText: string): Promise<{ outOfScope: boolean; request?: AiChangeRequest }> {
  if (promptText.length > MAX_PROMPT_LENGTH) {
    throw new Error(`La instrucción supera el máximo de ${MAX_PROMPT_LENGTH} caracteres`);
  }

  const hasQuota = dbConsumeAiQuota();
  if (!hasQuota) {
    throw new Error('Se alcanzó el límite diario de solicitudes a la IA (1500/día). Intenta de nuevo mañana.');
  }

  const lower = promptText.toLowerCase();
  const isInScope = IN_SCOPE_KEYWORDS.some((kw) => lower.includes(kw));
  if (!isInScope) {
    return delay({ outOfScope: true });
  }

  // Extrae un nombre de rol si el prompt lo menciona entre comillas o tras "rol para/de".
  const quotedMatch = promptText.match(/"([^"]+)"/);
  const roleNameMatch = promptText.match(/rol (?:para|de)\s+([a-záéíóúñ\s]+?)(?:que|para|,|\.|$)/i);
  const roleName = quotedMatch?.[1] ?? (roleNameMatch?.[1]?.trim() ? capitalize(roleNameMatch[1].trim()) : 'Nuevo Rol (IA)');

  const resources = dbGetResources();
  const items: AiChangeItem[] = [{ operation: 'ADD_ROLE', label: `ROLE "${roleName}"` }];

  for (const resource of resources) {
    if (lower.includes(resource.name) || lower.includes(resource.label.toLowerCase())) {
      const denied = /bloquea|bloquear|niega|denegado|no pued[ae]/i.test(lower);
      items.push({ operation: denied ? 'DENY' : 'ALLOW', label: `${resource.name}:view` });
    }
  }
  if (items.length === 1) {
    // Si no se detectó ningún recurso mencionado, se asume una vista mínima.
    items.push({ operation: 'ALLOW', label: 'dashboard:view' });
  }

  const request = dbCreateAiDraft(promptText, items);
  return delay({ outOfScope: false, request });
}

export async function commitAiChanges(requestId: string): Promise<void> {
  dbCommitAiDraft(requestId);
  return delay(undefined);
}

export async function discardAiChanges(requestId: string): Promise<void> {
  dbRejectAiDraft(requestId);
  return delay(undefined);
}

function capitalize(text: string): string {
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
}
