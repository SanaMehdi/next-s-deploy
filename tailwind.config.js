/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",         // root app directory
    "./components/**/*.{ts,tsx}",  // root components directory
    "./src/app/**/*.{ts,tsx}",     // in case you also have app inside src/
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}" // catch-all inside src
  ],
  theme: { extend: {} },
  plugins: [],
};
