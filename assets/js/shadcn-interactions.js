/* SHAD CN Theme Management: Dark mode, animations, and component interactions */

(function() {
  'use strict';

  // Theme Management
  class ThemeManager {
    constructor() {
      this.theme = localStorage.getItem('theme') || 'light';
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.init();
    }

    init() {
      this.applyTheme();
      this.bindEvents();
      this.watchSystemPreference();
    }

    applyTheme() {
      const root = document.documentElement;
      root.setAttribute('data-theme', this.theme);
      
      // Update theme-color meta tag
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', this.theme === 'dark' ? '#0f172a' : '#ffffff');
      }
    }

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.applyTheme();
      localStorage.setItem('theme', this.theme);
      this.dispatchThemeChange();
    }

    setTheme(theme) {
      if (theme === 'system') {
        this.theme = this.mediaQuery.matches ? 'dark' : 'light';
      } else {
        this.theme = theme;
      }
      this.applyTheme();
      localStorage.setItem('theme', theme);
      this.dispatchThemeChange();
    }

    dispatchThemeChange() {
      document.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme: this.theme }
      }));
    }

    watchSystemPreference() {
      this.mediaQuery.addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'system') {
          this.theme = e.matches ? 'dark' : 'light';
          this.applyTheme();
        }
      });
    }

    bindEvents() {
      // Theme toggle buttons
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-theme-toggle]')) {
          this.toggleTheme();
        }
        
        if (e.target.matches('[data-theme-set]')) {
          this.setTheme(e.target.dataset.themeSet);
        }
      });
    }
  }

  // Component Interactions
  class ComponentManager {
    constructor() {
      this.init();
    }

    init() {
      this.initDialogs();
      this.initDrawers();
      this.initDropdowns();
      this.initTabs();
      this.initCollapsibles();
      this.initTooltips();
      this.initTables();
      this.initNotifications();
    }

    // Dialog Management
    initDialogs() {
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-dialog-trigger]')) {
          const dialogId = e.target.dataset.dialogTrigger;
          this.openDialog(dialogId);
        }
        
        if (e.target.matches('[data-dialog-close]')) {
          const dialog = e.target.closest('.dialog');
          if (dialog) this.closeDialog(dialog);
        }
      });

      // Close on backdrop click
      document.addEventListener('click', (e) => {
        if (e.target.matches('.dialog.open')) {
          this.closeDialog(e.target);
        }
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openDialog = document.querySelector('.dialog.open');
          if (openDialog) this.closeDialog(openDialog);
        }
      });
    }

    openDialog(dialogId) {
      const dialog = document.getElementById(dialogId);
      if (dialog) {
        dialog.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Focus first focusable element
        const focusable = dialog.querySelector('button, input, select, textarea, [tabindex]');
        if (focusable) focusable.focus();
      }
    }

    closeDialog(dialog) {
      dialog.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Drawer Management
    initDrawers() {
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-drawer-trigger]')) {
          const drawerId = e.target.dataset.drawerTrigger;
          this.openDrawer(drawerId);
        }
        
        if (e.target.matches('[data-drawer-close]')) {
          const drawer = e.target.closest('.drawer');
          if (drawer) this.closeDrawer(drawer);
        }
      });

      // Close on backdrop click
      document.addEventListener('click', (e) => {
        if (e.target.matches('.drawer.open')) {
          this.closeDrawer(e.target);
        }
      });
    }

    openDrawer(drawerId) {
      const drawer = document.getElementById(drawerId);
      if (drawer) {
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    closeDrawer(drawer) {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Dropdown Management
    initDropdowns() {
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-dropdown-trigger]')) {
          const dropdownId = e.target.dataset.dropdownTrigger;
          this.toggleDropdown(dropdownId);
        }
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
          document.querySelectorAll('.dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
          });
        }
      });
    }

    toggleDropdown(dropdownId) {
      const dropdown = document.getElementById(dropdownId);
      if (dropdown) {
        dropdown.classList.toggle('open');
      }
    }

    // Tabs Management
    initTabs() {
      document.addEventListener('click', (e) => {
        if (e.target.matches('.tabs-trigger')) {
          this.activateTab(e.target);
        }
      });
    }

    activateTab(trigger) {
      const tabsList = trigger.closest('.tabs-list');
      const tabs = trigger.closest('.tabs');
      
      if (!tabsList || !tabs) return;

      // Remove active from all triggers
      tabsList.querySelectorAll('.tabs-trigger').forEach(t => t.classList.remove('active'));
      
      // Add active to clicked trigger
      trigger.classList.add('active');

      // Show corresponding content
      const targetId = trigger.dataset.tabsTarget;
      if (targetId) {
        tabs.querySelectorAll('.tabs-content').forEach(content => {
          content.style.display = 'none';
        });
        
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.style.display = 'block';
        }
      }
    }

    // Collapsible Management
    initCollapsibles() {
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-collapsible-trigger]')) {
          const targetId = e.target.dataset.collapsibleTrigger;
          this.toggleCollapsible(targetId);
        }
      });
    }

    toggleCollapsible(targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.toggle('open');
        
        // Update aria-expanded
        const trigger = document.querySelector(`[data-collapsible-trigger="${targetId}"]`);
        if (trigger) {
          trigger.setAttribute('aria-expanded', target.classList.contains('open'));
        }
      }
    }

    // Tooltip Management
    initTooltips() {
      document.addEventListener('mouseenter', (e) => {
        if (e.target.matches('[data-tooltip]')) {
          this.showTooltip(e.target);
        }
      });

      document.addEventListener('mouseleave', (e) => {
        if (e.target.matches('[data-tooltip]')) {
          this.hideTooltip(e.target);
        }
      });
    }

    showTooltip(element) {
      const tooltip = element.getAttribute('data-tooltip');
      if (!tooltip) return;

      const tooltipElement = document.createElement('div');
      tooltipElement.className = 'tooltip open';
      tooltipElement.textContent = tooltip;
      tooltipElement.id = 'tooltip-' + Date.now();
      
      document.body.appendChild(tooltipElement);
      
      // Position tooltip
      const rect = element.getBoundingClientRect();
      tooltipElement.style.left = rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2) + 'px';
      tooltipElement.style.top = rect.top - tooltipElement.offsetHeight - 8 + 'px';
      
      element.tooltipId = tooltipElement.id;
    }

    hideTooltip(element) {
      if (element.tooltipId) {
        const tooltip = document.getElementById(element.tooltipId);
        if (tooltip) {
          tooltip.remove();
        }
        delete element.tooltipId;
      }
    }

    // Table Management
    initTables() {
      document.addEventListener('click', (e) => {
        // Sortable table headers
        if (e.target.matches('.table-sortable .table-header-cell.sortable')) {
          this.sortTable(e.target);
        }
        
        // Row selection
        if (e.target.matches('.table-selectable .table-row')) {
          this.toggleRowSelection(e.target);
        }
        
        // Expandable rows
        if (e.target.matches('.table-expandable .table-row.expandable')) {
          this.toggleRowExpansion(e.target);
        }
      });
    }

    sortTable(header) {
      const table = header.closest('.table');
      const columnIndex = Array.from(header.parentElement.children).indexOf(header);
      const tbody = table.querySelector('.table-body');
      const rows = Array.from(tbody.querySelectorAll('.table-row'));
      
      const currentSort = header.classList.contains('sorted-asc') ? 'asc' : 
                         header.classList.contains('sorted-desc') ? 'desc' : 'none';
      
      const newSort = currentSort === 'asc' ? 'desc' : 'asc';
      
      // Clear all sort indicators
      header.parentElement.querySelectorAll('.table-header-cell').forEach(h => {
        h.classList.remove('sorted-asc', 'sorted-desc');
      });
      
      // Add new sort indicator
      header.classList.add(newSort === 'asc' ? 'sorted-asc' : 'sorted-desc');
      
      // Sort rows
      rows.sort((a, b) => {
        const aValue = a.children[columnIndex].textContent.trim();
        const bValue = b.children[columnIndex].textContent.trim();
        
        const result = aValue.localeCompare(bValue, undefined, { numeric: true });
        return newSort === 'asc' ? result : -result;
      });
      
      // Reorder rows
      rows.forEach(row => tbody.appendChild(row));
    }

    toggleRowSelection(row) {
      row.classList.toggle('selected');
      
      // Update checkbox if present
      const checkbox = row.querySelector('.table-checkbox');
      if (checkbox) {
        checkbox.checked = row.classList.contains('selected');
      }
    }

    toggleRowExpansion(row) {
      row.classList.toggle('expanded');
      
      // Show/hide expanded content
      const nextRow = row.nextElementSibling;
      if (nextRow && nextRow.classList.contains('expanded-content')) {
        nextRow.style.display = row.classList.contains('expanded') ? 'table-row' : 'none';
      }
    }

    // Notification Management
    initNotifications() {
      // Auto-dismiss notifications
      document.querySelectorAll('.notification[data-auto-dismiss]').forEach(notification => {
        const delay = parseInt(notification.dataset.autoDismiss) || 5000;
        setTimeout(() => {
          this.dismissNotification(notification);
        }, delay);
      });

      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-notification-dismiss]')) {
          const notification = e.target.closest('.notification');
          if (notification) this.dismissNotification(notification);
        }
      });
    }

    dismissNotification(notification) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }

  // Animation Utils
  class AnimationUtils {
    static fadeIn(element, duration = 300) {
      element.style.opacity = '0';
      element.style.display = 'block';
      
      let start = null;
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
      const startOpacity = parseFloat(getComputedStyle(element).opacity);
      let start = null;
      
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.max(startOpacity - (progress / duration), 0);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = 'none';
        }
      };
      
      requestAnimationFrame(animate);
    }

    static slideDown(element, duration = 300) {
      element.style.height = '0';
      element.style.overflow = 'hidden';
      element.style.display = 'block';
      
      const targetHeight = element.scrollHeight;
      let start = null;
      
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const height = Math.min((progress / duration) * targetHeight, targetHeight);
        
        element.style.height = height + 'px';
        
        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          element.style.height = '';
          element.style.overflow = '';
        }
      };
      
      requestAnimationFrame(animate);
    }

    static slideUp(element, duration = 300) {
      const startHeight = element.offsetHeight;
      element.style.overflow = 'hidden';
      
      let start = null;
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const height = Math.max(startHeight - (progress / duration) * startHeight, 0);
        
        element.style.height = height + 'px';
        
        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = 'none';
          element.style.height = '';
          element.style.overflow = '';
        }
      };
      
      requestAnimationFrame(animate);
    }
  }

  // Accessibility Helpers
  class AccessibilityManager {
    constructor() {
      this.init();
    }

    init() {
      this.setupKeyboardNavigation();
      this.setupFocusManagement();
      this.setupARIAAttributes();
    }

    setupKeyboardNavigation() {
      document.addEventListener('keydown', (e) => {
        // Tab navigation for custom components
        if (e.key === 'Tab') {
          this.handleTabNavigation(e);
        }
        
        // Enter/Space for button-like elements
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.matches('[role="button"]')) {
            e.preventDefault();
            e.target.click();
          }
        }
        
        // Arrow keys for tab navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          if (e.target.matches('.tabs-trigger')) {
            this.handleTabArrowNavigation(e);
          }
        }
      });
    }

    handleTabNavigation(e) {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const currentIndex = Array.from(focusableElements).indexOf(e.target);
      
      if (e.shiftKey && currentIndex === 0) {
        e.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      } else if (!e.shiftKey && currentIndex === focusableElements.length - 1) {
        e.preventDefault();
        focusableElements[0].focus();
      }
    }

    handleTabArrowNavigation(e) {
      const tabsList = e.target.closest('.tabs-list');
      const tabs = Array.from(tabsList.querySelectorAll('.tabs-trigger'));
      const currentIndex = tabs.indexOf(e.target);
      
      let nextIndex;
      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      } else {
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      }
      
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    }

    setupFocusManagement() {
      // Focus trap for modals
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          const modal = document.querySelector('.dialog.open, .drawer.open');
          if (modal) {
            this.trapFocus(e, modal);
          }
        }
      });
    }

    trapFocus(e, container) {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    setupARIAAttributes() {
      // Auto-setup ARIA attributes for common patterns
      document.querySelectorAll('[data-collapsible-trigger]').forEach(trigger => {
        const targetId = trigger.dataset.collapsibleTrigger;
        trigger.setAttribute('aria-controls', targetId);
        trigger.setAttribute('aria-expanded', 'false');
      });

      document.querySelectorAll('.tabs-trigger').forEach(trigger => {
        trigger.setAttribute('role', 'tab');
        trigger.setAttribute('aria-selected', 'false');
      });

      document.querySelectorAll('.tabs-list').forEach(tabsList => {
        tabsList.setAttribute('role', 'tablist');
      });

      document.querySelectorAll('.tabs-content').forEach(content => {
        content.setAttribute('role', 'tabpanel');
      });
    }
  }

  // Initialize everything when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.ShadCN = {
      theme: new ThemeManager(),
      components: new ComponentManager(),
      animations: AnimationUtils,
      accessibility: new AccessibilityManager()
    };
  });

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, ComponentManager, AnimationUtils, AccessibilityManager };
  }
})();
