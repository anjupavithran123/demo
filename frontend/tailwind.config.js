/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        keyframes: {
          "blob-slow": {
            "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
            "50%": { transform: "translate(40px, -30px) scale(1.1)" },
          },
          "blob-fast": {
            "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
            "50%": { transform: "translate(-30px, 20px) scale(1.05)" },
          },
          "slow-rotate": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        },
        animation: {
          "blob-slow": "blob-slow 14s ease-in-out infinite",
          "blob-fast": "blob-fast 10s ease-in-out infinite",
          "slow-rotate": "slow-rotate 40s linear infinite",
        },
      },
    },
    plugins: [],
  };
  