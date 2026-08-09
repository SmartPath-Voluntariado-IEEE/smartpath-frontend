---
name: developer-icons
description: Guidelines for installing, importing, and rendering technology and developer icons using the developer-icons React icon library in SmartPath. Make sure to use this skill WHENEVER adding, styling, or updating technology icons, skill logos, framework badges, developer icons, or tech stack logos in React components, roadmaps, course cards, or onboarding flows, even if the user does not explicitly mention 'developer-icons'.
---

# Developer Icons Guide for SmartPath Frontend

Use this skill to integrate, style, and render vector technology logos and developer icons in SmartPath using the `developer-icons` React package.

---

## 🔗 Official Documentation & References

- 🎨 **Live Icon Showcase & Search:** [Developer Icons Catalogue](https://xandemon.github.io/developer-icons/icons/All/)
- 📦 **GitHub Repository:** [xandemon/developer-icons](https://github.com/xandemon/developer-icons)

---

## 📦 Installation

To install `developer-icons` in the project, run:

```bash
npm i developer-icons
```

---

## ⚙️ Usage & Import Pattern

All icons are exported as named React components matching exact technology names in PascalCase.

```tsx
import {
  HTML5,
  JavaScript,
  TypeScript,
  React,
  Python,
  Git,
  PostgreSQL,
  Docker,
  TailwindCSS
} from "developer-icons";

export function SkillBadge() {
  return (
    <div className="flex items-center gap-3">
      <Git size={24} className="text-primary" />
      <React size={28} />
      <JavaScript size={24} />
    </div>
  );
}
```

---

## 🏷️ Common Icon Component Names

| Technology | Exported Component Name |
| :--- | :--- |
| **HTML5** | `<HTML5 />` |
| **JavaScript** | `<JavaScript />` |
| **TypeScript** | `<TypeScript />` |
| **React** | `<React />` |
| **Python** | `<Python />` |
| **Git** | `<Git />` |
| **GitHub** | `<GitHubDark />` / `<GitHubLight />` |
| **PostgreSQL** | `<PostgreSQL />` |
| **Docker** | `<Docker />` |
| **Node.js** | `<NodeJs />` |
| **Tailwind CSS** | `<TailwindCSS />` |
| **Adobe XD** | `<AdobeXD />` |
| **Angular** | `<Angular />` |

> 💡 **Tip:** Check the [Interactive Icon Catalogue](https://xandemon.github.io/developer-icons/icons/All/) to find exact component export names.

---

## 🎨 Styling & Component Props

`developer-icons` accept standard SVG component props:

- **`size`**: Number or string (e.g. `size={32}` or `size="2rem"`).
- **`className`**: Standard CSS / Tailwind CSS class names.
- **`style`**: Inline CSS properties.

Example:

```tsx
<Git size={32} className="shrink-0 transition-transform hover:scale-110" />
```

---

## 💡 Best Practices in SmartPath

1. **Reusability**: Use `developer-icons` inside Roadmap Skill Cards, Gap Analysis views, Onboarding chips, and Course Provider/Skill badges.
2. **Fallback**: If a specific tech icon is not available in `developer-icons`, fallback gracefully to a generic `lucide-react` icon (e.g., `Code`, `Terminal`, `Database`).
3. **Consistency**: Keep icon sizes uniform within list items or skill progress rings (e.g., `size={24}` for skill cards, `size={16}` for badges).
