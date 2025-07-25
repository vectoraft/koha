/**
 * Advanced SHAD CN Components Framework
 * Phase 4: Advanced data visualization and interactive components
 */

class ShadcnAdvanced {
    constructor() {
        this.charts = new Map();
        this.tables = new Map();
        this.dashboards = new Map();
        this.widgets = new Map();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.initializeCharts();
        this.initializeTables();
        this.initializeDashboards();
        this.initializeWidgets();
        this.initializeStatCards();
        this.initializeProgressBars();
    }

    // Chart System
    initializeCharts() {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            const chartId = container.id || `chart-${Date.now()}`;
            container.id = chartId;
            
            const chart = new ChartComponent(container);
            this.charts.set(chartId, chart);
        });
    }

    // Advanced Table System
    initializeTables() {
        const tables = document.querySelectorAll('.advanced-table');
        tables.forEach(table => {
            const tableId = table.id || `table-${Date.now()}`;
            table.id = tableId;
            
            const tableComponent = new AdvancedTable(table);
            this.tables.set(tableId, tableComponent);
        });
    }

    // Dashboard System
    initializeDashboards() {
        const dashboards = document.querySelectorAll('.dashboard-grid');
        dashboards.forEach(dashboard => {
            const dashboardId = dashboard.id || `dashboard-${Date.now()}`;
            dashboard.id = dashboardId;
            
            const dashboardComponent = new DashboardComponent(dashboard);
            this.dashboards.set(dashboardId, dashboardComponent);
        });
    }

    // Widget System
    initializeWidgets() {
        const widgets = document.querySelectorAll('.dashboard-widget');
        widgets.forEach(widget => {
            const widgetId = widget.id || `widget-${Date.now()}`;
            widget.id = widgetId;
            
            const widgetComponent = new WidgetComponent(widget);
            this.widgets.set(widgetId, widgetComponent);
        });
    }

    // Statistics Cards
    initializeStatCards() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const value = card.querySelector('.stat-value');
            const progressBar = card.querySelector('.progress-fill');
            
            if (value) {
                this.animateCounter(value);
            }
            
            if (progressBar) {
                this.animateProgress(progressBar);
            }
        });
    }

    // Progress Bars
    initializeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            this.animateProgress(bar);
        });
    }

    // Utility Functions
    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    animateProgress(element) {
        const targetWidth = element.dataset.progress || '0%';
        element.style.width = '0%';
        
        setTimeout(() => {
            element.style.width = targetWidth;
        }, 100);
    }

    // Public API
    getChart(id) {
        return this.charts.get(id);
    }

    getTable(id) {
        return this.tables.get(id);
    }

    getDashboard(id) {
        return this.dashboards.get(id);
    }

    getWidget(id) {
        return this.widgets.get(id);
    }
}

// Chart Component
class ChartComponent {
    constructor(container) {
        this.container = container;
        this.canvas = container.querySelector('.chart-canvas');
        this.controls = container.querySelectorAll('.chart-control');
        this.data = null;
        this.type = 'line';
        this.options = {};
        
        this.init();
    }

    init() {
        this.setupControls();
        this.setupResizeObserver();
    }

    setupControls() {
        this.controls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                this.controls.forEach(c => c.classList.remove('active'));
                control.classList.add('active');
                
                const action = control.dataset.action;
                this.handleControlAction(action);
            });
        });
    }

    setupResizeObserver() {
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                this.resize();
            });
            resizeObserver.observe(this.container);
        }
    }

    handleControlAction(action) {
        switch (action) {
            case 'period':
                this.updatePeriod(action);
                break;
            case 'type':
                this.updateType(action);
                break;
            case 'export':
                this.exportChart();
                break;
            case 'refresh':
                this.refreshData();
                break;
        }
    }

    updatePeriod(period) {
        // Implementation for period updates
        console.log('Updating chart period:', period);
    }

    updateType(type) {
        this.type = type;
        this.render();
    }

    exportChart() {
        // Implementation for chart export
        console.log('Exporting chart');
    }

    refreshData() {
        // Implementation for data refresh
        console.log('Refreshing chart data');
    }

    resize() {
        // Implementation for chart resize
        console.log('Resizing chart');
    }

    render() {
        // Implementation for chart rendering
        console.log('Rendering chart');
    }
}

// Advanced Table Component
class AdvancedTable {
    constructor(table) {
        this.table = table;
        this.tableElement = table.querySelector('.table-advanced');
        this.searchInput = table.querySelector('.table-search input');
        this.sortButtons = table.querySelectorAll('.table-sort');
        this.selectAllCheckbox = table.querySelector('input[type="checkbox"]');
        this.rowCheckboxes = table.querySelectorAll('tbody input[type="checkbox"]');
        this.paginationButtons = table.querySelectorAll('.pagination-btn');
        
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.searchQuery = '';
        this.selectedRows = new Set();
        
        this.init();
    }

    init() {
        this.setupSearch();
        this.setupSort();
        this.setupSelection();
        this.setupPagination();
        this.setupRowActions();
    }

