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
        background: "var(--background)",
        foreground: "var(--foreground)",
        icpc: {
          blue: "#1a56db",
          gold: "#f59e0b",
          dark: "#0f172a",
          card: "#1e293b",
        }
      },
    },
  },
  plugins: [],
};
export default config;
