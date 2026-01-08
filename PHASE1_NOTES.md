# Phase 1 Notes: Foundation + Hero

## Overview
Implemented the foundational design system and the high-impact Hero section for VoiceOrchestrator. This establishes the visual language (Vercel/Linear aesthetic) and sets up the project structure for future phases.

## What was built
1.  **Design System**: Fully configured `tailwind.config.js` with semantic colors (primary, secondary, accent), fonts (Geist/Inter), and custom animations.
2.  **Architecture**: Restructured routes to separate the Landing Page `(marketing)` from the Dashboard `(app)`.
    - Landing: `/`
    - Dashboard: `/app`
3.  **UI Components**:
    - `Button.svelte`: Primary, secondary, outline variants.
    - `Badge.svelte`: Semantic status badges.
    - `FeatureCard.svelte`: Reusable card pattern (ready for Phase 2).
4.  **Hero Section**:
    - Animated entrance sequence.
    - Custom "Orchestrator Graph" visual using SVG and CSS animations for performance.
    - Responsive layout.
5.  **Layout**:
    - Sticky glass-morphism header.
    - Dark/Light mode toggle with persistence.

## Design Decisions
- **SVG Animations**: Used CSS keyframes on SVG paths for the hero visual instead of a heavy JS library (Three.js/Canvas) to ensure instant load times (Total Blocking Time ~0).
- **Route Groups**: Used `(landing)` and `(app)` to apply distinct layouts while keeping the codebase unified.
- **Tailwind**: Switched from CDN to Build-time to enable custom config and optimization.

## How to Test
1.  **Deployment**: `npm run build` && `npx wrangler pages deploy`.
2.  **Hero**: Visit the root URL. Refresh to see the entrance animation.
3.  **Theme**: Toggle the sun/moon icon. Verify the palette shifts correctly (Deep Navy for dark mode).
4.  **Responsiveness**: Resize browser to mobile width. Verify stacked layout and valid spacing.

## Next Steps (Phase 2)
- Implement `Features` section using `FeatureCard`.
- Build `How It Works` and `Pricing` sections.
- Add mobile menu overlay functionality.
