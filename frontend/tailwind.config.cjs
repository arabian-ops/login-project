module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 6s infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-fast": "pulse 1.5s infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(255,255,255,0.5)",
      },
    },
  },
  plugins: [],
};
module.exports = {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation:{
        "float-slow":"float 8s ease-in-out infinite",
        "pulse-fast":"pulse 1.5s infinite"
      },
      keyframes:{
        float:{
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        }
      },
      boxShadow:{
        glow:"0 0 20px rgba(255,255,255,0.5)"
      }
    }
  },
  plugins: [],
}
