/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F2440",
        gold: "#C6A664",
        "gold-dark": "#A88A4A",
      },
      borderRadius: { xl: "16px" }
    }
  },
  plugins: []
}
