import { describe, it, expect, vi, beforeEach } from 'vitest';
import { theme, resolveTheme } from '$lib/stores/theme';

describe('Theme System', () => {
    beforeEach(() => {
        // Reset localStorage
        localStorage.clear();
        // Reset mocks
        vi.restoreAllMocks();
    });

    it('defaults to system preference', () => {
        // Mock system dark mode
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                onchange: null,
                addListener: vi.fn(), // Deprecated
                removeListener: vi.fn(), // Deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        expect(resolveTheme('system')).toBe('dark');
    });

    it('persists user choice', () => {
        theme.set('light');
        expect(localStorage.getItem('vo-theme')).toBe('light');
    });

    it('respects explicit override', () => {
        theme.set('dark');
        expect(resolveTheme('dark')).toBe('dark');
    });
});
