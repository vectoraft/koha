/**
 * Advanced Interactions Framework
 * Enhanced JavaScript framework for advanced UI interactions, animations, and behaviors
 */

class AdvancedInteractions {
    constructor() {
        this.initialized = false;
        this.observers = new Map();
        this.animations = new Map();
        this.components = new Map();
        this.init();
    }

    init() {
        if (this.initialized) return;
        
        this.setupIntersectionObserver();
        this.setupMutationObserver();
        this.setupResizeObserver();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.setupAnimations();
        this.setupComponents();
        
        this.initialized = true;
        console.log('Advanced Interactions Framework initialized');
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.5, 0.9]
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleIntersection(entry);
                }
            });
        }, options);

        this.observers.set('intersection', observer);
        
        // Observe elements with animation attributes
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    handleIntersection(entry) {
        const element = entry.target;
        const animation = element.dataset.animate;
        
        if (animation) {
            this.animateElement(element, animation);
        }
    }

    // Mutation Observer for dynamic content
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.initializeNewElements(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        this.observers.set('mutation', observer);
    }

    initializeNewElements(element) {
        // Initialize animations for new elements
        const animatedElements = element.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => {
            this.observers.get('intersection').observe(el);
        });

        // Initialize components for new elements
        this.initializeComponents(element);
    }

    // Resize Observer for responsive behavior
    setupResizeObserver() {
        const observer = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                this.handleResize(entry);
            });
        });

        // Observe responsive elements
        document.querySelectorAll('[data-responsive]').forEach(el => {
            observer.observe(el);
        });

        this.observers.set('resize', observer);
    }

    handleResize(entry) {
        const element = entry.target;
        const { width, height } = entry.contentRect;
        
        // Update element classes based on size
        element.classList.toggle('compact', width < 400);
        element.classList.toggle('expanded', width > 800);
        
        // Trigger custom resize event
        element.dispatchEvent(new CustomEvent('elementResize', {
            detail: { width, height }
        }));
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    handleKeyboardNavigation(e) {
        const { key, target, ctrlKey, shiftKey } = e;
        
        // Handle tab navigation
        if (key === 'Tab') {
            this.handleTabNavigation(e);
        }
        
        // Handle arrow key navigation
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            this.handleArrowNavigation(e);
        }
        
        // Handle keyboard shortcuts
        if (ctrlKey) {
            this.handleKeyboardShortcuts(e);
        }
    }

    handleTabNavigation(e) {
        const focusableElements = this.getFocusableElements();
        const currentIndex = focusableElements.indexOf(e.target);
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        if (e.shiftKey) {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) nextIndex = focusableElements.length - 1;
        } else {
            nextIndex = currentIndex + 1;
            if (nextIndex >= focusableElements.length) nextIndex = 0;
        }
        
        // Add focus animation
        this.animateElement(focusableElements[nextIndex], 'focus');
    }

    handleArrowNavigation(e) {
        const target = e.target;
        
        // Handle data table navigation
        if (target.closest('.data-table')) {
            this.handleTableNavigation(e);
        }
        
        // Handle menu navigation
        if (target.closest('.menu')) {
            this.handleMenuNavigation(e);
        }
    }

    handleKeyboardShortcuts(e) {
        const shortcuts = {
            'KeyS': () => this.saveForm(),
            'KeyF': () => this.toggleSearch(),
            'KeyE': () => this.toggleEditMode(),
            'KeyH': () => this.showHelp(),
            'KeyQ': () => this.quickAction()
        };
        
        const action = shortcuts[e.code];
        if (action) {
            e.preventDefault();
            action();
        }
    }

    getFocusableElements() {
        const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return Array.from(document.querySelectorAll(selector));
    }

    // Touch Gestures
    setupTouchGestures() {
        let startX, startY, currentX, currentY;
        let isSwipeMode = false;
        
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isSwipeMode = false;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const touch = e.touches[0];
            currentX = touch.clientX;
            currentY = touch.clientY;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                isSwipeMode = true;
                this.handleSwipeGesture(deltaX, e.target);
            }
        });
        
        document.addEventListener('touchend', () => {
            startX = null;
            startY = null;
            isSwipeMode = false;
        });
    }

    handleSwipeGesture(deltaX, target) {
        const swipeLeft = deltaX < -50;
        const swipeRight = deltaX > 50;
        
        // Handle swipe navigation
        if (target.closest('.swipeable')) {
            if (swipeLeft) {
                this.navigateNext(target);
            } else if (swipeRight) {
                this.navigatePrevious(target);
            }
        }
    }

    // Animation System
    setupAnimations() {
        this.animations.set('fadeIn', {
            duration: 300,
            easing: 'ease-out',
            keyframes: [
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ]
        });
        
        this.animations.set('slideIn', {
            duration: 400,
            easing: 'ease-out',
            keyframes: [
                { transform: 'translateX(-100%)' },
                { transform: 'translateX(0)' }
            ]
        });
        
        this.animations.set('scaleIn', {
            duration: 250,
            easing: 'ease-out',
            keyframes: [
                { transform: 'scale(0.8)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 }
            ]
        });
        
        this.animations.set('bounceIn', {
            duration: 500,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            keyframes: [
                { transform: 'scale(0.3)', opacity: 0 },
                { transform: 'scale(1.05)', opacity: 1 },
                { transform: 'scale(1)', opacity: 1 }
            ]
        });
        
        this.animations.set('focus', {
            duration: 200,
            easing: 'ease-out',
            keyframes: [
                { boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)' },
                { boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.3)' }
            ]
        });
    }

    animateElement(element, animationName) {
        const animation = this.animations.get(animationName);
        if (!animation) return;
        
        element.animate(animation.keyframes, {
            duration: animation.duration,
            easing: animation.easing,
            fill: 'both'
        });
    }

    // Component System
    setupComponents() {
        this.initializeComponents(document);
    }

    initializeComponents(root) {
        // Initialize tooltips
        this.initializeTooltips(root);
        
        // Initialize dropdowns
        this.initializeDropdowns(root);
        
        // Initialize modals
        this.initializeModals(root);
        
        // Initialize tabs
        this.initializeTabs(root);
        
        // Initialize accordions
        this.initializeAccordions(root);
        
        // Initialize data tables
        this.initializeDataTables(root);
        
        // Initialize forms
        this.initializeForms(root);
    }

    initializeTooltips(root) {
        const tooltips = root.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            if (element.dataset.tooltipInit) return;
            
            const tooltip = this.createTooltip(element.dataset.tooltip);
            element.addEventListener('mouseenter', () => this.showTooltip(element, tooltip));
            element.addEventListener('mouseleave', () => this.hideTooltip(tooltip));
            
            element.dataset.tooltipInit = 'true';
        });
    }

    createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        return tooltip;
    }

    showTooltip(element, tooltip) {
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.classList.add('visible');
        this.animateElement(tooltip, 'fadeIn');
    }

    hideTooltip(tooltip) {
        tooltip.classList.remove('visible');
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
    }

    initializeDropdowns(root) {
        const dropdowns = root.querySelectorAll('[data-dropdown]');
        dropdowns.forEach(dropdown => {
            if (dropdown.dataset.dropdownInit) return;
            
            const trigger = dropdown.querySelector('[data-dropdown-trigger]');
            const content = dropdown.querySelector('[data-dropdown-content]');
            
            if (trigger && content) {
                trigger.addEventListener('click', () => {
                    this.toggleDropdown(dropdown, content);
                });
                
                dropdown.dataset.dropdownInit = 'true';
            }
        });
    }

    toggleDropdown(dropdown, content) {
        const isOpen = dropdown.classList.contains('open');
        
        // Close all other dropdowns
        document.querySelectorAll('[data-dropdown].open').forEach(d => {
            if (d !== dropdown) {
                d.classList.remove('open');
            }
        });
        
        if (isOpen) {
            dropdown.classList.remove('open');
        } else {
            dropdown.classList.add('open');
            this.animateElement(content, 'scaleIn');
        }
    }

    initializeModals(root) {
        const modalTriggers = root.querySelectorAll('[data-modal-trigger]');
        modalTriggers.forEach(trigger => {
            if (trigger.dataset.modalInit) return;
            
            trigger.addEventListener('click', () => {
                const modalId = trigger.dataset.modalTrigger;
                const modal = document.getElementById(modalId);
                if (modal) {
                    this.showModal(modal);
                }
            });
            
            trigger.dataset.modalInit = 'true';
        });
        
        const modals = root.querySelectorAll('[data-modal]');
        modals.forEach(modal => {
            if (modal.dataset.modalInit) return;
            
            const closeButtons = modal.querySelectorAll('[data-modal-close]');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => this.hideModal(modal));
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
            
            modal.dataset.modalInit = 'true';
        });
    }

    showModal(modal) {
        modal.classList.add('visible');
        document.body.classList.add('modal-open');
        this.animateElement(modal, 'fadeIn');
        
        // Focus first focusable element
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    hideModal(modal) {
        modal.classList.remove('visible');
        document.body.classList.remove('modal-open');
    }

    initializeTabs(root) {
        const tabGroups = root.querySelectorAll('[data-tabs]');
        tabGroups.forEach(group => {
            if (group.dataset.tabsInit) return;
            
            const tabs = group.querySelectorAll('[data-tab]');
            const panels = group.querySelectorAll('[data-tab-panel]');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    this.activateTab(tab, tabs, panels);
                });
            });
            
            group.dataset.tabsInit = 'true';
        });
    }

    activateTab(activeTab, tabs, panels) {
        const targetPanel = activeTab.dataset.tab;
        
        // Deactivate all tabs
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Hide all panels
        panels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Activate selected tab
        activeTab.classList.add('active');
        
        // Show selected panel
        const panel = document.querySelector(`[data-tab-panel="${targetPanel}"]`);
        if (panel) {
            panel.classList.add('active');
            this.animateElement(panel, 'fadeIn');
        }
    }

    initializeAccordions(root) {
        const accordions = root.querySelectorAll('[data-accordion]');
        accordions.forEach(accordion => {
            if (accordion.dataset.accordionInit) return;
            
            const items = accordion.querySelectorAll('[data-accordion-item]');
            items.forEach(item => {
                const trigger = item.querySelector('[data-accordion-trigger]');
                const content = item.querySelector('[data-accordion-content]');
                
                if (trigger && content) {
                    trigger.addEventListener('click', () => {
                        this.toggleAccordion(item, content);
                    });
                }
            });
            
            accordion.dataset.accordionInit = 'true';
        });
    }

    toggleAccordion(item, content) {
        const isOpen = item.classList.contains('open');
        
        if (isOpen) {
            item.classList.remove('open');
            content.style.height = '0';
        } else {
            item.classList.add('open');
            content.style.height = content.scrollHeight + 'px';
            this.animateElement(content, 'slideIn');
        }
    }

    initializeDataTables(root) {
        const tables = root.querySelectorAll('[data-table]');
        tables.forEach(table => {
            if (table.dataset.tableInit) return;
            
            this.enhanceDataTable(table);
            table.dataset.tableInit = 'true';
        });
    }

    enhanceDataTable(table) {
        // Add sorting functionality
        const headers = table.querySelectorAll('th[data-sortable]');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                this.sortTable(table, header);
            });
        });
        
        // Add row selection
        const checkboxes = table.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateRowSelection(table);
            });
        });
    }

    sortTable(table, header) {
        const column = header.dataset.sortable;
        const direction = header.dataset.sortDirection || 'asc';
        const newDirection = direction === 'asc' ? 'desc' : 'asc';
        
        // Update header
        table.querySelectorAll('th').forEach(th => {
            th.removeAttribute('data-sort-direction');
        });
        header.dataset.sortDirection = newDirection;
        
        // Sort rows
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aValue = a.querySelector(`[data-column="${column}"]`).textContent;
            const bValue = b.querySelector(`[data-column="${column}"]`).textContent;
            
            if (newDirection === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        
        // Reorder rows
        rows.forEach(row => tbody.appendChild(row));
    }

    updateRowSelection(table) {
        const selectedRows = table.querySelectorAll('tbody input[type="checkbox"]:checked');
        const totalRows = table.querySelectorAll('tbody tr');
        
        table.classList.toggle('has-selection', selectedRows.length > 0);
        
        // Update bulk actions
        const bulkActions = table.querySelector('[data-bulk-actions]');
        if (bulkActions) {
            bulkActions.classList.toggle('visible', selectedRows.length > 0);
        }
    }

    initializeForms(root) {
        const forms = root.querySelectorAll('form[data-enhance]');
        forms.forEach(form => {
            if (form.dataset.formInit) return;
            
            this.enhanceForm(form);
            form.dataset.formInit = 'true';
        });
    }

    enhanceForm(form) {
        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
        
        // Add form submission handler
        form.addEventListener('submit', (e) => {
            if (!this.validateForm(form)) {
                e.preventDefault();
            }
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        const errorElement = field.parentNode.querySelector('.field-error');
        
        if (!isValid) {
            field.classList.add('invalid');
            if (errorElement) {
                errorElement.textContent = field.validationMessage;
                errorElement.style.display = 'block';
            }
        } else {
            field.classList.remove('invalid');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
        
        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('invalid');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Utility methods
    saveForm() {
        const form = document.querySelector('form:focus-within');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }

    toggleSearch() {
        const searchInput = document.querySelector('[data-search]');
        if (searchInput) {
            searchInput.focus();
        }
    }

    toggleEditMode() {
        document.body.classList.toggle('edit-mode');
    }

    showHelp() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            this.showModal(helpModal);
        }
    }

    quickAction() {
        const quickActionsMenu = document.querySelector('[data-quick-actions]');
        if (quickActionsMenu) {
            quickActionsMenu.classList.toggle('visible');
        }
    }

    navigateNext(element) {
        const container = element.closest('.swipeable');
        if (container) {
            const nextButton = container.querySelector('[data-next]');
            if (nextButton) {
                nextButton.click();
            }
        }
    }

    navigatePrevious(element) {
        const container = element.closest('.swipeable');
        if (container) {
            const prevButton = container.querySelector('[data-prev]');
            if (prevButton) {
                prevButton.click();
            }
        }
    }

    // Public API
    animate(element, animation) {
        this.animateElement(element, animation);
    }

    registerAnimation(name, config) {
        this.animations.set(name, config);
    }

    registerComponent(name, initFunction) {
        this.components.set(name, initFunction);
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
        this.components.clear();
        this.initialized = false;
    }
}

// Initialize the framework when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.AdvancedInteractions = new AdvancedInteractions();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedInteractions;
}
