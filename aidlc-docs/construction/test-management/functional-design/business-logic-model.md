# Business Logic Model — Unit 2: Test Management + Data Providers

## 1. Test Discovery Logic

### Flujo de Descubrimiento
```
Panel solicita tests → MockTestDiscoveryService
  → Simula salida de `npx playwright test --list`
  → Parsea la salida en TestItem[]
  → Extrae tags, prioridad, flujo, archivo de cada test
  → Retorna lista completa
```

### Parsing de Tests (desde salida de Playwright)
La salida de `npx playwright test --list` tiene el formato:
```
  flujoCompletoCliente.spec.ts
    flujo completo @smoke @e2e @P0 @B2B
  flujoCompletoClienteTCJ.spec.ts
    flujo completo TCJ @e2e @P1 @B2B
```

**Algoritmo de parsing**:
1. Leer cada línea de la salida
2. Si la línea termina en `.spec.ts` → es un archivo
3. Si la línea está indentada bajo un archivo → es un test
4. Extraer tags del título (palabras que empiezan con @)
5. Determinar prioridad del tag @P0-@P3
6. Determinar flujo del tag @B2B/@B2C o inferir de la ruta del archivo
7. Generar ID único (hash de file + title)

### Filtrado de Tests
```typescript
filterTests(tests: TestItem[], filter: TestFilter): TestItem[] {
  return tests.filter(test => {
    if (filter.search && !test.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (filter.tags?.length && !filter.tags.some(t => test.tags.includes(t))) return false;
    if (filter.priority?.length && !filter.priority.includes(test.priority)) return false;
    if (filter.flow?.length && !filter.flow.includes(test.flow)) return false;
    if (filter.file && test.file !== filter.file) return false;
    return true;
  });
}
```

---

## 2. Data Provider Logic

### Gestión de Datasets
```
Panel solicita datasets → MockDataProviderService
  → Lee archivos JSON mock (simula data_new_client.json, data_new_client_TCJ.json)
  → Retorna lista de datasets con sus keys
```

### Estructura de Dataset
```json
{
  "Marcos": { "dpi": "...", "nombre": "...", ... },
  "Monther": { "dpi": "...", "nombre": "...", ... }
}
```

### Validación de Dataset
- Cada key debe ser un string no vacío
- Cada value debe ser un objeto (no null, no array, no primitivo)
- El objeto debe tener al menos un campo

### Test Matrix
```json
{
  "scenarios": [
    {
      "id": "E2E-001",
      "name": "Flujo completo cliente B2B",
      "tags": ["@e2e", "@P0", "@B2B"],
      "dataProvider": "data_new_client.json",
      "datasets": ["Marcos", "Monther"]
    }
  ]
}
```

---

## 3. Mock Data (v1)

Para v1, los servicios retornan datos mock que simulan la estructura real del proyecto TCGT-QA:

### Mock Tests (basados en la estructura real de TCGT-QA)
- `flujoCompletoCliente.spec.ts` — @smoke @e2e @P0 @B2B
- `flujoCompletoClienteMatrixDriven.spec.ts` — @e2e @P0 @B2B @E2E-001
- `flujoCompletoClienteMovil.spec.ts` — @e2e @P1 @B2B
- `flujoCompletoClienteTCJ.spec.ts` — @e2e @P1 @B2B
- `B2C/flujoCompletoComercio.spec.ts` — @e2e @P0 @B2C @E2E-B2C-001
- `validations/datosGenerales/*.spec.ts` — @validation @P2 @B2B

### Mock Datasets
- `data_new_client.json` con keys: Marcos, Monther
- `data_new_client_TCJ.json` con keys: Marcos
- `test-matrix.json` con escenarios registrados
