/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d47a3b",
        accent: "#0b6b78",
        neutral: "#1a1721",
        bgOffset: "#faf7f2",
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#d47a3b",
          "secondary": "#faf7f2",
          "accent": "#0b6b78",
          "neutral": "#1a1721",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#10b981",
          "warning": "#eab308",
          "error": "#ef4444",
        },
      },
    ],
  },
}
