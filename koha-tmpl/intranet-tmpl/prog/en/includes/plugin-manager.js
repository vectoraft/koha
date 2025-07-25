/**
 * Plugin Manager System
 * Manages plugin discovery, installation, updates, and lifecycle
 */

class PluginManager {
    constructor() {
        this.architecture = window.PluginArchitecture;
        this.marketplace = new Map();
        this.installed = new Map();
        this.updates = new Map();
        this.dependencies = new Map();
        this.catalog = null;
        this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
        this.config = {
            marketplaceUrl: 'https://plugins.koha-community.org',
            autoUpdate: false,
            updateChannel: 'stable', // stable, beta, alpha
            allowExperimental: false,
            maxConcurrentInstalls: 3
        };
        
        this.init();
    }

    async init() {
        await this.loadCatalog();
        await this.loadInstalled();
        await this.checkUpdates();
        this.setupUpdateScheduler();
        this.setupEventHandlers();
        
        console.log('Plugin Manager initialized');
    }

    // Catalog Management
    async loadCatalog() {
        try {
            const response = await fetch(`${this.config.marketplaceUrl}/api/catalog`);
            this.catalog = await response.json();
            
            // Index plugins by category and tags
            this.indexCatalog();
            
            console.log(`Loaded ${this.catalog.plugins.length} plugins from catalog`);
        } catch (error) {
            console.error('Failed to load plugin catalog:', error);
            this.catalog = { plugins: [], categories: [], tags: [] };
        }
    }

    indexCatalog() {
        if (!this.catalog) return;

        // Index by category
        this.catalog.byCategory = new Map();
        this.catalog.byTag = new Map();
        this.catalog.byAuthor = new Map();

        this.catalog.plugins.forEach(plugin => {
            // Index by category
            if (!this.catalog.byCategory.has(plugin.category)) {
                this.catalog.byCategory.set(plugin.category, []);
            }
            this.catalog.byCategory.get(plugin.category).push(plugin);

            // Index by tags
            plugin.tags.forEach(tag => {
                if (!this.catalog.byTag.has(tag)) {
                    this.catalog.byTag.set(tag, []);
                }
                this.catalog.byTag.get(tag).push(plugin);
            });

            // Index by author
            if (!this.catalog.byAuthor.has(plugin.author)) {
                this.catalog.byAuthor.set(plugin.author, []);
            }
            this.catalog.byAuthor.get(plugin.author).push(plugin);
        });
    }

    // Plugin Discovery
    searchPlugins(query, filters = {}) {
        if (!this.catalog) return [];

        let results = this.catalog.plugins;

        // Text search
        if (query) {
            const searchTerms = query.toLowerCase().split(' ');
            results = results.filter(plugin => {
                const searchText = `${plugin.name} ${plugin.description} ${plugin.tags.join(' ')}`.toLowerCase();
                return searchTerms.every(term => searchText.includes(term));
            });
        }

        // Apply filters
        if (filters.category) {
            results = results.filter(plugin => plugin.category === filters.category);
        }

        if (filters.tag) {
            results = results.filter(plugin => plugin.tags.includes(filters.tag));
        }

        if (filters.author) {
            results = results.filter(plugin => plugin.author === filters.author);
        }

        if (filters.minRating) {
            results = results.filter(plugin => plugin.rating >= filters.minRating);
        }

        if (filters.maxPrice) {
            results = results.filter(plugin => plugin.price <= filters.maxPrice);
        }

        if (filters.compatibility) {
            results = results.filter(plugin => 
                plugin.compatibility.includes(filters.compatibility)
            );
        }

        // Sort results
        if (filters.sortBy) {
            results = this.sortResults(results, filters.sortBy, filters.sortOrder);
        }

        return results;
    }

    sortResults(results, sortBy, sortOrder = 'desc') {
        return results.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'rating':
                    aValue = a.rating;
                    bValue = b.rating;
                    break;
                case 'downloads':
                    aValue = a.downloads;
                    bValue = b.downloads;
                    break;
                case 'updated':
                    aValue = new Date(a.lastUpdated);
                    bValue = new Date(b.lastUpdated);
                    break;
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }

    getPluginDetails(pluginId) {
        if (!this.catalog) return null;
        return this.catalog.plugins.find(p => p.id === pluginId);
    }

    getRecommendations(pluginId, limit = 5) {
        const plugin = this.getPluginDetails(pluginId);
        if (!plugin) return [];

        // Find similar plugins based on tags and category
        const similar = this.catalog.plugins.filter(p => {
            if (p.id === pluginId) return false;
            
            // Same category
            if (p.category === plugin.category) return true;
            
            // Shared tags
            const sharedTags = p.tags.filter(tag => plugin.tags.includes(tag));
            return sharedTags.length > 0;
        });

        // Sort by similarity score
        similar.sort((a, b) => {
            const aScore = this.calculateSimilarityScore(plugin, a);
            const bScore = this.calculateSimilarityScore(plugin, b);
            return bScore - aScore;
        });

        return similar.slice(0, limit);
    }

