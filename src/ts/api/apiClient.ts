/**
 * Simula la latencia de una petición de red real. Los demás módulos de
  `api/` la usan para que la UI muestre estados de carga de forma
  realista, en vez de que los datos aparezcan instantáneamente.
 */
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/* Base URL del backend real. Se lee de una variable de entorno inyectada
   por Vite  para no hardcodear la URL en el código.Todavía NO se usa en este esqueleto, 
   pero queda lista para el día que reemplaces mockBackend.ts por llamadas reales.
*/
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

/* Wrapper de fetch que centraliza: adjuntar el JWT, parsear JSON y 
  convertir respuestas de error HTTP en excepciones legibles.*/
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('iam_token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    window.location.href = '/src/pages/login.html';
    throw new Error('Sesión expirada');
  }
  if (response.status === 429) {
    throw new Error('Se alcanzó el límite diario de solicitudes a la IA. Intenta de nuevo mañana.');
  }
  if (!response.ok) {
    throw new Error(`Error del servidor (${response.status})`);
  }
  return response.json() as Promise<T>;
}
