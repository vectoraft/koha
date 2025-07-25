/**
 * Service Integration System
 * Integrates with external library services, cloud storage, and authentication providers
 */

class ServiceIntegrator {
    constructor() {
        this.services = new Map();
        this.connectors = new Map();
        this.credentials = new Map();
        this.cache = new Map();
        this.config = {
            timeout: 30000,
            retries: 3,
            cacheExpiry: 5 * 60 * 1000, // 5 minutes
            encryptCredentials: true,
            enableHealthChecks: true,
            healthCheckInterval: 60000 // 1 minute
        };
        this.healthStatus = new Map();
        
        this.init();
    }

    init() {
        this.setupCoreServices();
        this.setupConnectors();
        this.setupHealthMonitoring();
        this.setupEventHandlers();
        this.loadCredentials();
        
        console.log('Service Integrator initialized');
    }

    // Core Services Setup
    setupCoreServices() {
        // OCLC WorldCat Integration
        this.registerService('oclc_worldcat', {
            name: 'OCLC WorldCat',
            description: 'Global library catalog and resource sharing',
            baseUrl: 'https://worldcat.org/webservices',
            authType: 'api_key',
            endpoints: {
                search: '/catalog/search/opensearch',
                holdings: '/catalog/content/holdings',
                citations: '/catalog/content/citations',
                availability: '/catalog/content/availability'
            },
            rateLimit: {
                requests: 1000,
                window: 3600000 // 1 hour
            }
        });

        // Ex Libris Alma Integration
        this.registerService('exlibris_alma', {
            name: 'Ex Libris Alma',
            description: 'Library management platform',
            baseUrl: 'https://api-eu.hosted.exlibrisgroup.com/almaws/v1',
            authType: 'api_key',
            endpoints: {
                bibs: '/bibs',
                holdings: '/bibs/{mms_id}/holdings',
                items: '/bibs/{mms_id}/holdings/{holding_id}/items',
                users: '/users',
                loans: '/users/{user_id}/loans',
                requests: '/users/{user_id}/requests'
            },
            rateLimit: {
                requests: 25,
                window: 1000 // 1 second
            }
        });

        // HathiTrust Integration
        this.registerService('hathitrust', {
            name: 'HathiTrust Digital Library',
            description: 'Digital preservation and access',
            baseUrl: 'https://catalog.hathitrust.org/api',
            authType: 'oauth',
            endpoints: {
                volumes: '/volumes/brief/json',
                full: '/volumes/full/json',
                rights: '/volumes/rights/json'
            },
            rateLimit: {
                requests: 100,
                window: 60000 // 1 minute
            }
        });

        // DPLA Integration
        this.registerService('dpla', {
            name: 'Digital Public Library of America',
            description: 'Digital library aggregation service',
            baseUrl: 'https://api.dp.la/v2',
            authType: 'api_key',
            endpoints: {
                items: '/items',
                collections: '/collections',
                search: '/items'
            },
            rateLimit: {
                requests: 500,
                window: 3600000 // 1 hour
            }
        });

        // CrossRef Integration
        this.registerService('crossref', {
            name: 'CrossRef',
            description: 'Digital Object Identifier (DOI) registration',
            baseUrl: 'https://api.crossref.org',
            authType: 'none',
            endpoints: {
                works: '/works',
                journals: '/journals',
                members: '/members',
                funders: '/funders'
            },
            rateLimit: {
                requests: 50,
                window: 1000 // 1 second
            }
        });

        // Library of Congress Integration
        this.registerService('loc', {
            name: 'Library of Congress',
            description: 'National library of the United States',
            baseUrl: 'https://www.loc.gov/apis',
            authType: 'none',
            endpoints: {
                search: '/search',
                items: '/items',
                collections: '/collections',
                authorities: '/authorities'
            },
            rateLimit: {
                requests: 100,
                window: 60000 // 1 minute
            }
        });
    }

