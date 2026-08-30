// Lightweight PubSub Toast Notification Bus (Phase 4 / SRE)

const listeners = new Set();
let toastIdCounter = 0;

export const toast = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  show(message, type = 'info', duration = 4000, title = '') {
    const id = ++toastIdCounter;
    const toastItem = { id, message, type, duration, title, timestamp: Date.now() };
    listeners.forEach((listener) => listener(toastItem));
    return id;
  },

  error(message, title = 'Error') {
    return this.show(message, 'error', 5000, title);
  },

  success(message, title = 'Success') {
    return this.show(message, 'success', 3500, title);
  },

  info(message, title = 'Notification') {
    return this.show(message, 'info', 3500, title);
  },

  warning(message, title = 'Warning') {
    return this.show(message, 'warning', 4500, title);
  },
};

export default toast;
