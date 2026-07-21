# Border Standardization & Card Rules Protocol

This specification defines the mandatory border styling and card container standardization for the LIAO platform.

## Standard Border Tokens

| Context | Light Mode Class | Dark Mode Class | Purpose |
| :--- | :--- | :--- | :--- |
| **Cards & Containers** | `border border-neutral-200` | `dark:border-neutral-700` | Standardized 1px subtle light/dark gray border for all card components. |
| **White / Outline Buttons** | `border border-neutral-200` | `dark:border-neutral-700` | Border specification for white and outline buttons (`Button.tsx`). |
| **Avatar Rings** | `border-2 border-neutral-200` | `dark:border-neutral-700` | Subtle avatar border replacing legacy rainbow gradient rings. |

---

## Design System Tokens & Implementation

To prevent hardcoding classes across individual views, border standards are centralized in `src/index.css` and base UI components:

```css
/* src/index.css */
@layer components {
  .card {
    @apply bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-md hover:shadow-xl dark:shadow-neutral-900/50 transition-all duration-300 overflow-hidden;
  }

  .border-card {
    @apply border border-neutral-200 dark:border-neutral-700;
  }
}
```

---

## Component Constraints & Rules

1. **No Out-of-Place Multi-Color Gradient Borders**:
   - Colorful outer gradient borders (e.g., `bg-gradient-to-br from-danger-500 via-warning-400 to-success-500`) are strictly forbidden on member cards, tutor cards, or standard event cards.
   - Use standard neutral borders with background elevation (`bg-white dark:bg-neutral-800`).

2. **White Buttons**:
   - White buttons must always enforce `border border-neutral-200 dark:border-neutral-700` to maintain definition against light backgrounds.

3. **Reusability**:
   - Always wrap new domain cards with `.card`, `.border-card`, or `<Card>` component.
