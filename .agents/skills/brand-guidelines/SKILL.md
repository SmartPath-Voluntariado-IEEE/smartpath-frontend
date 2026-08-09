---
name: brand-guidelines
description: Official brand guidelines, design system, visual identity, and UI standards for Smartpath frontend development. Make sure to use this skill WHENEVER creating, modifying, styling, refactoring, or auditing React/Next.js components, Tailwind CSS classes, UI layouts, pages, buttons, cards, roadmaps, onboarding flows, course catalogs, dashboards, typography, or color themes for Smartpath, even if the user does not explicitly mention 'brand guidelines' or 'DESIGN.md'.
---

# Smartpath — Brand Guidelines & UI Design System

Use this skill to maintain a consistent, modern, friendly, accessible, and highly recognizable visual interface across all Smartpath web applications.

---

## 🎨 1. Core Identity & Visual Philosophy

Smartpath is an intelligent career guidance platform designed for tech students and early-career professionals in Peru. It transforms complex job market data into a clear, actionable, and structured learning roadmap.

### Key Visual Attributes
- **Light & Clean Canvas**: White surface cards (`#FFFFFF`) with soft grey borders (`#E5E7EB`) set against light lavender/slate page backgrounds (`#F8FAFC` or `#F3F0FF`).
- **Roadmap as the Visual Hero**: Learning pathways, level steps, skill progress rings, and next steps must always take prime visual hierarchy.
- **Direction + Learning + Tech + Progress + Trust**: The UI should feel motivating, modern, and approachable without looking like a dense corporate CRM or generic SaaS admin template.
- **Clarity Over Decoration**: Avoid heavy dark shadows, generic enterprise layouts, or applying gradients to every element. Use whitespace generously (4px spatial grid system).

> **Core Design Rule**: Smartpath should not show more information—it must show the information that matters, better.

---

## 🌈 2. Official Color Palette & Tokens

### Primary Brand Tokens

| Token Key | Color Name | Hex Code | Primary Usage |
| :--- | :--- | :--- | :--- |
| `primary` | Electric Purple | `#6E43FF` | Primary action buttons, active roadmap steps, core brand identity |
| `indigo` | Vibrant Indigo | `#3D5AFE` | Interactive links, active tab highlights, secondary emphasis |
| `cyan` | Tech Cyan | `#00B4DB` | Progress indicators, tech tags, informational chips |
| `success` | Mint Green | `#00C48C` | Mastered skills, completed states, success confirmations |
| `accent` / `orange` | Energizing Orange | `#FF8A00` | Highlights, pending alerts, streak counters, urgent callouts |
| `text-primary` | Deep Navy | `#0D1133` | Headings, titles, high-contrast text |
| `text-secondary` | Cool Grey | `#6B7280` | Subtitles, body copy, meta details, helper labels |
| `border` | Soft Grey | `#E5E7EB` | Card dividers, input borders, structural boundaries |
| `surface` | Pure White | `#FFFFFF` | Card backgrounds, dialog containers, dropdowns |
| `background` | Light Slate | `#F8FAFC` | Page background canvas |
| `surface-variant` | Soft Purple Tint | `#F3F0FF` | Active navigation pills, highlighted row backgrounds |

### Brand Gradients

Use gradients intentionally for high-impact surfaces (Hero banners, main overall progress bars, featured cards, AI assistant callouts). Do **NOT** apply gradients to every card or standard button.

- **Primary Brand Gradient (135°)**:
  `linear-gradient(135deg, #6E43FF 0%, #3D5AFE 40%, #00B4DB 70%, #00C48C 100%)`
- **Accent Gradient (135°)**:
  `linear-gradient(135deg, #6E43FF 0%, #FF8A00 100%)`
- **Progress Bar Gradient (90°)**:
  `linear-gradient(90deg, #6E43FF 0%, #3D5AFE 50%, #00B4DB 100%)`

---

## 🔤 3. Typography & Hierarchy

Font Family: **Poppins**, `sans-serif` (`font-family: var(--font-poppins), sans-serif;`)

| Scale / Element | Size | Weight | Line Height | Color | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `48px` (`3rem`) | 800 (ExtraBold) | 1.15 | `#0D1133` | Page hero banner titles |
| **H1** | `36px` (`2.25rem`) | 700 (Bold) | 1.15 | `#0D1133` | Main section headings |
| **H2** | `28px` (`1.75rem`) | 700 (Bold) | 1.2 | `#0D1133` | Sub-section titles, modal headers |
| **H3** | `20px` (`1.25rem`) | 600 (SemiBold) | 1.3 | `#0D1133` | Card headers, widget titles |
| **Body Large** | `18px` (`1.125rem`) | 400 (Regular) | 1.6 | `#6B7280` | Intro paragraphs, hero descriptions |
| **Body Regular** | `15px` (`0.9375rem`) | 400 (Regular) | 1.6 | `#6B7280` | Standard UI paragraph text |
| **Label / Small** | `12px` (`0.75rem`) | 500 (Medium) | 1.4 | `#6B7280` | Badges, timestamps, small tags |

---

## 📐 4. Layout, Geometry, Radii & Elevation

