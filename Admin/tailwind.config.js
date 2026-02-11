/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2C5F2D', // Forest Green
                secondary: '#97BC62', // Sage Green
                accent: '#D4A373', // Earthy Brown
                dark: '#1F2937',
                light: '#F3F4F6',
                admin: '#1e293b' // Special admin dashboard color
            }
        },
    },
    plugins: [],
}
