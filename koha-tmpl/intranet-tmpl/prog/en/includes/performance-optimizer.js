/**
 * Performance Optimization System
 * Advanced performance monitoring, caching, and optimization features
 */

class PerformanceOptimizer {
    constructor() {
        this.cache = new Map();
        this.observers = new Map();
        this.metrics = {
            pageLoad: 0,
            domReady: 0,
            firstPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0
        };
        this.resourceCache = new Map();
        this.lazyLoadObserver = null;
        this.preloadQueue = [];
        this.bundleManifest = null;
        
        this.init();
    }

    init() {
        this.setupPerformanceMonitoring();
        this.setupResourceOptimization();
        this.setupLazyLoading();
        this.setupPreloading();
        this.setupCaching();
        this.setupBundleOptimization();
        this.setupMemoryManagement();
        
        console.log('Performance Optimizer initialized');
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.observeWebVitals();
        
        // Monitor custom metrics
        this.monitorPageLoad();
        this.monitorDOMReady();
        this.monitorResourceLoading();
        
        // Set up performance reporting
        this.setupPerformanceReporting();
    }

    observeWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
                this.reportMetric('LCP', lastEntry.startTime);
            });
            
            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP monitoring not supported');
            }
        }

        // First Input Delay (FID)
        if ('PerformanceObserver' in window) {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                    this.reportMetric('FID', entry.processingStart - entry.startTime);
                });
            });
            
            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID monitoring not supported');
            }
        }

        // Cumulative Layout Shift (CLS)
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cumulativeLayoutShift = clsValue;
                this.reportMetric('CLS', clsValue);
            });
            
            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('CLS monitoring not supported');
            }
        }
    }

    monitorPageLoad() {
        window.addEventListener('load', () => {
            this.metrics.pageLoad = performance.now();
            this.reportMetric('Page Load', this.metrics.pageLoad);
        });
    }

    monitorDOMReady() {
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.domReady = performance.now();
            this.reportMetric('DOM Ready', this.metrics.domReady);
        });
    }

    monitorResourceLoading() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.analyzeResourcePerformance(entry);
                });
            });
            
            try {
                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.warn('Resource monitoring not supported');
            }
        }
    }

    analyzeResourcePerformance(entry) {
        const duration = entry.responseEnd - entry.startTime;
        const size = entry.transferSize || 0;
        
        // Log slow resources
        if (duration > 1000) {
            console.warn(`Slow resource: ${entry.name} (${duration}ms)`);
        }
        
        // Log large resources
        if (size > 500000) {
            console.warn(`Large resource: ${entry.name} (${(size / 1024).toFixed(2)}KB)`);
        }
        
        // Cache resource metrics
        this.cache.set(`resource:${entry.name}`, {
            duration,
            size,
            timestamp: Date.now()
        });
    }

    setupPerformanceReporting() {
        // Report metrics every 30 seconds
        setInterval(() => {
            this.reportMetrics();
        }, 30000);
        
        // Report on page unload
        window.addEventListener('beforeunload', () => {
            this.reportMetrics();
        });
    }

    reportMetric(name, value) {
        // Send to analytics or logging service
        console.log(`Performance Metric - ${name}: ${value}`);
        
        // You can integrate with your analytics service here
        // analytics.track('performance_metric', { name, value });
    }

    reportMetrics() {
        const report = {
            ...this.metrics,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            connectionType: navigator.connection?.effectiveType || 'unknown'
        };
        
        console.log('Performance Report:', report);
        
        // Send to your analytics service
        // this.sendToAnalytics(report);
    }

    // Resource Optimization
    setupResourceOptimization() {
        this.optimizeImages();
        this.optimizeFonts();
        this.optimizeCSS();
        this.optimizeJavaScript();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" if not present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding="async" for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            
            // Monitor image loading
            img.addEventListener('load', () => {
                this.reportMetric('Image Load', img.src);
            });
            
            img.addEventListener('error', () => {
                console.warn('Image failed to load:', img.src);
            });
        });
    }

    optimizeFonts() {
        // Preload critical fonts
        const criticalFonts = [
            '/fonts/inter-var.woff2',
            '/fonts/source-code-pro.woff2'
        ];
        
        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = font;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    optimizeCSS() {
        // Remove unused CSS (simplified implementation)
        const usedSelectors = new Set();
        
        // Track used selectors
        const observer = new MutationObserver(() => {
            this.trackUsedSelectors(usedSelectors);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id']
        });
        
        // Initial tracking
        this.trackUsedSelectors(usedSelectors);
    }

    trackUsedSelectors(usedSelectors) {
        // Track class names
        document.querySelectorAll('[class]').forEach(element => {
            element.classList.forEach(className => {
                usedSelectors.add(`.${className}`);
            });
        });
        
        // Track IDs
        document.querySelectorAll('[id]').forEach(element => {
            usedSelectors.add(`#${element.id}`);
        });
    }

    optimizeJavaScript() {
        // Code splitting and dynamic imports
        this.setupCodeSplitting();
        
        // Tree shaking for unused code
        this.setupTreeShaking();
        
        // Minification and compression
        this.setupMinification();
    }

    setupCodeSplitting() {
        // Dynamic import for non-critical modules
        const loadModule = async (moduleName) => {
            try {
                const module = await import(`./modules/${moduleName}.js`);
                return module;
            } catch (error) {
                console.warn(`Failed to load module: ${moduleName}`, error);
                return null;
            }
        };
        
        // Store for lazy loading
        this.loadModule = loadModule;
    }

    setupTreeShaking() {
        // Track used functions and modules
        this.usedModules = new Set();
        this.usedFunctions = new Set();
        
        // Override console methods to track usage
        const originalLog = console.log;
        console.log = (...args) => {
            this.trackFunctionUsage('console.log');
            return originalLog.apply(console, args);
        };
    }

    trackFunctionUsage(functionName) {
        this.usedFunctions.add(functionName);
    }

    setupMinification() {
        // Runtime minification for dynamic content
        this.minifyHTML = (html) => {
            return html
                .replace(/\s+/g, ' ')
                .replace(/>\s+</g, '><')
                .trim();
        };
        
        this.minifyCSS = (css) => {
            return css
                .replace(/\s+/g, ' ')
                .replace(/;\s*}/g, '}')
                .replace(/{\s*/g, '{')
                .replace(/;\s*/g, ';')
                .trim();
        };
    }

    // Lazy Loading
    setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadLazyContent(entry.target);
                    this.lazyLoadObserver.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe lazy load elements
        document.querySelectorAll('[data-lazy]').forEach(element => {
            this.lazyLoadObserver.observe(element);
        });
    }

    loadLazyContent(element) {
        const type = element.dataset.lazy;
        const src = element.dataset.src;
        
        switch (type) {
            case 'image':
                this.loadLazyImage(element, src);
                break;
            case 'iframe':
                this.loadLazyIframe(element, src);
                break;
            case 'script':
                this.loadLazyScript(element, src);
                break;
            case 'component':
                this.loadLazyComponent(element, src);
                break;
            default:
                console.warn('Unknown lazy load type:', type);
        }
    }

    loadLazyImage(element, src) {
        const img = new Image();
        img.onload = () => {
            element.src = src;
            element.classList.add('loaded');
        };
        img.onerror = () => {
            element.classList.add('error');
        };
        img.src = src;
    }

    loadLazyIframe(element, src) {
        element.src = src;
        element.classList.add('loaded');
    }

    loadLazyScript(element, src) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            element.classList.add('loaded');
        };
        script.onerror = () => {
            element.classList.add('error');
        };
        document.head.appendChild(script);
    }

    async loadLazyComponent(element, componentName) {
        try {
            const module = await this.loadModule(componentName);
            if (module && module.default) {
                const component = new module.default(element);
                element.classList.add('loaded');
                return component;
            }
        } catch (error) {
            console.warn(`Failed to load component: ${componentName}`, error);
            element.classList.add('error');
        }
    }

    // Preloading
    setupPreloading() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Predictive preloading
        this.setupPredictivePreloading();
        
        // Hover preloading
        this.setupHoverPreloading();
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: '/css/shadcn-components.css', as: 'style' },
            { href: '/js/shadcn-advanced.js', as: 'script' },
            { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.type) link.type = resource.type;
            if (resource.as === 'font') link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    setupPredictivePreloading() {
        // Track user behavior to predict next actions
        this.userBehavior = {
            clickPatterns: [],
            scrollPatterns: [],
            timeOnPage: Date.now()
        };
        
        // Track clicks
        document.addEventListener('click', (e) => {
            this.userBehavior.clickPatterns.push({
                target: e.target.tagName,
                className: e.target.className,
                timestamp: Date.now()
            });
            
            this.predictNextAction();
        });
        
        // Track scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.userBehavior.scrollPatterns.push({
                    scrollY: window.scrollY,
                    timestamp: Date.now()
                });
                
                this.predictNextAction();
            }, 100);
        });
    }

    predictNextAction() {
        // Simple prediction based on patterns
        const recentClicks = this.userBehavior.clickPatterns.slice(-5);
        const recentScrolls = this.userBehavior.scrollPatterns.slice(-3);
        
        // Predict likely next page
        if (recentClicks.length > 2) {
            const commonTargets = this.findCommonPatterns(recentClicks);
            commonTargets.forEach(target => {
                this.preloadForTarget(target);
            });
        }
    }

    findCommonPatterns(actions) {
        const patterns = {};
        actions.forEach(action => {
            const key = `${action.target}-${action.className}`;
            patterns[key] = (patterns[key] || 0) + 1;
        });
        
        return Object.keys(patterns)
            .filter(key => patterns[key] > 1)
            .sort((a, b) => patterns[b] - patterns[a]);
    }

    preloadForTarget(target) {
        // Preload likely resources for target
        const links = document.querySelectorAll(`a[class*="${target}"]`);
        links.forEach(link => {
            this.preloadPage(link.href);
        });
    }

    preloadPage(url) {
        if (this.preloadQueue.includes(url)) return;
        
        this.preloadQueue.push(url);
        
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    setupHoverPreloading() {
        // Preload on hover
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !this.preloadQueue.includes(link.href)) {
                this.preloadPage(link.href);
            }
        });
    }

    // Caching
    setupCaching() {
        // Service Worker for caching
        this.setupServiceWorker();
        
        // Memory caching
        this.setupMemoryCache();
        
        // Local storage caching
        this.setupLocalStorageCache();
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.warn('Service Worker registration failed:', error);
                });
        }
    }

    setupMemoryCache() {
        // Cache API responses
        this.apiCache = new Map();
        
        // Cache DOM queries
        this.domCache = new Map();
        
        // Cache computed styles
        this.styleCache = new Map();
    }

    setupLocalStorageCache() {
        // Cache configuration
        this.cacheConfig = {
            maxSize: 10 * 1024 * 1024, // 10MB
            ttl: 24 * 60 * 60 * 1000, // 24 hours
            prefix: 'koha_cache_'
        };
        
        // Cleanup old cache entries
        this.cleanupCache();
    }

    cleanupCache() {
        const now = Date.now();
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.cacheConfig.prefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp + this.cacheConfig.ttl < now) {
                        localStorage.removeItem(key);
                    }
                } catch (error) {
                    localStorage.removeItem(key);
                }
            }
        });
    }

    // Bundle Optimization
    setupBundleOptimization() {
        // Load bundle manifest
        this.loadBundleManifest();
        
        // Setup module federation
        this.setupModuleFederation();
        
        // Setup chunk loading
        this.setupChunkLoading();
    }

    async loadBundleManifest() {
        try {
            const response = await fetch('/manifest.json');
            this.bundleManifest = await response.json();
        } catch (error) {
            console.warn('Failed to load bundle manifest:', error);
        }
    }

    setupModuleFederation() {
        // Configure module federation for micro-frontends
        this.moduleRegistry = new Map();
        
        // Register available modules
        this.registerModule('auth', '/modules/auth.js');
        this.registerModule('catalog', '/modules/catalog.js');
        this.registerModule('circulation', '/modules/circulation.js');
    }

    registerModule(name, path) {
        this.moduleRegistry.set(name, {
            path,
            loaded: false,
            loading: false,
            instance: null
        });
    }

    async loadModule(name) {
        const module = this.moduleRegistry.get(name);
        if (!module) {
            throw new Error(`Module not found: ${name}`);
        }
        
        if (module.instance) {
            return module.instance;
        }
        
        if (module.loading) {
            // Wait for existing load to complete
            while (module.loading) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            return module.instance;
        }
        
        module.loading = true;
        
        try {
            const moduleInstance = await import(module.path);
            module.instance = moduleInstance;
            module.loaded = true;
            return moduleInstance;
        } catch (error) {
            console.error(`Failed to load module ${name}:`, error);
            throw error;
        } finally {
            module.loading = false;
        }
    }

    setupChunkLoading() {
        // Dynamic chunk loading based on route
        this.chunkRegistry = new Map();
        
        // Monitor route changes
        window.addEventListener('popstate', () => {
            this.loadChunksForRoute(window.location.pathname);
        });
        
        // Load chunks for current route
        this.loadChunksForRoute(window.location.pathname);
    }

    async loadChunksForRoute(route) {
        const chunks = this.getChunksForRoute(route);
        
        for (const chunk of chunks) {
            if (!this.chunkRegistry.has(chunk)) {
                this.chunkRegistry.set(chunk, this.loadChunk(chunk));
            }
        }
        
        // Wait for all chunks to load
        await Promise.all(
            chunks.map(chunk => this.chunkRegistry.get(chunk))
        );
    }

    getChunksForRoute(route) {
        // Map routes to required chunks
        const routeChunkMap = {
            '/admin': ['admin', 'common'],
            '/catalog': ['catalog', 'common'],
            '/circulation': ['circulation', 'common'],
            '/members': ['members', 'common'],
            '/reports': ['reports', 'common']
        };
        
        return routeChunkMap[route] || ['common'];
    }

    async loadChunk(chunkName) {
        const chunkPath = `/chunks/${chunkName}.js`;
        
        try {
            const module = await import(chunkPath);
            console.log(`Chunk loaded: ${chunkName}`);
            return module;
        } catch (error) {
            console.warn(`Failed to load chunk: ${chunkName}`, error);
            return null;
        }
    }

    // Memory Management
    setupMemoryManagement() {
        // Monitor memory usage
        this.monitorMemoryUsage();
        
        // Cleanup unused resources
        this.setupResourceCleanup();
        
        // Optimize garbage collection
        this.optimizeGarbageCollection();
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usage = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                };
                
                this.reportMetric('Memory Usage', usage);
                
                // Trigger cleanup if memory usage is high
                if (usage.used / usage.limit > 0.8) {
                    this.performCleanup();
                }
            }, 60000); // Check every minute
        }
    }

    setupResourceCleanup() {
        // Cleanup on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.performCleanup();
            }
        });
        
        // Cleanup on low memory
        if ('memory' in performance) {
            window.addEventListener('beforeunload', () => {
                this.performCleanup();
            });
        }
    }

    performCleanup() {
        // Clear caches
        this.clearExpiredCache();
        
        // Remove unused DOM elements
        this.removeUnusedElements();
        
        // Clear unused event listeners
        this.clearEventListeners();
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    clearExpiredCache() {
        const now = Date.now();
        
        // Clear memory cache
        this.cache.forEach((value, key) => {
            if (value.timestamp + this.cacheConfig.ttl < now) {
                this.cache.delete(key);
            }
        });
        
        // Clear API cache
        this.apiCache.forEach((value, key) => {
            if (value.timestamp + this.cacheConfig.ttl < now) {
                this.apiCache.delete(key);
            }
        });
    }

    removeUnusedElements() {
        // Remove hidden elements that are no longer needed
        const hiddenElements = document.querySelectorAll('[style*="display: none"]');
        hiddenElements.forEach(element => {
            if (element.dataset.keepAlive !== 'true') {
                element.remove();
            }
        });
    }

    clearEventListeners() {
        // This is a simplified approach - in practice, you'd need to track listeners
        console.log('Clearing unused event listeners');
    }

    optimizeGarbageCollection() {
        // Optimize object creation and cleanup
        this.objectPool = new Map();
        
        // Create object pools for frequently used objects
        this.createObjectPool('domElement', () => document.createElement('div'));
        this.createObjectPool('event', () => new CustomEvent('custom'));
    }

    createObjectPool(type, factory) {
        this.objectPool.set(type, {
            factory,
            pool: [],
            borrowed: new Set()
        });
    }

    borrowObject(type) {
        const pool = this.objectPool.get(type);
        if (!pool) return null;
        
        let obj = pool.pool.pop();
        if (!obj) {
            obj = pool.factory();
        }
        
        pool.borrowed.add(obj);
        return obj;
    }

    returnObject(type, obj) {
        const pool = this.objectPool.get(type);
        if (!pool) return;
        
        pool.borrowed.delete(obj);
        pool.pool.push(obj);
    }

    // Public API
    getMetrics() {
        return { ...this.metrics };
    }

    clearCache() {
        this.cache.clear();
        this.apiCache.clear();
        this.resourceCache.clear();
    }

    preload(url) {
        this.preloadPage(url);
    }

    async loadModuleAsync(name) {
        return await this.loadModule(name);
    }

    optimize() {
        this.performCleanup();
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.clearCache();
        this.objectPool.clear();
    }
}

// Initialize the performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.PerformanceOptimizer = new PerformanceOptimizer();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
