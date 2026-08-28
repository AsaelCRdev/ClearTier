import { apiFetch } from './apiClient';
import type { AiChangeRequest, AiChangeItem } from '../models/aiChange.model';

const MAX_PROMPT_LENGTH = 4000;
let lastAiType: 'role' | 'permission' = 'role';

export async function fetchAiQuota() {
  return { used: 0, limit: 1500 };
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
export async function interpretPrompt(promptText: string): Promise<{ outOfScope: boolean; request?: AiChangeRequest; type?: 'role' | 'permission' }> {
  if (promptText.length > MAX_PROMPT_LENGTH) {
    throw new Error(`La instrucción supera el máximo de ${MAX_PROMPT_LENGTH} caracteres`);
  }

  const type = /permiso|permission|acceso/i.test(promptText) ? 'permission' : 'role';
  lastAiType = type;
  const preview = await apiFetch<Record<string, unknown>>(`/chat?type=${type}`, {
    method: 'POST',
    body: JSON.stringify({ message: promptText }),
  });
  if (typeof preview.error === 'string') {
    throw new Error(preview.error);
  }
  if (!preview.preview) {
    throw new Error(typeof preview.message === 'string' ? preview.message : 'La IA no devolvió una vista previa válida.');
  }

  const draft = preview.preview as Record<string, unknown>;
  const items: AiChangeItem[] = type === 'role'
    ? [{ operation: 'ADD_ROLE', label: `ROLE "${draft.name ?? ''}"` }]
    : [{ operation: 'ALLOW', label: `${draft.resource ?? ''}:${draft.action ?? ''}` }];
  return { outOfScope: false, request: {
    id: crypto.randomUUID(),
    promptText,
    status: 'DRAFT',
    items,
    createdAt: new Date().toISOString(),
  }, type };
}

export async function commitAiChanges(requestId: string): Promise<void> {
  void requestId;
  const response = await apiFetch<{ error?: string; result?: string }>(`/chat?type=${lastAiType}`, {
    method: 'POST',
    body: JSON.stringify({ message: 'si, confirmar' }),
  });
  if (response.error) throw new Error(response.error);
  if (response.result?.startsWith('Error')) throw new Error(response.result);
}

export async function discardAiChanges(requestId: string): Promise<void> {
  void requestId;
  const response = await apiFetch<{ error?: string; result?: string }>(`/chat?type=${lastAiType}`, {
    method: 'POST',
    body: JSON.stringify({ message: 'no, cancelar' }),
  });
  if (response.error) throw new Error(response.error);
}

