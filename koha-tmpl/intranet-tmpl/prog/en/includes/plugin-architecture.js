/**
 * Plugin Architecture System
 * Core plugin system for extending SHAD CN components with third-party functionality
 */

class PluginArchitecture {
    constructor() {
        this.plugins = new Map();
        this.hooks = new Map();
        this.middlewares = new Map();
        this.registry = new Map();
        this.sandboxes = new Map();
        this.permissions = new Map();
        this.eventBus = new EventTarget();
        this.config = {
            maxPlugins: 100,
            maxMemoryPerPlugin: 50 * 1024 * 1024, // 50MB
            maxExecutionTime: 5000, // 5 seconds
            sandboxEnabled: true,
            debugMode: false
        };
        
        this.init();
    }

    init() {
        this.setupHooks();
        this.setupMiddleware();
        this.setupSandboxing();
        this.setupPermissions();
        this.setupEventSystem();
        this.loadRegisteredPlugins();
        
        console.log('Plugin Architecture initialized');
    }

    // Hook System
    setupHooks() {
        // Core hooks that plugins can subscribe to
        const coreHooks = [
            'before_page_load',
            'after_page_load',
            'before_component_render',
            'after_component_render',
            'before_form_submit',
            'after_form_submit',
            'before_api_call',
            'after_api_call',
            'before_navigation',
            'after_navigation',
            'user_login',
            'user_logout',
            'error_occurred',
            'performance_metric'
        ];

        coreHooks.forEach(hook => {
            this.hooks.set(hook, new Set());
        });
    }

