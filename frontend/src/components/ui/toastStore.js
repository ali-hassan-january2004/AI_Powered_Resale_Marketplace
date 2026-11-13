let toasts = [];
let nextId = 1;
const listeners = new Set();
const emit = () => listeners.forEach((listener) => listener(toasts));

export const subscribeToasts = (listener) => {
  listeners.add(listener);
  listener(toasts);
  return () => listeners.delete(listener);
};

const dismiss = (id) => {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
};

const show = (message, { type = "info", duration = 4000 } = {}) => {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];
  emit();
  if (duration > 0) setTimeout(() => dismiss(id), duration);
  return id;
};

export const toast = {
  show,
  dismiss,
  success: (message, options) => show(message, { ...options, type: "success" }),
  error: (message, options) => show(message, { duration: 6000, ...options, type: "error" }),
  info: (message, options) => show(message, { ...options, type: "info" }),
};
