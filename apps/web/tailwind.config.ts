import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0E0F12",
        canvas: "#0E0F12",
        surface: {
          DEFAULT: "#1E1F24",
          elevated: "#282A30",
          subtle: "#16171B",
          highlight: "#35383F",
          border: "rgba(255, 255, 255, 0.08)",
        },
        gpay: {
          blue: "#A8C7FA",
          blueDark: "#0B57D0",
          blueContainer: "#004A77",
          blueText: "#041E49",
          textPrimary: "#E3E3E3",
          textSecondary: "#C4C7C5",
          textMuted: "#8E918F",
          border: "#444746",
          pillPurple: "#2D1E3A",
          pillTeal: "#162E33",
        },
        brand: {
          blue: "#A8C7FA",
          electric: "#C2E7FF",
          sky: "#A8C7FA",
          violet: "#D0BCFF",
          indigo: "#004A77",
          purple: "#E8DEF8",
        },
        status: {
          success: "#34D399",
          warning: "#FBBF24",
          danger: "#F87171",
          info: "#A8C7FA",
        },
        accent: {
          gold: "#FBBF24",
          teal: "#2DD4BF",
          rose: "#FB7185",
        },
      },
      borderRadius: {
        'card': '28px',
        'card-lg': '32px',
        'input': '24px',
        'pill': '9999px',
      },
      fontFamily: {
        sans: ['Google Sans', 'Roboto', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -4px rgba(168, 199, 250, 0.3)',
        'glow-emerald': '0 0 20px -4px rgba(52, 211, 153, 0.3)',
        'card-subtle': '0 2px 10px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};
export default config;
