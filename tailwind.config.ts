/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#040B14",
          900: "#0A1628",
          800: "#122640",
          700: "#1A3354",
        },
        brand: {
          DEFAULT: "#059669",
          light:   "#34D399",
          dark:    "#047857",
        },
        accent: {
          DEFAULT: "#2563EB",
          light:   "#60A5FA",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        brand: "0 4px 24px rgba(5,150,105,.25)",
        card:  "0 1px 3px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06)",
      },
    },
  },
  plugins: [],
};
