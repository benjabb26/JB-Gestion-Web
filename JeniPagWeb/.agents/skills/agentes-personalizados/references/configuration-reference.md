# Referencia de Configuración: Agentes Personalizados en Antigravity

Los agentes personalizados se definen mediante un archivo Markdown (`.md`) con un bloque de metadatos YAML frontmatter al inicio.

## Ubicación de los Archivos
- **Nivel de Proyecto / Espacio de Trabajo**: `.agents/agents/<nombre-del-agente>.md`
  - Se versiona en Git para que todo el equipo comparta los mismos asistentes.
- **Nivel Global del Usuario**: `~/.gemini/config/agents/<nombre-del-agente>.md`
  - Disponible en cualquier proyecto abierto en la máquina local.

## Esquema Frontmatter YAML

| Campo | Tipo | Requerido | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- |
| `name` | string | Sí | Identificador único del agente en minúsculas y con guiones. | `dependency-modernizer` |
| `description` | string | Sí | Breve descripción del rol del agente y cuándo debe utilizarse. | `Actualiza paquetes y valida suites de pruebas.` |
| `model` | string | No | Modelo a emplear para el agente (ej. `flash`, `pro`). | `flash` |
| `mainAgent` | boolean | No | Si es `true`, puede iniciarse como sesión principal desde GUI o CLI. | `true` |
| `subagent` | boolean | No | Si es `true`, puede ser invocado dinámicamente como subagente por un coordinador. | `true` |
| `tools` | list | No | Lista explícita de herramientas permitidas para el agente. | `[view_file, replace_file_content, run_command]` |
| `skills` | list | No | Lista de habilidades (rutas o identificadores) que el agente puede cargar. | `[skills/package-upgrade-rules]` |
| `permissionMode` | string | No | Modo de permisos (`acceptEdits`, `bypassPermissions`, etc.). | `acceptEdits` |
| `commandExecutionPolicy` | string | No | Política de comandos (`auto`, etc.). Con `auto`, ejecuta comandos seguros sin prompt constante. | `auto` |

## Estructura del Cuerpo Markdown
Todo el texto debajo del bloque frontmatter (`---`) se compila directamente en el **System Prompt** o instrucciones maestras del agente:
- Rol y objetivo principal.
- Procedimientos paso a paso.
- Criterios de validación y control de calidad.
- Restricciones operativas (qué NO debe hacer el agente).
