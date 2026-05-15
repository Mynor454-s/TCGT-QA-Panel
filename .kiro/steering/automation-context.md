---
inclusion: auto
---

# Contexto: Proyecto de Automatización (TCGT-QA)

Este panel se construye como interfaz de gestión para el proyecto de automatización E2E existente en el repositorio `TCGT-QA`. A continuación se describe el contexto necesario para que el panel interactúe correctamente con la automatización.

## Producto bajo prueba

**Tarjeta Digital (TDCGT)** — Plataforma de onboarding digital de tarjetas de crédito para Banco Industrial (Guatemala). Permite a clientes solicitar tarjetas mediante un flujo web con verificación de identidad, biometría y formularios.

## Flujos de negocio

| Flujo | Descripción | Entry Point |
|-------|-------------|-------------|
| B2B (Cliente Directo) | Cliente aplica directamente, sin login | `/cliente-digital/inicio` |
| B2C (Comercios) | Comercio aplica en nombre del cliente, requiere login | `/comercio/sitio/inicio-sesion` |
| TCJ | Variante Mastercard Liv con selección de color y lealtad | Mismo entry que B2B |

## Ambientes

| Ambiente | URL | Variable |
|----------|-----|----------|
| QA (default) | `qa-tarjetadigital.incubadorabi.com` | `ENV=qa` |
| STG | `stg-tarjetadigital.incubadorabi.com` | `ENV=stg` |

## Comandos de ejecución de tests

```bash
# Todos los tests
npx playwright test

# Solo smoke (P0)
npx playwright test --grep "@smoke"

# Regresión (P0 + P1)
npx playwright test --grep "@P0|@P1"

# Por archivo específico
npx playwright test flujoCompletoCliente.spec.ts

# Por ambiente
ENV=stg npx playwright test

# Generar reporte HTML
npx playwright show-report
```

## Estructura de tests disponibles

### Flujos E2E (Happy Path)

| ID | Nombre | Archivo | Prioridad | Tags |
|----|--------|---------|-----------|------|
| E2E-001 | Flujo completo B2B - Cliente nuevo | `flujoCompletoClienteMatrixDriven.spec.ts` | P0 | @smoke @e2e @B2B |
| E2E-002 | Flujo completo TCJ - Cliente nuevo | `TCJ/flujoCompletoClienteTCJMatrixDriven.spec.ts` | P0 | @smoke @e2e @B2B |
| E2E-B2C-001 | Flujo completo B2C - Comercio | `B2C/flujoCompletoB2CClienteMatrixDriven.spec.ts` | P0 | @smoke @e2e @B2C |

### Validaciones UI

| ID | Nombre | Casos | Prioridad |
|----|--------|-------|-----------|
| VAL-UI-B2C-001 | Labels Login B2C | 6 | P1 |
| VAL-UI-DPI-001 | DPI B2C | 3 | P1 |
| VAL-UI-PWD-001 | Contraseña B2C | 3 | P1 |
| VAL-UI-BTN-001 | Botón Login B2C | 4 | P1 |
| VAL-UI-EMAIL-001 | Email B2C | 4 | P1 |
| VAL-UI-NIT-001 | NIT B2C | 4 | P1 |
| VAL-UI-TEL-001 | Teléfono B2C | 3 | P1 |
| VAL-MODAL-INST-001 | Modal Instructivo | 5 | P1 |
| VAL-MODAL-FP-001 | Modal Error FacePhi | 4 | P1 |
| VAL-UI-LOGIN2-001 | Login Actualizado | 11 | P1 |
| VAL-UI-LAYOUT-001 | Layout Negocio Propio | 1 | P2 |
| VAL-REG-SELPHI-001 | Regresión Selphi | 1 | P0 |

## Datos de prueba

Los datasets viven en archivos JSON:

- `data/data_new_client.json` — Clientes B2B (keys: `Marcos`, `Monther`)
- `data/data_new_client_TCJ.json` — Clientes TCJ (key: `Marcos`)
- `data/test-matrix.json` — Registro central de escenarios
- `data/ui-expected-values.json` — Valores esperados para validaciones UI

### Estructura de un dataset de cliente

```json
{
  "Marcos": {
    "dpi": "3889788561412",
    "tipoTarjeta": "VISA",
    "email": "test7@bi.com.gt",
    "numeroCelular": "41111117",
    "nit": "107821567",
    "fechaInicioTrabajo": "20/06/2015",
    "Alias": "Marcos",
    "IngresoMensual": "4500",
    "GastoMensual": "1500",
    "economicCheckboxes": ["Trabajo en una empresa"],
    "empresa": { "nombre": "...", "puesto": "...", ... },
    "assets": { "templateRaw": "s3://...", "bestImage": "s3://...", ... },
    "bel": { "username": "marcos", "compania": "Tigo" }
  }
}
```

## Reportes generados

| Formato | Ubicación | Uso |
|---------|-----------|-----|
| HTML | `playwright-report/index.html` | Reporte visual interactivo |
| JSON | `test-results/results.json` | Parseable para dashboards |
| JUnit XML | `test-results/results.xml` | Integración CI/CD |
| Screenshots | `test-results/*/test-failed-*.png` | Solo en fallos |
| Traces | `test-results/*/trace.zip` | Debug de fallos |

## Prioridades y tiempos estimados

| Suite | Escenarios | Tiempo estimado |
|-------|-----------|-----------------|
| Smoke (P0) | 3 | ~8 min |
| Regresión (P0+P1) | 13 | ~13.5 min |
| Full | 14 | ~14 min |

## Configuración técnica del proyecto de automatización

- **Framework**: Playwright (`@playwright/test` ^1.55.0)
- **Lenguaje**: TypeScript (strict, ES2020, CommonJS)
- **Runtime**: Node.js v18+
- **Browser**: Chrome (channel mode)
- **Timeout global**: 20 min por test
- **Retries**: 0
- **Assets biométricos**: Almacenados en S3 (`storage-tdcgt-test`)

## Integración esperada Panel ↔ Automatización

El panel debe poder:
1. **Ejecutar tests** — Invocar comandos de Playwright con filtros (por tag, archivo, ambiente)
2. **Leer resultados** — Parsear `test-results/results.json` y `results.xml`
3. **Gestionar datos** — CRUD sobre los archivos JSON de `data/`
4. **Mostrar reportes** — Servir o linkear al HTML report de Playwright
5. **Monitorear** — Mostrar estado de última ejecución, pass rate, tendencias
