# Klassia Play — Frontend

Módulo de **quizzes en vivo** para profesores de Klassia. Solo frontend: hoy funciona
con datos mock; queda listo para conectar el backend cambiando una variable de entorno.

## Regla de identidad del proyecto

> **Color, tipografía y tono visual → manda el LOGO de Klassia GO.**
> **Estructura, jerarquía y distribución de secciones → manda el FIGMA.**
>
> La identidad migró del índigo del prompt al azul `#1769FF` + lima `#C9F04A`
> del logo oficial (`Figma: ly347syEOpnTKjSEAK2kji`, nodo `0:1`). Los tokens
> viven en `app/globals.css` (`@theme`) y `lib/constants.ts`, no en los
> componentes.

## Logo

El logo no es una imagen: es un componente React (`components/layout/KlassiaGoLogo.tsx`)
construido con los vectores exactos exportados de Figma.

- El **icono azul** (`#3B82F6 → #1769FF`) y la **píldora lima GO** (`#C9F04A`
  con texto `#07152C`) son fijos, porque son el asset de marca.
- El **wordmark “Klassia”** usa `fill="currentColor"`, así que se pinta en tinta
  sobre fondos claros y en blanco con `tone="onBrand"` (lobby y podio).
- `Brand.tsx` es el único punto de uso: acepta `tone` (`default` / `onBrand`) y
  `compact` (solo icono).
- Aparece en **todas** las pantallas: dashboard, editor, lobby, live y podio,
  incluidos sus estados de carga y error.
- `app/icon.svg` reutiliza el icono azul como favicon.

## Stack

| Pieza | Uso |
| --- | --- |
| Next.js 16 (App Router) | Rutas por pantalla, RSC + Client Components |
| TypeScript | Contratos en `types/klassia.ts` |
| Tailwind CSS v4 | Tokens con `@theme` en `app/globals.css` |
| Zustand | `store/useQuizStore.ts` (editor) y `store/useGameStore.ts` (partida) |
| Framer-free animations | CSS keyframes + `canvas-confetti` en el podio |
| lucide-react | Iconografía |
| qrcode.react | QR del lobby |

## Pantallas

| ID | Ruta | Archivo |
| --- | --- | --- |
| KP-01 | `/klassia-play` | `components/dashboard/DashboardScreen.tsx` |
| KP-02 | `/klassia-play/new` y `/klassia-play/[id]/edit` | `components/builder/QuizBuilder.tsx` |
| KP-03 | `/klassia-play/[id]/lobby` | `components/lobby/LobbyScreen.tsx` |
| KP-04 | `/klassia-play/[id]/live` | `components/live/LiveGameScreen.tsx` |
| KP-05 | `/klassia-play/[id]/live` (modal de ranking) | `components/ui/Modal.tsx` |
| KP-06 | `/klassia-play/[id]/podium` | `components/podium/PodiumScreen.tsx` |

## Principio de layout: cero scroll

- `html`, `body` y `#__next` tienen `overflow: hidden` (`app/globals.css`).
- Cada pantalla usa `100dvh` / `100vw` y `ScreenShell` con `grid-rows-[64px_1fr]`.
- La lista de preguntas del editor **pagina de 3 en 3** con modal “Ver todas”.
- El dashboard muestra **una fila de tarjetas** (2 en tablet, 3 en desktop) y el
  resto vive en “Ver todos”, así la pantalla nunca empuja el layout.
- En móvil el editor oculta la lista lateral y ofrece navegación
  anterior/siguiente sobre el título de la pregunta.
- El grid de estudiantes del lobby muestra 9 y agrupa el resto en “+N más”.
- El ranking muestra solo Top 5.
- Único scroll permitido: el interior de un modal, por accesibilidad.

## Identidad visual

