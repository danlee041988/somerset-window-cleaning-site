# Glass Noir Design System

_Last updated: 2025-09-18_

Somerset Window Cleaning now uses a unified **Glass Noir** aesthetic across the marketing site and booking experience. Use this document as the single source of truth when building new UI or refactoring existing components.

## Palette

| Token             | Value                           | Usage                                              |
| ----------------- | ------------------------------- | -------------------------------------------------- |
| `--bg`            | `#0A0B0D`                       | Base page background                               |
| `--fg`            | `#F5F7FA`                       | Primary text                                       |
| `--muted`         | `rgba(245,247,250,0.72)`        | Secondary copy                                     |
| `--muted-subtle`  | `rgba(245,247,250,0.55)`        | Captions / helper text                             |
| `--accent`        | `#E11D2A`                       | Buttons, chips, tiny dividers                      |
| `--glass`         | `rgba(255,255,255,0.06)`        | Base glass fill                                    |
| `--glass-border`  | `rgba(255,255,255,0.14)`        | Hairline borders                                   |
| `--ring`          | `rgba(225,29,42,0.45)`          | Focus ring                                         |

Radial background glow is defined in `tailwind.config.ts` (`backgroundImage.radial-glow`).

## Implementation Notes

- Global tokens and the reusable `.glass-*` utilities live in `app/globals.css`. Update that file when you introduce new surface treatments or tweak blur/border values.

## Core Surfaces

- `.feature-card`, `.feature-card--minimal`, `.glass-surface`: primary glass panels with blur + soft inner highlight.
- `.glass-card` / `.glass-noir-card`: smaller cards and sidebars. Use `--tight` modifier for 16px radius.
- `.glass-noir-panel`: page-width hero/section container.
- `.glass-noir-tile`: interactive selectors. Add `--active` for selected state.
- `.glass-input`: inputs and textareas. Labels should use `.noir-subtle` and helper text `.noir-muted`.

## Buttons (`components/ui/Button.tsx`)

- `primary`: Accent-filled button with dark text and glow shadow.
- `secondary`: Glass button using `.glass-card` styling.
- `ghost`: Transparent outline with hover tint.

Always keep rounded-full shape and focus state (`focus:ring var(--ring)` with offset).

## Typography

- Font stack: `-apple-system, 'SF Pro Text', Inter, Segoe UI, Roboto, sans-serif`.
- Headings: semi-bold, tight tracking.
- Body copy: `.noir-muted`. Helper text: `.noir-subtle`.
- Chips: `.noir-chip` for uppercase metadata.

## Utility Overrides

Legacy Tailwind utilities (`bg-white/5`, `border-white/10`, etc.) are mapped to Glass Noir equivalents in `app/globals.css`. Prefer the dedicated classes above for new work.

## Layout Guidelines

1. Backgrounds remain almost black with soft red radial glows for emphasis.
2. Accents use red sparingly (primary CTAs, small dividers, metrics).
3. Surfaces should look translucent; avoid flat solid fills.
4. Focus states must use the accent ring.
5. Motion limits: 200ms ease-out; opacity + subtle translations only.

## Implementation Checklist

Before shipping a new component or page:

- [ ] Wrap panels/cards in `.glass-card`/`.glass-noir-panel` instead of raw `bg-white/5`.
- [ ] Use the shared `Button` component for actions.
- [ ] Apply `.glass-input` to form controls and `.noir-muted`/`.noir-subtle` to supporting text.
- [ ] Ensure backgrounds inherit the global gradient and no amber/orange hues remain.
- [ ] Provide responsive spacing using the Section component.
- [ ] Run `npm run lint` to confirm no style regressions.

Following this checklist keeps the experience consistent with the Glass Noir direction.
