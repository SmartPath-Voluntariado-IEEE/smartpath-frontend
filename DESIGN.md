
# Smartpath — DESIGN.md

> Sistema de diseño y lineamientos visuales para el desarrollo del MVP.
>
> **Objetivo:** mantener una interfaz consistente, moderna, amigable y reconocible como Smartpath.

---

## 1. Identidad de Smartpath

### Concepto

Smartpath es una plataforma que ayuda a estudiantes y jóvenes profesionales a encontrar:

- qué habilidades necesita el mercado;
- qué debe aprender;
- en qué orden debe aprenderlo;
- qué recursos puede utilizar para conseguirlo.

La interfaz debe transmitir:

**Dirección + aprendizaje + tecnología + progreso + confianza.**

No buscamos una apariencia de "dashboard empresarial genérico".

La experiencia debe sentirse:

- Moderna
- Tecnológica
- Cercana
- Clara
- Motivadora
- Inteligente
- Ordenada

---

# 2. Principios visuales

## 2.1 Claridad antes que decoración

La información debe ser fácil de entender.

Evitar:

- exceso de sombras;
- demasiados gradientes;
- elementos decorativos que compitan con el contenido;
- exceso de colores;
- tarjetas innecesarias.

---

## 2.2 La ruta es el elemento visual principal

Smartpath representa una ruta hacia un objetivo.

Los componentes relacionados con:

- Roadmap
- Progreso
- Skills
- Próximos pasos
- Recomendaciones

deben tener mayor protagonismo visual.

---

## 2.3 La interfaz debe sentirse ligera

El producto utiliza:

- fondos claros;
- espacios amplios;
- tarjetas limpias;
- bordes suaves;
- colores de marca como acentos.

No utilizar una interfaz completamente oscura para el MVP.

---

# 3. Paleta oficial

## Colores principales

| Token | Color | Hex | Uso |
|---|---|---|---|
| `primary` | Púrpura | `#6E43FF` | Acciones principales, roadmap, botones |
| `indigo` | Índigo | `#3D5AFE` | Links, estados activos, énfasis |
| `cyan` | Azul | `#00B4DB` | Progreso, tecnología, información |
| `success` | Verde | `#00C48C` | Completado, éxito |
| `accent` | Naranja | `#FF8A00` | Destacados, llamados de atención |
| `text-primary` | Azul oscuro | `#0D1133` | Títulos y texto principal |
| `text-secondary` | Gris | `#6B7280` | Texto secundario |
| `border` | Gris claro | `#E5E7EB` | Bordes |
| `background` | Blanco | `#FFFFFF` | Fondo principal |

---

# 4. Gradiente de marca

El gradiente representa el concepto de evolución y recorrido de Smartpath.

### Gradiente principal

```css
background: linear-gradient(
  135deg,
  #6E43FF 0%,
  #3D5AFE 40%,
  #00B4DB 70%,
  #00C48C 100%
);
````

### Gradiente de acento

Para elementos destacados:

```css
background: linear-gradient(
  135deg,
  #6E43FF 0%,
  #FF8A00 100%
);
```

### Uso

El gradiente puede utilizarse en:

* Hero
* Indicadores de progreso
* Elementos destacados
* Roadmap
* Ilustraciones
* Estados activos

No utilizarlo en todos los componentes.

---

# 5. Tipografía

## Familia

**Poppins**

Usar:

```css
font-family: 'Poppins', sans-serif;
```

### Pesos

| Peso | Uso                         |
| ---- | --------------------------- |
| 400  | Texto normal                |
| 500  | Texto secundario / labels   |
| 600  | Botones / subtítulos       |
| 700  | Títulos                    |
| 800  | Hero / títulos principales |

---

# 6. Jerarquía tipográfica

### H1

```css
font-size: 36px;
font-weight: 700;
line-height: 1.15;
color: #0D1133;
```

### H2

```css
font-size: 28px;
font-weight: 700;
line-height: 1.2;
color: #0D1133;
```

### H3

```css
font-size: 20px;
font-weight: 600;
line-height: 1.3;
color: #0D1133;
```

### Body

```css
font-size: 15px;
font-weight: 400;
line-height: 1.6;
color: #6B7280;
```

### Small

```css
font-size: 12px;
font-weight: 500;
color: #6B7280;
```

---

# 7. Espaciado

Utilizar una escala basada en múltiplos de 4px.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

### Recomendaciones

* Padding interno de tarjetas: `20px - 24px`
* Separación entre componentes: `24px`
* Separación entre secciones: `32px - 48px`
* Espacio de página: `32px - 64px`

---

# 8. Bordes y radios

Smartpath utiliza esquinas suaves.

### Cards

```css
border-radius: 16px;
```

### Botones

```css
border-radius: 10px;
```

### Inputs

```css
border-radius: 10px;
```

### Pills / Tags

```css
border-radius: 999px;
```

Evitar radios excesivamente grandes en componentes que no sean pills.

---

# 9. Sombras

Las sombras deben ser sutiles.

### Card

```css
box-shadow: 0 4px 20px rgba(13, 17, 51, 0.06);
```

### Card destacada

```css
box-shadow: 0 8px 30px rgba(110, 67, 255, 0.12);
```

No utilizar sombras negras fuertes.

---

# 10. Botones

## Primary

```text
Background: #6E43FF
Text: #FFFFFF
```

Hover:

```text
Background: #5B35E6
```

Uso:

* Continuar
* Crear roadmap
* Ver roadmap
* Recomendar
* Iniciar

---

## Secondary

```text
Background: #FFFFFF
Border: #E5E7EB
Text: #0D1133
```

Uso:

* Editar perfil
* Volver
* Cancelar
* Ver detalles

---

## Accent

Utilizar naranja únicamente para acciones o información que necesite llamar la atención.

```text
Background: #FF8A00
Text: #FFFFFF
```

No convertir el naranja en color principal de la aplicación.

---

# 11. Estados

## Completado

```text
Color: #00C48C
```

Representación:

* ✓
* barra verde
* badge "Completado"

---

## En progreso

```text
Color: #6E43FF
```

---

## Pendiente

```text
Color: #FF8A00
```

---

## Información

```text
Color: #00B4DB
```

---

## Error

Para errores funcionales se puede utilizar:

```text
#EF4444
```

El rojo no pertenece a la identidad principal y debe reservarse para errores.

---

# 12. Cards

Las tarjetas son uno de los componentes principales de Smartpath.

### Estructura

```text
┌──────────────────────────────┐
│ Label / categoría            │
│                              │
│ Título principal             │
│ Descripción                  │
│                              │
│ Información / progreso       │
│                              │
│ Acción                       │
└──────────────────────────────┘
```

### Reglas

* Fondo blanco.
* Border `#E5E7EB`.
* Radio 16px.
* Sombra muy ligera.
* Títulos en `#0D1133`.
* Información secundaria en `#6B7280`.

