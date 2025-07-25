# Koha SHAD CN API Documentation

## Overview
The Koha SHAD CN design system provides a comprehensive API for building modern, accessible, and performant library management interfaces. This documentation covers all available APIs, components, and integration patterns.

## Table of Contents
- [Core API](#core-api)
- [Component API](#component-api)
- [Plugin API](#plugin-api)
- [Service Integration API](#service-integration-api)
- [Performance API](#performance-api)
- [Authentication API](#authentication-api)
- [Developer Tools](#developer-tools)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)

## Core API

### SHAD CN Core
The main SHAD CN object provides access to all system functionality.

```javascript
// Initialize SHAD CN
const shadcn = new SHADCN({
    theme: 'light', // 'light' | 'dark' | 'auto'
    accessibility: true,
    performance: true,
    plugins: true
});
```

#### Configuration Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | 'auto' | Theme mode: 'light', 'dark', or 'auto' |
| `accessibility` | boolean | true | Enable accessibility features |
| `performance` | boolean | true | Enable performance optimizations |
| `plugins` | boolean | true | Enable plugin system |
| `debug` | boolean | false | Enable debug mode |

#### Core Methods

##### `shadcn.init()`
Initialize the SHAD CN system.

```javascript
await shadcn.init();
```

##### `shadcn.createComponent(type, props)`
Create a new component instance.

```javascript
const button = shadcn.createComponent('button', {
    variant: 'primary',
    size: 'md',
    text: 'Click Me'
});
```

##### `shadcn.render(component, container)`
Render a component to the DOM.

```javascript
shadcn.render(button, document.getElementById('button-container'));
```

##### `shadcn.setTheme(theme)`
Change the current theme.

```javascript
shadcn.setTheme('dark');
```

##### `shadcn.getTheme()`
Get the current theme.

```javascript
const currentTheme = shadcn.getTheme(); // 'light' | 'dark'
```

## Component API

### Button Component

#### Basic Usage
```javascript
const button = shadcn.createComponent('button', {
    variant: 'primary',
    size: 'md',
    text: 'Submit',
    onClick: () => console.log('Button clicked')
});
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | 'default' | Button style: 'default', 'primary', 'secondary', 'destructive', 'ghost', 'link' |
| `size` | string | 'md' | Button size: 'xs', 'sm', 'md', 'lg', 'xl' |
| `text` | string | '' | Button text content |
| `icon` | string | null | Icon name (Feather icons) |
| `loading` | boolean | false | Show loading state |
| `disabled` | boolean | false | Disable button |
| `onClick` | function | null | Click event handler |

#### Template Toolkit Usage
```perl
[% shadcn_button(
    text = "Submit Form",
    variant = "primary",
    size = "lg",
    icon = "send",
    type = "submit"
) %]
```

### Input Component

#### Basic Usage
```javascript
const input = shadcn.createComponent('input', {
    type: 'text',
    placeholder: 'Enter your name',
    value: '',
    onChange: (value) => console.log('Input changed:', value)
});
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'text' | Input type: 'text', 'password', 'email', 'number', 'tel', 'url' |
| `placeholder` | string | '' | Placeholder text |
| `value` | string | '' | Input value |
| `label` | string | '' | Input label |
| `description` | string | '' | Help text |
| `error` | string | '' | Error message |
| `required` | boolean | false | Required field |
| `disabled` | boolean | false | Disable input |
| `onChange` | function | null | Change event handler |

#### Template Toolkit Usage
```perl
[% shadcn_input(
    label = "Full Name",
    type = "text",
    placeholder = "Enter your full name",
    required = 1,
    description = "This will be displayed on your library card"
) %]
```

### Card Component

#### Basic Usage
```javascript
const card = shadcn.createComponent('card', {
    title: 'Book Details',
    content: 'This is the card content',
    actions: [
        { text: 'Edit', onClick: () => console.log('Edit clicked') },
        { text: 'Delete', variant: 'destructive', onClick: () => console.log('Delete clicked') }
    ]
});
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | '' | Card title |
| `subtitle` | string | '' | Card subtitle |
| `content` | string/element | '' | Card content |
| `image` | string | '' | Card image URL |
| `actions` | array | [] | Action buttons |
| `variant` | string | 'default' | Card style: 'default', 'glass', 'neumorphic' |

#### Template Toolkit Usage
```perl
[% shadcn_card(
    title = "New Arrivals",
    subtitle = "Latest books in the collection",
    content = card_content,
    variant = "glass"
) %]
```

### Table Component

#### Basic Usage
```javascript
const table = shadcn.createComponent('table', {
    columns: [
        { key: 'title', label: 'Title', sortable: true },
        { key: 'author', label: 'Author', sortable: true },
        { key: 'isbn', label: 'ISBN' },
        { key: 'status', label: 'Status', type: 'badge' }
    ],
    data: [
        { title: 'Book 1', author: 'Author 1', isbn: '123456789', status: 'Available' },
        { title: 'Book 2', author: 'Author 2', isbn: '987654321', status: 'Checked Out' }
    ],
    searchable: true,
    paginated: true,
    selectable: true
});
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | array | [] | Column definitions |
| `data` | array | [] | Table data |
| `searchable` | boolean | false | Enable search |
| `sortable` | boolean | false | Enable sorting |
| `paginated` | boolean | false | Enable pagination |
| `selectable` | boolean | false | Enable row selection |
| `pageSize` | number | 10 | Items per page |

#### Template Toolkit Usage
```perl
[% shadcn_table(
    columns = table_columns,
    data = table_data,
    searchable = 1,
    sortable = 1,
    paginated = 1
) %]
```

### Modal Component

#### Basic Usage
```javascript
const modal = shadcn.createComponent('modal', {
    title: 'Confirm Delete',
    content: 'Are you sure you want to delete this item?',
    actions: [
        { text: 'Cancel', variant: 'outline', onClick: () => modal.close() },
        { text: 'Delete', variant: 'destructive', onClick: () => handleDelete() }
    ]
});

modal.open();
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | '' | Modal title |
| `content` | string/element | '' | Modal content |
| `actions` | array | [] | Action buttons |
| `size` | string | 'md' | Modal size: 'xs', 'sm', 'md', 'lg', 'xl', 'full' |
| `closable` | boolean | true | Allow closing |
| `overlay` | boolean | true | Show overlay |

#### Template Toolkit Usage
```perl
[% shadcn_modal(
    id = "delete-modal",
    title = "Confirm Delete",
    content = "Are you sure you want to delete this item?",
    size = "sm"
) %]
```

## Plugin API

### Plugin Development

#### Basic Plugin Structure
```javascript
class MyPlugin {
    constructor(api) {
        this.api = api;
        this.name = 'My Plugin';
        this.version = '1.0.0';
    }

    async init() {
        // Initialize plugin
        this.api.log('Plugin initialized');
        
        // Register hooks
        this.api.registerHook('before_page_load', this.onBeforePageLoad.bind(this));
        
        // Register components
        this.api.registerComponent('my-component', this.createMyComponent.bind(this));
    }

    async onBeforePageLoad(data) {
        // Handle page load
        this.api.log('Page loading:', data.url);
        return data;
    }

    createMyComponent(props) {
        const element = this.api.createElement('div', {
            class: 'my-component',
            'data-plugin': this.api.getId()
        });
        
        element.textContent = 'Hello from my plugin!';
        return element;
    }

    async destroy() {
        // Cleanup plugin
        this.api.log('Plugin destroyed');
    }
}
```

#### Plugin Registration
```javascript
// Register plugin
const plugin = await window.PluginArchitecture.install({
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    author: 'Your Name',
    description: 'A sample plugin',
    main: MyPlugin,
    permissions: ['dom_access', 'storage_access']
});
```

#### Plugin API Methods

##### `api.getId()`
Get the plugin ID.

```javascript
const pluginId = this.api.getId();
```

##### `api.registerHook(hookName, callback, priority)`
Register a hook callback.

```javascript
this.api.registerHook('before_form_submit', (data) => {
    // Process form data
    return data;
}, 10);
```

##### `api.registerComponent(name, factory)`
Register a custom component.

```javascript
this.api.registerComponent('my-widget', (props) => {
    return this.createWidget(props);
});
```

##### `api.emit(event, data)`
Emit a custom event.

```javascript
this.api.emit('plugin_event', { message: 'Hello World' });
```

##### `api.getStorage()` / `api.setStorage(key, value)`
Access plugin storage.

```javascript
const settings = this.api.getStorage();
this.api.setStorage('setting1', 'value1');
```

## Service Integration API

### Service Connection

#### Basic Usage
```javascript
const integrator = window.ServiceIntegrator;

// Connect to OCLC WorldCat
await integrator.connect('oclc_worldcat', {
    apiKey: 'your-api-key'
});

// Make API call
const searchResults = await integrator.call('oclc_worldcat', 'search', {
    query: 'title:javascript',
    format: 'json'
});
```

#### Available Services
- `oclc_worldcat` - OCLC WorldCat
- `exlibris_alma` - Ex Libris Alma
- `hathitrust` - HathiTrust Digital Library
- `dpla` - Digital Public Library of America
- `crossref` - CrossRef
- `loc` - Library of Congress
- `aws_s3` - Amazon S3
- `google_cloud_storage` - Google Cloud Storage
- `azure_blob` - Azure Blob Storage

#### Service Methods

##### `integrator.connect(serviceId, credentials)`
Connect to a service.

```javascript
await integrator.connect('oclc_worldcat', {
    apiKey: 'your-api-key'
});
```

##### `integrator.call(serviceId, endpoint, params, options)`
Make a service API call.

```javascript
const results = await integrator.call('crossref', 'works', {
    query: 'machine learning',
    rows: 10
});
```

##### `integrator.upload(serviceId, endpoint, file, options)`
Upload a file to a service.

```javascript
const result = await integrator.upload('aws_s3', 'bucket/path', file, {
    metadata: { type: 'document' }
});
```

##### `integrator.download(serviceId, endpoint, options)`
Download a file from a service.

```javascript
const blob = await integrator.download('aws_s3', 'bucket/file.pdf');
```

## Performance API

### Performance Monitoring

#### Basic Usage
```javascript
const optimizer = window.PerformanceOptimizer;

// Get performance metrics
const metrics = optimizer.getMetrics();
console.log('Core Web Vitals:', metrics);

// Preload resources
optimizer.preload('/path/to/resource.js');

// Optimize components
optimizer.optimize();
```

#### Performance Methods

##### `optimizer.getMetrics()`
Get current performance metrics.

```javascript
const metrics = optimizer.getMetrics();
// { pageLoad: 1234, domReady: 567, largestContentfulPaint: 890, ... }
```

##### `optimizer.preload(url)`
Preload a resource.

```javascript
optimizer.preload('/js/critical-component.js');
```

##### `optimizer.loadModuleAsync(name)`
Load a module asynchronously.

```javascript
const module = await optimizer.loadModuleAsync('advanced-charts');
```

##### `optimizer.clearCache()`
Clear performance cache.

```javascript
optimizer.clearCache();
```

## Authentication API

### User Authentication

#### Login
```javascript
const auth = window.AuthManager;

// Login with credentials
const user = await auth.login({
    username: 'user@example.com',
    password: 'password123'
});

// Login with external provider
const user = await auth.loginWithProvider('google');
```

#### User Management
```javascript
// Get current user
const user = auth.getCurrentUser();

// Check permissions
const canEdit = auth.hasPermission('edit_catalog');

// Get user preferences
const preferences = auth.getUserPreferences();
```

## Developer Tools

### Debug Mode

#### Enable Debug Mode
```javascript
shadcn.setDebugMode(true);
```

#### Debug Methods
```javascript
// Log component tree
shadcn.debug.logComponentTree();

// Log performance metrics
shadcn.debug.logPerformanceMetrics();

// Log plugin status
shadcn.debug.logPluginStatus();
```

### Testing Framework

#### Component Testing
```javascript
const { ComponentTester } = require('@koha/shadcn-testing');

const tester = new ComponentTester();

// Test button component
const button = tester.createComponent('button', {
    text: 'Test Button',
    variant: 'primary'
});

// Simulate click
tester.click(button);

// Assert state
tester.expect(button.classList.contains('clicked')).toBe(true);
```

#### Performance Testing
```javascript
const { PerformanceTester } = require('@koha/shadcn-testing');

const tester = new PerformanceTester();

// Test component render time
const renderTime = await tester.measureRenderTime('table', tableProps);
tester.expect(renderTime).toBeLessThan(100); // 100ms
```

## Code Examples

### Complete Form Example
```javascript
// Create a complete form with validation
const form = shadcn.createComponent('form', {
    fields: [
        {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true,
            validation: {
                minLength: 3,
                maxLength: 100
            }
        },
        {
            name: 'author',
            label: 'Author',
            type: 'text',
            required: true
        },
        {
            name: 'isbn',
            label: 'ISBN',
            type: 'text',
            validation: {
                pattern: /^[0-9]{13}$/,
                message: 'ISBN must be 13 digits'
            }
        },
        {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: [
                { value: 'fiction', label: 'Fiction' },
                { value: 'non-fiction', label: 'Non-Fiction' },
                { value: 'reference', label: 'Reference' }
            ]
        }
    ],
    onSubmit: async (data) => {
        console.log('Form submitted:', data);
        
        // Save to API
        const result = await api.saveBook(data);
        
        if (result.success) {
            shadcn.showNotification('Book saved successfully!', 'success');
        } else {
            shadcn.showNotification('Error saving book', 'error');
        }
    }
});
```

### Dashboard Widget Example
```javascript
// Create a dashboard widget
const widget = shadcn.createComponent('widget', {
    title: 'Library Statistics',
    size: 'large',
    content: [
        {
            type: 'stat',
            label: 'Total Books',
            value: '12,543',
            trend: '+5.2%',
            trendType: 'positive'
        },
        {
            type: 'chart',
            chartType: 'line',
            data: monthlyCheckouts,
            title: 'Monthly Checkouts'
        }
    ],
    actions: [
        { text: 'View Details', onClick: () => navigateToDetails() },
        { text: 'Export Data', onClick: () => exportData() }
    ]
});
```

### Plugin Development Example
```javascript
// Advanced plugin with service integration
class LibraryAnalyticsPlugin {
    constructor(api) {
        this.api = api;
        this.name = 'Library Analytics';
        this.version = '1.0.0';
        this.service = null;
    }

    async init() {
        // Connect to analytics service
        this.service = window.ServiceIntegrator;
        await this.service.connect('google_analytics', {
            trackingId: 'UA-XXXXXXXX-X'
        });

        // Register hooks
        this.api.registerHook('after_page_load', this.trackPageView.bind(this));
        this.api.registerHook('after_form_submit', this.trackFormSubmit.bind(this));

        // Register components
        this.api.registerComponent('analytics-widget', this.createAnalyticsWidget.bind(this));
    }

    async trackPageView(data) {
        await this.service.call('google_analytics', 'pageview', {
            page: data.url,
            title: data.title
        });
        return data;
    }

    async trackFormSubmit(data) {
        await this.service.call('google_analytics', 'event', {
            category: 'Form',
            action: 'Submit',
            label: data.formName
        });
        return data;
    }

    createAnalyticsWidget(props) {
        const widget = this.api.createElement('div', {
            class: 'analytics-widget'
        });

        // Add analytics dashboard
        widget.innerHTML = `
            <h3>Library Analytics</h3>
            <div class="analytics-content">
                <div class="metric">
                    <label>Page Views</label>
                    <span class="value">${props.pageViews}</span>
                </div>
                <div class="metric">
                    <label>Active Users</label>
                    <span class="value">${props.activeUsers}</span>
                </div>
            </div>
        `;

        return widget;
    }
}
```

## Best Practices

### Performance Best Practices

1. **Lazy Loading**: Use lazy loading for non-critical components
   ```javascript
   const LazyComponent = shadcn.lazy(() => import('./HeavyComponent'));
   ```

2. **Memoization**: Cache expensive computations
   ```javascript
   const memoizedResults = shadcn.memo(expensiveFunction, [dependencies]);
   ```

3. **Virtual Scrolling**: Use for large lists
   ```javascript
   const virtualList = shadcn.createComponent('virtual-list', {
     items: largeDataset,
     itemHeight: 50,
     visibleItems: 20
   });
   ```

### Accessibility Best Practices

1. **ARIA Labels**: Always provide ARIA labels
   ```javascript
   const button = shadcn.createComponent('button', {
     text: 'Delete',
     ariaLabel: 'Delete item from cart'
   });
   ```

2. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
   ```javascript
   const menu = shadcn.createComponent('menu', {
     items: menuItems,
     keyboardNavigation: true
   });
   ```

3. **Focus Management**: Manage focus properly
   ```javascript
   modal.on('open', () => {
     modal.focusFirstElement();
   });
   ```

### Security Best Practices

1. **Input Sanitization**: Always sanitize user input
   ```javascript
   const sanitizedInput = shadcn.sanitize(userInput);
   ```

2. **CSP Headers**: Use Content Security Policy
   ```javascript
   shadcn.setCSPPolicy({
     'default-src': "'self'",
     'script-src': "'self' 'unsafe-inline'",
     'style-src': "'self' 'unsafe-inline'"
   });
   ```

3. **Plugin Sandboxing**: Enable plugin sandboxing
   ```javascript
   const pluginManager = new PluginManager({
     sandboxEnabled: true,
     maxExecutionTime: 5000
   });
   ```

## Migration Guide

### Migrating from Legacy Koha Templates

#### Step 1: Identify Components
```bash
# Use migration tool to analyze existing templates
./migrate-templates.sh analyze /path/to/templates
```

#### Step 2: Convert Templates
```bash
# Convert templates to SHAD CN
./migrate-templates.sh convert /path/to/templates
```

#### Step 3: Update JavaScript
```javascript
// Replace legacy jQuery with SHAD CN
// Old:
$('#myButton').click(function() {
    // handler
});

// New:
const button = shadcn.getElementById('myButton');
button.on('click', () => {
    // handler
});
```

#### Step 4: Update Styles
```css
/* Replace legacy styles with SHAD CN classes */
/* Old: */
.btn-primary {
    background-color: #007bff;
}

/* New: */
.btn-primary {
    @apply bg-primary text-primary-foreground;
}
```

### Version Compatibility

#### v1.0.0 → v2.0.0
- Component prop names changed from camelCase to kebab-case
- Event handling updated to use native events
- Plugin API updated with new security model

#### Breaking Changes
```javascript
// v1.0.0
const button = shadcn.createComponent('button', {
    onClick: handler,
    backgroundColor: 'blue'
});

// v2.0.0
const button = shadcn.createComponent('button', {
    'on-click': handler,
    'background-color': 'blue'
});
```

## API Reference Summary

### Core Classes
- `SHADCN` - Main system class
- `ComponentFactory` - Component creation
- `ThemeManager` - Theme handling
- `PluginArchitecture` - Plugin system
- `ServiceIntegrator` - External service integration
- `PerformanceOptimizer` - Performance management

### Event Types
- `component_created` - Component creation
- `component_rendered` - Component rendering
- `theme_changed` - Theme updates
- `plugin_loaded` - Plugin loading
- `service_connected` - Service connection
- `performance_metric` - Performance data

### Error Handling
All API methods return promises and should be wrapped in try-catch blocks:

```javascript
try {
    const result = await shadcn.createComponent('button', props);
} catch (error) {
    console.error('Component creation failed:', error);
}
```

---

**Documentation Version**: 1.0.0  
**Last Updated**: July 18, 2025  
**License**: MIT  
**Support**: [GitHub Issues](https://github.com/koha-community/shadcn/issues)
