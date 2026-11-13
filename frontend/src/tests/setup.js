import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// jsdom has no matchMedia, IntersectionObserver or object URLs
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

URL.createObjectURL = vi.fn(() => "blob:mock-url");
URL.revokeObjectURL = vi.fn();
window.scrollTo = vi.fn();

if (!globalThis.crypto?.randomUUID) {
  globalThis.crypto = { ...globalThis.crypto, randomUUID: () => `id-${Math.random().toString(16).slice(2)}` };
}