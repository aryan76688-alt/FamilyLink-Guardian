/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        guardian: {
          navy: '#062B52',
          blue: '#087CF5',
          bright: '#168DFF',
          sky: '#53B9FF',
          bg: '#F5F8FC',
          card: '#FFFFFF',
          text: '#10243E',
          muted: '#718096',
          success: '#22B573',
          warning: '#F4A62A',
          danger: '#EF4444',
          border: '#E4EAF2',
        },
        dark: {
          bg: '#071321',
          surface: '#0D2035',
          elevated: '#102A44',
          primary: '#2495FF',
          text: '#F0F4F8',
          muted: '#94A3B8',
          border: '#1E3A5A',
        },
      },
      borderRadius: {
        'card': '16px',
        'modal': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(6, 43, 82, 0.06)',
        'elevated': '0 12px 30px -4px rgba(6, 43, 82, 0.12)',
        'blue-glow': '0 0 25px rgba(8, 124, 245, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
