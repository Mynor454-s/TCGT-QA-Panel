# Plan de Diseño de Aplicación — TCGT-QA-Panel

## Objetivo
Definir los componentes principales, servicios, interfaces y dependencias del panel de gestión de automatizaciones.

---

## Plan de Ejecución

- [x] Identificar componentes principales y sus responsabilidades
- [x] Definir métodos/interfaces de cada componente
- [x] Diseñar service layer (servicios y orquestación)
- [x] Mapear dependencias entre componentes
- [x] Validar completitud y consistencia del diseño

---

## Preguntas de Diseño

Por favor responde las siguientes preguntas llenando la letra después del tag `[Answer]:`.

### Componentes y Organización

## Question 1
¿Cómo prefieres organizar los módulos del panel en la navegación?

A) Sidebar fija con iconos + labels (estilo admin panel clásico)
B) Top navbar con tabs para cada sección
C) Sidebar colapsable (iconos cuando está colapsada, iconos + labels cuando está expandida)
D) Dashboard central con cards que llevan a cada módulo
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 2
¿Qué librería de UI/componentes prefieres para el panel?

A) Angular Material (oficial de Angular, Material Design)
B) PrimeNG (componentes ricos, tablas avanzadas, charts incluidos)
C) Tailwind CSS + componentes custom (máxima flexibilidad, sin dependencia de librería UI)
D) Bootstrap + ng-bootstrap (familiar, rápido de implementar)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
Para la visualización de resultados y métricas en el dashboard, ¿qué librería de charts prefieres?

A) Chart.js (via ng2-charts, simple y ligero)
B) Apache ECharts (via ngx-echarts, potente y personalizable)
C) D3.js (máximo control, más complejo)
D) Sin charts por ahora, solo tablas y contadores numéricos
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Service Layer

## Question 4
Para el service layer (que será mock por ahora pero preparado para API real), ¿qué patrón prefieres?

A) Interfaces TypeScript + clases concretas (MockTestService implements ITestService) — inyección vía Angular DI con tokens
B) Servicios con métodos que retornan Observables, datos hardcodeados por ahora, fácil de reemplazar el source
C) Patrón Repository con adaptadores (TestRepository → LocalAdapter ahora, HttpAdapter después)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
¿Cómo debe el panel descubrir los tests disponibles del proyecto TCGT-QA?

A) Leer los archivos .spec.ts del filesystem directamente (requiere acceso al filesystem del proyecto)
B) Parsear un archivo de manifiesto/índice generado previamente (JSON con metadata de todos los tests)
C) Ejecutar `npx playwright test --list` y parsear la salida para obtener la lista de tests
D) Configuración manual en el panel (el usuario registra los tests disponibles)
X) Other (please describe after [Answer]: tag below)

[Answer]: Por ahora que ejecute el npx playwright test pero dejalo abierto para obtenerlo a traves de una base de datos

---

## Question 6
¿El proyecto TCGT-QA estará en el mismo servidor/contenedor que el panel, o serán separados?

A) Mismo contenedor — el panel tiene acceso directo al filesystem de TCGT-QA
B) Contenedores separados pero en el mismo docker-compose (volumen compartido)
C) Completamente separados — comunicación solo vía API (cuando exista el backend)
D) Flexible — soportar tanto acceso local como remoto vía configuración
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

### Datos y Estado

## Question 7
¿Cómo debe persistir el historial de ejecuciones mientras no hay backend/DB?

A) LocalStorage del navegador (simple, pero se pierde si se limpia el browser)
B) Archivos JSON en el filesystem del servidor (persistente, requiere acceso a disco)
C) IndexedDB del navegador (más capacidad que localStorage, persiste entre sesiones)
D) Sin persistencia real por ahora — solo en memoria durante la sesión (mock data para demo)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 8
¿El scheduling de ejecuciones automáticas debe funcionar realmente en v1, o solo la UI para configurarlo?

A) Solo la UI — el usuario puede configurar schedules pero no se ejecutan automáticamente (requiere backend)
B) Funcional con un proceso Node.js simple que ejecute los cron jobs (script separado)
C) Solo la UI con un export de la configuración cron para que el usuario lo configure manualmente en su sistema
X) Other (please describe after [Answer]: tag below)

[Answer]: Solo UI pero dejarlo pensando para poder configurador con algun tipo de funcionalidad que prvenga del backend

---