- **Max Container Width**: `max-width: 1200px; margin: 0 auto;` (`max-w-7xl` or custom `1200px`).
- **4px Spatial Grid**: Spacing steps in 4px multiples (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`).
- **Border Radii**:
  - **Cards & Containers**: `16px` (`rounded-2xl` or `rounded-[16px]`).
  - **Buttons & Text Inputs**: `10px` (`rounded-xl` or `rounded-[10px]`).
  - **Pills, Chips & Badges**: `999px` (`rounded-full`).
  - **Large Feature Panels**: `24px` (`rounded-3xl`).
- **Elevation & Shadows**:
  - **Standard Card Shadow**: `box-shadow: 0 4px 20px rgba(13, 17, 51, 0.06);`
  - **Highlighted/Hero Shadow**: `box-shadow: 0 8px 30px rgba(110, 67, 255, 0.12);`
  - **Floating Ambient Glow**: `box-shadow: 0 12px 40px -12px rgba(110, 67, 255, 0.45);`

---

## 🧩 5. Core Component Specifications & Patterns

### 1. Level-Based Roadmap
- **Structure**: Vertical step timeline featuring numbered level nodes (Level 1: Fundamentos, Level 2: Lenguajes base, Level 3: Manipulación de Datos, Level 4: Análisis y Visualización, Level 5: Proyecto Integrador).
- **Node Colors**: Completed level node (`#00C48C`), Active level node (`#6E43FF`), Future level node (`#FF8A00` or `#00B4DB`).
- **Skill Progress Ring**: Circular SVG progress gauge (e.g. 60% completion ring in purple/orange tint).

### 2. Skill Cards
- **Dimensions**: Compact white card with 16px radius, soft border (`#E5E7EB`).
- **Status Indicator**:
  - **Mastered**: Green status pill (`#00C48C`) with checkmark `✓`.
  - **In Progress**: Electric purple / indigo status badge (`#6E43FF` / `#3D5AFE`).
  - **Pending**: Orange indicator (`#FF8A00`).

### 3. Conversational Onboarding
- **Layout**: Clean chat window layout with steps top progress bar.
- **Chat Bubbles**: Left-aligned AI system message in soft grey/white card; Right-aligned user response bubble in solid primary purple (`#6E43FF`) with white text.
- **Interactive Widgets**: Rounded selection chips, range sliders, option cards with radial/checkbox selections.

### 4. Course Comparison Cards
- **Attributes**: Top header tag (Provider: AWS, Platzi, freeCodeCamp, edX), 3D icon artwork, rating stars (e.g. `4.9 ★`), course title in `#0D1133`, meta details (Duration `6h`, Level `Básico`, Price `Gratis`, Format `Lectura/Video`).
- **CTA**: Clean outline button (`View course ->`).

### 5. AI Assistant & Streak Callouts
- **AI SmartPath Bot Widget**: Card with cute 3D robot illustration, purple prompt message, and primary action button ("Abrir chat").
- **Daily Streak Banner**: Rocket illustration, active streak counter ("12 días ¡Sigue así! 🔥"), weekly day pills (L, M, M, J, V, S, D).

---

## 🎨 6. Iconography & Visual Assets

- **Icon Library**: Use **Lucide Icons** exclusively (`lucide-react`).
- **Icon Style**: Linear stroke, 2px stroke width, rounded caps/joins. Do NOT mix multiple icon packs (e.g., FontAwesome, Material Icons).
- **Visual Illustrations & 3D Accents**:
  - Use high-quality 3D renders/illustrations (rocket, cloud tech, mountain peak, laptop code, robot) to add visual depth to callouts.
  - **Stock Photo Policy**: Strictly **NO** generic corporate stock photos of people in suits. Prefer tech graphics, career growth imagery, abstract learning concepts.

---

## ✅ DO'S & ❌ DONT'S

### ✅ DO (Mandatory Patterns)
- **Maintain Light Canvas**: Use white containers on light slate/lavender backgrounds (`#F8FAFC`).
- **Hero the Roadmap**: Give progress paths, level steps, and next steps top visual prominence.
- **Use Poppins Typography**: Maintain strict hierarchy (800 for Hero, 700 for Headings, 600 for Subtitles, 400 for Body).
- **Respect Radius System**: 16px for cards, 10px for inputs/buttons, 999px for badges/pills.
- **Keep Navigation Clean**: Highlight active links with soft purple background (`#F3F0FF`) and purple text (`#6E43FF`).

### ❌ DONT (Strictly Forbidden)
- ❌ **NO All-Dark Mode for MVP**: Do not generate dark-themed pages.
- ❌ **NO Generic Enterprise SaaS/CRM Look**: Avoid dense data tables, gray box walls, or admin template aesthetics.
- ❌ **NO Color Overuse**: Do not turn every element purple. Balance primary purple with indigo, cyan, green, and white.
- ❌ **NO Gradient Abuse**: Reserve gradients for hero elements, progress bars, and key feature callouts.
- ❌ **NO Hard Black Shadows**: Never use heavy `#000000` shadows. Use soft indigo-tinted drop shadows (`rgba(13, 17, 51, 0.06)`).

---

## 📋 7. UI Verification Checklist

Run this checklist before completing any React component or page task:

- [ ] Page uses light background (`#F8FAFC`) with clean white cards (`#FFFFFF`).
- [ ] Font family is **Poppins** with correct weights (Bold/SemiBold for titles, Regular for body).
- [ ] Primary buttons use `#6E43FF` with 10px rounded corners.
- [ ] Cards have 16px rounded corners (`rounded-2xl`), border `#E5E7EB`, and shadow `0 4px 20px rgba(13, 17, 51, 0.06)`.
- [ ] Badges, chips, and pills have 999px rounded corners (`rounded-full`).
- [ ] Status indicators strictly use `#00C48C` (Completed), `#6E43FF` (In Progress), and `#FF8A00` (Pending/Alert).
- [ ] Icons come exclusively from `lucide-react`.
- [ ] Layout is responsive across Mobile (`sm`), Tablet (`md`), and Desktop (`lg`/`xl`) up to 1200px max width.
- [ ] Visual hierarchy is obvious: user immediately knows where they are, what step is next, and how to proceed.
