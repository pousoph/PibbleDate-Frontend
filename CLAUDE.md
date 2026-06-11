# Date Blueprint — CLAUDE.md

Aplicación web para planificar citas, organizar experiencias en pareja y guardar
los recuerdos resultantes. Una sola entidad con ciclo de vida:

> **Idea → Planeada → Vivida (Recuerdo)**

Contexto: proyecto de **portfolio**, desarrollado por **una sola frontend
developer**. La app debe parecer un producto real, pero seguir siendo viable para
una persona. Optimiza para aprendizaje, mantenibilidad y buen gusto, no para
escala empresarial.

---

## Cómo trabajar en este proyecto (contrato — esto manda)

Eres un Arquitecto Frontend Senior y filtro contra el *vibe coding*. Antes de
implementar **cualquier** funcionalidad, evalúa en voz alta:

- ¿Resuelve un problema real del alcance actual?
- ¿Existe una solución más simple?
- ¿Está justificada la complejidad? ¿Generará deuda técnica?

Reglas no negociables:

- **YAGNI / KISS / DRY / SOLID.** Nada de abstracciones prematuras ni
  optimización prematura. No apliques patrones por ser populares.
- **No amplíes el alcance.** Lo que no está en el roadmap de la versión actual,
  **no se construye**. Si crees que falta algo, proponlo; no lo implementes solo.
- **No agregues dependencias** sin justificarlo y proponérmelo primero.
- **Estado local antes que global.** Componentes pequeños y cohesionados.
- **Mobile-first, accessibility-first, offline-first** siempre.
- Si una petición mía choca con estas reglas, **dilo y propón una alternativa
  profesional** en vez de obedecer.

---

## Stack (fijo — no cambiar sin razón técnica clara)

| Herramienta | Uso |
|---|---|
| React + TypeScript | UI, `strict: true` |
| Vite | build/dev |
| Tailwind CSS v4 | estilos (vía `@theme` en `index.css`) |
| shadcn/ui | componentes base (`cssVariables: true`) |
| Zustand | **solo** estado de UI efímero (filtros, theme) |
| React Hook Form + Zod | formularios y validación |
| Dexie.js (IndexedDB) | persistencia y **fuente de verdad** de los datos |
| Framer Motion | microinteracciones (dosificadas) |
| Recharts | gráficas (solo en v1.2) |

Adiciones confirmadas al stack base, con justificación:

- **react-router-dom** — la app tiene varias vistas (lista, detalle, formulario,
  insights); el routing lo amerita. *Veta si prefieres ruteo por estado.*
- **dexie-react-hooks** (`useLiveQuery`) — lecturas reactivas desde IndexedDB sin
  duplicar datos en un store. Es parte del ecosistema Dexie.

---

## Arquitectura

Estructura **por features**, no por tipo de archivo:

```
src/
  app/                  # shell, router, providers
  features/
    plans/
      components/        # PlanCard, PlanList, PlanForm, PlanDetail, StatusBadge
      hooks/             # usePlans, usePlan, useUpsertPlan, useDeletePlan
      schema/            # planSchema.ts (Zod, reusado create + edit)
      types.ts           # DatePlan, DateStatus, ChecklistItem
    memories/            # v1.1
    insights/            # v1.2
  shared/
    db/                  # db.ts (Dexie), plansRepo.ts, photosRepo.ts
    components/          # EmptyState, ErrorState, Spinner, PibbleMascot
    ui/                  # componentes de shadcn (components/ui)
    lib/                 # uid(), compressImage(), formatDate()
    hooks/
  styles/index.css       # tokens del design system (ya creado)
  main.tsx
```

### Flujo de datos (regla crítica)

- **Dexie es la única fuente de verdad.** Los componentes leen con `useLiveQuery`.
- **NUNCA** copies los datos de `plans` dentro de Zustand. Zustand es solo para
  estado de UI (p. ej. filtro activo, toggle de tema). Duplicar la data de
  IndexedDB en un store es el error clásico que aquí está prohibido.
- Toda escritura pasa por los repos (`plansRepo`, `photosRepo`), no desde el
  componente directo a `db`.
- Formularios: **un solo** `planSchema` de Zod, reusado para crear y editar, con
  `zodResolver`.

---

## Modelo de datos

```ts
type DateStatus = 'idea' | 'planned' | 'completed';

interface ChecklistItem { id: string; text: string; done: boolean; }

interface DatePlan {
  id: string;              // uuid
  title: string;
  description?: string;
  status: DateStatus;
  plannedFor?: number;     // epoch ms (NO Date: números indexan/ordenan mejor)
  location?: string;       // texto libre en MVP (sin mapas)
  category?: string;
  estimatedBudget?: number;
  steps: ChecklistItem[];  // el "blueprint" de la cita
  notes?: string;
  createdAt: number;       // epoch ms
  updatedAt: number;       // epoch ms
  // --- v1.1 (opcionales hasta entonces) ---
  rating?: number;         // 1..5
  memoryNote?: string;
  photoIds?: string[];     // referencias a la tabla photos
}

interface Photo { id: string; planId: string; blob: Blob; createdAt: number; }
```

Esquema Dexie:

```ts
db.version(1).stores({
  plans:  'id, status, plannedFor, createdAt, updatedAt',
  photos: 'id, planId',
});
```

Convenciones de datos:

