/**
 * SHAD CN Dark Mode and Interactions for Koha
 * Provides theme switching, smooth animations, and accessibility features
 */

class KohaShadcnTheme {
    constructor() {
        this.theme = localStorage.getItem('koha-theme') || 'light';
        this.init();
    }

    init() {
        // Initialize theme
        this.applyTheme(this.theme);
        
        // Create theme toggle button
        this.createThemeToggle();
        
        // Add smooth animations
        this.initAnimations();
        
        // Enhance accessibility
        this.enhanceAccessibility();
        
        // Add interactive effects
        this.addInteractiveEffects();
        
        // Handle system theme changes
        this.watchSystemTheme();
    }

    applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        
        this.theme = theme;
        localStorage.setItem('koha-theme', theme);
        
        // Emit theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    createThemeToggle() {
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'theme-toggle';
        toggleButton.className = 'fixed top-4 right-4 z-50 p-3 rounded-full glass-light hover:glass-medium transition-all-smooth hover-lift';
        toggleButton.setAttribute('aria-label', 'Toggle theme');
        toggleButton.innerHTML = this.getThemeIcon();
        
        // Add click handler
        toggleButton.addEventListener('click', () => this.toggleTheme());
        
        // Add to DOM
        document.body.appendChild(toggleButton);
        
        // Add keyboard support
        toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    getThemeIcon() {
        const sunIcon = `
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
        `;
        
        const moonIcon = `
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
        `;
        
        return this.theme === 'dark' ? sunIcon : moonIcon;
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        
        // Add animation class
        document.body.classList.add('theme-transition');
        
        // Apply new theme
        this.applyTheme(newTheme);
        
        // Update toggle button
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.innerHTML = this.getThemeIcon();
        }
        
        // Remove animation class after transition
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }

    initAnimations() {
        // Add entrance animations to elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.card-glass, .neomorph-button, .glass-nav').forEach(el => {
            observer.observe(el);
        });

        // Add smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    enhanceAccessibility() {
        // Add skip links
        this.addSkipLinks();
        
        // Enhance focus management
        this.enhanceFocusManagement();
        
        // Add screen reader announcements
        this.addScreenReaderAnnouncements();
        
        // Handle reduced motion preference
        this.handleReducedMotion();
    }

    addSkipLinks() {
        if (document.querySelector('.skip-links')) return;
        
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#search" class="skip-link">Skip to search</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    enhanceFocusManagement() {
        // Add focus-visible polyfill behavior
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    this.closeModal(modal);
                }
            }
        });
    }

    addScreenReaderAnnouncements() {
        // Create announcement region
        const announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);

        // Listen for theme changes
        window.addEventListener('themeChanged', (e) => {
            this.announce(`Theme changed to ${e.detail.theme} mode`);
        });
    }

    announce(message) {
        const announcer = document.getElementById('screen-reader-announcer');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (query) => {
            if (query.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        handleReducedMotion(prefersReducedMotion);
        prefersReducedMotion.addEventListener('change', handleReducedMotion);
    }

    addInteractiveEffects() {
        // Add hover effects to buttons
        document.querySelectorAll('.btn-primary, .btn-secondary, .neomorph-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.classList.add('hover-lift');
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('hover-lift');
            });
        });

        // Add ripple effect to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', this.createRippleEffect);
        });

        // Add loading states
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.classList.add('loading');
                    submitButton.disabled = true;
                }
            });
        });
    }

    createRippleEffect(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    watchSystemTheme() {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        darkModeQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('koha-theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    closeModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Return focus to trigger element
        const trigger = document.querySelector(`[data-modal="${modal.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    }

    // Public methods for external use
    setTheme(theme) {
        this.applyTheme(theme);
    }

    getTheme() {
        return this.theme;
    }

    // Utility methods
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize theme system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.kohaShadcnTheme = new KohaShadcnTheme();
});

// Add CSS for theme transitions and effects
const style = document.createElement('style');
style.textContent = `
    /* Theme transition */
    .theme-transition * {
        transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease !important;
    }

    /* Skip links */
    .skip-links {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
    }

    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        padding: 8px 16px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 600;
        transition: top 0.3s ease;
    }

    .skip-link:focus {
        top: 6px;
    }

    /* Screen reader only */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    /* Ripple effect */
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        pointer-events: none;
        transform: scale(0);
        animation: rippleAnimation 600ms ease-out;
    }

    @keyframes rippleAnimation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    /* Loading state */
    .loading {
        position: relative;
        color: transparent !important;
    }

    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        margin: -8px 0 0 -8px;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Keyboard navigation enhancement */
    .keyboard-navigation button:focus,
    .keyboard-navigation input:focus,
    .keyboard-navigation select:focus,
    .keyboard-navigation textarea:focus,
    .keyboard-navigation a:focus {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
    }

    /* Reduced motion styles */
    .reduced-motion *,
    .reduced-motion *::before,
    .reduced-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
`;

document.head.appendChild(style);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KohaShadcnTheme;
}
