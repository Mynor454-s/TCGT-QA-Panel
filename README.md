# TCGT-QA Panel

Panel de gestión de automatizaciones para el equipo de QA. Permite gestionar, ejecutar y monitorear los tests de Playwright del proyecto TCGT-QA desde una interfaz web amigable.

## Características

- **Gestión de Tests** — Listar, filtrar y seleccionar tests por archivo, tag, prioridad o flujo (B2B/B2C/TCJ)
- **Data Providers** — Visualizar y editar datasets de prueba (`data_new_client.json`, `test-matrix.json`)
- **Ejecución** — Configurar y lanzar ejecuciones (local o BrowserStack) en ambiente QA o STG
- **Reportes** — Ver resultados detallados con logs, screenshots, traces y reporte HTML de Playwright
- **Historial** — Consultar ejecuciones pasadas con filtros y tendencias
- **Scheduling** — Programar ejecuciones automáticas (UI lista, ejecución requiere backend futuro)
- **Configuración** — Gestionar ambientes, conexión con TCGT-QA y credenciales de BrowserStack

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd TCGT-QA-Panel

# Instalar dependencias
npm install
```

## Desarrollo

```bash
# Terminal 1: Backend API (en TCGT-QA/)
cd ../TCGT-QA
npm run server
# → 🚀 TCGT-QA API running on port 3001

# Terminal 2: Panel (desarrollo local con hot reload)
npx ng serve
# → http://localhost:4200 (proxy automático a backend:3001)

# O con Docker (solo el panel, backend sigue local):
sudo docker compose -f ../TCGT-QA/docker-compose.yml up --build
```

## Producción (Docker)

```bash
# Terminal 1: Backend (en la máquina, con display para ver Chrome)
cd TCGT-QA
npm run server

# Terminal 2: Panel en Docker
cd TCGT-QA
sudo docker compose up --build
# → Panel en http://localhost:4200
# → Backend en localhost:3001 (proxy via nginx)
```

**Nota**: El backend corre fuera de Docker para que Playwright pueda abrir Chrome visible en el escritorio.

## Estructura del Proyecto

```
src/app/
├── core/                     # Servicios, interfaces, modelos, tokens DI
│   ├── interfaces/           # Contratos de servicio (ITestDiscoveryService, etc.)
│   ├── models/               # Tipos TypeScript compartidos
│   ├── tokens/               # InjectionTokens para Angular DI
│   └── services/
│       ├── mock/             # Implementaciones mock (v1)
│       └── local/            # Implementaciones con IndexedDB
├── shared/                   # Componentes, pipes y directivas reutilizables
│   ├── components/           # Card, DataTable, StatusBadge, SearchInput, etc.
│   └── pipes/                # duration, statusLabel, relativeDate
├── layout/                   # Header, NotificationToast, LoadingOverlay
└── features/                 # Módulos de funcionalidad (lazy loaded)
    ├── dashboard/
    ├── test-management/
    ├── data-provider/
    ├── execution/
    ├── reports/
    ├── history/
    ├── scheduling/
    └── configuration/
```

## Módulos

### Dashboard (`/dashboard`)
Vista principal con métricas resumidas, ejecuciones recientes y acceso rápido a todos los módulos.

### Gestión de Tests (`/tests`)
Lista todos los tests disponibles del proyecto TCGT-QA. Permite:
- Filtrar por prioridad (P0-P3), flujo (B2B/B2C/TCJ), tags (@smoke, @e2e, @validation)
- Buscar por nombre
- Seleccionar tests para ejecución

### Data Providers (`/data-providers`)
Visualiza los datasets de prueba:
- `data_new_client.json` — Datos de clientes (keys: Marcos, Monther)
- `data_new_client_TCJ.json` — Datos para flujo TCJ
- `test-matrix.json` — Registro central de escenarios

### Ejecutar (`/execute`)
Configura y lanza ejecuciones:
1. Seleccionar tests
2. Elegir ambiente (QA/STG)
3. Elegir modo (Local/BrowserStack)
4. Ejecutar y ver progreso en tiempo real

### Reportes (`/reports/:runId`)
Muestra resultados detallados de una ejecución:
- Resumen (total, exitosos, fallidos, tasa de éxito)
- Tabla de resultados por test con estado, duración y errores
- Integración con reporte HTML de Playwright

### Historial (`/history`)
Lista todas las ejecuciones pasadas con:
- Fecha, estado, cantidad de tests, resultados, duración, ambiente
- Click para ver el reporte completo

### Scheduling (`/scheduling`)
Configura ejecuciones programadas:
- Nombre, cron expression, tags, ambiente, modo
- Los schedules se guardan en IndexedDB
- La ejecución automática requiere backend (futuro)

### Configuración (`/configuration`)
Gestiona:
- Conexión con TCGT-QA (path local o URL remota)
- URLs de ambientes QA y STG
- Credenciales de BrowserStack
- Preferencias (ambiente y modo por defecto)

## Arquitectura

### Service Layer
El panel usa un patrón de **Interfaces + DI Tokens** que permite reemplazar implementaciones sin cambiar componentes:

```typescript
// Interface definida en core/interfaces/
interface ITestDiscoveryService { ... }

// Token en core/tokens/
const TEST_DISCOVERY_SERVICE = new InjectionToken<ITestDiscoveryService>('...');

// Mock (v1) en core/services/mock/
class MockTestDiscoveryService implements ITestDiscoveryService { ... }

// Futuro: HTTP implementation
class HttpTestDiscoveryService implements ITestDiscoveryService { ... }
```

Para conectar un backend real, solo hay que crear nuevas implementaciones y cambiar el provider en `app.config.ts`.

### Persistencia
- **v1**: IndexedDB para historial, schedules y configuración
- **Futuro**: API REST + base de datos

### Styling
- Tailwind CSS 3 para estilos utilitarios
- Componentes custom (sin dependencia de librería UI)

## Tech Stack

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Angular | 21.2 | Framework frontend |
| TypeScript | 5.9 | Lenguaje |
| Tailwind CSS | 3.x | Estilos |
| Vitest | 4.x | Test runner |
| fast-check | latest | Property-based testing |
| Docker | — | Deployment |
| nginx | alpine | Servidor de producción |

## Roadmap (Futuro)

- [ ] Backend con Node.js/Express
- [ ] Base de datos para persistencia real
- [ ] WebSockets para resultados en tiempo real
- [ ] Ejecución real de tests (no mock)
- [ ] Notificaciones push/email
- [ ] Integración con Jira
- [ ] Soporte para múltiples proyectos de automatización