- Timestamps como **number (epoch ms)**, no `Date`.
- IDs con `crypto.randomUUID()`.
- Fotos en **tabla aparte** (Blobs), referenciadas por `photoIds`. **Comprimir**
  antes de guardar (canvas → `toBlob`, lado máx. ~1600px) para no reventar la
  cuota del navegador.
- Sin backend = sin backup → exportar/importar JSON es feature de v1.1.

---

## Sistema de diseño

**Fuente de verdad:** `src/styles/index.css` (ya creado). No hardcodear colores;
usar las variables/utilidades.

- **Blush (`#F5D0D0`) es SOLO superficie**, nunca color de texto (~1.1:1, falla
  accesibilidad). **Crimson (`#4A0011`) es la tinta y la acción.**
- Acentos `peach`/`lilac`: con moderación (chips de estado, realces). Nunca
  inundar la UI.
- Semánticos (`success/warning/danger/info`) son **distintos** de la marca:
  `danger` ≠ crimson, para no confundir acción con peligro.
- Tipografía: **Baloo 2** en titulares (≥18px, sentence case, sin ALL CAPS) +
  **Nunito Sans** en cuerpo.
- Radios suaves, sombras tintadas en crimson. Estética *Pibbles*.
- **Mascota Pibble**: vive en estados vacíos, loading y el momento de marcar una
  cita como "vivida". No como wallpaper de fondo.

---

## Alcance por versión (NO construir fuera de esto)

**v1.0 — MVP (esqueleto que ya es producto)**
- CRUD de planes: title, description, plannedFor, location, category,
  estimatedBudget, steps (checklist), notes.
- Estado `idea | planned | completed`.
- Vista lista + vista detalle + formulario crear/editar.
- Persistencia offline (Dexie). Estados vacío / carga / error. Responsive + a11y.

**v1.1 — Recuerdos (cierra el ciclo)**
- Al pasar a `completed`: rating, memoryNote, foto(s) como Blob.
- Vista de recuerdos. Exportar/importar JSON (backup).

**v1.2 — Insights (payoff con Recharts)**
- Citas por mes, gasto acumulado, categorías favoritas, distribución de ratings.

**Backlog (FUERA del MVP — no implementar):** descubrimiento de actividades vía
API, colaboración/compartir multi-dispositivo, mapas/geolocalización,
recordatorios push, autenticación, backend.

---

## Estados y UX obligatorios

Toda vista que muestre datos debe manejar **vacío, carga y error** explícitos
(no pantallas en blanco). Los errores explican qué pasó y cómo seguir, en voz de
la interfaz. Microinteracciones con Framer Motion **dosificadas** y respetando
`prefers-reduced-motion` (ya contemplado en el CSS). Foco visible siempre,
labels en todos los inputs.

---

## Convenciones de código

- TypeScript `strict`. Sin `any` salvo justificación puntual.
- Componentes pequeños; si uno pasa de ~150 líneas o hace 2+ cosas, divídelo.
- Sin prop drilling: si un dato viaja 3+ niveles, replantea (hook/contexto local).
- Custom hooks solo cuando aporten valor real (lógica reusada o compleja).
- Nombres en inglés; copy de UI en español.
- Lazy loading / code splitting solo donde haya beneficio medible (p. ej.
  `insights` con Recharts).

---

## Plan de construcción (una milestone a la vez, en orden)

Cada milestone debe quedar **funcional, responsive, accesible y con sus estados**
antes de pasar a la siguiente.

- **M0 — Setup.** Vite + TS, Tailwind v4 + `index.css`, shadcn, router, Dexie,
  estructura de carpetas. App corre con un layout vacío.
- **M1 — Capa de datos.** `db.ts`, tipos, `plansRepo`, hooks (`usePlans`,
  `usePlan`, `useUpsertPlan`, `useDeletePlan`). Probada con datos dummy.
- **M2 — Formulario.** `planSchema` (Zod) + `PlanForm` (RHF) para crear/editar.
- **M3 — Lista + detalle + estados.** `PlanList`, `PlanCard`, `StatusBadge`,
  `PlanDetail`. Vacío/carga/error. → **v1.0 entregable.**
- **M4 — Pulido de movimiento.** Framer Motion en card, transición de estado y
  navegación. Mascota en estado vacío.
- **M5+ —** v1.1 (recuerdos + export) y luego v1.2 (insights).

Definition of done por milestone: tipa sin errores, responsive a 320px, navegable
por teclado, sin colores hardcodeados, sin dependencias nuevas no acordadas.

---

## Comandos

```bash
npm run dev      # dev server en http://localhost:5173
npm run build    # tsc -b && vite build (falla si hay errores TS)
npm run lint     # eslint
npm run preview  # sirve el build de dist/
```

Notas de setup (ya hecho — solo referencia):

- Tailwind v4: plugin `@tailwindcss/vite` en `vite.config.ts`, sin `tailwind.config.js`.
- shadcn: componentes en `src/shared/ui/`. Para añadir uno: `npx shadcn@latest add <nombre>`.
  Requiere que `tsconfig.json` raíz tenga `compilerOptions.paths` con `"@/*": ["./src/*"]`
  (además de `tsconfig.app.json`) para que el CLI resuelva el alias correctamente.

---

## Cómo usar este archivo

Este es el contrato; mantenlo corto y de alta señal. Si crece, **no lo infles**:
divide el detalle en archivos por tema (p. ej. `docs/data-model.md`,
`docs/design-system.md`) que Claude Code lee bajo demanda, y deja aquí solo lo que
cambia decisiones del agente.
