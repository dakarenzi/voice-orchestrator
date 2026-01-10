import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { trackThemeChange } from '$lib/analytics';

export type Theme = 'light' | 'dark' | 'high-contrast' | 'system';
export type ResolvedTheme = 'light' | 'dark' | 'high-contrast';

// Detect system preference including high-contrast
function getSystemTheme(): ResolvedTheme {
    if (!browser) return 'dark';

    // Check for high-contrast preference first
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    if (prefersHighContrast) return 'high-contrast';

    // Then check for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
}

// Get stored or system theme
function getInitialTheme(): Theme {
    if (!browser) return 'system';

    const stored = localStorage.getItem('vo-theme') as Theme;
    return stored || 'system';
}

// Resolve 'system' to actual theme
export function resolveTheme(theme: Theme): ResolvedTheme {
    if (theme === 'system') return getSystemTheme();
    return theme as ResolvedTheme;
}

// Get theme color for meta tag
function getThemeColor(theme: ResolvedTheme): string {
    switch (theme) {
        case 'high-contrast':
            return '#000000';
        case 'dark':
            return '#0a0a0a';
        case 'light':
            return '#ffffff';
        default:
            return '#0a0a0a';
    }
}

// Apply theme to document
function applyTheme(resolved: ResolvedTheme) {
    if (!browser) return;

    document.documentElement.setAttribute('data-theme', resolved);

    // Toggle 'dark' class for Tailwind (both dark and high-contrast are dark schemes)
    if (resolved === 'dark' || resolved === 'high-contrast') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', getThemeColor(resolved));
    }
}

// Create theme store
function createThemeStore() {
    const { subscribe, set, update } = writable<Theme>(getInitialTheme());

    return {
        subscribe,
        set: (value: Theme) => {
            if (browser) {
                const current = localStorage.getItem('vo-theme') || 'system';
                localStorage.setItem('vo-theme', value);
                const resolved = resolveTheme(value);
                applyTheme(resolved);
                trackThemeChange(current, value);
            }
            set(value);
        },
        toggle: () => {
            update(current => {
                const resolved = resolveTheme(current);
                // Cycle through: light → dark → high-contrast → light
                let next: Theme;
                if (resolved === 'light') next = 'dark';
                else if (resolved === 'dark') next = 'high-contrast';
                else next = 'light';

                if (browser) {
                    localStorage.setItem('vo-theme', next);
                    const resolvedNext = resolveTheme(next);
                    applyTheme(resolvedNext);
                    trackThemeChange(current, next);
                }

                return next;
            });
        },
        init: () => {
            if (browser) {
                const initial = getInitialTheme();
                const resolved = resolveTheme(initial);
                applyTheme(resolved);

                // Listen for system preference changes
                const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const contrastQuery = window.matchMedia('(prefers-contrast: more)');

                const updateSystemTheme = () => {
                    const current = localStorage.getItem('vo-theme') as Theme;
                    if (current === 'system' || !current) {
                        const newTheme = getSystemTheme();
                        applyTheme(newTheme);
                    }
                };

                colorSchemeQuery.addEventListener('change', updateSystemTheme);
                contrastQuery.addEventListener('change', updateSystemTheme);
            }
        }
    };
}

export const theme = createThemeStore();
