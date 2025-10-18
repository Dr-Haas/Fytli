/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fytli Brand Colors
        'fytli-red': '#FF4D3A',
        'fytli-orange': '#FF8A3D',
        'fytli-dark': '#0E0E10',
        'fytli-gray': '#3A3A3E',
        'fytli-line': '#D7D7DB',
        'fytli-cream': '#FBFAF7',
        'fytli-success': '#2BB673',
        'fytli-info': '#2D7FF9',
        'fytli-warning': '#FFCA55',
        
        // Shadcn/UI compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'fytli-sm': '12px',
        'fytli-md': '16px',
        'fytli-lg': '20px',
        'fytli-xl': '28px',
      },
      boxShadow: {
        'fytli-card': '0 6px 24px rgba(14,14,16,0.06)',
        'fytli-hover': '0 10px 28px rgba(14,14,16,0.10)',
      },
      fontFamily: {
        'ui': ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        'brand': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        'fytli-fast': '150ms',
        'fytli-base': '200ms',
      },
      transitionTimingFunction: {
        'fytli': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}

