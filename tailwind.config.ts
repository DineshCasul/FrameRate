module.exports = {
  darkMode: "class",
content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: "var(--font-mono)", // override Tailwind mono
        sans: "var(--font-sans)", // override Tailwind sans
      },
    },
  },
  plugins: [],
};