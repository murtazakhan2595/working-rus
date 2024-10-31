/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',


  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    
    },
    extend: {
       
      fontFamily: {
        body: ['Inter', 'sans-serif'], // Define your custom font family
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "gray": {
          100: "hsl(var(--gray-1))",
          200: "hsl(var(--gray-2))",
          300: "hsl(var(--gray-3))",
          400: "hsl(var(--gray-4))",
          500: "hsl(var(--gray-5))",
          600: "hsl(var(--gray-6))",
          700: "hsl(var(--gray-7))",
          800: "hsl(var(--gray-8))",
          900: "hsl(var(--gray-9))",
          1000: "hsl(var(--gray-10))",
          1100: "hsl(var(--gray-11))",
          1200: "hsl(var(--gray-12))",
        },

        
        "mauve": {
          100: "hsl(var(--mauve-1))",
          200: "hsl(var(--mauve-2))",
          300: "hsl(var(--mauve-3))",
          400: "hsl(var(--mauve-4))",
          500: "hsl(var(--mauve-5))",
          600: "hsl(var(--mauve-6))",
          700: "hsl(var(--mauve-7))",
          800: "hsl(var(--mauve-8))",
          900: "hsl(var(--mauve-9))",
          1000: "hsl(var(--mauve-10))",
          1100: "hsl(var(--mauve-11))",
          1200: "hsl(var(--mauve-12))",
        },

       
       
        "slate": {
          100: "hsl(var(--slate-1))",
          200: "hsl(var(--slate-2))",
          300: "hsl(var(--slate-3))",
          400: "hsl(var(--slate-4))",
          500: "hsl(var(--slate-5))",
          600: "hsl(var(--slate-6))",
          700: "hsl(var(--slate-7))",
          800: "hsl(var(--slate-8))",
          900: "hsl(var(--slate-9))",
          1000: "hsl(var(--slate-10))",
          1100: "hsl(var(--slate-11))",
          1200: "hsl(var(--slate-12))",
        },

       
        "plum": {
          100: "hsl(var(--plum-1))",
          200: "hsl(var(--plum-2))",
          300: "hsl(var(--plum-3))",
          400: "hsl(var(--plum-4))",
          500: "hsl(var(--plum-5))",
          600: "hsl(var(--plum-6))",
          700: "hsl(var(--plum-7))",
          800: "hsl(var(--plum-8))",
          900: "hsl(var(--plum-9))",
          1000: "hsl(var(--plum-10))",
          1100: "hsl(var(--plum-11))",
          1200: "hsl(var(--plum-12))",
        },

        "neutral": {
          100: "hsl(var(--neutral-1))",
          200: "hsl(var(--neutral-2))",
          300: "hsl(var(--neutral-3))",
          400: "hsl(var(--neutral-4))",
          500: "hsl(var(--neutral-5))",
          600: "hsl(var(--neutral-6))",
          700: "hsl(var(--neutral-7))",
          800: "hsl(var(--neutral-8))",
          900: "hsl(var(--neutral-9))",
          1000: "hsl(var(--neutral-10))",
          1100: "hsl(var(--neutral-11))",
          1200: "hsl(var(--neutral-12))",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    screens: {
      'sm': '640px',
      
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    
  },
  plugins: [require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
  
}


