# Preguntas de Clarificación de Requerimientos

Por favor responde las siguientes preguntas llenando la letra de tu elección después del tag `[Answer]:`.
Si ninguna opción se ajusta a tu necesidad, elige la última opción (Other) y describe tu preferencia.

---

## Question 1
¿Qué tipo de automatizaciones se gestionarán desde el panel? (del proyecto TCGT-QA)

A) Solo tests E2E de Playwright (happy paths, validaciones)
B) Tests E2E + smoke tests + regression tests (por tags como @P0, @P1, @smoke)
C) Todos los tests del proyecto TCGT-QA incluyendo ejecución por archivo individual, por tag, y por suite completa
D) Tests de TCGT-QA + posibilidad de agregar otros proyectos de automatización en el futuro
X) Other (please describe after [Answer]: tag below)

[Answer]: Se deben de poder ejecutar todos los test así como poder configurar los data provider

---

## Question 2
¿Cómo se ejecutarán las automatizaciones desde el panel?

A) El panel envía comandos al backend que ejecuta Playwright directamente en el servidor
B) El panel se conecta a un servicio de CI/CD (Jenkins, GitHub Actions, etc.) y dispara pipelines
C) El panel ejecuta los tests vía BrowserStack usando el SDK ya configurado en TCGT-QA
D) Combinación: ejecución local en servidor + opción de BrowserStack para cross-browser
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 3
¿Qué información necesita ver el QA manual en el panel después de ejecutar tests?

A) Solo estado básico: pasó/falló con conteo de tests
B) Estado + logs de consola + screenshots de fallos
C) Reporte completo: estado, logs, screenshots, traces, video de ejecución, tiempo por test
D) Reporte completo + integración con reporte HTML de Playwright (poder abrirlo desde el panel)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 4
¿Cuántos usuarios QA usarán el panel simultáneamente?

A) 1-3 usuarios (equipo pequeño, sin necesidad de concurrencia compleja)
B) 4-10 usuarios (equipo mediano, necesita manejo básico de concurrencia)
C) 10+ usuarios (equipo grande, necesita cola de ejecución y manejo robusto de concurrencia)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
¿El panel necesita autenticación/control de acceso?

A) No, es una herramienta interna sin restricciones de acceso
B) Sí, login básico con usuario/contraseña
C) Sí, con roles (admin puede configurar, QA solo puede ejecutar y ver resultados)
D) Sí, integrado con un sistema existente (Active Directory, SSO, etc.)
X) Other (please describe after [Answer]: tag below)

[Answer]: No

---

## Question 6
¿Qué funcionalidades de gestión necesita el panel además de ejecutar tests?

A) Solo ejecutar y ver resultados
B) Ejecutar + ver historial de ejecuciones pasadas
C) Ejecutar + historial + programar ejecuciones automáticas (cron/schedule)
D) Ejecutar + historial + programar + configurar ambientes (QA/STG) + gestionar datos de prueba
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 7
¿Necesitas un backend/API para este panel o prefieres que sea solo frontend?

A) Solo frontend (ejecuta comandos directamente, sin servidor backend propio)
B) Frontend + Backend ligero (Node.js/Express para ejecutar Playwright y servir resultados)
C) Frontend + Backend completo (con base de datos para historial, usuarios, configuraciones)
D) Frontend + Backend + Base de datos + WebSockets (para resultados en tiempo real)
X) Other (please describe after [Answer]: tag below)

[Answer]: De momento solo el front ya que aun no existe api para ejecutar automatizaciones, pero dejalo abierto para poder hacer la opcion D

---

## Question 8
¿En qué ambiente se desplegará este panel?

A) Solo local (cada QA lo corre en su máquina)
B) Servidor interno del equipo (una instancia compartida en la red local)
C) Cloud (AWS, Azure, etc.) accesible por VPN o internet
D) Contenedores Docker (portable, puede correr en cualquier ambiente)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 9: Extensión de Seguridad
¿Deben aplicarse reglas de seguridad como restricciones obligatorias para este proyecto?

A) Sí — aplicar todas las reglas de SEGURIDAD como restricciones bloqueantes (recomendado para aplicaciones de producción)
B) No — omitir todas las reglas de SEGURIDAD (adecuado para PoCs, prototipos y proyectos experimentales)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 10: Extensión de Property-Based Testing
¿Deben aplicarse reglas de property-based testing (PBT) para este proyecto?

A) Sí — aplicar todas las reglas de PBT como restricciones bloqueantes (recomendado para proyectos con lógica de negocio, transformaciones de datos)
B) Parcial — aplicar reglas de PBT solo para funciones puras y serialización (adecuado para proyectos con complejidad algorítmica limitada)
C) No — omitir todas las reglas de PBT (adecuado para aplicaciones CRUD simples, proyectos solo de UI)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---
