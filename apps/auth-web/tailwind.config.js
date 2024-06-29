const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter-var': ['"Inter var"', 'sans-serif'],
      },
      colors: {
        'text-color': '#4b5563',
        'text-color-secondary': '#6b7280',
        'primary-color': '#3B82F6',
        'primary-color-text': '#ffffff',
        'primary-50': '#f5f9ff',
        'primary-100': '#d0e1fd',
        'primary-200': '#abc9fb',
        'primary-300': '#85b2f9',
        'primary-400': '#609af8',
        'primary-500': '#3b82f6',
        'primary-600': '#326fd1',
        'primary-700': '#295bac',
        'primary-800': '#204887',
        'primary-900': '#183462',
      },
    },
  },
  plugins: [],
};