    registerHook(hookName, callback, pluginId, priority = 10) {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, new Set());
        }

        const hookData = {
            callback,
            pluginId,
            priority,
            id: this.generateId()
        };

        this.hooks.get(hookName).add(hookData);
        
        // Sort by priority
        const sortedHooks = Array.from(this.hooks.get(hookName))
            .sort((a, b) => a.priority - b.priority);
        
        this.hooks.set(hookName, new Set(sortedHooks));

        this.emit('hook_registered', { hookName, pluginId, priority });
    }

    async executeHook(hookName, data = {}) {
        const hooks = this.hooks.get(hookName);
        if (!hooks) return data;

        let result = data;
        
        for (const hook of hooks) {
            try {
                if (this.config.sandboxEnabled) {
                    result = await this.executeSandboxed(hook.callback, result, hook.pluginId);
                } else {
                    result = await hook.callback(result);
                }
            } catch (error) {
                console.error(`Hook execution error in plugin ${hook.pluginId}:`, error);
                this.emit('hook_error', { hookName, pluginId: hook.pluginId, error });
            }
        }

        return result;
    }

    // Middleware System
    setupMiddleware() {
        this.middlewares.set('request', []);
        this.middlewares.set('response', []);
        this.middlewares.set('component', []);
        this.middlewares.set('event', []);
    }

    registerMiddleware(type, middleware, pluginId, priority = 10) {
        if (!this.middlewares.has(type)) {
            this.middlewares.set(type, []);
        }

        const middlewareData = {
            middleware,
            pluginId,
            priority,
            id: this.generateId()
        };

        this.middlewares.get(type).push(middlewareData);
        
        // Sort by priority
        this.middlewares.get(type).sort((a, b) => a.priority - b.priority);

        this.emit('middleware_registered', { type, pluginId, priority });
    }

    async executeMiddleware(type, data, next) {
        const middlewares = this.middlewares.get(type) || [];
        let index = 0;

        const executeNext = async (currentData) => {
            if (index >= middlewares.length) {
                return next ? await next(currentData) : currentData;
            }

            const middleware = middlewares[index++];
            
            try {
                if (this.config.sandboxEnabled) {
                    return await this.executeSandboxed(
                        middleware.middleware,
                        currentData,
                        middleware.pluginId,
                        executeNext
                    );
                } else {
                    return await middleware.middleware(currentData, executeNext);
                }
            } catch (error) {
                console.error(`Middleware execution error in plugin ${middleware.pluginId}:`, error);
                this.emit('middleware_error', { type, pluginId: middleware.pluginId, error });
                return await executeNext(currentData);
            }
        };

        return await executeNext(data);
    }

    // Plugin Management
    async registerPlugin(pluginConfig) {
        const { id, name, version, author, description, main, permissions = [] } = pluginConfig;

        // Validate plugin configuration
        if (!this.validatePluginConfig(pluginConfig)) {
            throw new Error('Invalid plugin configuration');
        }

        // Check if plugin already exists
        if (this.plugins.has(id)) {
            throw new Error(`Plugin ${id} already registered`);
        }

        // Load plugin code
        const pluginCode = await this.loadPluginCode(main);
        
        // Create plugin instance
        const plugin = await this.createPluginInstance(pluginCode, pluginConfig);

        // Set up permissions
        this.permissions.set(id, new Set(permissions));

        // Register plugin
        this.plugins.set(id, {
            ...pluginConfig,
            instance: plugin,
            loaded: true,
            active: true,
            loadTime: Date.now()
        });

        // Register in registry
        this.registry.set(id, {
            name,
            version,
            author,
            description,
            permissions,
            installDate: Date.now(),
            updateDate: Date.now(),
            usage: 0
        });

        // Initialize plugin
        if (plugin.init) {
            await plugin.init();
        }

        this.emit('plugin_registered', { id, name, version });
        console.log(`Plugin registered: ${name} v${version}`);

        return plugin;
    }

    async unregisterPlugin(pluginId) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) {
            throw new Error(`Plugin ${pluginId} not found`);
        }

        // Cleanup plugin hooks
        this.hooks.forEach((hooks, hookName) => {
            const filteredHooks = Array.from(hooks).filter(h => h.pluginId !== pluginId);
            this.hooks.set(hookName, new Set(filteredHooks));
        });

        // Cleanup plugin middleware
        this.middlewares.forEach((middlewares, type) => {
            const filteredMiddleware = middlewares.filter(m => m.pluginId !== pluginId);
            this.middlewares.set(type, filteredMiddleware);
        });

        // Cleanup plugin instance
        if (plugin.instance && plugin.instance.destroy) {
            await plugin.instance.destroy();
        }

        // Remove from sandbox
        this.sandboxes.delete(pluginId);

        // Remove permissions
        this.permissions.delete(pluginId);

        // Remove from registry
        this.registry.delete(pluginId);

        // Remove from plugins
        this.plugins.delete(pluginId);

        this.emit('plugin_unregistered', { pluginId });
        console.log(`Plugin unregistered: ${pluginId}`);
    }

    validatePluginConfig(config) {
        const required = ['id', 'name', 'version', 'main'];
        
        for (const field of required) {
            if (!config[field]) {
                console.error(`Missing required field: ${field}`);
                return false;
            }
        }

        // Validate ID format
        if (!/^[a-zA-Z0-9_-]+$/.test(config.id)) {
            console.error('Invalid plugin ID format');
            return false;
        }

        // Validate version format
        if (!/^\d+\.\d+\.\d+$/.test(config.version)) {
            console.error('Invalid version format');
            return false;
        }

        return true;
    }

    async loadPluginCode(main) {
        try {
            if (main.startsWith('http')) {
                // Load from URL
                const response = await fetch(main);
                return await response.text();
            } else {
                // Load from file
                const response = await fetch(main);
                return await response.text();
            }
        } catch (error) {
            throw new Error(`Failed to load plugin code: ${error.message}`);
        }
    }

    async createPluginInstance(code, config) {
        try {
            // Create plugin constructor
            const PluginClass = new Function('return ' + code)();
            
            // Create plugin instance with sandbox
            const plugin = new PluginClass(this.createPluginAPI(config.id));
            
            return plugin;
        } catch (error) {
            throw new Error(`Failed to create plugin instance: ${error.message}`);
        }
    }

    createPluginAPI(pluginId) {
        return {
            // Core API
            getId: () => pluginId,
            getConfig: () => this.plugins.get(pluginId),
            
            // Hook system
            registerHook: (hookName, callback, priority) => 
                this.registerHook(hookName, callback, pluginId, priority),
            executeHook: (hookName, data) => 
                this.executeHook(hookName, data),
            
            // Middleware system
            registerMiddleware: (type, middleware, priority) => 
                this.registerMiddleware(type, middleware, pluginId, priority),
            
            // Event system
            emit: (event, data) => this.emit(event, data),
            on: (event, callback) => this.on(event, callback),
            off: (event, callback) => this.off(event, callback),
            
            // Storage
            getStorage: () => this.getPluginStorage(pluginId),
            setStorage: (key, value) => this.setPluginStorage(pluginId, key, value),
            
            // HTTP utilities
            fetch: (url, options) => this.safeFetch(url, options, pluginId),
            
            // DOM utilities
            querySelector: (selector) => this.safeQuerySelector(selector, pluginId),
            createElement: (tag, attributes) => this.safeCreateElement(tag, attributes, pluginId),
            
            // Component utilities
            createComponent: (type, props) => this.createComponent(type, props, pluginId),
            renderComponent: (component, container) => this.renderComponent(component, container, pluginId),
            
            // Utility functions
            log: (...args) => console.log(`[Plugin ${pluginId}]:`, ...args),
            warn: (...args) => console.warn(`[Plugin ${pluginId}]:`, ...args),
            error: (...args) => console.error(`[Plugin ${pluginId}]:`, ...args)
        };
    }

    // Sandboxing System
    setupSandboxing() {
        if (!this.config.sandboxEnabled) return;

        // Create sandbox for each plugin
        this.createSandbox = (pluginId) => {
            const sandbox = {
                pluginId,
                memoryUsage: 0,
                executionTime: 0,
                permissions: this.permissions.get(pluginId) || new Set(),
                restrictions: {
                    maxMemory: this.config.maxMemoryPerPlugin,
                    maxExecutionTime: this.config.maxExecutionTime,
                    allowedDomains: ['localhost', 'koha.community'],
                    allowedPaths: ['/api/', '/plugins/'],
                    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
                }
            };

            this.sandboxes.set(pluginId, sandbox);
            return sandbox;
        };
    }

    async executeSandboxed(fn, data, pluginId, next) {
        const sandbox = this.sandboxes.get(pluginId);
        if (!sandbox) {
            throw new Error(`Sandbox not found for plugin ${pluginId}`);
        }

        const startTime = Date.now();
        const startMemory = this.getMemoryUsage();

        try {
            // Execute with timeout
            const result = await Promise.race([
                fn.call(null, data, next),
                this.createTimeout(sandbox.restrictions.maxExecutionTime)
            ]);

            // Track execution time
            sandbox.executionTime += Date.now() - startTime;

            // Track memory usage
            const endMemory = this.getMemoryUsage();
            sandbox.memoryUsage = Math.max(sandbox.memoryUsage, endMemory - startMemory);

            return result;
        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new Error(`Plugin ${pluginId} execution timeout`);
            }
            throw error;
        }
    }

    createTimeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                const error = new Error('Execution timeout');
                error.name = 'TimeoutError';
                reject(error);
            }, ms);
        });
    }

    getMemoryUsage() {
        return performance.memory ? performance.memory.usedJSHeapSize : 0;
    }

    // Permission System
    setupPermissions() {
        this.permissionTypes = new Set([
            'dom_access',
            'network_access',
            'storage_access',
            'location_access',
            'notification_access',
            'camera_access',
            'microphone_access',
            'file_access',
            'clipboard_access',
            'fullscreen_access'
        ]);
    }

    hasPermission(pluginId, permission) {
        const permissions = this.permissions.get(pluginId);
        return permissions && permissions.has(permission);
    }

    requestPermission(pluginId, permission) {
        if (!this.permissionTypes.has(permission)) {
            throw new Error(`Unknown permission type: ${permission}`);
        }

        if (!this.permissions.has(pluginId)) {
            this.permissions.set(pluginId, new Set());
        }

        this.permissions.get(pluginId).add(permission);
        this.emit('permission_granted', { pluginId, permission });
    }

    revokePermission(pluginId, permission) {
        const permissions = this.permissions.get(pluginId);
        if (permissions) {
            permissions.delete(permission);
            this.emit('permission_revoked', { pluginId, permission });
        }
    }

    // Event System
    setupEventSystem() {
        this.eventListeners = new Map();
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

    // Storage System
    getPluginStorage(pluginId) {
        const storageKey = `plugin_${pluginId}_storage`;
        
        try {
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error(`Failed to get storage for plugin ${pluginId}:`, error);
            return {};
        }
    }

    setPluginStorage(pluginId, key, value) {
        const storageKey = `plugin_${pluginId}_storage`;
        
        try {
            const storage = this.getPluginStorage(pluginId);
            storage[key] = value;
            localStorage.setItem(storageKey, JSON.stringify(storage));
        } catch (error) {
            console.error(`Failed to set storage for plugin ${pluginId}:`, error);
        }
    }

    // Safe API Methods
    async safeFetch(url, options, pluginId) {
        if (!this.hasPermission(pluginId, 'network_access')) {
            throw new Error(`Plugin ${pluginId} does not have network access permission`);
        }

        const sandbox = this.sandboxes.get(pluginId);
        if (sandbox) {
            // Check allowed domains
            const urlObj = new URL(url);
            if (!sandbox.restrictions.allowedDomains.includes(urlObj.hostname)) {
                throw new Error(`Plugin ${pluginId} is not allowed to access ${urlObj.hostname}`);
            }

            // Check allowed paths
            if (!sandbox.restrictions.allowedPaths.some(path => urlObj.pathname.startsWith(path))) {
                throw new Error(`Plugin ${pluginId} is not allowed to access ${urlObj.pathname}`);
            }

            // Check allowed methods
            const method = options?.method || 'GET';
            if (!sandbox.restrictions.allowedMethods.includes(method)) {
                throw new Error(`Plugin ${pluginId} is not allowed to use ${method} method`);
            }
        }

        return fetch(url, options);
    }

    safeQuerySelector(selector, pluginId) {
        if (!this.hasPermission(pluginId, 'dom_access')) {
            throw new Error(`Plugin ${pluginId} does not have DOM access permission`);
        }

        // Restrict to plugin container
        const pluginContainer = document.querySelector(`[data-plugin="${pluginId}"]`);
        if (pluginContainer) {
            return pluginContainer.querySelector(selector);
        }

        return document.querySelector(selector);
    }

    safeCreateElement(tag, attributes, pluginId) {
        if (!this.hasPermission(pluginId, 'dom_access')) {
            throw new Error(`Plugin ${pluginId} does not have DOM access permission`);
        }

        const element = document.createElement(tag);
        
        if (attributes) {
            Object.keys(attributes).forEach(attr => {
                element.setAttribute(attr, attributes[attr]);
            });
        }

        // Add plugin identifier
        element.setAttribute('data-plugin', pluginId);

        return element;
    }

    // Component Integration
    createComponent(type, props, pluginId) {
        // Create component using the existing SHAD CN system
        const component = {
            type,
            props: { ...props, pluginId },
            pluginId,
            id: this.generateId()
        };

        this.emit('component_created', { component, pluginId });
        return component;
    }

    renderComponent(component, container, pluginId) {
        if (!this.hasPermission(pluginId, 'dom_access')) {
            throw new Error(`Plugin ${pluginId} does not have DOM access permission`);
        }

        // Render component using existing system
        const element = this.renderComponentElement(component);
        container.appendChild(element);

        this.emit('component_rendered', { component, pluginId });
        return element;
    }

    renderComponentElement(component) {
        // This would integrate with the existing SHAD CN component system
        const element = document.createElement('div');
        element.className = `shadcn-${component.type}`;
        element.setAttribute('data-component', component.type);
        element.setAttribute('data-plugin', component.pluginId);
        
        // Add component-specific content
        element.innerHTML = `<div class="component-content">${component.type} Component</div>`;
        
        return element;
    }

    // Registry Management
    async loadRegisteredPlugins() {
        try {
            const registryData = localStorage.getItem('koha_plugin_registry');
            if (registryData) {
                const registry = JSON.parse(registryData);
                
                for (const [pluginId, pluginConfig] of Object.entries(registry)) {
                    try {
                        await this.registerPlugin(pluginConfig);
                    } catch (error) {
                        console.error(`Failed to load plugin ${pluginId}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load plugin registry:', error);
        }
    }

    saveRegistry() {
        try {
            const registryData = Object.fromEntries(this.registry);
            localStorage.setItem('koha_plugin_registry', JSON.stringify(registryData));
        } catch (error) {
            console.error('Failed to save plugin registry:', error);
        }
    }

    // Utility Methods
    generateId() {
        return 'plugin_' + Math.random().toString(36).substr(2, 9);
    }

    getPluginInfo(pluginId) {
        return this.plugins.get(pluginId);
    }

    getAllPlugins() {
        return Array.from(this.plugins.values());
    }

    getActivePlugins() {
        return Array.from(this.plugins.values()).filter(p => p.active);
    }

    getPluginStats(pluginId) {
        const plugin = this.plugins.get(pluginId);
        const sandbox = this.sandboxes.get(pluginId);
        const registry = this.registry.get(pluginId);

        return {
            ...plugin,
            sandbox,
            registry,
            performance: {
                memoryUsage: sandbox?.memoryUsage || 0,
                executionTime: sandbox?.executionTime || 0,
                usage: registry?.usage || 0
            }
        };
    }

    // Public API
    async install(pluginConfig) {
        return await this.registerPlugin(pluginConfig);
    }

    async uninstall(pluginId) {
        return await this.unregisterPlugin(pluginId);
    }

    activate(pluginId) {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
            plugin.active = true;
            this.emit('plugin_activated', { pluginId });
        }
    }

    deactivate(pluginId) {
        const plugin = this.plugins.get(pluginId);
        if (plugin) {
            plugin.active = false;
            this.emit('plugin_deactivated', { pluginId });
        }
    }

    getRegistry() {
        return Array.from(this.registry.entries());
    }

    destroy() {
        // Cleanup all plugins
        this.plugins.forEach((plugin, pluginId) => {
            this.unregisterPlugin(pluginId);
        });

        // Clear all data
        this.plugins.clear();
        this.hooks.clear();
        this.middlewares.clear();
        this.registry.clear();
        this.sandboxes.clear();
        this.permissions.clear();
        this.eventListeners.clear();

        console.log('Plugin Architecture destroyed');
    }
}

// Initialize plugin architecture
document.addEventListener('DOMContentLoaded', () => {
    window.PluginArchitecture = new PluginArchitecture();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PluginArchitecture;
}
