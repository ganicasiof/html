tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                caribbean: {
                    400: '#38bdf8',
                    500: '#06b6d4',
                    600: '#0891b2',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace']
            },
            animation: {
                'gradient-x': 'gradient-x 15s ease infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'heart-pop': 'heartPop 0.4s ease-out forwards',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))' },
                    '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(6, 182, 212, 0.8))' },
                },
                'heartPop': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.4)' },
                    '100%': { transform: 'scale(1)' }
                }
            }
        }
    }
}
