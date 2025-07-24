/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",       // slate-50
        foreground: "#0f172a",       // slate-900
        primary: "#475569",          // slate-600
        secondary: "#64748b",        // slate-500
        accent: "#38bdf8",           // sky-400 (to balance slate)
        muted: "#e2e8f0",            // slate-200
        danger: "#ef4444",           // red-500
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};
