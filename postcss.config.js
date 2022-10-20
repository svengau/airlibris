// Doc: https://tailwindcss.com/docs/using-with-preprocessors#nesting
module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
