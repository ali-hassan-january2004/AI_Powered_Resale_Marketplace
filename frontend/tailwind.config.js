/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Distinctive headings + a clean body face (SRS 9.5). Loaded in index.html.
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        brand: {
          50: "var(--color-brand-50)",
          100: "var(--color-brand-100)",
          500: "var(--color-brand-500)",
          600: "var(--color-brand-600)",
          700: "var(--color-brand-700)",
        },
      },
    },
  },
  plugins: [],
};