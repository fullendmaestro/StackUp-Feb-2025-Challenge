/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
          DEFAULT: "#2E7D32", // Green color used in the application
          foreground: "#FFFFFF", // White foreground for primary
        },
        secondary: {
          DEFAULT: "#E8F4FC", // Light blue background color used in the application
          foreground: "#2E7D32", // Green foreground for secondary
        },
        destructive: {
          DEFAULT: "#D32F2F", // Red color for destructive actions
          foreground: "#FFFFFF", // White foreground for destructive
        },
        muted: {
          DEFAULT: "#A5D6A7", // Light green color for muted elements
          foreground: "#2E7D32", // Green foreground for muted
        },
        accent: {
          DEFAULT: "#81C784", // Accent color used in the application
          foreground: "#2E7D32", // Green foreground for accent
        },
        popover: {
          DEFAULT: "#E8F4FC", // Light blue background for popovers
          foreground: "#2E7D32", // Green foreground for popovers
        },
        card: {
          DEFAULT: "#FFFFFF", // White background for cards
          foreground: "#2E7D32", // Green foreground for cards
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