| Token | Valor |
| --- | --- |
| Brand (azul del logo) | `#1769FF` / hover `#0F55D6` / soft `#EEF4FF` |
| Accent (lima del logo) | `#C9F04A` / texto `#07152C` |
| Success | `#10B981` / soft `#ECFDF5` |
| Danger | `#EF4444` / soft `#FEF2F2` |
| Warning | `#F59E0B` / soft `#FFFBEB` |
| App background | `#F8FAFC` |
| Superficie | `#FFFFFF` |
| Texto | `#0F172A` / secundario `#64748B` |
| Tipografía | Plus Jakarta Sans (fallback Inter) |
| Radios | `rounded-card` 16px / `rounded-panel` 22px |
| Sombras | `shadow-card`, `shadow-pop` |

La lima se usa con intención, no como decoración: píldora **GO** del logo, punto
“Sala abierta” del lobby, bloque del **1.º puesto** del podio y la corona.

Reglas antigenericas aplicadas:

- Sin degradados decorativos de plantilla. Solo dos halos intencionales
  (`.lobby-surface` y `.podium-surface`) como fondo de escena.
- Tarjetas con borde de 1px (`--color-line`) + `shadow-card`; nunca sombras duras.
- Estados con `transition-colors duration-200`; foco visible con `:focus-visible`.

## Conectar el backend

1. Copia `.env.local.example` a `.env.local`.
2. Ajusta:
   ```env
   NEXT_PUBLIC_USE_MOCKS=false
   NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
   ```
3. Implementa estos endpoints. El frontend ya los consume desde
   `lib/api/endpoints.ts`; no hay que tocar componentes.

| Método | Endpoint | Devuelve |
| --- | --- | --- |
| GET | `/stats/dashboard` | `DashboardStats` |
| GET | `/quizzes` | `Quiz[]` |
| POST | `/quizzes` | `Quiz` |
| GET | `/quizzes/:id` | `Quiz` |
| PUT | `/quizzes/:id` | `Quiz` |
| DELETE | `/quizzes/:id` | `204` |
| POST | `/sessions` | `{ sessionId, pin }` |
| GET | `/sessions/:id` | `GameSession` |
| POST | `/sessions/:id/advance` | `GameSession` |
| POST | `/sessions/:id/close` | `QuestionResult` |
| POST | `/sessions/:id/finish` | `PodiumResult` |

Los shapes exactos están en `types/klassia.ts`. Cada función de
`lib/api/endpoints.ts` tiene su rama mock y su rama `request(...)`; la real solo
necesita respetar el tipo.

### Recomendaciones para el backend

- El editor guarda el quiz completo (`QuizDraft`), no deltas: es un `PUT` idempotente.
- La sesión en vivo puede resolverse por **polling** de `/sessions/:id` (2s) o por
  WebSocket. El frontend ya está preparado para ambos: `getSession()` está aislado.
- El PIN debe ser único por academia y expirar al cerrar la sesión.
- Las respuestas de estudiantes deben llegar con `questionId`, `optionId`,
  `playerId` y `ms` para calcular puntos por rapidez.

## Desarrollo

```bash
npm install
cp .env.local.example .env.local   # (Windows: copy)
npm run dev
```

Abre `http://localhost:3000` → redirige a `/klassia-play`.

## Estructura

```
app/
  klassia-play/
    page.tsx                 KP-01
    new/page.tsx             KP-02 crear
    [id]/edit/page.tsx       KP-02 editar
    [id]/lobby/page.tsx      KP-03
    [id]/live/page.tsx       KP-04 / KP-05
    [id]/podium/page.tsx     KP-06
components/
  ui/         Button, Badge, Avatar, Modal, Select, Shape
  layout/     Brand, PlayHeader, ScreenShell
  dashboard/  DashboardScreen, QuizCard
  builder/    QuizBuilder, QuestionSidebar, QuestionEditor
  lobby/      LobbyScreen
  live/       LiveGameScreen, TimerRing
  podium/     PodiumScreen
lib/
  api/        endpoints.ts, mock-data.ts
  constants.ts, utils/
store/
  useQuizStore.ts, useGameStore.ts
types/
  klassia.ts
```
