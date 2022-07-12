/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      montserrat: 'Montserrat, sans-serif'
    },
    extend: {
      width: {
        drawer: "250px"
      },
      margin: {
        drawer: "250px"
      },
      spacing: {
        drawer: "250px"
      },
      // padding: {
      //   '6px': '0.375rem'
      // }
    },
  },
  plugins: [],
}
