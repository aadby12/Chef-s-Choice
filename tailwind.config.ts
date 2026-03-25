/** Tailwind v3 config — no `import type` so TS works even before `npm install` resolves `tailwindcss`. */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#FAF7F2",
          sand: "#E8E0D5",
          clay: "#C4A574",
          terracotta: "#B86B4C",
          espresso: "#2C2420",
          charcoal: "#1A1614",
          sage: "#8A9A84",
          mist: "#EEF0EC",
          gold: "#C9A227",
          ember: "#C45C3E",
          wine: "#722F37",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lift: "0 18px 40px -20px rgba(44, 36, 32, 0.35)",
        soft: "0 10px 30px -12px rgba(44, 36, 32, 0.18)",
        glow: "0 0 0 1px rgba(201, 162, 39, 0.25), 0 24px 50px -20px rgba(44, 36, 32, 0.45)",
      },
      backgroundImage: {
        "grain-soft":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.45s ease-out forwards",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
