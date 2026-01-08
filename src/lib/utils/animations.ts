export function fadeInUp(node: HTMLElement, { delay = 0, duration = 600 } = {}) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                node.style.opacity = '1';
                node.style.transform = 'translateY(0)';
                observer.unobserve(node);
            }
        });
    }, { threshold: 0.1 });

    node.style.opacity = '0';
    node.style.transform = 'translateY(20px)';
    node.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`;

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        }
    };
}

export function staggerChildren(node: HTMLElement, { delay = 100, stagger = 100 } = {}) {
    const children = Array.from(node.children) as HTMLElement[];
    children.forEach((child, index) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = `opacity 600ms cubic-bezier(0.4, 0, 0.2, 1) ${delay + index * stagger}ms, transform 600ms cubic-bezier(0.4, 0, 0.2, 1) ${delay + index * stagger}ms`;

        // Use IntersectionObserver for staggered children as well if applied to a container
        // checking if parent is in view or trigger manually.
        // For simplicity reusing the parent observer pattern in components is often easier.
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                children.forEach((child) => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                });
                observer.unobserve(node);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        }
    };
}

export function setupScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });
}
