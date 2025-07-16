import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Apartment rental brand colors
        brand: {
          orange: "#e67e22", // Primary brand color (230, 126, 34)
          50: "#fdf6f0",
          100: "#fbead9",
          200: "#f6d0ae",
          300: "#efad7a",
          400: "#e67e22", // Main brand
          500: "#d97706",
          600: "#c2610c",
          700: "#a14b0c",
          800: "#833d12",
          900: "#6c3412",
        },

        // Semantic colors from the design
        page: {
          bg: "#fafbfc", // Main page background (250, 251, 252)
        },

        neutral: {
          50: "#f8fafc", // White backgrounds
          100: "#f1f5f9", // Light borders
          200: "#e2e8f0", // Border color (226, 232, 240)
          300: "#cbd5e1", // Dividers
          400: "#94a3b8", // Subtle text (148, 163, 184)
          500: "#64748b", // Medium gray text (100, 116, 139)
          600: "#475569", // Secondary text (71, 85, 105)
          700: "#334155", // Footer borders
          800: "#1e293b", // Footer background
          900: "#0f172a", // Primary text (44, 62, 80)
        },

        status: {
          available: "#22c55e", // Green (34, 197, 94)
          limited: "#f39c12", // Orange (243, 156, 18)
          booked: "#e74c3c", // Red (231, 76, 60)
        },

        // Original shadcn colors for compatibility
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px", // Small elements
        md: "8px", // Default elements
        lg: "12px", // Cards and containers
        xl: "16px",
        "2xl": "24px",
        full: "9999px", // Circular elements
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
        "4xl": ["36px", { lineHeight: "40px" }],
        "5xl": ["48px", { lineHeight: "1" }],
      },
      spacing: {
        18: "4.5rem", // 72px
        88: "22rem", // 352px
        100: "25rem", // 400px
      },
      maxWidth: {
        "8xl": "88rem", // 1408px
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
