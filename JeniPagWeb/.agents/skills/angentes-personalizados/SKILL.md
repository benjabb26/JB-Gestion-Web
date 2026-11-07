---
name: angentes-personalizados
description: >-
  Guía y especificación completa para diseñar, crear, configurar e implementar agentes personalizados
  (Custom Agents) en Google Antigravity (Antigravity 2.0 y Antigravity CLI). Activa esta habilidad cuando
  el usuario solicite crear un agente especializado, configurar subagentes o agentes principales,
  definir permisos y políticas de ejecución segura, o gestionar archivos en .agents/agents/.
---

# Habilidad: Agentes Personalizados en Google Antigravity

Esta habilidad documenta el estándar oficial para la creación, configuración y uso de **Agentes Personalizados (Custom Agents)** en Google Antigravity, basado en las características introducidas en Antigravity 2.0 y el CLI de Antigravity ([Fuente Oficial](https://antigravity.google/blog/introducing-custom-agents/)).

---

## 1. ¿Qué son los Agentes Personalizados?

Los agentes personalizados permiten dividir proyectos complejos en asistentes altamente especializados con instrucciones, modelos, herramientas y habilidades acotadas.

### Problemas que resuelven frente al asistente general:
1. **Falta de especialización**: Los asistentes generales desconocen las convenciones internas de testing, despliegue o librerías del proyecto sin explicarlas en cada conversación.
2. **Saturación del contexto (Context window bloat)**: Cargar directrices monolíticas y manuales gigantes en cada chat consume tokens innecesarios y degrada la calidad de respuesta.

---

## 2. Ubicación de Archivos y Descubrimiento

Los agentes personalizados se definen en archivos individuales de Markdown (`.md`) con encabezado YAML frontmatter:

- **A nivel de Proyecto (Workspace)**:  
  📁 `.agents/agents/<nombre-del-agente>.md`  
  *Recomendado*: Se añade al control de versiones (Git) para que todo el equipo cuente con los mismos agentes estandarizados inmediatamente tras clonar el repositorio.

- **A nivel Global de Usuario**:  
  📁 `~/.gemini/config/agents/<nombre-del-agente>.md`  
  Disponible en todos los proyectos y espacios de trabajo abiertos en la máquina local.

---

## 3. Anatomía de un Agente Personalizado

Un agente consta de un bloque de metadatos YAML frontmatter y un cuerpo en Markdown con las instrucciones maestras:

```markdown
---
name: nombre-del-agente
description: Breve descripción de qué hace y cuándo debe invocarse.
model: flash
mainAgent: true
subagent: true
permissionMode: acceptEdits
commandExecutionPolicy: auto
tools:
  - view_file
  - replace_file_content
  - run_command
skills:
  - skills/mi-habilidad-especializada
---

# Core Instructions
Aquí se definen las instrucciones de sistema (System Prompt) que gobernarán el comportamiento del agente.
```

### Campos del Frontmatter YAML

| Parámetro | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | string | Sí | Identificador único en minúsculas y con guiones (ej. `dependency-modernizer`). |
| `description` | string | Sí | Resume el rol y los casos de uso para que el coordinador o el usuario sepan cuándo usarlo. |
| `model` | string | No | Modelo a utilizar (ej. `flash`, `pro`). |
| `mainAgent` | boolean | No | Si es `true`, puede ser seleccionado como agente primario en la GUI de Antigravity o vía CLI (`agy --agent <nombre>`). |
| `subagent` | boolean | No | Si es `true`, puede ser invocado dinámicamente como subagente por un coordinador. |
| `tools` | list | No | Lista restrictiva de herramientas autorizadas (previene alucinaciones o uso indebido de herramientas no relacionadas). |
| `skills` | list | No | Lista de habilidades asociadas específicamente al agente. |
| `permissionMode` | string | No | Nivel de permisos (`acceptEdits`, `bypassPermissions`, etc.). |
| `commandExecutionPolicy` | string | No | Si se establece en `auto`, permite ejecutar comandos estándar (como tests o compilaciones) en segundo plano sin pedir confirmación continua. |

---

## 4. Características Únicas de Antigravity

### A. Simetría de Ejecución (Main Agent vs. Subagent)
A diferencia de otros entornos donde los agentes son exclusivamente subagentes subordinados, en Antigravity se pueden habilitar ambos modos en el mismo agente:
- **Como Agente Principal (`mainAgent: true`)**: Permite hablar directamente con el agente especializado desde el menú desplegable en Antigravity 2.0 o usando el CLI `agy --agent <nombre>`.
- **Como Subagente (`subagent: true`)**: El agente coordinador principal puede delegarle tareas específicas en paralelo.

### B. Políticas de Seguridad de Comandos (`commandExecutionPolicy: auto`)
- Reduce la fricción de aprobaciones repetitivas para tareas habituales (ej. `npm test`, `pytest`, `cargo build`).
- Las acciones de riesgo crítico (como borrado masivo de archivos o comandos destructivos) permanecen protegidas por confirmación manual.

### C. Herramientas y Habilidades Acotadas
- Al especificar `tools` y `skills`, el agente no se satura con herramientas innecesarias (ej. un revisor de código no necesita herramientas de navegación web ni generador de imágenes).

---

## 5. Procedimiento para Crear un Agente Personalizado

1. Crear el directorio `.agents/agents/` en la raíz del proyecto si aún no existe:
   ```powershell
   New-Item -ItemType Directory -Force -Path ".agents/agents"
   ```
2. Crear un archivo `<nombre-del-agente>.md` dentro de `.agents/agents/`.
3. Configurar el frontmatter con `name`, `description`, `mainAgent`, `subagent`, `tools` y permisos.
4. Escribir directrices claras en el cuerpo Markdown:
   - Rol y especialidad.
   - Flujo de trabajo ordenado paso a paso.
   - Criterios de aceptación y manejo de errores.
5. Probar el agente:
   - Como agente principal: Selecciónalo desde el selector de agentes en Antigravity 2.0 o mediante `agy --agent <nombre>`.
   - Como subagente: Pídele al agente principal que delegue la tarea al agente configurado.

---

## 6. Recursos y Ejemplos

- [Resumen del Artículo Oficial](../agentes-personalizados/references/blog-summary.md)
- [Referencia Detallada de Parámetros](../agentes-personalizados/references/configuration-reference.md)
- [Ejemplo: Dependency Modernizer](../agentes-personalizados/examples/dependency-modernizer.md)
- [Ejemplo: Code Reviewer](../agentes-personalizados/examples/code-reviewer.md)
