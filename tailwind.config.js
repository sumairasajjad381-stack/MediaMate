/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060913",
          900: "#0a0f1d",
          850: "#0e1529",
          800: "#131c35",
          700: "#1e2c52",
        },
        brand: {
          blue: "#0284c7",
          sky: "#38bdf8",
          emerald: "#10b981",
          teal: "#14b8a6",
        },
      },
    },
  },
  plugins: [],
};
