/**
 * Tracks theme changes using Google Analytics (gtag).
 * 
 * @param from - The previous theme mode
 * @param to - The new theme mode
 */
export function trackThemeChange(from: string, to: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'theme_change', {
            from_theme: from,
            to_theme: to,
            is_system: to === 'system'
        });
    }
}
