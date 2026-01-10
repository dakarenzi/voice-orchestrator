# VoiceOrchestrator Theming Documentation

This document outlines the architecture, usage, and accessibility standards of the VoiceOrchestrator semantic theming system.

## Architecture

The system uses a triple-layered approach to theming:

1.  **Semantic Definitions** (`src/lib/styles/tokens/colors.css`): Defines high-level variables like `--bg-default` or `--text-primary`. These NEVER contain actual color hex codes.
2.  **Theme Implementations**:
    *   **Light** (`src/lib/styles/tokens/light.css`): Warm whites and deep indigos.
    *   **Dark** (`src/lib/styles/tokens/dark.css`): Rich neutrals (#0a0a0a) and soft indigos.
    *   **High Contrast** (`src/lib/styles/tokens/high-contrast.css`): Pure black/white for WCAG AAA compliance.
3.  **Tailwind Bridge** (`src/app.css`): Maps standard utility classes to the theme system where possible.

## Key Semantic Tokens

### Backgrounds
- `var(--bg-default)`: Main page background.
- `var(--bg-surface)`: Cards, sidebars, and overlays.
- `var(--bg-surface-raised)`: Hover states and secondary sections.

### Typography
- `var(--text-primary)`: Maximum contrast text for headings and body.
- `var(--text-secondary)`: Subtle text for descriptions.
- `var(--text-muted)`: De-emphasized metadata.

### Accents
- `var(--accent-primary)`: Brand color (Indigo). Used for primary buttons and selection rings.

## Implementation Guidelines

### 1. Avoid Hardcoded Colors
**❌ Incorrect:**
```html
<div class="bg-slate-900 border-gray-200">...</div>
```

**✅ Correct:**
```html
<div class="bg-bg-surface border-brd-default">...</div>
```

### 2. Zero-Flash Strategy
The theme is applied in `src/app.html` via a critical blocking script in the `<head>`. This prevents the common "flash of white" when a user with a dark theme preference loads the page.

### 3. Accessibility (WCAG AAA)
Our High-Contrast mode is designed for maximum legibility. It:
- Removes gradients.
- Replaces shadows with 1px/2px borders.
- Increases border thickness globally.
- Adds text-based symbols to status indicators (e.g., `✓` for success).

## Testing the Theme
Use the Vitest suite in `tests/theme.test.ts` to verify that system preference detection and manual overrides work correctly.

```bash
npm test
```

## Embedded Widgets
For the Voice Widget, the system uses parent-page luminance detection in `src/lib/embed/widget-theme.ts` to automatically match the host's aesthetic if `themeMode="inherit"` is set.
