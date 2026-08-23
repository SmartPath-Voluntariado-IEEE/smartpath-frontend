# HU-57 / HU-58 — Resumen de la sesión (frontend)

## Qué se construyó

**Pestaña "Bolsa laboral"** (`app/bolsa-laboral/page.tsx`), agregada al nav
en `AppHeader.tsx`. Lista las ofertas recolectadas por el backend (HU-57),
ordenadas por afinidad con la ruta del usuario, con filtros de nivel,
afinidad mínima, remoto y búsqueda por texto, con paginación.

**`components/jobs/JobCard.tsx`**: tarjeta de oferta. Muestra % de afinidad,
desglose en "alineación con tu ruta" / "ya lo cumples", chips de requisitos
(HU-58: experiencia, educación, idioma, modalidad), chips de tecnologías
(verde = ya la sabes, morado = te falta pero tu ruta la enseña, con link a
`/cursos`), y botón a la oferta real.

**`services/api.ts`**: tipos (`ScrapedJob`, `JobRecommendation`,
`JobRequirementItem`) y funciones (`getJobRecommendations`, `collectJobs`)
para consumir los endpoints nuevos del backend.

## Bugs corregidos en esta sesión

- **`Select`/`Input`/`Button` sin estilo (bordes negros)**: el kit base
  (`components/ui/*`) depende de tokens de color (`border-input`,
  `bg-popover`, `border-border`, `ring-foreground`) que este proyecto nunca
  definió en `globals.css`. Se sobreescribieron con la paleta ya usada en
  `/cursos` (`#e1ddeb`, fondo blanco) en todos los controles de filtro de
  la página nueva.

## Pendiente / no tocado

- El `600ms` + reintento de `1000ms` fijo en `app/auth/callback/page.tsx`
  (workaround de desfase de reloj) no se tocó — no había certeza de si
  seguía siendo necesario.
- El gap de tokens de color (`--color-border`, `--color-popover`, etc.) es
  del tema global, no solo de esta página. Se parchó local, no de raíz.

---

## Qué probar

| Página / flujo | Qué revisar |
|---|---|
| `/bolsa-laboral` | Carga inicial, tarjetas con datos coherentes |
| Filtro de nivel (`Select`) | Fondo blanco, sin borde negro, hover morado |
| Filtro de afinidad mínima | Filtra resultados correctamente |
| "Solo remoto" | Alterna estado activo/inactivo |
| Buscador | Filtra por puesto/empresa/ciudad, no dispara por cada tecla |
| Paginación | Anterior/Siguiente, deshabilitados en los extremos |
| Chip "te falta X, tu ruta lo enseña" | Link a `/cursos?skill=...` funciona |
| Botón "Ver oferta" | Abre la URL real en pestaña nueva |
| Estado sin resultados | Mensaje distinto si es por filtros vs. catálogo vacío |
| Sin perfil / sin sesión | Redirige a login, no crashea |
