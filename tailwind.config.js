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
        obsidian: {
          DEFAULT: "#050507",
          50: "#18181f",
          100: "#14141a",
          200: "#101014",
          300: "#0c0c0f",
          400: "#08080a",
          500: "#050507",
          base: "#030304",
        },
        graphite: {
          50: "#8e8e9f",
          100: "#717182",
          200: "#5a5a68",
          300: "#444450",
          400: "#33333d",
          500: "#24242c",
          600: "#1c1c22",
          700: "#15151a",
          800: "#0f0f13",
        },
        tactical: {
          red: "#ef4444",
          amber: "#f59e0b",
          green: "#10b981",
          cyan: "#06b6d4",
          blue: "#3b82f6",
          silver: "#e2e8f0",
          muted: "#94a3b8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        tactical: "0.2em",
        tightest: "-0.05em",
        editorial: "0.08em",
      },
      animation: {
        "radar-sweep": "radar 4s linear infinite",
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
        "glitch": "glitch 0.2s ease-in-out infinite",
      },
      keyframes: {
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
      backgroundImage: {
        "grid-tactical": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        "radar-radial": "radial-gradient(circle at center, rgba(6, 182, 212, 0.08) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
