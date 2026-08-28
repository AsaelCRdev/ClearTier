import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

/*Este proyecto usa "type": "module" en package.json (ESM), y en ESM no
  existe la variable __dirname que sí existe en CommonJS. `import.meta.url`
  es el equivalente moderno: da la URL del archivo actual, y fileURLToPath
  la convierte a una ruta de sistema de archivos normal. `r()` es un atajo
  para resolver una ruta relativa a este archivo, sin depender de __dirname.
 */
const r = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url));

/*Al ser un sitio multi-página y no que unicamente contenga un index.html,
  hay que decirle a Vite explícitamente cuáles son todas las páginas que
  debe incluir en el build de producción. En modo `dev`
  esto no es necesario: Vite sirve cualquier archivo directamente.
 */
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: r('index.html'),
        login: r('src/pages/login.html'),
        dashboard: r('src/pages/dashboard.html'),
        users: r('src/pages/users/users.html'),
        roles: r('src/pages/roles/roles.html'),
        permissions: r('src/pages/permissions/permissions.html'),
        audit: r('src/pages/audit/audit.html'),
        aiAssistant: r('src/pages/ai-assistant/ai-assistant.html'),
      },
    },
  },
});
