# IAM Control — Frontend (HTML + CSS + TypeScript + Bootstrap)

Frontend del "Asistente de Configuración de Permisos y Roles". Corre 100% en el navegador con un **mock backend en memoria** (ver `src/ts/api/mockBackend.ts`) — no necesitas Java, PostgreSQL ni una API key de Gemini para probarlo.

## Instalación (siguiendo las prácticas seguras de npm)
Antes de ejecuta cualquier comando se debe estar en la direccion del directorio de la carpeta frontend para poder aplicarlos
```bash
npm config set ignore-scripts true
npm ci --ignore-scripts
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`). Te redirige automáticamente a la pantalla de login.

Para entrar, cualquier valor no vacío en "Admin ID" y "Security Token" funciona (es un login simulado).

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura

Ver el documento `estructura-frontend-html-css-typescript.md` del proyecto para la explicación detallada de cada carpeta.

## Reemplazar el mock backend por el backend real

Cuando el backend de Spring Boot esté listo:
1. Borra `src/ts/api/mockBackend.ts`.
2. En cada archivo de `src/ts/api/*Api.ts`, reemplaza las llamadas a `dbXxx(...)` por `apiFetch('/ruta', { ... })` (ya definido en `apiClient.ts`).
3. Configura `VITE_API_BASE_URL` en tu `.env` apuntando al backend real.

Ningún archivo de `pages-init/` ni de `components/` necesita cambiar — ese es el punto de tener la capa de `api/` separada.
