module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "moh-blue": "#0056b3",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
