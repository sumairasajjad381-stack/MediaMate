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
        insta: {
          purple: "#833AB4",
          pink: "#FD1D1D",
          orange: "#F77737",
          yellow: "#FCAF45",
          blue: "#0095F6",
          dark: "#121212",
          card: "#1E1E1E",
          border: "#2E2E2E"
        }
      }
    },
  },
  plugins: [],
};
