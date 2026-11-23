import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: process.env.NODE_ENV === 'production' ? [purgecss({
    content: ['./index.html', './src/**/*.{tsx,ts,json}'],
    safelist: ['html', 'body', 'root', /^lucide-/, /^modal-/, /^col-/, /^g-/],
    keyframes: false,
    variables: false,
  })] : [],
};
