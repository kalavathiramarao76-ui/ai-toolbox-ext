/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        glass: {
          light: "rgba(255,255,255,0.15)",
          dark: "rgba(0,0,0,0.25)",
        },
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};
