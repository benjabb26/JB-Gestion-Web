# Resumen: Introducing Custom Agents (Google Antigravity)

Fuente oficial: https://antigravity.google/blog/introducing-custom-agents/

## Contexto y Motivación
El desarrollo de software con IA ha evolucionado desde la generación simple de líneas de código hacia la orquestación de agentes especializados. Los asistentes generales enfrentan dos limitaciones críticas:
1. **Falta de especialización**: No conocen convenciones específicas ni reglas de dependencias del proyecto sin explicarlas repetidamente.
2. **Saturación de contexto (Context window bloat)**: Cargar directrices masivas en cada sesión desperdicia tokens y degrada la precisión.

Los **Agentes Personalizados (Custom Agents)** resuelven esto permitiendo definir roles específicos en archivos `.md` con herramientas, habilidades e instrucciones acotadas.

## Características Clave en Antigravity

### 1. Simetría de Ejecución (Main Agent vs. Subagent)
A diferencia de otras herramientas donde los agentes personalizados solo pueden ser invocados internamente como subagentes, Antigravity introduce simetría total:
- **`mainAgent: true`**: Puede ser seleccionado directamente como el agente primario interactivo desde la interfaz gráfica (GUI de Antigravity 2.0) o ejecutarse desde la CLI (`agy --agent <nombre>`).
- **`subagent: true`**: Puede ser delegado como subagente por un agente coordinador.
- Ambos flags pueden activarse simultáneamente.

### 2. Políticas de Seguridad Acotadas (`commandExecutionPolicy`)
- Permite definir `commandExecutionPolicy: auto` junto con `permissionMode: acceptEdits`.
- Permite la ejecución autónoma de pruebas y compilaciones estándar en segundo plano sin pedir confirmación continua al desarrollador, mientras que comandos de alto riesgo (como eliminación de archivos) permanecen protegidos bajo confirmación manual.

### 3. Conjuntos de Herramientas y Habilidades Curadas (`tools` y `skills`)
- Limita las herramientas disponibles a solo las necesarias para la tarea (`view_file`, `replace_file_content`, `run_command`, etc.).
- Asigna únicamente las habilidades (`skills`) relevantes al rol específico, reduciendo el ruido en el prompt del sistema.