    setupSearch() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterRows();
            });
        }
    }

    setupSort() {
        this.sortButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const column = button.dataset.column;
                
                if (this.sortColumn === column) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = column;
                    this.sortDirection = 'asc';
                }
                
                this.sortTable();
                this.updateSortUI();
            });
        });
    }

    setupSelection() {
        if (this.selectAllCheckbox) {
            this.selectAllCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                this.rowCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    const row = checkbox.closest('tr');
                    if (isChecked) {
                        this.selectedRows.add(row.dataset.id);
                        row.classList.add('selected');
                    } else {
                        this.selectedRows.delete(row.dataset.id);
                        row.classList.remove('selected');
                    }
                });
                this.updateSelectionUI();
            });
        }

        this.rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const row = checkbox.closest('tr');
                const rowId = row.dataset.id;
                
                if (e.target.checked) {
                    this.selectedRows.add(rowId);
                    row.classList.add('selected');
                } else {
                    this.selectedRows.delete(rowId);
                    row.classList.remove('selected');
                }
                
                this.updateSelectionUI();
            });
        });
    }

    setupPagination() {
        this.paginationButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const action = button.dataset.action;
                
                switch (action) {
                    case 'prev':
                        if (this.currentPage > 1) this.currentPage--;
                        break;
                    case 'next':
                        this.currentPage++;
                        break;
                    case 'page':
                        this.currentPage = parseInt(button.dataset.page);
                        break;
                }
                
                this.updatePagination();
            });
        });
    }

    setupRowActions() {
        const rows = this.tableElement.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    this.handleRowClick(row);
                }
            });
        });
    }

    filterRows() {
        const rows = this.tableElement.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(this.searchQuery);
            row.style.display = matches ? '' : 'none';
        });
    }

    sortTable() {
        const rows = Array.from(this.tableElement.querySelectorAll('tbody tr'));
        const columnIndex = this.getColumnIndex(this.sortColumn);
        
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();
            
            let comparison = 0;
            if (aValue > bValue) comparison = 1;
            if (aValue < bValue) comparison = -1;
            
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
        
        const tbody = this.tableElement.querySelector('tbody');
        rows.forEach(row => tbody.appendChild(row));
    }

    updateSortUI() {
        this.sortButtons.forEach(button => {
            button.classList.remove('asc', 'desc');
            if (button.dataset.column === this.sortColumn) {
                button.classList.add(this.sortDirection);
            }
        });
    }

    updateSelectionUI() {
        const totalCheckboxes = this.rowCheckboxes.length;
        const checkedCheckboxes = Array.from(this.rowCheckboxes).filter(cb => cb.checked).length;
        
        if (this.selectAllCheckbox) {
            this.selectAllCheckbox.checked = checkedCheckboxes === totalCheckboxes;
            this.selectAllCheckbox.indeterminate = checkedCheckboxes > 0 && checkedCheckboxes < totalCheckboxes;
        }
    }

    updatePagination() {
        // Implementation for pagination update
        console.log('Updating pagination');
    }

    handleRowClick(row) {
        // Implementation for row click handling
        console.log('Row clicked:', row.dataset.id);
    }

    getColumnIndex(column) {
        const headers = this.tableElement.querySelectorAll('thead th');
        return Array.from(headers).findIndex(header => 
            header.querySelector('.table-sort')?.dataset.column === column
        );
    }

    // Public API
    getSelectedRows() {
        return Array.from(this.selectedRows);
    }

    clearSelection() {
        this.selectedRows.clear();
        this.rowCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('tr').classList.remove('selected');
        });
        this.updateSelectionUI();
    }

    search(query) {
        this.searchQuery = query.toLowerCase();
        this.filterRows();
    }

    sort(column, direction = 'asc') {
        this.sortColumn = column;
        this.sortDirection = direction;
        this.sortTable();
        this.updateSortUI();
    }
}

// Dashboard Component
class DashboardComponent {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.widgets = [];
        this.layout = 'grid';
        this.init();
    }

    init() {
        this.setupWidgets();
        this.setupDragAndDrop();
        this.setupResizeObserver();
    }

    setupWidgets() {
        const widgets = this.dashboard.querySelectorAll('.dashboard-widget');
        widgets.forEach(widget => {
            this.widgets.push(new WidgetComponent(widget));
        });
    }

    setupDragAndDrop() {
        // Implementation for drag and drop
        console.log('Setting up drag and drop');
    }

    setupResizeObserver() {
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                this.handleResize();
            });
            resizeObserver.observe(this.dashboard);
        }
    }

    handleResize() {
        // Implementation for dashboard resize
        console.log('Dashboard resized');
    }

    // Public API
    addWidget(widget) {
        this.widgets.push(widget);
        this.dashboard.appendChild(widget.element);
    }

    removeWidget(widgetId) {
        const index = this.widgets.findIndex(w => w.id === widgetId);
        if (index > -1) {
            this.widgets[index].destroy();
            this.widgets.splice(index, 1);
        }
    }

    setLayout(layout) {
        this.layout = layout;
        this.dashboard.className = `dashboard-${layout}`;
    }
}

// Widget Component
class WidgetComponent {
    constructor(element) {
        this.element = element;
        this.id = element.id;
        this.type = element.dataset.type || 'default';
        this.menuButton = element.querySelector('.widget-menu-btn');
        this.init();
    }

    init() {
        this.setupMenu();
        this.setupContent();
    }

    setupMenu() {
        if (this.menuButton) {
            this.menuButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }
    }

    setupContent() {
        // Implementation for widget content setup
        console.log('Setting up widget content');
    }

    toggleMenu() {
        // Implementation for widget menu toggle
        console.log('Toggling widget menu');
    }

    // Public API
    refresh() {
        // Implementation for widget refresh
        console.log('Refreshing widget');
    }

    destroy() {
        this.element.remove();
    }
}

// Initialize Advanced Components
const ShadcnAdvancedInstance = new ShadcnAdvanced();

// Export for global access
window.ShadcnAdvanced = ShadcnAdvancedInstance;
