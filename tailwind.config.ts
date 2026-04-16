import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "Manrope", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Sora", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      colors: {
        // --- Navy-Atelier palette (mirrors mobile app) ---
        ink: "#0B1B36", // main text, deepest navy
        navy: "#0C2348", // primary brand navy (buttons, hero bg)
        "navy-deep": "#061226",
        royal: "#1E3A8A", // secondary navy for gradients
        electric: "#3B82F6", // active/interactive blue
        neon: "#60A5FA", // highlight / accent blue

        parchment: "#FBF8F2", // warm off-white page tint
        ivory: "#F7F5F0", // card surface
        stone: "#E8E4DA", // subtle borders/dividers
        fog: "#F5F7FB", // cool neutral surface

        terracotta: "#C87764", // warm accent (limited use)
        "terracotta-soft": "#F4E1DA",
        sage: "#7A9075", // natural accent
        "sage-soft": "#E1E8DE",
        honey: "#D9A85F", // warm highlight
        "honey-soft": "#F5E8D0",

        slate: "#64748B",
      },
      boxShadow: {
        lift: "0 18px 45px -24px rgba(11, 27, 54, 0.45)",
        card: "0 24px 64px -36px rgba(15, 23, 42, 0.26), inset 0 1px 0 rgba(255,255,255,0.7)",
        glow: "0 30px 80px -28px rgba(30, 58, 138, 0.55)",
        hero: "0 40px 120px -48px rgba(11, 27, 54, 0.78)",
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 18% 12%, rgba(96,165,250,0.22) 0%, transparent 40%), radial-gradient(circle at 88% 8%, rgba(216,168,95,0.16) 0%, transparent 38%)",
        "ink-gradient":
          "linear-gradient(145deg, #061226 0%, #0C2348 55%, #1E3A8A 100%)",
        "royal-gradient":
          "linear-gradient(135deg, #0C2348 0%, #1E3A8A 60%, #3B82F6 100%)",
      },
      letterSpacing: {
        "ultra-tight": "-0.05em",
        "display": "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
