# Tailwind CSS — Recap

---

## What is Tailwind?

Instead of writing a separate CSS file, you apply small utility classes directly in your JSX.

```tsx
// Without Tailwind — you'd write CSS somewhere else
<button className="my-button">Add Book</button>

// With Tailwind — styles live right here
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    Add Book
</button>
```

Each class does exactly one thing. You compose them together.

---

## Spacing

| Class | What it does |
|---|---|
| `p-4` | padding on all sides (1rem) |
| `px-4` | padding left + right |
| `py-2` | padding top + bottom |
| `m-4` | margin on all sides |
| `mb-4` | margin bottom |
| `mt-4` | margin top |
| `gap-4` | gap between flex/grid children |

Numbers scale: `1` = 0.25rem, `2` = 0.5rem, `4` = 1rem, `8` = 2rem

---

## Sizing

| Class | What it does |
|---|---|
| `w-full` | width 100% |
| `w-64` | fixed width (16rem) |
| `max-w-md` | max width medium (~28rem) |
| `max-w-xl` | max width extra large (~36rem) |
| `h-10` | fixed height |
| `min-h-screen` | min height = full viewport |

---

## Typography

| Class | What it does |
|---|---|
| `text-sm` | small text |
| `text-base` | normal text |
| `text-xl` | larger text |
| `text-2xl` | even larger |
| `font-bold` | bold |
| `font-medium` | medium weight |
| `text-gray-500` | muted gray |
| `text-white` | white text |

---

## Colors

Pattern: `{property}-{color}-{shade}`
Shades go from `50` (lightest) to `900` (darkest)

```tsx
bg-blue-500      // blue background
text-gray-700    // dark gray text
border-gray-300  // light gray border
text-red-500     // red text (delete buttons)
```

Common colors: `gray`, `blue`, `red`, `green`, `yellow`, `purple`, `indigo`

---

## Layout

| Class | What it does |
|---|---|
| `flex` | display flex |
| `flex-col` | flex direction column |
| `items-center` | align items center (cross axis) |
| `justify-center` | justify content center (main axis) |
| `justify-between` | space between children |
| `grid` | display grid |
| `mx-auto` | center block horizontally |

---

## Borders & Shapes

| Class | What it does |
|---|---|
| `border` | 1px border |
| `border-gray-300` | border color |
| `rounded` | small border radius |
| `rounded-lg` | larger border radius |
| `rounded-full` | pill shape |
| `shadow` | small drop shadow |
| `shadow-md` | medium drop shadow |

---

## Interactivity

Prefix any class with `hover:` to apply it on hover:

```tsx
hover:bg-blue-600    // darker blue on hover
hover:text-red-700   // darker red on hover
hover:shadow-lg      // bigger shadow on hover
```

---

## Focus (inputs)

```tsx
focus:outline-none      // remove default outline
focus:ring-2            // add ring on focus
focus:ring-blue-500     // ring color
```

---

## Common Patterns

### Centered page layout
```tsx
<div className="max-w-xl mx-auto px-4 py-8">
    ...
</div>
```

### Card
```tsx
<div className="border border-gray-200 rounded-lg p-4 shadow-sm">
    ...
</div>
```

### Full-width input
```tsx
<input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
```

### Primary button
```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    Add Book
</button>
```

### Danger button
```tsx
<button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
    Delete
</button>
```

---

## How it's set up in this project

Tailwind v4 — no config file needed. Just two things:

1. Plugin in `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite'
plugins: [react(), tailwindcss()]
```

2. Import in `index.css`:
```css
@import "tailwindcss";
```

That's it. Classes are available everywhere in the project.
