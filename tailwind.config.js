/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ml': {
          'yellow': '#FFF159',
          'yellow-bright': '#FFEB3B',
          'yellow-dark': '#F9C74F',
          'blue': '#3483FA',
          'blue-dark': '#2968C8',
          'blue-light': '#E3F2FD',
          'gray': '#666666',
          'gray-light': '#F5F5F5',
          'gray-dark': '#333333',
          'success': '#00A650',
          'warning': '#FF9500',
          'error': '#F23D4F',
        }
      },
      backgroundImage: {
        'ml-gradient': 'linear-gradient(135deg, #FFF159 0%, #FFEB3B 50%, #3483FA 100%)',
        'ml-gradient-yellow': 'linear-gradient(135deg, #FFF159 0%, #FFEB3B 100%)',
        'ml-gradient-blue': 'linear-gradient(135deg, #3483FA 0%, #2968C8 100%)',
      },
      boxShadow: {
        'ml': '0 4px 16px rgba(52, 131, 250, 0.15)',
        'ml-hover': '0 8px 32px rgba(52, 131, 250, 0.25)',
        'ml-yellow': '0 4px 16px rgba(255, 241, 89, 0.3)',
      }
    },
  },
  plugins: [],
};
