/**
 * Developer Tools System
 * Comprehensive development utilities, debugging tools, and testing framework
 */

class DeveloperTools {
    constructor() {
        this.debugMode = false;
        this.logger = new Map();
        this.profiler = new Map();
        this.inspector = null;
        this.testRunner = null;
        this.codeGenerator = null;
        this.docs = new Map();
        this.config = {
            logLevel: 'info', // 'debug', 'info', 'warn', 'error'
            maxLogSize: 1000,
            profileSamples: 100,
            enableInspector: true,
            enableProfiler: true,
            hotReload: true
        };
        
        this.init();
    }

    init() {
        this.setupLogger();
        this.setupProfiler();
        this.setupInspector();
        this.setupTestRunner();
        this.setupCodeGenerator();
        this.setupHotReload();
        this.setupKeyboardShortcuts();
        
        console.log('Developer Tools initialized');
    }

    // Debug Mode Management
    setDebugMode(enabled) {
        this.debugMode = enabled;
        
        if (enabled) {
            this.enableDebugFeatures();
        } else {
            this.disableDebugFeatures();
        }
        
        this.emit('debug_mode_changed', { enabled });
    }

    enableDebugFeatures() {
        // Add debug styles
        this.injectDebugStyles();
        
        // Enable component highlighting
        this.enableComponentHighlighting();
        
        // Show debug panel
        this.showDebugPanel();
        
        // Enable verbose logging
        this.config.logLevel = 'debug';
        
        console.log('Debug mode enabled');
    }

    disableDebugFeatures() {
        // Remove debug styles
        this.removeDebugStyles();
        
        // Disable component highlighting
        this.disableComponentHighlighting();
        
        // Hide debug panel
        this.hideDebugPanel();
        
        // Reset logging level
        this.config.logLevel = 'info';
        
        console.log('Debug mode disabled');
    }

    // Logging System
    setupLogger() {
        this.logLevels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
        
        this.logs = [];
        this.logFilters = new Set();
        
        // Override console methods
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            debug: console.debug
        };
        
        console.log = (...args) => {
            this.log('info', ...args);
            this.originalConsole.log(...args);
        };
        
        console.warn = (...args) => {
            this.log('warn', ...args);
            this.originalConsole.warn(...args);
        };
        
        console.error = (...args) => {
            this.log('error', ...args);
            this.originalConsole.error(...args);
        };
        
