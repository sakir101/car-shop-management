/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'background-item': '#FFFFFF'
      },
     colors: {
        primary: '#A3A3A3',     // Gray
        secondary: '#4B5563',   // Gray-600
        accent: '#1E40AF',      // Blue-900
        danger: '#DC2626',      // Red-600
        success: '#16A34A',     // Green-600
        'button-color': '#FFFFFF',
        'related-header': '#EEF1F4',
        'page-background':'#FBFCFD',
        'calculate-background':'#F9F9F9'
      },
    },
  },
  plugins: [require("daisyui"),
    function ({ addComponents }) {
      addComponents({
        '.all-button': {
        backgroundColor: '#262626',       // bg-neutral-800
        fontWeight: '700',                // font-bold
        cursor: 'pointer',                // cursor-pointer
        '&:hover': {
          backgroundColor: '#404040',     // hover:bg-neutral-700
        },
      },
        '.input-box': {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)', // shadow-lg
        backgroundColor: '#ffffff', 
       
      },
      '.input-field': {
        padding: '10px',
        backgroundColor: '#ffffff',
        color: '#000000',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#D1D5DB', // gray-300
        outline: 'none',
        width: '100%',
        borderRadius: '0.375rem', // rounded-md
        transition: 'border-color 0.2s ease-in-out',
        '&:hover': {
          borderColor: '#3B82F6', // blue-500
        },
        '&:focus': {
          borderColor: '#3B82F6', // blue-500
        },
      },
      });
    },
  ],
  corePlugins: {
    preflight: false,
  },
  important: true,
};
