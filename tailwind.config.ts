import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          50: "#E6EEF7",
          100: "#CCE0F0",
          200: "#99C1E1",
          300: "#66A3D1",
          400: "#3384C2",
          500: "#004F9F",
          600: "#003F7F",
          700: "#002F5F",
          800: "#002040",
          900: "#001020",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          light: "#5DD879",
          DEFAULT: "hsl(var(--secondary))",
          dark: "#1E7E34",
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
          light: "#FFD54F",
          DEFAULT: "hsl(var(--accent))",
          dark: "#FFA000",
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
        // ICPL Semantic Colors (aligned with CSS variables)
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--destructive))",
        info: "hsl(var(--primary))",
      },
      fontFamily: {
        sans: ["Public Sans", "Noto Sans Thai", "sans-serif"],
        primary: ["Public Sans", "Noto Sans Thai", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
