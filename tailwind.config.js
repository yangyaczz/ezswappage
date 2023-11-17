/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        "4-auto": "repeat(4,minmax(0,auto))",
        "2-auto": "repeat(2,minmax(0,auto))",
        "7-3": "7fr 3fr",
        "2-1": "2fr 1fr",
      },
      gridTemplateRows: {
        "2-auto": "repeat(2,minmax(0,auto))",
        "3-2": "3fr 2fr",
      },
      // backgroundImage: (theme) => ({
      //   "zinc800-transparent-gradient":
      //     "linear-gradient(to top, rgba(39,39,42,0.8), rgba(39,39,42, 0))",
      // }),
      // fontSize: {
      //   base: "1rem",
      //   sm: "1.1rem",
      //   md: "1.2rem",
      //   lg: "1.5rem",
      // },
    },
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["night"],
  },
};
