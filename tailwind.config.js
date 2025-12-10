/****************************************************
 * Tailwind config for the React + Vite app.
 * Adjust the content globs if you add more folders.
 ****************************************************/
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "Manrope", "system-ui", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 70px rgba(5, 9, 20, 0.45)",
      },
      colors: {
        brand: {
          blue: "#47b2ff",
          coral: "#ff9a62",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".glass": {
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
        },
      });
    }),
  ],
};
