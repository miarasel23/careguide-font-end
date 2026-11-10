/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        admin: {
          bg: "#f4f6f9",
          sidebar: "#18181b",
          border: "#dee2e6",
        },
      },
    },
  },
  plugins: [],
};