    calculateSimilarityScore(plugin1, plugin2) {
        let score = 0;

        // Category match
        if (plugin1.category === plugin2.category) {
            score += 10;
        }

        // Tag matches
        const sharedTags = plugin1.tags.filter(tag => plugin2.tags.includes(tag));
        score += sharedTags.length * 2;

        // Author match
        if (plugin1.author === plugin2.author) {
            score += 5;
        }

        // Rating similarity
        const ratingDiff = Math.abs(plugin1.rating - plugin2.rating);
        score += (5 - ratingDiff) * 0.5;

        return score;
    }

    // Plugin Installation
    async installPlugin(pluginId, version = 'latest') {
        try {
            const plugin = this.getPluginDetails(pluginId);
            if (!plugin) {
                throw new Error(`Plugin ${pluginId} not found in catalog`);
            }

            // Check if already installed
            if (this.installed.has(pluginId)) {
                throw new Error(`Plugin ${pluginId} is already installed`);
            }

            // Check dependencies
            await this.checkDependencies(plugin);

            // Download plugin
            const pluginData = await this.downloadPlugin(plugin, version);

            // Validate plugin
            await this.validatePlugin(pluginData);

            // Install dependencies first
            await this.installDependencies(plugin);

            // Install plugin
            await this.architecture.registerPlugin(pluginData);

            // Track installation
            this.installed.set(pluginId, {
                ...plugin,
                version,
                installDate: Date.now(),
                active: true
            });

            // Update statistics
            await this.updateDownloadStats(pluginId);

            console.log(`Plugin ${pluginId} installed successfully`);
            this.emit('plugin_installed', { pluginId, version });

            return pluginData;
        } catch (error) {
            console.error(`Failed to install plugin ${pluginId}:`, error);
            this.emit('plugin_install_failed', { pluginId, error });
            throw error;
        }
    }

    async downloadPlugin(plugin, version) {
        const downloadUrl = version === 'latest' 
            ? plugin.downloadUrl 
            : plugin.versions.find(v => v.version === version)?.downloadUrl;

        if (!downloadUrl) {
            throw new Error(`Version ${version} not found for plugin ${plugin.id}`);
        }

        const response = await fetch(downloadUrl);
        if (!response.ok) {
            throw new Error(`Failed to download plugin: ${response.statusText}`);
        }

        const pluginData = await response.json();
        return pluginData;
    }

    async validatePlugin(pluginData) {
        // Basic validation
        if (!pluginData.id || !pluginData.name || !pluginData.version) {
            throw new Error('Invalid plugin data: missing required fields');
        }

        // Security validation
        if (pluginData.permissions && pluginData.permissions.includes('system_access')) {
            if (!this.config.allowExperimental) {
                throw new Error('Plugin requires system access but experimental plugins are disabled');
            }
        }

        // Code validation (basic)
        if (pluginData.main && typeof pluginData.main !== 'string') {
            throw new Error('Invalid plugin main file');
        }

        return true;
    }

    // Dependency Management
    async checkDependencies(plugin) {
        if (!plugin.dependencies || plugin.dependencies.length === 0) {
            return true;
        }

        const missing = [];
        const incompatible = [];

        for (const dep of plugin.dependencies) {
            const installedPlugin = this.installed.get(dep.id);
            
            if (!installedPlugin) {
                missing.push(dep);
            } else if (!this.isVersionCompatible(installedPlugin.version, dep.version)) {
                incompatible.push({ ...dep, installedVersion: installedPlugin.version });
            }
        }

        if (missing.length > 0 || incompatible.length > 0) {
            throw new Error(`Dependencies not met: ${JSON.stringify({ missing, incompatible })}`);
        }

        return true;
    }

    async installDependencies(plugin) {
        if (!plugin.dependencies || plugin.dependencies.length === 0) {
            return;
        }

        for (const dep of plugin.dependencies) {
            if (!this.installed.has(dep.id)) {
                await this.installPlugin(dep.id, dep.version);
            }
        }
    }

    isVersionCompatible(installedVersion, requiredVersion) {
        // Simple semver compatibility check
        const installed = installedVersion.split('.').map(Number);
        const required = requiredVersion.split('.').map(Number);

        // Major version must match
        if (installed[0] !== required[0]) {
            return false;
        }

        // Minor version must be >= required
        if (installed[1] < required[1]) {
            return false;
        }

        // Patch version must be >= required if minor versions match
        if (installed[1] === required[1] && installed[2] < required[2]) {
            return false;
        }

        return true;
    }

