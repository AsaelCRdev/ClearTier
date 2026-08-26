# ClearTier

Aplicacion para administrar roles, permisos, recursos y auditoria de cambios. El proyecto esta dividido en un backend REST con Spring Boot y un frontend multipagina construido con HTML, CSS, TypeScript y Vite.

## Requisitos

- JDK 25, definido en `backend/pom.xml`.
- PostgreSQL en ejecucion.
- Node.js y npm.
- Una base de datos PostgreSQL llamada `ClearTier`.

## Arquitectura

```text
Navegador
	|
	| http://localhost:5173
	v
Frontend (frontend/src)
	| TypeScript: paginas-init, componentes y capa api
	| Vite sirve y compila las paginas HTML
	|
	| HTTP -> http://localhost:8081/api
	v
Backend (backend)
	| Spring MVC + Spring Security + Spring Data JPA
	| Servicios, DTOs, mappers y repositorios
	v
PostgreSQL (ClearTier)
```

### Backend

El punto de entrada es `backend/src/main/java/com/clearTier/backend/BackendApplication.java`. Spring Boot expone la API en el puerto `8081`. La configuracion de PostgreSQL esta en `backend/src/main/resources/application.properties`.

La API disponible incluye:

| Recurso | Endpoints |
| --- | --- |
| Roles | `GET /api/role`, `POST /api/role` |
| Recursos | `GET /api/resources` |
| Permisos | `GET /api/permissions`, `POST /api/permissions` |
| Matriz de permisos | `GET /api/permissions/matrix`, `PUT /api/permissions/matrix/{roleName}/{resourceName}` |
| Auditoria | `GET /api/audit?page=0&size=100` |
| Asistente IA | `GET /api/chat`, `POST /api/chat?type={tipo}` |

La persistencia se realiza con JPA/Hibernate y PostgreSQL. `spring.jpa.hibernate.ddl-auto=update` permite que Hibernate actualice el esquema al iniciar; para una instalacion inicial tambien se puede ejecutar `backend/Create Table ClearTier.sql`.

### Frontend

El frontend vive en `frontend/src` y usa Vite como servidor de desarrollo y empaquetador. Es una aplicacion multipagina con estas vistas:

- Login
- Dashboard
- Usuarios
- Roles
- Permisos
- Auditoria
- Asistente IA

Cada pagina HTML carga su propio inicializador desde `frontend/src/src/pages-init`. Los componentes reutilizables estan en `frontend/src/src/ts/components`, y los modelos y validadores estan separados en sus propias carpetas.

La capa `frontend/src/src/ts/api` centraliza el acceso a datos. Roles, permisos, recursos, auditoria y chat usan `apiFetch` contra `VITE_API_BASE_URL`. La autenticacion y la gestion de usuarios aun usan `mockBackend.ts`, por lo que esas partes funcionan en memoria y no representan una integracion completa con el backend.

## Configuracion de PostgreSQL

La configuracion actual espera:

```text
Host: localhost
Puerto: 5432
Base de datos: ClearTier
Usuario: postgres
```

La contrasena se toma actualmente de `application.properties`. Antes de compartir o desplegar el proyecto, cambia las credenciales y la API key de Gemini por variables de entorno o un mecanismo de secretos. No subas credenciales reales al repositorio; la clave que haya quedado expuesta debe ser rotada.

## Compilar y ejecutar el backend

Desde PowerShell, situado en la raiz del proyecto:

```powershell
cd backend
.\mvnw.cmd clean package
```

El JAR se genera en `backend/target/backend-0.0.1-SNAPSHOT.jar`.

Para iniciar el backend en modo desarrollo:

```powershell
.\mvnw.cmd spring-boot:run
```

Tambien se puede ejecutar el JAR compilado:

```powershell
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Para ejecutar las pruebas:

```powershell
.\mvnw.cmd test
```

## Compilar y ejecutar el frontend

El `package.json` esta en `frontend/src`, por lo que los comandos npm deben ejecutarse desde esa carpeta:

```powershell
cd frontend/src
npm ci --ignore-scripts
```

Para iniciar Vite:

```powershell
npm run dev
```

Abre la URL indicada por Vite, normalmente `http://localhost:5173`. La pagina raiz redirige al login.

Para generar el build de produccion:

```powershell
npm run build
```

El resultado se genera en `frontend/src/dist`. Para probar ese build localmente:

```powershell
npm run preview
```

La URL base del backend se puede cambiar creando `frontend/src/.env` a partir de `frontend/env.example`:

```dotenv
VITE_API_BASE_URL=http://localhost:8081/api
```

Vite inyecta las variables que empiezan por `VITE_` durante el build. Esta variable solo configura las llamadas que ya usan `apiFetch`; no reemplaza el mock de autenticacion ni el de usuarios.

## Ejecucion completa

Abre dos terminales.

**Terminal 1: backend**

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**Terminal 2: frontend**

```powershell
cd frontend/src
npm run dev
```

Con PostgreSQL activo, entra desde `http://localhost:5173`. El backend permite actualmente las peticiones CORS desde `http://localhost:5173` y `http://localhost:4200`.

## Estructura principal

```text
backend/
  pom.xml                         Dependencias y ciclo de compilacion Maven
  src/main/java/.../controllers   Endpoints REST
  src/main/java/.../services      Logica de negocio
  src/main/java/.../entities      Entidades JPA
  src/main/java/.../repository    Acceso a PostgreSQL
  src/main/resources/             Configuracion y recursos

frontend/src/
  package.json                    Scripts npm
  vite.config.ts                  Entradas multipagina de Vite
  src/pages/                      Paginas HTML
  src/pages-init/                 Inicializacion de cada pagina
  src/ts/api/                     Comunicacion con API y mocks
  src/ts/components/              Componentes reutilizables
  src/styles/                     Estilos globales
```

## Notas importantes

- La autenticacion actual del frontend es simulada y no valida usuarios contra Spring Security.
- `SecurityConfig` permite actualmente todas las peticiones HTTP; debe endurecerse antes de un despliegue real.
- El asistente IA necesita una API key valida de Google GenAI configurada de forma segura.
