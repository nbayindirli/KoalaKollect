import type { Config } from "tailwindcss";
import forms from '@tailwindcss/forms';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',  // This will catch all files in src
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // This will catch all files in pages
    './components/**/*.{js,ts,jsx,tsx,mdx}', // This will catch all files in components
    './app/**/*.{js,ts,jsx,tsx,mdx}', // This will catch all files in app
  ],
  theme: {
    extend: {
      colors: {
        koala: {
          gray: '#E6E6E6',    // Light gray from koala body
          black: '#2D3436',   // Dark gray/black from koala features
          green: '#27AE60',   // Green from eucalyptus leaves
        }
      }
    }
  },
  plugins: [
    forms,
  ],
}

export default config;
