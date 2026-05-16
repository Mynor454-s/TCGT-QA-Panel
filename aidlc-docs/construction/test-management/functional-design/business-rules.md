# Business Rules — Unit 2: Test Management + Data Providers

## BR-T01: Test Discovery

| Rule | Description |
|------|-------------|
| BR-T01.1 | Los tests se descubren al cargar el módulo (lazy, primera vez) |
| BR-T01.2 | El usuario puede forzar un refresh manual de la lista |
| BR-T01.3 | Si el discovery falla, mostrar error y permitir reintentar |
| BR-T01.4 | Los tags se extraen del título del test (palabras con @) |
| BR-T01.5 | La prioridad se infiere del tag @P0-@P3 (default: P2 si no tiene) |
| BR-T01.6 | El flujo se infiere del tag @B2B/@B2C o de la ruta del archivo |
| BR-T01.7 | El ID del test es un hash determinístico de file + title |

## BR-T02: Test Filtering

| Rule | Description |
|------|-------------|
| BR-T02.1 | Los filtros son aditivos (AND): todos los criterios deben cumplirse |
| BR-T02.2 | Dentro de un mismo filtro (ej: tags), es OR: al menos uno debe coincidir |
| BR-T02.3 | El filtro de búsqueda es case-insensitive y busca en el título |
| BR-T02.4 | Los filtros se aplican en el cliente (no requieren re-fetch) |
| BR-T02.5 | Al limpiar filtros, se muestra la lista completa |
| BR-T02.6 | Los filtros activos se muestran como chips removibles |

## BR-T03: Test Selection

| Rule | Description |
|------|-------------|
| BR-T03.1 | El usuario puede seleccionar tests individuales con checkbox |
| BR-T03.2 | El usuario puede seleccionar todos los tests visibles (filtrados) |
| BR-T03.3 | La selección persiste al cambiar filtros (no se pierde) |
| BR-T03.4 | Se muestra un resumen de selección (N tests seleccionados) |
| BR-T03.5 | Desde la selección se puede navegar a Ejecución con los tests pre-seleccionados |

## BR-D01: Dataset Management

| Rule | Description |
|------|-------------|
| BR-D01.1 | Los datasets se cargan al entrar al módulo |
| BR-D01.2 | Cada dataset muestra sus keys disponibles |
| BR-D01.3 | El contenido de un dataset se muestra como JSON formateado |
| BR-D01.4 | La edición de datasets valida el formato antes de guardar |
| BR-D01.5 | Si la validación falla, mostrar errores específicos |

## BR-D02: Test Matrix

| Rule | Description |
|------|-------------|
| BR-D02.1 | El test-matrix muestra la relación escenario → dataset |
| BR-D02.2 | Cada escenario muestra: ID, nombre, tags, data provider, datasets |
| BR-D02.3 | El test-matrix es editable (agregar/remover escenarios) |
| BR-D02.4 | Los cambios al test-matrix se validan antes de guardar |