    // Cloud Storage Services
    setupCloudStorage() {
        // AWS S3 Integration
        this.registerService('aws_s3', {
            name: 'Amazon S3',
            description: 'Cloud object storage',
            baseUrl: 'https://s3.amazonaws.com',
            authType: 'aws_signature',
            endpoints: {
                bucket: '/{bucket}',
                object: '/{bucket}/{key}',
                list: '/{bucket}?list-type=2',
                multipart: '/{bucket}/{key}?uploads'
            },
            rateLimit: {
                requests: 3500,
                window: 1000 // 1 second
            }
        });

        // Google Cloud Storage
        this.registerService('google_cloud_storage', {
            name: 'Google Cloud Storage',
            description: 'Google cloud object storage',
            baseUrl: 'https://storage.googleapis.com/storage/v1',
            authType: 'oauth',
            endpoints: {
                buckets: '/b',
                objects: '/b/{bucket}/o',
                download: '/b/{bucket}/o/{object}?alt=media',
                upload: '/upload/storage/v1/b/{bucket}/o'
            },
            rateLimit: {
                requests: 1000,
                window: 1000 // 1 second
            }
        });

        // Microsoft Azure Blob Storage
        this.registerService('azure_blob', {
            name: 'Azure Blob Storage',
            description: 'Microsoft cloud object storage',
            baseUrl: 'https://{account}.blob.core.windows.net',
            authType: 'azure_signature',
            endpoints: {
                containers: '/?comp=list',
                blobs: '/{container}?restype=container&comp=list',
                blob: '/{container}/{blob}',
                upload: '/{container}/{blob}'
            },
            rateLimit: {
                requests: 2000,
                window: 1000 // 1 second
            }
        });
    }

    // Authentication Providers
    setupAuthProviders() {
        // OAuth2 Generic Provider
        this.registerService('oauth2_generic', {
            name: 'OAuth2 Provider',
            description: 'Generic OAuth2 authentication',
            authType: 'oauth2',
            endpoints: {
                authorize: '/oauth/authorize',
                token: '/oauth/token',
                userinfo: '/oauth/userinfo',
                refresh: '/oauth/token'
            }
        });

        // SAML Provider
        this.registerService('saml', {
            name: 'SAML Provider',
            description: 'SAML 2.0 authentication',
            authType: 'saml',
            endpoints: {
                sso: '/sso',
                slo: '/slo',
                metadata: '/metadata'
            }
        });

        // LDAP Provider
        this.registerService('ldap', {
            name: 'LDAP Directory',
            description: 'LDAP directory authentication',
            authType: 'ldap',
            endpoints: {
                bind: '/bind',
                search: '/search',
                modify: '/modify'
            }
        });

        // OpenID Connect
        this.registerService('openid_connect', {
            name: 'OpenID Connect',
            description: 'OpenID Connect authentication',
            authType: 'oidc',
            endpoints: {
                discovery: '/.well-known/openid_configuration',
                authorize: '/auth',
                token: '/token',
                userinfo: '/userinfo',
                jwks: '/jwks'
            }
        });
    }

    // Service Registration
    registerService(serviceId, config) {
        this.services.set(serviceId, {
            ...config,
            id: serviceId,
            enabled: false,
            connected: false,
            lastHealthCheck: null,
            rateLimitRemaining: config.rateLimit?.requests || Infinity,
            rateLimitReset: Date.now() + (config.rateLimit?.window || 3600000)
        });

        this.connectors.set(serviceId, this.createConnector(serviceId, config));
        console.log(`Service registered: ${config.name}`);
    }

    // Connector Creation
    createConnector(serviceId, config) {
        return {
            async connect(credentials) {
                return await this.establishConnection(serviceId, credentials);
            },

            async disconnect() {
                return await this.terminateConnection(serviceId);
            },

            async call(endpoint, params = {}, options = {}) {
                return await this.makeServiceCall(serviceId, endpoint, params, options);
            },

            async upload(endpoint, file, options = {}) {
                return await this.uploadFile(serviceId, endpoint, file, options);
            },

            async download(endpoint, options = {}) {
                return await this.downloadFile(serviceId, endpoint, options);
            },

            async authenticate(credentials) {
                return await this.authenticateService(serviceId, credentials);
            },

            getHealth() {
                return this.getServiceHealth(serviceId);
            },

            getRateLimitStatus() {
                return this.getRateLimitStatus(serviceId);
            }
        };
    }

    // Connection Management
    async establishConnection(serviceId, credentials) {
        const service = this.services.get(serviceId);
        if (!service) {
            throw new Error(`Service ${serviceId} not found`);
        }

        try {
            // Store credentials securely
            await this.storeCredentials(serviceId, credentials);

            // Test connection
            const isConnected = await this.testConnection(serviceId);
            
            if (isConnected) {
                service.connected = true;
                service.enabled = true;
                service.lastHealthCheck = Date.now();
                
                this.emit('service_connected', { serviceId, serviceName: service.name });
                console.log(`Connected to ${service.name}`);
                
                return true;
            } else {
                throw new Error('Connection test failed');
            }
        } catch (error) {
            console.error(`Failed to connect to ${service.name}:`, error);
            this.emit('service_connection_failed', { serviceId, error });
            throw error;
        }
    }

