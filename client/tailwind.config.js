/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        primary: "#470821",
        primary100: "#801942",
        primary200: "#5E1934",
        primary300: "#4D1229",
        primary400: "#3D0B1F",
        primary500: "#39071B",
        primary100A: "#80194267",
        primaryX:"#DAB018",
        
        secondary: "#DAB018",
        secondaryA: "#dab0186f",
        
    
        makePlay: "#9105E7",
        wating: "#05A3E7",
        loose: "#F63125",
        winner: "#31B02F",
        tie:"#9A9292",

        white80: "rgba(255, 255, 255, 0.8)",
        white60: "rgba(255, 255, 255, 0.6)"
      },
      fontFamily: {
        sans: ['Inter var',],
      },
    },
  },
  plugins: [],
}