    // Plugin Updates
    async checkUpdates() {
        const updatePromises = Array.from(this.installed.keys()).map(async (pluginId) => {
            try {
                const update = await this.checkPluginUpdate(pluginId);
                if (update) {
                    this.updates.set(pluginId, update);
                }
            } catch (error) {
                console.error(`Failed to check update for plugin ${pluginId}:`, error);
            }
        });

        await Promise.all(updatePromises);
        
        if (this.updates.size > 0) {
            this.emit('updates_available', { count: this.updates.size });
        }
    }

    async checkPluginUpdate(pluginId) {
        const installed = this.installed.get(pluginId);
        if (!installed) return null;

        const latest = this.getPluginDetails(pluginId);
        if (!latest) return null;

        if (this.isNewerVersion(latest.version, installed.version)) {
            return {
                pluginId,
                currentVersion: installed.version,
                latestVersion: latest.version,
                changelog: latest.changelog,
                releaseDate: latest.lastUpdated
            };
        }

        return null;
    }

    isNewerVersion(latest, current) {
        const latestParts = latest.split('.').map(Number);
        const currentParts = current.split('.').map(Number);

        for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
            const latestPart = latestParts[i] || 0;
            const currentPart = currentParts[i] || 0;

            if (latestPart > currentPart) {
                return true;
            } else if (latestPart < currentPart) {
                return false;
            }
        }

