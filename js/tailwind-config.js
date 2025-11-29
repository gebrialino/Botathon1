tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    red: '#DA291C',
                    darkRed: '#B91C1C',
                    purple: '#6B21A8', // Continuai
                    blue: '#2563EB',   // Voluntai
                    green: '#059669',  // Campus
                    orange: '#D97706', // Match
                    cyan: '#0891b2'    // Comms
                }
            },
            animation: {
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scan': 'scan 2s linear infinite',
                'pop-in': 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            },
            keyframes: {
                scan: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' }
                },
                popIn: {
                    '0%': { opacity: '0', transform: 'scale(0.5)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                }
            }
        }
    }
}