    async terminateConnection(serviceId) {
        const service = this.services.get(serviceId);
        if (!service) {
            throw new Error(`Service ${serviceId} not found`);
        }

        service.connected = false;
        service.enabled = false;
        
        // Remove credentials
        this.credentials.delete(serviceId);
        
        this.emit('service_disconnected', { serviceId, serviceName: service.name });
        console.log(`Disconnected from ${service.name}`);
    }

    async testConnection(serviceId) {
        const service = this.services.get(serviceId);
        if (!service) return false;

        try {
            // Make a simple API call to test connectivity
            const testEndpoint = service.endpoints.test || Object.values(service.endpoints)[0];
            const response = await this.makeServiceCall(serviceId, testEndpoint, {}, { timeout: 5000 });
            
            return response.status < 400;
        } catch (error) {
            console.error(`Connection test failed for ${service.name}:`, error);
            return false;
        }
    }

    // Service Calls
    async makeServiceCall(serviceId, endpoint, params = {}, options = {}) {
        const service = this.services.get(serviceId);
        if (!service) {
            throw new Error(`Service ${serviceId} not found`);
        }

        if (!service.connected) {
            throw new Error(`Service ${service.name} is not connected`);
        }

        // Check rate limits
        if (!this.checkRateLimit(serviceId)) {
            throw new Error(`Rate limit exceeded for ${service.name}`);
        }

        const cacheKey = `${serviceId}:${endpoint}:${JSON.stringify(params)}`;
        
        // Check cache first
        if (options.cache !== false) {
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() < cached.expiry) {
                return cached.data;
            }
        }

