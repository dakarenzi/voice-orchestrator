export type ToastType = 'success' | 'error';

export interface Toast {
    id: string;
    msg: string;
    type: ToastType;
}

class ToastStore {
    toasts = $state<Toast[]>([]);

    add(msg: string, type: ToastType = 'success') {
        const id = Math.random().toString(36).substr(2, 9);
        this.toasts.push({ id, msg, type });
        setTimeout(() => {
            this.remove(id);
        }, 3000);
    }

    remove(id: string) {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }
}

export const toast = new ToastStore();