        console.debug = (...args) => {
            this.log('debug', ...args);
            this.originalConsole.debug(...args);
        };
    }

    log(level, ...args) {
        const levelNum = this.logLevels[level] || 1;
        const configLevelNum = this.logLevels[this.config.logLevel] || 1;
        
        if (levelNum < configLevelNum) return;
        
        const logEntry = {
            level,
            message: args.join(' '),
            timestamp: Date.now(),
            stack: new Error().stack,
            component: this.getCurrentComponent()
        };
        
        this.logs.push(logEntry);
        
        // Limit log size
        if (this.logs.length > this.config.maxLogSize) {
            this.logs.shift();
        }
        
        // Update debug panel
        this.updateDebugPanel();
        
        this.emit('log_entry', logEntry);
    }

    getLogs(filter = {}) {
        let filteredLogs = this.logs;
        
        if (filter.level) {
            filteredLogs = filteredLogs.filter(log => log.level === filter.level);
        }
        
        if (filter.component) {
            filteredLogs = filteredLogs.filter(log => log.component === filter.component);
        }
        
        if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            filteredLogs = filteredLogs.filter(log => 
                log.message.toLowerCase().includes(searchTerm)
            );
        }
        
        return filteredLogs;
    }

    clearLogs() {
        this.logs = [];
        this.updateDebugPanel();
        this.emit('logs_cleared');
    }

    // Performance Profiler
    setupProfiler() {
        this.profiles = new Map();
        this.activeProfiles = new Set();
        this.performanceObserver = null;
        
        if ('PerformanceObserver' in window) {
            this.performanceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.recordPerformanceEntry(entry);
                });
            });
            
            try {
                this.performanceObserver.observe({ entryTypes: ['measure', 'mark'] });
            } catch (error) {
                console.warn('Performance observer not supported');
            }
        }
    }

    startProfile(name) {
        if (this.activeProfiles.has(name)) {
            console.warn(`Profile '${name}' is already active`);
            return;
        }
        
        this.activeProfiles.add(name);
        performance.mark(`${name}-start`);
        
        this.profiles.set(name, {
            name,
            startTime: performance.now(),
            endTime: null,
            duration: null,
            samples: []
        });
        
        this.log('debug', `Profile started: ${name}`);
    }

    endProfile(name) {
        if (!this.activeProfiles.has(name)) {
            console.warn(`Profile '${name}' is not active`);
            return;
        }
        
        this.activeProfiles.delete(name);
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const profile = this.profiles.get(name);
        if (profile) {
            profile.endTime = performance.now();
            profile.duration = profile.endTime - profile.startTime;
            
            this.log('debug', `Profile ended: ${name} (${profile.duration.toFixed(2)}ms)`);
            this.emit('profile_completed', profile);
        }
        
        return profile;
    }

    recordPerformanceEntry(entry) {
        if (entry.entryType === 'measure') {
            const profile = this.profiles.get(entry.name);
            if (profile) {
                profile.samples.push({
                    duration: entry.duration,
                    startTime: entry.startTime,
                    timestamp: Date.now()
                });
            }
        }
    }

    getProfile(name) {
        return this.profiles.get(name);
    }

    getAllProfiles() {
        return Array.from(this.profiles.values());
    }

    clearProfiles() {
        this.profiles.clear();
        this.activeProfiles.clear();
        this.emit('profiles_cleared');
    }

    // Component Inspector
    setupInspector() {
        if (!this.config.enableInspector) return;
        
        this.inspector = {
            selectedComponent: null,
            highlightedComponent: null,
            inspectorPanel: null
        };
        
        this.createInspectorPanel();
        this.setupInspectorEvents();
    }

    createInspectorPanel() {
        const panel = document.createElement('div');
        panel.id = 'shadcn-inspector';
        panel.className = 'shadcn-inspector-panel';
        panel.innerHTML = `
            <div class="inspector-header">
                <h3>Component Inspector</h3>
                <button id="inspector-close" class="inspector-close">×</button>
            </div>
            <div class="inspector-content">
                <div class="inspector-tree" id="inspector-tree"></div>
                <div class="inspector-properties" id="inspector-properties"></div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.inspector.inspectorPanel = panel;
        
        // Hide initially
        panel.style.display = 'none';
        
        // Setup close button
        panel.querySelector('#inspector-close').addEventListener('click', () => {
            this.hideInspector();
        });
    }

    setupInspectorEvents() {
        document.addEventListener('mouseover', (e) => {
            if (!this.debugMode) return;
            
            const component = this.findComponent(e.target);
            if (component) {
                this.highlightComponent(component);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (!this.debugMode) return;
            
            this.unhighlightComponent();
        });
        
        document.addEventListener('click', (e) => {
            if (!this.debugMode) return;
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const component = this.findComponent(e.target);
                if (component) {
                    this.selectComponent(component);
                }
            }
        });
    }

    findComponent(element) {
        let current = element;
        while (current) {
            if (current.dataset && current.dataset.component) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    highlightComponent(component) {
        this.unhighlightComponent();
        
        component.classList.add('shadcn-debug-highlight');
        this.inspector.highlightedComponent = component;
        
        // Show component info tooltip
        this.showComponentTooltip(component);
    }

    unhighlightComponent() {
        if (this.inspector.highlightedComponent) {
            this.inspector.highlightedComponent.classList.remove('shadcn-debug-highlight');
            this.inspector.highlightedComponent = null;
        }
        
        this.hideComponentTooltip();
    }

    selectComponent(component) {
        this.inspector.selectedComponent = component;
        this.showInspector();
        this.updateInspectorContent();
        
        this.emit('component_selected', { component });
    }

    showInspector() {
        if (this.inspector.inspectorPanel) {
            this.inspector.inspectorPanel.style.display = 'block';
        }
    }

    hideInspector() {
        if (this.inspector.inspectorPanel) {
            this.inspector.inspectorPanel.style.display = 'none';
        }
    }

    updateInspectorContent() {
        const component = this.inspector.selectedComponent;
        if (!component) return;
        
        const treeContainer = document.getElementById('inspector-tree');
        const propertiesContainer = document.getElementById('inspector-properties');
        
        if (treeContainer) {
            treeContainer.innerHTML = this.generateComponentTree(component);
        }
        
        if (propertiesContainer) {
            propertiesContainer.innerHTML = this.generateComponentProperties(component);
        }
    }

    generateComponentTree(component) {
        const componentType = component.dataset.component || 'unknown';
        const componentId = component.id || 'no-id';
        
        let html = `
            <div class="tree-node selected">
                <span class="tree-node-label">${componentType}</span>
                <span class="tree-node-id">#${componentId}</span>
            </div>
        `;
        
        // Add child components
        const childComponents = component.querySelectorAll('[data-component]');
        if (childComponents.length > 0) {
            html += '<div class="tree-children">';
            childComponents.forEach(child => {
                const childType = child.dataset.component || 'unknown';
                const childId = child.id || 'no-id';
                html += `
                    <div class="tree-node">
                        <span class="tree-node-label">${childType}</span>
                        <span class="tree-node-id">#${childId}</span>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        return html;
    }

    generateComponentProperties(component) {
        const properties = {
            'Component Type': component.dataset.component || 'unknown',
            'ID': component.id || 'none',
            'Classes': component.className || 'none',
            'Tag Name': component.tagName.toLowerCase(),
            'Data Attributes': this.getDataAttributes(component),
            'Style Properties': this.getComputedStyles(component),
            'Event Listeners': this.getEventListeners(component)
        };
        
        let html = '<div class="properties-list">';
        
        Object.entries(properties).forEach(([key, value]) => {
            html += `
                <div class="property-item">
                    <div class="property-key">${key}:</div>
                    <div class="property-value">${this.formatPropertyValue(value)}</div>
                </div>
            `;
        });
        
        html += '</div>';
        
        return html;
    }

    getDataAttributes(element) {
        const dataAttrs = {};
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
                dataAttrs[attr.name] = attr.value;
            }
        });
        return dataAttrs;
    }

    getComputedStyles(element) {
        const styles = window.getComputedStyle(element);
        return {
            display: styles.display,
            position: styles.position,
            width: styles.width,
            height: styles.height,
            margin: styles.margin,
            padding: styles.padding,
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily
        };
    }

    getEventListeners(element) {
        // This is a simplified version - in a real implementation,
        // you'd need to track event listeners as they're added
        return 'Event listeners tracking not implemented';
    }

    formatPropertyValue(value) {
        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    }

    showComponentTooltip(component) {
        const tooltip = document.createElement('div');
        tooltip.className = 'shadcn-debug-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <strong>${component.dataset.component || 'Component'}</strong>
                ${component.id ? `#${component.id}` : ''}
            </div>
            <div class="tooltip-content">
                <div>Tag: ${component.tagName.toLowerCase()}</div>
                <div>Classes: ${component.className || 'none'}</div>
                <div>Size: ${component.offsetWidth}×${component.offsetHeight}</div>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = component.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.zIndex = '10000';
        
        this.componentTooltip = tooltip;
    }

    hideComponentTooltip() {
        if (this.componentTooltip) {
            this.componentTooltip.remove();
            this.componentTooltip = null;
        }
    }

    // Test Runner
    setupTestRunner() {
        this.testRunner = {
            tests: new Map(),
            suites: new Map(),
            results: [],
            running: false
        };
    }

    createTestSuite(name, tests) {
        this.testRunner.suites.set(name, {
            name,
            tests,
            results: []
        });
    }

    addTest(suiteName, testName, testFunction) {
        const suite = this.testRunner.suites.get(suiteName);
        if (!suite) {
            throw new Error(`Test suite '${suiteName}' not found`);
        }
        
        suite.tests.push({
            name: testName,
            function: testFunction,
            result: null
        });
    }

    async runTests(suiteName) {
        const suite = this.testRunner.suites.get(suiteName);
        if (!suite) {
            throw new Error(`Test suite '${suiteName}' not found`);
        }
        
        this.testRunner.running = true;
        this.emit('test_run_started', { suiteName });
        
        const results = [];
        
        for (const test of suite.tests) {
            const result = await this.runSingleTest(test);
            results.push(result);
            suite.results.push(result);
        }
        
        this.testRunner.running = false;
        this.emit('test_run_completed', { suiteName, results });
        
        return results;
    }

    async runSingleTest(test) {
        const startTime = performance.now();
        
        try {
            await test.function();
            
            const endTime = performance.now();
            const result = {
                name: test.name,
                status: 'passed',
                duration: endTime - startTime,
                error: null
            };
            
            this.log('info', `Test passed: ${test.name}`);
            return result;
        } catch (error) {
            const endTime = performance.now();
            const result = {
                name: test.name,
                status: 'failed',
                duration: endTime - startTime,
                error: error.message
            };
            
            this.log('error', `Test failed: ${test.name} - ${error.message}`);
            return result;
        }
    }

    // Code Generator
    setupCodeGenerator() {
        this.codeGenerator = {
            templates: new Map(),
            generators: new Map()
        };
        
        this.setupDefaultTemplates();
    }

    setupDefaultTemplates() {
        // Component template
        this.codeGenerator.templates.set('component', `
class {{componentName}} {
    constructor(props) {
        this.props = props;
        this.element = null;
    }
    
    render() {
        this.element = document.createElement('{{tagName}}');
        this.element.className = '{{className}}';
        {{#if hasContent}}
        this.element.innerHTML = this.props.content || '';
        {{/if}}
        
        return this.element;
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
        `);
        
        // Plugin template
        this.codeGenerator.templates.set('plugin', `
class {{pluginName}} {
    constructor(api) {
        this.api = api;
        this.name = '{{pluginName}}';
        this.version = '1.0.0';
    }
    
    async init() {
        this.api.log('Plugin initialized');
        
        // Register hooks
        {{#each hooks}}
        this.api.registerHook('{{name}}', this.{{handler}}.bind(this));
        {{/each}}
        
        // Register components
        {{#each components}}
        this.api.registerComponent('{{name}}', this.{{factory}}.bind(this));
        {{/each}}
    }
    
    async destroy() {
        this.api.log('Plugin destroyed');
    }
}
        `);
    }

    generateCode(templateName, data) {
        const template = this.codeGenerator.templates.get(templateName);
        if (!template) {
            throw new Error(`Template '${templateName}' not found`);
        }
        
        return this.processTemplate(template, data);
    }

    processTemplate(template, data) {
        let result = template;
        
        // Replace simple variables
        Object.entries(data).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, value);
        });
        
        // Process conditionals
        result = result.replace(/{{#if\s+(\w+)}}(.*?){{\/if}}/gs, (match, condition, content) => {
            return data[condition] ? content : '';
        });
        
        // Process loops
        result = result.replace(/{{#each\s+(\w+)}}(.*?){{\/each}}/gs, (match, arrayName, content) => {
            const array = data[arrayName];
            if (!Array.isArray(array)) return '';
            
            return array.map(item => {
                let itemContent = content;
                Object.entries(item).forEach(([key, value]) => {
                    const regex = new RegExp(`{{${key}}}`, 'g');
                    itemContent = itemContent.replace(regex, value);
                });
                return itemContent;
            }).join('');
        });
        
        return result;
    }

    // Hot Reload
    setupHotReload() {
        if (!this.config.hotReload) return;
        
        this.hotReload = {
            enabled: true,
            watchers: new Map(),
            lastModified: new Map()
        };
        
        // Watch for file changes (simplified - in real implementation would use websockets)
        setInterval(() => {
            this.checkForChanges();
        }, 1000);
    }

    checkForChanges() {
        // This would be implemented with websockets in a real system
        // For now, we'll just emit a fake hot reload event
        if (Math.random() < 0.01) { // 1% chance
            this.emit('hot_reload', {
                file: 'components/Button.js',
                type: 'component'
            });
        }
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'F12':
                        e.preventDefault();
                        this.toggleDebugMode();
                        break;
                    case 'i':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.toggleInspector();
                        }
                        break;
                    case 'l':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.toggleDebugPanel();
                        }
                        break;
                    case 'p':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.toggleProfiler();
                        }
                        break;
                    case 'r':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.reloadComponents();
                        }
                        break;
                }
            }
        });
    }

    toggleDebugMode() {
        this.setDebugMode(!this.debugMode);
    }

    toggleInspector() {
        if (this.inspector.inspectorPanel.style.display === 'none') {
            this.showInspector();
        } else {
            this.hideInspector();
        }
    }

    toggleDebugPanel() {
        this.debugPanelVisible = !this.debugPanelVisible;
        if (this.debugPanelVisible) {
            this.showDebugPanel();
        } else {
            this.hideDebugPanel();
        }
    }

    toggleProfiler() {
        this.profilerVisible = !this.profilerVisible;
        if (this.profilerVisible) {
            this.showProfiler();
        } else {
            this.hideProfiler();
        }
    }

    reloadComponents() {
        this.emit('components_reload');
        console.log('Components reloaded');
    }

    // Debug Panel
    showDebugPanel() {
        if (!this.debugPanel) {
            this.createDebugPanel();
        }
        this.debugPanel.style.display = 'block';
        this.debugPanelVisible = true;
    }

    hideDebugPanel() {
        if (this.debugPanel) {
            this.debugPanel.style.display = 'none';
        }
        this.debugPanelVisible = false;
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'shadcn-debug-panel';
        panel.className = 'shadcn-debug-panel';
        panel.innerHTML = `
            <div class="debug-header">
                <h3>Debug Console</h3>
                <div class="debug-controls">
                    <button id="clear-logs">Clear</button>
                    <button id="debug-close">×</button>
                </div>
            </div>
            <div class="debug-content">
                <div class="debug-tabs">
                    <button class="debug-tab active" data-tab="logs">Logs</button>
                    <button class="debug-tab" data-tab="performance">Performance</button>
                    <button class="debug-tab" data-tab="components">Components</button>
                </div>
                <div class="debug-tab-content">
                    <div id="debug-logs" class="debug-tab-panel active"></div>
                    <div id="debug-performance" class="debug-tab-panel"></div>
                    <div id="debug-components" class="debug-tab-panel"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.debugPanel = panel;
        
        // Setup event listeners
        panel.querySelector('#clear-logs').addEventListener('click', () => {
            this.clearLogs();
        });
        
        panel.querySelector('#debug-close').addEventListener('click', () => {
            this.hideDebugPanel();
        });
        
        // Setup tabs
        panel.querySelectorAll('.debug-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchDebugTab(tab.dataset.tab);
            });
        });
        
        this.updateDebugPanel();
    }

    updateDebugPanel() {
        if (!this.debugPanel) return;
        
        const logsContainer = this.debugPanel.querySelector('#debug-logs');
        const performanceContainer = this.debugPanel.querySelector('#debug-performance');
        const componentsContainer = this.debugPanel.querySelector('#debug-components');
        
        if (logsContainer) {
            logsContainer.innerHTML = this.generateLogsHTML();
        }
        
        if (performanceContainer) {
            performanceContainer.innerHTML = this.generatePerformanceHTML();
        }
        
        if (componentsContainer) {
            componentsContainer.innerHTML = this.generateComponentsHTML();
        }
    }

    generateLogsHTML() {
        const logs = this.getLogs();
        let html = '<div class="logs-container">';
        
        logs.forEach(log => {
            html += `
                <div class="log-entry log-${log.level}">
                    <div class="log-meta">
                        <span class="log-timestamp">${new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span class="log-level">${log.level.toUpperCase()}</span>
                        ${log.component ? `<span class="log-component">${log.component}</span>` : ''}
                    </div>
                    <div class="log-message">${log.message}</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    generatePerformanceHTML() {
        const profiles = this.getAllProfiles();
        let html = '<div class="performance-container">';
        
        profiles.forEach(profile => {
            html += `
                <div class="performance-entry">
                    <div class="performance-name">${profile.name}</div>
                    <div class="performance-duration">${profile.duration?.toFixed(2) || 'N/A'}ms</div>
                    <div class="performance-samples">${profile.samples.length} samples</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    generateComponentsHTML() {
        const components = document.querySelectorAll('[data-component]');
        let html = '<div class="components-container">';
        
        components.forEach(component => {
            html += `
                <div class="component-entry">
                    <div class="component-type">${component.dataset.component}</div>
                    <div class="component-id">${component.id || 'no-id'}</div>
                    <div class="component-classes">${component.className || 'no-classes'}</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    switchDebugTab(tabName) {
        // Update active tab
        this.debugPanel.querySelectorAll('.debug-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        this.debugPanel.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update active panel
        this.debugPanel.querySelectorAll('.debug-tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        this.debugPanel.querySelector(`#debug-${tabName}`).classList.add('active');
    }

    // Utilities
    injectDebugStyles() {
        const style = document.createElement('style');
        style.id = 'shadcn-debug-styles';
        style.textContent = `
            .shadcn-debug-highlight {
                outline: 2px solid #3b82f6 !important;
                outline-offset: -2px !important;
            }
            
            .shadcn-debug-tooltip {
                background: #1f2937;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                line-height: 1.4;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .shadcn-debug-panel {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 300px;
                background: #1f2937;
                color: white;
                font-family: monospace;
                font-size: 12px;
                z-index: 9999;
                border-top: 1px solid #374151;
            }
            
            .shadcn-inspector-panel {
                position: fixed;
                top: 0;
                right: 0;
                width: 400px;
                height: 100%;
                background: #1f2937;
                color: white;
                font-family: monospace;
                font-size: 12px;
                z-index: 9999;
                border-left: 1px solid #374151;
            }
        `;
        document.head.appendChild(style);
    }

    removeDebugStyles() {
        const style = document.getElementById('shadcn-debug-styles');
        if (style) {
            style.remove();
        }
    }

    getCurrentComponent() {
        // Try to determine current component from call stack
        const stack = new Error().stack;
        const componentMatch = stack.match(/at (\w+Component)/);
        return componentMatch ? componentMatch[1] : null;
    }

    // Event System
    setupEventSystem() {
        this.eventListeners = new Map();
        this.eventBus = new EventTarget();
    }

    emit(event, data) {
        this.eventBus.dispatchEvent(new CustomEvent(event, { detail: data }));
    }

    on(event, callback) {
        this.eventBus.addEventListener(event, callback);
        
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
    }

    off(event, callback) {
        this.eventBus.removeEventListener(event, callback);
        
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.delete(callback);
        }
    }

    // Public API
    debug(enabled) {
        this.setDebugMode(enabled);
    }

    profile(name) {
        this.startProfile(name);
        return {
            end: () => this.endProfile(name)
        };
    }

    inspect(component) {
        this.selectComponent(component);
    }

    test(suiteName, testName, testFunction) {
        if (!this.testRunner.suites.has(suiteName)) {
            this.createTestSuite(suiteName, []);
        }
        this.addTest(suiteName, testName, testFunction);
    }

    generate(templateName, data) {
        return this.generateCode(templateName, data);
    }

    destroy() {
        this.logs = [];
        this.profiles.clear();
        this.testRunner.tests.clear();
        this.testRunner.suites.clear();
        this.eventListeners.clear();
        
        if (this.debugPanel) {
            this.debugPanel.remove();
        }
        
        if (this.inspector.inspectorPanel) {
            this.inspector.inspectorPanel.remove();
        }
        
        this.removeDebugStyles();
        
        console.log('Developer Tools destroyed');
    }
}

// Initialize developer tools
document.addEventListener('DOMContentLoaded', () => {
    window.DeveloperTools = new DeveloperTools();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeveloperTools;
}
