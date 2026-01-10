export type WidgetThemeMode = 'auto' | 'light' | 'dark' | 'inherit';

/**
 * Detects the theme of the host page by examining background color
 * and calculating luminance. Handles cross-origin restrictions gracefully.
 */
export function detectHostTheme(): 'light' | 'dark' {
    // Try to detect parent page theme
    try {
        if (typeof window !== 'undefined' && window.parent !== window) {
            const parentBg = window.parent.getComputedStyle(
                window.parent.document.body
            ).backgroundColor;

            // Parse RGB and calculate luminance
            const rgb = parentBg.match(/\d+/g);
            if (rgb) {
                const [r, g, b] = rgb.map(Number);
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                return luminance > 0.5 ? 'light' : 'dark';
            }
        }
    } catch (e) {
        // Cross-origin restriction, fall back to system
    }

    return (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light';
}

/**
 * Applies the widget theme to the document element.
 */
export function applyWidgetTheme(mode: WidgetThemeMode = 'auto') {
    if (typeof window === 'undefined') return 'light';

    let theme: 'light' | 'dark';

    switch (mode) {
        case 'inherit':
            theme = detectHostTheme();
            break;
        case 'auto':
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            break;
        default:
            theme = mode as 'light' | 'dark';
    }

    document.documentElement.setAttribute('data-widget-theme', theme);
    // Also add/remove 'dark' class for Tailwind consistency within the widget if needed
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    return theme;
}