        try {
            const url = this.buildUrl(service, endpoint, params);
            const headers = await this.buildHeaders(serviceId, options);
            
            const requestOptions = {
                method: options.method || 'GET',
                headers,
                timeout: options.timeout || this.config.timeout,
                ...options
            };

            if (options.body) {
                requestOptions.body = JSON.stringify(options.body);
            }

            const response = await this.fetchWithRetry(url, requestOptions);
            
            // Update rate limit
            this.updateRateLimit(serviceId, response.headers);
            
            // Parse response
            const data = await this.parseResponse(response);
            
            // Cache result
            if (options.cache !== false) {
                this.cache.set(cacheKey, {
                    data,
                    expiry: Date.now() + this.config.cacheExpiry
                });
            }

            this.emit('service_call_success', { serviceId, endpoint, data });
            return data;
        } catch (error) {
            console.error(`Service call failed for ${service.name}:`, error);
            this.emit('service_call_failed', { serviceId, endpoint, error });
            throw error;
        }
    }

    async fetchWithRetry(url, options, retryCount = 0) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok && retryCount < this.config.retries) {
                // Exponential backoff
                const delay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                
                return this.fetchWithRetry(url, options, retryCount + 1);
            }

            return response;
        } catch (error) {
            if (retryCount < this.config.retries) {
                const delay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                
                return this.fetchWithRetry(url, options, retryCount + 1);
            }
            
            throw error;
        }
    }

    buildUrl(service, endpoint, params) {
        let url = service.baseUrl;
        
        // Replace path parameters
        let endpointPath = service.endpoints[endpoint] || endpoint;
        
        Object.keys(params).forEach(key => {
            const placeholder = `{${key}}`;
            if (endpointPath.includes(placeholder)) {
                endpointPath = endpointPath.replace(placeholder, encodeURIComponent(params[key]));
                delete params[key];
            }
        });

        url += endpointPath;

        // Add query parameters
        const queryParams = new URLSearchParams(params);
        if (queryParams.toString()) {
            url += (url.includes('?') ? '&' : '?') + queryParams.toString();
        }

        return url;
    }

    async buildHeaders(serviceId, options) {
        const service = this.services.get(serviceId);
        const credentials = this.credentials.get(serviceId);
        
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Koha-SHADCN/1.0',
            ...options.headers
        };

        // Add authentication headers
        if (credentials) {
            switch (service.authType) {
                case 'api_key':
                    headers['Authorization'] = `Bearer ${credentials.apiKey}`;
                    break;
                case 'oauth':
                    headers['Authorization'] = `Bearer ${credentials.accessToken}`;
                    break;
                case 'basic':
                    headers['Authorization'] = `Basic ${btoa(credentials.username + ':' + credentials.password)}`;
                    break;
                case 'aws_signature':
                    headers['Authorization'] = await this.createAWSSignature(serviceId, options);
                    break;
                case 'azure_signature':
                    headers['Authorization'] = await this.createAzureSignature(serviceId, options);
                    break;
            }
        }

        return headers;
    }

    async parseResponse(response) {
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType.includes('application/xml')) {
            const text = await response.text();
            return this.parseXML(text);
        } else {
            return await response.text();
        }
    }

    parseXML(xmlString) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlString, 'text/xml');
            
            // Convert XML to JSON-like object
            return this.xmlToJson(doc);
        } catch (error) {
            console.error('Failed to parse XML:', error);
            return xmlString;
        }
    }

    xmlToJson(xml) {
        const obj = {};
        
        if (xml.nodeType === 1) { // Element
            if (xml.attributes.length > 0) {
                obj['@attributes'] = {};
                for (let i = 0; i < xml.attributes.length; i++) {
                    const attr = xml.attributes.item(i);
                    obj['@attributes'][attr.nodeName] = attr.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) { // Text
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                const child = xml.childNodes.item(i);
                const nodeName = child.nodeName;
                
                if (typeof obj[nodeName] === 'undefined') {
                    obj[nodeName] = this.xmlToJson(child);
                } else {
                    if (typeof obj[nodeName].push === 'undefined') {
                        const old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this.xmlToJson(child));
                }
            }
        }

        return obj;
    }

    // File Operations
    async uploadFile(serviceId, endpoint, file, options = {}) {
        const service = this.services.get(serviceId);
        if (!service) {
            throw new Error(`Service ${serviceId} not found`);
        }

        try {
            const url = this.buildUrl(service, endpoint, options.params || {});
            const headers = await this.buildHeaders(serviceId, options);
            
            // Remove content-type for file uploads
            delete headers['Content-Type'];

            const formData = new FormData();
            formData.append('file', file);
            
            if (options.metadata) {
                Object.keys(options.metadata).forEach(key => {
                    formData.append(key, options.metadata[key]);
                });
            }

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await this.parseResponse(response);
            this.emit('file_uploaded', { serviceId, file: file.name, result });
            
            return result;
        } catch (error) {
            console.error(`File upload failed for ${service.name}:`, error);
            this.emit('file_upload_failed', { serviceId, file: file.name, error });
            throw error;
        }
    }

    async downloadFile(serviceId, endpoint, options = {}) {
        const service = this.services.get(serviceId);
        if (!service) {
            throw new Error(`Service ${serviceId} not found`);
        }

        try {
            const url = this.buildUrl(service, endpoint, options.params || {});
            const headers = await this.buildHeaders(serviceId, options);

            const response = await fetch(url, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                throw new Error(`Download failed: ${response.statusText}`);
            }

            const blob = await response.blob();
            this.emit('file_downloaded', { serviceId, size: blob.size });
            
            return blob;
        } catch (error) {
            console.error(`File download failed for ${service.name}:`, error);
            this.emit('file_download_failed', { serviceId, error });
            throw error;
        }
    }

    // Rate Limiting
    checkRateLimit(serviceId) {
        const service = this.services.get(serviceId);
        if (!service || !service.rateLimit) return true;

        const now = Date.now();
        
        if (now > service.rateLimitReset) {
            // Reset rate limit
            service.rateLimitRemaining = service.rateLimit.requests;
            service.rateLimitReset = now + service.rateLimit.window;
        }

        return service.rateLimitRemaining > 0;
    }

    updateRateLimit(serviceId, headers) {
        const service = this.services.get(serviceId);
        if (!service) return;

        // Update from response headers if available
        const remaining = headers.get('X-RateLimit-Remaining') || headers.get('RateLimit-Remaining');
        const reset = headers.get('X-RateLimit-Reset') || headers.get('RateLimit-Reset');

        if (remaining) {
            service.rateLimitRemaining = parseInt(remaining);
        } else if (service.rateLimitRemaining > 0) {
            service.rateLimitRemaining--;
        }

        if (reset) {
            service.rateLimitReset = parseInt(reset) * 1000; // Convert to milliseconds
        }
    }

    getRateLimitStatus(serviceId) {
        const service = this.services.get(serviceId);
        if (!service) return null;

        return {
            remaining: service.rateLimitRemaining,
            reset: service.rateLimitReset,
            limit: service.rateLimit?.requests || Infinity
        };
    }

    // Health Monitoring
    setupHealthMonitoring() {
        if (!this.config.enableHealthChecks) return;

        setInterval(async () => {
            await this.performHealthChecks();
        }, this.config.healthCheckInterval);
    }

    async performHealthChecks() {
        const healthPromises = Array.from(this.services.keys()).map(async (serviceId) => {
            try {
                const isHealthy = await this.checkServiceHealth(serviceId);
                this.healthStatus.set(serviceId, {
                    healthy: isHealthy,
                    lastCheck: Date.now(),
                    consecutiveFailures: isHealthy ? 0 : (this.healthStatus.get(serviceId)?.consecutiveFailures || 0) + 1
                });
            } catch (error) {
                console.error(`Health check failed for ${serviceId}:`, error);
                this.healthStatus.set(serviceId, {
                    healthy: false,
                    lastCheck: Date.now(),
                    consecutiveFailures: (this.healthStatus.get(serviceId)?.consecutiveFailures || 0) + 1,
                    error: error.message
                });
            }
        });

        await Promise.all(healthPromises);
        this.emit('health_check_completed', { status: this.getOverallHealth() });
    }

    async checkServiceHealth(serviceId) {
        const service = this.services.get(serviceId);
        if (!service || !service.connected) return false;

        return await this.testConnection(serviceId);
    }

    getServiceHealth(serviceId) {
        return this.healthStatus.get(serviceId) || { healthy: false, lastCheck: null };
    }

    getOverallHealth() {
        const statuses = Array.from(this.healthStatus.values());
        const healthy = statuses.filter(s => s.healthy).length;
        const total = statuses.length;
        
        return {
            healthy,
            total,
            percentage: total > 0 ? (healthy / total) * 100 : 0,
            services: Object.fromEntries(this.healthStatus)
        };
    }

    // Credential Management
    async storeCredentials(serviceId, credentials) {
        if (this.config.encryptCredentials) {
            credentials = await this.encryptCredentials(credentials);
        }
        
        this.credentials.set(serviceId, credentials);
        
        // Persist to secure storage
        this.saveCredentials();
    }

    async encryptCredentials(credentials) {
        // Simple encryption - in production, use proper encryption
        const encrypted = {};
        
        for (const [key, value] of Object.entries(credentials)) {
            encrypted[key] = btoa(value);
        }
        
        return encrypted;
    }

    async decryptCredentials(encryptedCredentials) {
        // Simple decryption - in production, use proper decryption
        const decrypted = {};
        
        for (const [key, value] of Object.entries(encryptedCredentials)) {
            decrypted[key] = atob(value);
        }
        
        return decrypted;
    }

    saveCredentials() {
        const credentialsData = Object.fromEntries(this.credentials);
        localStorage.setItem('koha_service_credentials', JSON.stringify(credentialsData));
    }

    async loadCredentials() {
        try {
            const saved = localStorage.getItem('koha_service_credentials');
            if (saved) {
                const credentialsData = JSON.parse(saved);
                
                for (const [serviceId, credentials] of Object.entries(credentialsData)) {
                    let decrypted = credentials;
                    
                    if (this.config.encryptCredentials) {
                        decrypted = await this.decryptCredentials(credentials);
                    }
                    
                    this.credentials.set(serviceId, decrypted);
                }
            }
        } catch (error) {
            console.error('Failed to load credentials:', error);
        }
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

    // Public API
    getService(serviceId) {
        return this.services.get(serviceId);
    }

    getConnector(serviceId) {
        return this.connectors.get(serviceId);
    }

    getAllServices() {
        return Array.from(this.services.values());
    }

    getConnectedServices() {
        return Array.from(this.services.values()).filter(s => s.connected);
    }

    getHealth() {
        return this.getOverallHealth();
    }

    async connect(serviceId, credentials) {
        const connector = this.connectors.get(serviceId);
        if (!connector) {
            throw new Error(`Connector for ${serviceId} not found`);
        }
        
        return await connector.connect(credentials);
    }

    async disconnect(serviceId) {
        const connector = this.connectors.get(serviceId);
        if (!connector) {
            throw new Error(`Connector for ${serviceId} not found`);
        }
        
        return await connector.disconnect();
    }

    async call(serviceId, endpoint, params, options) {
        const connector = this.connectors.get(serviceId);
        if (!connector) {
            throw new Error(`Connector for ${serviceId} not found`);
        }
        
        return await connector.call(endpoint, params, options);
    }

    clearCache() {
        this.cache.clear();
    }

    destroy() {
        this.services.clear();
        this.connectors.clear();
        this.credentials.clear();
        this.cache.clear();
        this.healthStatus.clear();
        this.eventListeners.clear();
        
        console.log('Service Integrator destroyed');
    }
}

// Initialize service integrator
document.addEventListener('DOMContentLoaded', () => {
    window.ServiceIntegrator = new ServiceIntegrator();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceIntegrator;
}
