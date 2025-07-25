/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./koha-tmpl/**/*.tt",
    "./koha-tmpl/**/*.html",
    "./koha-tmpl/**/*.js",
    "./koha-tmpl/**/*.vue",
    "./opac/**/*.pl",
    "./admin/**/*.pl",
    "./catalogue/**/*.pl",
    "./circ/**/*.pl",
    "./members/**/*.pl",
    "./tools/**/*.pl",
    "./reports/**/*.pl",
    "./serials/**/*.pl",
    "./acqui/**/*.pl",
    "./suggestion/**/*.pl",
    "./virtualshelves/**/*.pl",
    "./labels/**/*.pl",
    "./patroncards/**/*.pl",
    "./reserve/**/*.pl",
    "./tags/**/*.pl",
    "./rotating_collections/**/*.pl",
    "./offline_circ/**/*.pl",
    "./course_reserves/**/*.pl",
    "./clubs/**/*.pl",
    "./patron_lists/**/*.pl",
    "./ill/**/*.pl",
    "./erm/**/*.pl",
    "./preservation/**/*.pl",
    "./pos/**/*.pl",
    "./bookings/**/*.pl",
    "./recalls/**/*.pl",
    "./reviews/**/*.pl",
    "./basket/**/*.pl",
    "./about.pl",
    "./help.pl",
    "./mainpage.pl",
    "./changelanguage.pl",
    "./kohaversion.pl"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SHAD CN Color System
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Glassmorphism colors
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.2)",
          dark: "rgba(0, 0, 0, 0.1)",
        },
        // Neumorphism colors
        neomorphism: {
          light: "rgba(255, 255, 255, 0.8)",
          shadow: "rgba(0, 0, 0, 0.2)",
          inset: "rgba(0, 0, 0, 0.1)",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        // Neumorphism shadows
        'neomorphism-light': '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neomorphism-dark': '8px 8px 16px rgba(0, 0, 0, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.1)',
        'neomorphism-inset': 'inset 8px 8px 16px rgba(0, 0, 0, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neomorphism-inset-dark': 'inset 8px 8px 16px rgba(0, 0, 0, 0.3), inset -8px -8px 16px rgba(255, 255, 255, 0.1)',
        // Glassmorphism shadows
        'glass-light': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'glass-medium': '0 8px 32px rgba(31, 38, 135, 0.5)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionDuration: {
        '350': '350ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
        '104': '26rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    // Custom plugin for Koha-specific utilities
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.glass-light': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-medium': {
          'background': 'rgba(255, 255, 255, 0.2)',
          'backdrop-filter': 'blur(15px)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.neumorphism-light': {
          'background': '#f0f0f0',
          'box-shadow': '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        },
        '.neumorphism-dark': {
          'background': '#2a2a2a',
          'box-shadow': '8px 8px 16px rgba(0, 0, 0, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.1)',
        },
        '.neumorphism-inset': {
          'box-shadow': 'inset 8px 8px 16px rgba(0, 0, 0, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.8)',
        },
        '.transition-all-smooth': {
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.hover-lift': {
          'transition': 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.15)',
          },
        },
      };

      const newComponents = {
        '.btn-primary': {
          'background': 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)))',
          'color': 'white',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'font-weight': '600',
          'transition': 'all 0.3s ease',
          'border': 'none',
          'cursor': 'pointer',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 25px rgba(0, 0, 0, 0.2)',
          },
          '&:active': {
            'transform': 'translateY(0)',
          },
        },
        '.btn-secondary': {
          'background': 'hsl(var(--secondary))',
          'color': 'hsl(var(--secondary-foreground))',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'font-weight': '600',
          'transition': 'all 0.3s ease',
          'border': '1px solid hsl(var(--border))',
          'cursor': 'pointer',
          '&:hover': {
            'background': 'hsl(var(--accent))',
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 25px rgba(0, 0, 0, 0.1)',
          },
        },
        '.card-glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'border-radius': '1rem',
          'padding': '1.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'background': 'rgba(255, 255, 255, 0.15)',
            'transform': 'translateY(-5px)',
            'box-shadow': '0 20px 40px rgba(0, 0, 0, 0.1)',
          },
        },
        '.input-glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'border-radius': '0.5rem',
          'padding': '0.75rem 1rem',
          'color': 'hsl(var(--foreground))',
          'transition': 'all 0.3s ease',
          '&:focus': {
            'outline': 'none',
            'border-color': 'hsl(var(--primary))',
            'box-shadow': '0 0 0 3px rgba(var(--primary), 0.1)',
          },
        },
      };

      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],
};