---

# 13. Roadmap

El roadmap es uno de los componentes distintivos de Smartpath.

La versión principal será:

## Ruta por niveles

Ejemplo:

```text
NIVEL 1
Fundamentos
──────────────
✓ Git
✓ GitHub
○ SQL

NIVEL 2
Desarrollo Core
──────────────
○ Java
○ POO
○ APIs

NIVEL 3
Desarrollo Backend
──────────────
○ Spring Boot
○ REST API
○ PostgreSQL
```

### Principios

Cada nivel debe comunicar:

1. dónde está el usuario;
2. qué debe aprender;
3. qué ya domina;
4. qué falta;
5. qué puede desbloquear después.

---

# 14. Skill Cards

Cada skill puede representarse mediante una tarjeta pequeña.

```text
┌───────────────────┐
│       ◇           │
│      Git          │
│                   │
│     60%           │
│   de avance       │
│                   │
│  [Ver cursos]     │
└───────────────────┘
```

### Estados visuales

**Dominada**

Verde.

**En progreso**

Púrpura / índigo.

**Pendiente**

Naranja suave.

---

# 15. Progreso

El progreso es importante en toda la aplicación.

### Barra

```css
height: 8px;
border-radius: 999px;
```

Para progreso general puede utilizarse el gradiente:

```css
linear-gradient(
  90deg,
  #6E43FF,
  #3D5AFE,
  #00B4DB
);
```

---

# 16. Dashboard

El dashboard debe priorizar:

### 1. Objetivo

Ejemplo:

> Tu ruta hacia Full Stack Developer

### 2. Progreso

```text
29% completado
```

### 3. Skills prioritarias

Mostrar las habilidades que tienen mayor impacto según el mercado.

### 4. Próximos pasos

Mostrar pocas acciones y claramente priorizadas.

### 5. Ofertas analizadas

Mostrar evidencia del mercado que sustenta las recomendaciones.

---

# 17. Onboarding

El onboarding utiliza una interfaz conversacional.

No debe parecer un formulario tradicional.

### Estructura

```text
        Smartpath

   ┌───────────────────────┐
   │ ¡Hola! 👋             │
   │                       │
   │ Vamos a construir     │
   │ tu ruta profesional.  │
   └───────────────────────┘

       [ Respuesta ]

   ┌───────────────────────┐
   │ ¿Qué área te interesa?│
   └───────────────────────┘

   [ Data ] [ Frontend ]
   [ Backend ] [ Cloud ]
```

### Widgets permitidos

* Texto
* Selección única
* Selección múltiple
* Chips
* Escala numérica
* Slider
* Selector de horas
* Selector de meses
* Área de texto
* Botones de continuación
* Progreso del onboarding

La interacción debe sentirse progresiva y sencilla.

---

# 18. Cursos

Las tarjetas de cursos deben permitir comparar rápidamente:

