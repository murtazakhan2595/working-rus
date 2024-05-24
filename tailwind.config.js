/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx}", "./public/index.html"],
  content: [],
  theme: {
    fontFamily: {
      montserrat: ["Montserrat", "sans-serif"],
      sfpro: ["SF Pro Display", "sans-serif"],
      lato: ['Lato'],
      roboto: ['Roboto']
    },
    extend: {
      boxShadow: {
        custom: "5px 10px 18px rgba(0, 0, 0, 0.45)",
      },
      textColor: {
        baseBlue: "#283B91",
        input: "#555657",
        baseGray: "#5C5E64"
      },
      backgroundColor: {
        baseBlue: "#283B91",
      },
      borderColor: {
        baseGray: "#5C5E64"
      }
    },
    screens: {
      xs: "300px",
      // => @media (min-width: 320px) { ... }

      sm: "425px",
      // => @media (min-width: 426px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1440px",
      // => @media (min-width: 1280px) { ... }

      "3xl": "1600px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
