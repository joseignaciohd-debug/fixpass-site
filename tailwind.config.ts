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
        navy: "#0A1E3C",
        ink: "#0F172A",
        fog: "#F8FAFC",
        gold: "#FDBA2D",
        slate: "#64748B",
      },
      boxShadow: {
        lift: "0 18px 45px -24px rgba(10, 30, 60, 0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 25% 20%, rgba(253,186,45,.22) 0%, rgba(253,186,45,0) 40%), radial-gradient(circle at 90% 10%, rgba(56,189,248,.18) 0%, rgba(56,189,248,0) 35%)",
      },
    },
  },
  plugins: [],
};

export default config;