* plataforma;
* nombre;
* duración;
* precio;
* rating;
* nivel;
* modalidad;
* certificación;
* habilidad relacionada.

La información importante debe ser visible sin abrir el curso.

---

# 19. Iconografía

Estilo:

**Lineal + moderno + amigable.**

Características:

* trazos redondeados;
* formas simples;
* poco detalle;
* consistencia de grosor.

Preferentemente utilizar iconos de una misma librería.

Ejemplo recomendado:

**Lucide Icons**

No mezclar diferentes estilos de iconografía.

---

# 20. Imágenes e ilustraciones

Las imágenes deben reforzar:

* crecimiento;
* tecnología;
* aprendizaje;
* dirección;
* progreso;
* oportunidades profesionales.

Evitar imágenes corporativas genéricas de personas con laptops mirando a cámara.

Preferir:

* rutas;
* mapas;
* tecnología;
* interfaces;
* abstracciones relacionadas con aprendizaje;
* escenas profesionales naturales.

---

# 21. Header

El header debe ser limpio.

Ejemplo:

```text
Smartpath

Dashboard   Perfil   Roadmap   Cursos

                           Usuario
```

El elemento activo puede utilizar:

```text
background: #F3F0FF;
color: #6E43FF;
```

---

# 22. Layout

Utilizar una estructura de página consistente:

```text
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│                                     │
│ Contenido principal                 │
│                                     │
│ ┌────────────┐ ┌────────────┐       │
│ │ Component  │ │ Component  │       │
│ └────────────┘ └────────────┘       │
│                                     │
└─────────────────────────────────────┘
```

### Ancho máximo

```css
max-width: 1200px;
margin: 0 auto;
```

---

# 23. Responsive

La aplicación debe funcionar correctamente en:

* Desktop
* Tablet
* Mobile

### Breakpoints recomendados

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

En mobile:

* reducir columnas;
* convertir grids en listas;
* ocultar información secundaria;
* mantener acciones principales visibles.

---

# 24. Qué evitar

### ❌ Dashboard genérico

Evitar interfaces que parezcan:

* panel administrativo;
* plantilla SaaS genérica;
* CRM;
* sistema empresarial.

---

### ❌ Exceso de púrpura

El púrpura es el color principal, no el único color.

Combinar con:

* índigo;
* cyan;
* verde;
* naranja.

---

### ❌ Exceso de gradientes

Los gradientes deben utilizarse para destacar elementos importantes.

No utilizar gradientes en cada tarjeta.

---

### ❌ Exceso de sombras

Smartpath debe sentirse limpio y ligero.

---

### ❌ Demasiadas tarjetas

No convertir cada dato en una tarjeta independiente.

---

### ❌ Tipografías diferentes

Utilizar Poppins como fuente principal.

---

# 25. Tokens CSS

Para mantener consistencia entre componentes:

```css
:root {
  --sp-primary: #6E43FF;
  --sp-indigo: #3D5AFE;
  --sp-cyan: #00B4DB;
  --sp-success: #00C48C;
  --sp-orange: #FF8A00;

  --sp-text-primary: #0D1133;
  --sp-text-secondary: #6B7280;

  --sp-border: #E5E7EB;
  --sp-background: #FFFFFF;

  --sp-radius-sm: 10px;
  --sp-radius-md: 16px;
  --sp-radius-lg: 24px;
  --sp-radius-pill: 999px;

  --sp-shadow-card:
    0 4px 20px rgba(13, 17, 51, 0.06);

  --sp-shadow-highlight:
    0 8px 30px rgba(110, 67, 255, 0.12);
}
```

---

# 26. Regla principal del diseño

> **Smartpath no debe mostrar más información. Debe mostrar mejor la información que importa.**

Cada pantalla debe responder rápidamente:

**¿Dónde estoy?**

**¿Qué necesito hacer?**

**¿Por qué debería hacerlo?**

**¿Cuál es mi siguiente paso?**

La interfaz debe convertir la complejidad del mercado laboral y educativo en una experiencia visual clara, ordenada y accionable.

---

# 27. Checklist antes de aprobar una pantalla

Antes de considerar terminada una pantalla:

* [ ] Utiliza la paleta Smartpath.
* [ ] Utiliza Poppins.
* [ ] Mantiene fondo claro.
* [ ] Tiene suficiente espacio en blanco.
* [ ] No utiliza sombras excesivas.
* [ ] No utiliza demasiados colores.
* [ ] El CTA principal es evidente.
* [ ] La jerarquía visual es clara.
* [ ] Los estados tienen significado visual.
* [ ] El diseño funciona en mobile.
* [ ] La pantalla se siente parte de Smartpath.
* [ ] No parece una plantilla genérica de SaaS.
* [ ] La información principal puede entenderse rápidamente.

---

## Smartpath

**Tu ruta inteligente hacia el empleo tech.**

> Convertimos el ruido de opciones en una ruta clara hacia tu objetivo.