        return false;
    }

    async updatePlugin(pluginId, version = 'latest') {
        try {
            const update = this.updates.get(pluginId);
            if (!update) {
                throw new Error(`No update available for plugin ${pluginId}`);
            }

            // Backup current version
            const currentPlugin = this.installed.get(pluginId);
            const backup = JSON.parse(JSON.stringify(currentPlugin));

            // Uninstall current version
            await this.uninstallPlugin(pluginId, false);

            try {
                // Install new version
                await this.installPlugin(pluginId, version);
                
                // Remove update from queue
                this.updates.delete(pluginId);

                console.log(`Plugin ${pluginId} updated to version ${version}`);
                this.emit('plugin_updated', { pluginId, version });
            } catch (error) {
                // Rollback on failure
                console.error(`Update failed, rolling back plugin ${pluginId}:`, error);
                await this.rollbackPlugin(pluginId, backup);
                throw error;
            }
        } catch (error) {
            console.error(`Failed to update plugin ${pluginId}:`, error);
            this.emit('plugin_update_failed', { pluginId, error });
            throw error;
        }
    }

    async rollbackPlugin(pluginId, backup) {
        try {
            await this.architecture.registerPlugin(backup);
            this.installed.set(pluginId, backup);
            console.log(`Plugin ${pluginId} rolled back successfully`);
        } catch (error) {
            console.error(`Failed to rollback plugin ${pluginId}:`, error);
        }
    }

    // Plugin Uninstallation
    async uninstallPlugin(pluginId, removeDependencies = true) {
        try {
            const plugin = this.installed.get(pluginId);
            if (!plugin) {
                throw new Error(`Plugin ${pluginId} is not installed`);
            }

            // Check if other plugins depend on this one
            const dependents = this.findDependents(pluginId);
            if (dependents.length > 0) {
                throw new Error(`Cannot uninstall ${pluginId}: required by ${dependents.join(', ')}`);
            }

            // Unregister from architecture
            await this.architecture.unregisterPlugin(pluginId);

            // Remove from installed
            this.installed.delete(pluginId);

            // Remove updates
            this.updates.delete(pluginId);

            // Remove dependencies if requested
            if (removeDependencies && plugin.dependencies) {
                for (const dep of plugin.dependencies) {
                    const dependents = this.findDependents(dep.id);
                    if (dependents.length === 0) {
                        await this.uninstallPlugin(dep.id, false);
                    }
                }
            }

            console.log(`Plugin ${pluginId} uninstalled successfully`);
            this.emit('plugin_uninstalled', { pluginId });
        } catch (error) {
            console.error(`Failed to uninstall plugin ${pluginId}:`, error);
            this.emit('plugin_uninstall_failed', { pluginId, error });
            throw error;
        }
    }

    findDependents(pluginId) {
        const dependents = [];
        
        this.installed.forEach((plugin, id) => {
            if (plugin.dependencies && plugin.dependencies.some(dep => dep.id === pluginId)) {
                dependents.push(id);
            }
        });

        return dependents;
    }

    // Plugin Lifecycle
    async enablePlugin(pluginId) {
        const plugin = this.installed.get(pluginId);
        if (!plugin) {
            throw new Error(`Plugin ${pluginId} is not installed`);
        }

        if (plugin.active) {
            return; // Already enabled
        }

        this.architecture.activate(pluginId);
        plugin.active = true;
        
        this.emit('plugin_enabled', { pluginId });
        console.log(`Plugin ${pluginId} enabled`);
    }

    async disablePlugin(pluginId) {
        const plugin = this.installed.get(pluginId);
        if (!plugin) {
            throw new Error(`Plugin ${pluginId} is not installed`);
        }

        if (!plugin.active) {
            return; // Already disabled
        }

        this.architecture.deactivate(pluginId);
        plugin.active = false;
        
        this.emit('plugin_disabled', { pluginId });
        console.log(`Plugin ${pluginId} disabled`);
    }

    // Statistics and Analytics
    async updateDownloadStats(pluginId) {
        try {
            await fetch(`${this.config.marketplaceUrl}/api/stats/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pluginId })
            });
        } catch (error) {
            console.error('Failed to update download stats:', error);
        }
    }

    getPluginStats(pluginId) {
        const plugin = this.installed.get(pluginId);
        if (!plugin) return null;

        return {
            ...plugin,
            stats: this.architecture.getPluginStats(pluginId)
        };
    }

    getAllStats() {
        return {
            installed: this.installed.size,
            active: Array.from(this.installed.values()).filter(p => p.active).length,
            updates: this.updates.size,
            categories: this.getCategoryStats(),
            authors: this.getAuthorStats()
        };
    }

    getCategoryStats() {
        const categories = new Map();
        
        this.installed.forEach(plugin => {
            const category = plugin.category;
            categories.set(category, (categories.get(category) || 0) + 1);
        });

        return Object.fromEntries(categories);
    }

    getAuthorStats() {
        const authors = new Map();
        
        this.installed.forEach(plugin => {
            const author = plugin.author;
            authors.set(author, (authors.get(author) || 0) + 1);
        });

        return Object.fromEntries(authors);
    }

    // Event System
    setupEventHandlers() {
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

    // Update Scheduler
    setupUpdateScheduler() {
        // Check for updates periodically
        setInterval(async () => {
            if (this.config.autoUpdate) {
                await this.checkUpdates();
                
                // Auto-update stable plugins
                for (const [pluginId, update] of this.updates) {
                    if (update.latestVersion.includes('stable')) {
                        await this.updatePlugin(pluginId);
                    }
                }
            }
        }, this.updateInterval);
    }

    // Configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
    }

    saveConfig() {
        localStorage.setItem('koha_plugin_manager_config', JSON.stringify(this.config));
    }

    loadConfig() {
        const saved = localStorage.getItem('koha_plugin_manager_config');
        if (saved) {
            this.config = { ...this.config, ...JSON.parse(saved) };
        }
    }

    // Data Persistence
    async loadInstalled() {
        try {
            const installed = localStorage.getItem('koha_installed_plugins');
            if (installed) {
                const pluginData = JSON.parse(installed);
                
                for (const [pluginId, plugin] of Object.entries(pluginData)) {
                    this.installed.set(pluginId, plugin);
                }
            }
        } catch (error) {
            console.error('Failed to load installed plugins:', error);
        }
    }

    saveInstalled() {
        try {
            const installedData = Object.fromEntries(this.installed);
            localStorage.setItem('koha_installed_plugins', JSON.stringify(installedData));
        } catch (error) {
            console.error('Failed to save installed plugins:', error);
        }
    }

    // Public API
    search(query, filters) {
        return this.searchPlugins(query, filters);
    }

    async install(pluginId, version) {
        return await this.installPlugin(pluginId, version);
    }

    async uninstall(pluginId) {
        return await this.uninstallPlugin(pluginId);
    }

    async update(pluginId, version) {
        return await this.updatePlugin(pluginId, version);
    }

    async enable(pluginId) {
        return await this.enablePlugin(pluginId);
    }

    async disable(pluginId) {
        return await this.disablePlugin(pluginId);
    }

    getInstalled() {
        return Array.from(this.installed.values());
    }

    getUpdates() {
        return Array.from(this.updates.values());
    }

    getRecommended(pluginId, limit) {
        return this.getRecommendations(pluginId, limit);
    }

    getDetails(pluginId) {
        return this.getPluginDetails(pluginId);
    }

    getStats() {
        return this.getAllStats();
    }

    destroy() {
        this.installed.clear();
        this.updates.clear();
        this.marketplace.clear();
        this.dependencies.clear();
        this.eventListeners.clear();
        
        console.log('Plugin Manager destroyed');
    }
}

// Initialize plugin manager
document.addEventListener('DOMContentLoaded', () => {
    window.PluginManager = new PluginManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PluginManager;
}
