# Koha SHAD CN Modernization - Deployment & Usage Guide
## Complete Guide for Installing, Deploying, and Using the Modern Koha Interface

> **Note**: This guide is for the Koha SHAD CN Modernization project located at `/workspaces/codespaces-blank/Koha`. This is a complete modernization of the Koha library management system interface using SHAD CN components, completed across 5 development phases with over 12,000 lines of code and 50+ modern components.

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Deployment Options](#deployment-options)
4. [Configuration](#configuration)
5. [Component Usage](#component-usage)
6. [Plugin Development](#plugin-development)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)
9. [Performance Optimization](#performance-optimization)
10. [Maintenance](#maintenance)

---

## Prerequisites

### System Requirements

#### Minimum Requirements
- **Operating System**: Linux (Ubuntu 20.04+, CentOS 8+, Debian 11+)
- **Web Server**: Apache 2.4+ or Nginx 1.18+
- **Database**: MySQL 8.0+ or PostgreSQL 13+
- **PHP**: 7.4+ (for existing Koha backend)
- **Node.js**: 16.x or higher
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 10GB free space minimum

#### Recommended Requirements
- **CPU**: 4+ cores
- **Memory**: 16GB RAM
- **Storage**: 50GB+ SSD storage
- **Network**: High-speed internet connection

### Software Dependencies

#### Required Software
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y curl wget git build-essential

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install additional tools
sudo npm install -g pm2 nginx
```

#### Optional Tools
- **Docker**: For containerized deployment
- **Redis**: For caching and session management
- **Elasticsearch**: For advanced search capabilities

---

## Installation

### Option 1: Fresh Installation

#### Step 1: Download the Project
```bash
# Clone this repository
git clone https://github.com/codespaces-blank/koha-shadcn-modernization.git
cd koha-shadcn-modernization

# Or download from this project
# (Use the current project files from /workspaces/codespaces-blank/Koha)
cp -r /workspaces/codespaces-blank/Koha ./koha-shadcn-modernization
cd koha-shadcn-modernization
```

#### Step 2: Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install development dependencies (optional)
npm install --only=dev
```

#### Step 3: Build the Project
```bash
# Build for production
npm run build:prod

# Or build for development
npm run build
```

#### Step 4: Verify Installation
```bash
# Run tests
npm test

# Check component showcase
open demo-components.html
```

### Option 2: Upgrade Existing Koha Installation

#### Step 1: Backup Existing Installation
```bash
# Create backup directory
sudo mkdir -p /backup/koha-$(date +%Y%m%d)

# Backup templates
sudo cp -r /usr/share/koha/intranet/htdocs/intranet-tmpl /backup/koha-$(date +%Y%m%d)/

# Backup configuration
sudo cp /etc/koha/sites/library/koha-conf.xml /backup/koha-$(date +%Y%m%d)/
```

#### Step 2: Install SHAD CN Components
```bash
# Navigate to Koha installation directory
cd /usr/share/koha/intranet/htdocs

# Copy SHAD CN files from our project
sudo cp -r /workspaces/codespaces-blank/Koha/koha-tmpl/* ./intranet-tmpl/

# Set proper permissions
sudo chown -R koha:koha ./intranet-tmpl/
sudo chmod -R 755 ./intranet-tmpl/
```

#### Step 3: Update Template Includes
```bash
# Run the migration script from our project
sudo /workspaces/codespaces-blank/Koha/migrate-templates.sh

# Or manually update includes
sudo nano /usr/share/koha/intranet/htdocs/intranet-tmpl/prog/en/includes/doc-head-close.inc
```

Add these lines to your template head:
```html
<!-- SHAD CN Modernization -->
<link rel="stylesheet" href="/intranet-tmpl/prog/en/includes/shadcn-styles.css">
<script src="/intranet-tmpl/prog/en/includes/shadcn-components.js"></script>
<script src="/intranet-tmpl/prog/en/includes/plugin-architecture.js"></script>
<script src="/intranet-tmpl/prog/en/includes/developer-tools.js"></script>
```

---

## Deployment Options

### Option 1: Traditional Web Server Deployment

#### Apache Configuration
```apache
# /etc/apache2/sites-available/koha-shadcn.conf
<VirtualHost *:80>
    ServerName koha.library.org
    DocumentRoot /usr/share/koha/intranet/htdocs
    
    # Enable compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Cache static assets
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    
    ErrorLog ${APACHE_LOG_DIR}/koha_error.log
    CustomLog ${APACHE_LOG_DIR}/koha_access.log combined
</VirtualHost>
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/koha-shadcn
server {
    listen 80;
    server_name koha.library.org;
    root /usr/share/koha/intranet/htdocs;
    index index.html index.htm;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/json application/xml+rss;
    
    # Static asset caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    
    # Main location
    location / {
        try_files $uri $uri/ =404;
    }
    
    # API proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  koha-web:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    environment:
      - NODE_ENV=production
    depends_on:
      - koha-db
      - redis
  
  koha-db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secure_password
      MYSQL_DATABASE: koha
      MYSQL_USER: koha
      MYSQL_PASSWORD: koha_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

#### Deploy with Docker
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale web services
docker-compose up -d --scale koha-web=3
```

### Option 3: Cloud Deployment

#### Cloud Deployment

#### AWS Deployment
```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Deploy this project to AWS
npm run deploy:aws
```

#### Google Cloud Deployment
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Deploy this project to Google Cloud
gcloud app deploy
```

---

## Configuration

### Environment Configuration

#### Production Configuration
```javascript
// config/production.js
module.exports = {
  environment: 'production',
  api: {
    baseUrl: 'https://api.koha.library.org',
    timeout: 30000,
    retries: 3
  },
  cache: {
    type: 'redis',
    host: 'localhost',
    port: 6379,
    ttl: 3600
  },
  security: {
    corsOrigins: ['https://koha.library.org'],
    csrfProtection: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  logging: {
    level: 'info',
    format: 'json',
    destination: '/var/log/koha/application.log'
  }
};
```

#### Development Configuration
```javascript
// config/development.js
module.exports = {
  environment: 'development',
  api: {
    baseUrl: 'http://localhost:8001',
    timeout: 10000
  },
  cache: {
    type: 'memory',
    ttl: 300
  },
  security: {
    corsOrigins: ['http://localhost:3000'],
    csrfProtection: false
  },
  logging: {
    level: 'debug',
    format: 'pretty'
  },
  devTools: {
    enabled: true,
    hotReload: true
  }
};
```

### Theme Configuration

#### Custom Theme Setup
```css
/* themes/library-theme.css */
:root {
  /* Primary colors */
  --primary: 28 100% 35%;        /* Library blue */
  --primary-foreground: 0 0% 98%;
  
  /* Secondary colors */
  --secondary: 210 40% 96%;      /* Light gray */
  --secondary-foreground: 222 47% 11%;
  
  /* Accent colors */
  --accent: 43 100% 45%;         /* Library gold */
  --accent-foreground: 222 47% 11%;
  
  /* Custom library colors */
  --library-red: 0 84% 60%;      /* For urgent alerts */
  --library-green: 142 76% 36%;  /* For success states */
  --library-blue: 221 83% 53%;   /* For information */
}

/* Custom component styling */
.library-header {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  color: hsl(var(--primary-foreground));
}

.patron-card {
  border-left: 4px solid hsl(var(--accent));
}
```

#### Apply Custom Theme
```javascript
// Initialize with custom theme
document.addEventListener('DOMContentLoaded', function() {
  // Load custom theme
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/themes/library-theme.css';
  document.head.appendChild(link);
  
  // Initialize SHAD CN components
  if (window.ShadCNComponents) {
    window.ShadCNComponents.init({
      theme: 'library-theme'
    });
  }
});
```

---

## Component Usage

### Basic Component Usage

#### Using Buttons
```html
<!-- HTML Template -->
<div id="button-container"></div>

<script>
// JavaScript Usage
const buttonContainer = document.getElementById('button-container');

// Create primary button
const primaryButton = new ShadCNComponents.Button({
  text: 'Add New Patron',
  variant: 'primary',
  size: 'medium',
  icon: 'plus',
  onClick: function() {
    console.log('Adding new patron...');
    // Your patron creation logic here
  }
});

primaryButton.appendTo(buttonContainer);

// Create secondary button
const secondaryButton = new ShadCNComponents.Button({
  text: 'Cancel',
  variant: 'secondary',
  size: 'medium',
  onClick: function() {
    console.log('Operation cancelled');
  }
});

secondaryButton.appendTo(buttonContainer);
</script>
```

#### Using Form Components
```html
<!-- Patron Registration Form -->
<div id="patron-form"></div>

<script>
// Create form container
const formContainer = document.getElementById('patron-form');

// Name input
const nameInput = new ShadCNComponents.Input({
  label: 'Full Name',
  placeholder: 'Enter patron full name',
  required: true,
  validation: {
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/
  }
});

// Email input
const emailInput = new ShadCNComponents.Input({
  label: 'Email Address',
  type: 'email',
  placeholder: 'patron@example.com',
  required: true
});

// Library card type select
const cardTypeSelect = new ShadCNComponents.Select({
  label: 'Card Type',
  options: [
    { value: 'adult', label: 'Adult' },
    { value: 'student', label: 'Student' },
    { value: 'senior', label: 'Senior' },
    { value: 'child', label: 'Child' }
  ],
  required: true
});

// Append to form
nameInput.appendTo(formContainer);
emailInput.appendTo(formContainer);
cardTypeSelect.appendTo(formContainer);

// Form submission
const submitButton = new ShadCNComponents.Button({
  text: 'Register Patron',
  variant: 'primary',
  onClick: function() {
    const formData = {
      name: nameInput.getValue(),
      email: emailInput.getValue(),
      cardType: cardTypeSelect.getValue()
    };
    
    // Validate form
    if (nameInput.validate() && emailInput.validate() && cardTypeSelect.validate()) {
      console.log('Submitting patron data:', formData);
      // Submit to API
      registerPatron(formData);
    }
  }
});

submitButton.appendTo(formContainer);
</script>
```

#### Using Data Tables
```html
<!-- Patron List Table -->
<div id="patron-table"></div>

<script>
// Sample patron data
const patronData = [
  {
    id: '1001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    cardType: 'Adult',
    status: 'Active',
    joined: '2024-01-15'
  },
  {
    id: '1002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    cardType: 'Student',
    status: 'Active',
    joined: '2024-02-20'
  }
];

// Create data table
const patronTable = new ShadCNComponents.DataTable({
  columns: [
    { key: 'id', title: 'Card Number', sortable: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email' },
    { key: 'cardType', title: 'Type', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
    { key: 'joined', title: 'Join Date', sortable: true },
    {
      key: 'actions',
      title: 'Actions',
      render: function(row) {
        return `
          <button onclick="editPatron('${row.id}')" class="btn-sm btn-primary">Edit</button>
          <button onclick="viewPatron('${row.id}')" class="btn-sm btn-secondary">View</button>
        `;
      }
    }
  ],
  data: patronData,
  searchable: true,
  pagination: true,
  pageSize: 10
});

patronTable.appendTo(document.getElementById('patron-table'));

// Action handlers
function editPatron(patronId) {
  console.log('Editing patron:', patronId);
  // Open edit modal or navigate to edit page
}

function viewPatron(patronId) {
  console.log('Viewing patron:', patronId);
  // Show patron details
}
</script>
```

### Advanced Component Usage

#### Using Modals and Dialogs
```javascript
// Create confirmation dialog
const deleteConfirmDialog = new ShadCNComponents.Dialog({
  title: 'Confirm Deletion',
  content: 'Are you sure you want to delete this patron? This action cannot be undone.',
  actions: [
    {
      text: 'Cancel',
      variant: 'secondary',
      onClick: function(dialog) {
        dialog.close();
      }
    },
    {
      text: 'Delete',
      variant: 'destructive',
      onClick: function(dialog) {
        // Perform deletion
        deletePatron(patronId);
        dialog.close();
      }
    }
  ]
});

// Show dialog
function confirmDeletePatron(patronId) {
  deleteConfirmDialog.show();
}
```

#### Using Notifications
```javascript
// Success notification
function showSuccessMessage(message) {
  const notification = new ShadCNComponents.Notification({
    type: 'success',
    title: 'Success',
    message: message,
    duration: 5000,
    dismissible: true
  });
  
  notification.show();
}

// Error notification
function showErrorMessage(message) {
  const notification = new ShadCNComponents.Notification({
    type: 'error',
    title: 'Error',
    message: message,
    duration: 0, // Don't auto-dismiss
    dismissible: true
  });
  
  notification.show();
}

// Usage
showSuccessMessage('Patron registered successfully!');
showErrorMessage('Failed to connect to the server. Please try again.');
```

### Library-Specific Components

#### Circulation Dashboard
```javascript
// Create circulation dashboard
const circulationDashboard = new KohaComponents.CirculationDashboard({
  container: '#circulation-dashboard',
  data: {
    checkedOut: 1250,
    overdue: 45,
    holds: 320,
    returns: 95
  },
  onItemClick: function(item) {
    console.log('Dashboard item clicked:', item);
  }
});

circulationDashboard.render();
```

#### Catalog Search
```javascript
// Create catalog search interface
const catalogSearch = new KohaComponents.CatalogSearch({
  container: '#catalog-search',
  searchTypes: ['keyword', 'title', 'author', 'subject', 'isbn'],
  filters: ['format', 'location', 'availability'],
  onSearch: function(query, filters) {
    console.log('Searching:', query, filters);
    // Perform search API call
    performCatalogSearch(query, filters);
  }
});

catalogSearch.render();
```

---

## Plugin Development

### Creating a Simple Plugin

#### Plugin Structure
```
my-plugin/
├── plugin.js          # Main plugin file
├── manifest.json      # Plugin manifest
├── styles.css         # Plugin styles
├── templates/         # Plugin templates
│   └── settings.html
└── README.md          # Plugin documentation
```

#### Plugin Manifest
```json
{
  "name": "My Library Plugin",
  "version": "1.0.0",
  "description": "A sample plugin for library management",
  "author": "Library Developer",
  "main": "plugin.js",
  "permissions": [
    "patron.read",
    "catalog.read",
    "settings.write"
  ],
  "hooks": [
    "patron-created",
    "item-checked-out",
    "overdue-notice"
  ],
  "dependencies": {
    "koha-shadcn-modernization": "^1.0.0"
  },
  "koha": {
    "minVersion": "22.11.0"
  }
}
```

#### Plugin Implementation
```javascript
// plugin.js
class MyLibraryPlugin {
  constructor(api) {
    this.api = api;
    this.name = 'My Library Plugin';
    this.version = '1.0.0';
    this.settings = {};
  }
  
  async init() {
    this.api.log('Initializing My Library Plugin');
    
    // Load settings
    this.settings = await this.api.getSettings(this.name);
    
    // Register hooks
    this.api.registerHook('patron-created', this.onPatronCreated.bind(this));
    this.api.registerHook('item-checked-out', this.onItemCheckedOut.bind(this));
    
    // Register components
    this.api.registerComponent('patron-stats', this.createPatronStats.bind(this));
    
    // Add menu item
    this.api.addMenuItem({
      text: 'My Plugin',
      icon: 'plugin',
      path: '/plugins/my-plugin',
      permission: 'plugin.access'
    });
    
    this.api.log('My Library Plugin initialized successfully');
  }
  
  onPatronCreated(patron) {
    this.api.log('New patron created:', patron.name);
    
    // Send welcome email
    this.sendWelcomeEmail(patron);
    
    // Update statistics
    this.updatePatronStats();
  }
  
  onItemCheckedOut(checkout) {
    this.api.log('Item checked out:', checkout.item.title);
    
    // Track usage statistics
    this.trackItemUsage(checkout.item);
    
    // Send notifications if needed
    if (this.settings.sendCheckoutNotifications) {
      this.sendCheckoutNotification(checkout);
    }
  }
  
  createPatronStats(container, options) {
    const stats = new ShadCNComponents.Card({
      title: 'Patron Statistics',
      content: `
        <div class="stats-grid">
          <div class="stat-item">
            <h3>${options.totalPatrons}</h3>
            <p>Total Patrons</p>
          </div>
          <div class="stat-item">
            <h3>${options.newThisMonth}</h3>
            <p>New This Month</p>
          </div>
          <div class="stat-item">
            <h3>${options.activeToday}</h3>
            <p>Active Today</p>
          </div>
        </div>
      `
    });
    
    stats.appendTo(container);
    return stats;
  }
  
  sendWelcomeEmail(patron) {
    // Implementation for sending welcome email
    this.api.sendEmail({
      to: patron.email,
      subject: 'Welcome to the Library!',
      template: 'welcome',
      data: { patron }
    });
  }
  
  updatePatronStats() {
    // Update patron statistics
    this.api.updateStats('patron-count', 1);
  }
  
  trackItemUsage(item) {
    // Track item usage for analytics
    this.api.track('item-checkout', {
      itemId: item.id,
      title: item.title,
      category: item.category
    });
  }
  
  sendCheckoutNotification(checkout) {
    // Send checkout notification
    this.api.sendNotification({
      userId: checkout.patron.id,
      type: 'checkout',
      message: `You have checked out: ${checkout.item.title}`,
      dueDate: checkout.dueDate
    });
  }
  
  async getSettings() {
    return this.settings;
  }
  
  async updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    await this.api.saveSettings(this.name, this.settings);
  }
  
  destroy() {
    this.api.log('Destroying My Library Plugin');
    // Cleanup code here
  }
}

// Register plugin
if (typeof window !== 'undefined') {
  window.MyLibraryPlugin = MyLibraryPlugin;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MyLibraryPlugin;
}
```

#### Installing the Plugin
```javascript
// Install via plugin manager
const pluginManager = window.PluginManager;

// Install from URL
pluginManager.install('https://plugins.koha.org/my-plugin.zip')
  .then(() => {
    console.log('Plugin installed successfully');
  })
  .catch(error => {
    console.error('Plugin installation failed:', error);
  });

// Or install from local file
const fileInput = document.getElementById('plugin-file');
fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    pluginManager.installFromFile(file)
      .then(() => {
        console.log('Plugin installed from file');
      })
      .catch(error => {
        console.error('Installation failed:', error);
      });
  }
});
```

---

## Customization

### Customizing Components

#### Extending Existing Components
```javascript
// Extend the Button component
class LibraryButton extends ShadCNComponents.Button {
  constructor(props) {
    super(props);
    this.libraryId = props.libraryId;
  }
  
  createElement() {
    super.createElement();
    
    // Add library-specific attributes
    this.element.setAttribute('data-library-id', this.libraryId);
    
    // Add custom CSS classes
    this.element.classList.add('library-button');
    
    // Add accessibility improvements
    if (this.props.tooltip) {
      this.element.setAttribute('aria-describedby', `tooltip-${this.id}`);
      this.createTooltip();
    }
  }
  
  createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = `tooltip-${this.id}`;
    tooltip.className = 'library-tooltip';
    tooltip.textContent = this.props.tooltip;
    tooltip.setAttribute('role', 'tooltip');
    
    document.body.appendChild(tooltip);
    
    // Position tooltip on hover
    this.element.addEventListener('mouseenter', () => {
      this.showTooltip(tooltip);
    });
    
    this.element.addEventListener('mouseleave', () => {
      this.hideTooltip(tooltip);
    });
  }
  
  showTooltip(tooltip) {
    const rect = this.element.getBoundingClientRect();
    tooltip.style.display = 'block';
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
  }
  
  hideTooltip(tooltip) {
    tooltip.style.display = 'none';
  }
}

// Register custom component
ShadCNComponents.register('LibraryButton', LibraryButton);
```

#### Creating Custom Components
```javascript
// Create a custom patron card component
class PatronCard extends ShadCNComponents.Component {
  constructor(props) {
    super(props);
    this.patron = props.patron;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'patron-card';
    this.element.innerHTML = this.getTemplate();
    
    this.setupEventListeners();
    return this.element;
  }
  
  getTemplate() {
    const patron = this.patron;
    return `
      <div class="patron-card__header">
        <img src="${patron.photo || '/images/default-avatar.png'}" 
             alt="${patron.name}" class="patron-card__photo">
        <div class="patron-card__info">
          <h3 class="patron-card__name">${patron.name}</h3>
          <p class="patron-card__id">Card #${patron.cardNumber}</p>
        </div>
        <div class="patron-card__status ${patron.status.toLowerCase()}">
          ${patron.status}
        </div>
      </div>
      <div class="patron-card__details">
        <div class="detail-item">
          <label>Email:</label>
          <span>${patron.email}</span>
        </div>
        <div class="detail-item">
          <label>Phone:</label>
          <span>${patron.phone}</span>
        </div>
        <div class="detail-item">
          <label>Category:</label>
          <span>${patron.category}</span>
        </div>
        <div class="detail-item">
          <label>Expires:</label>
          <span>${this.formatDate(patron.expiryDate)}</span>
        </div>
      </div>
      <div class="patron-card__actions">
        <button class="btn btn-primary btn-sm" data-action="edit">Edit</button>
        <button class="btn btn-secondary btn-sm" data-action="view">View Details</button>
        <button class="btn btn-outline btn-sm" data-action="checkout">Quick Checkout</button>
      </div>
    `;
  }
  
  setupEventListeners() {
    this.element.addEventListener('click', (event) => {
      const action = event.target.getAttribute('data-action');
      if (action) {
        this.handleAction(action);
      }
    });
  }
  
  handleAction(action) {
    switch (action) {
      case 'edit':
        this.emit('edit', this.patron);
        break;
      case 'view':
        this.emit('view', this.patron);
        break;
      case 'checkout':
        this.emit('checkout', this.patron);
        break;
    }
  }
  
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  updatePatron(newPatronData) {
    this.patron = { ...this.patron, ...newPatronData };
    this.element.innerHTML = this.getTemplate();
    this.setupEventListeners();
  }
}

// Register the component
ShadCNComponents.register('PatronCard', PatronCard);
```

### Custom Styling

#### Library-Specific Styles
```css
/* library-custom.css */

/* Custom color scheme */
:root {
  --library-primary: #1e40af;
  --library-secondary: #6b7280;
  --library-accent: #f59e0b;
  --library-success: #10b981;
  --library-warning: #f59e0b;
  --library-error: #ef4444;
}

/* Custom patron card styling */
.patron-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.patron-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.patron-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.patron-card__photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.patron-card__info {
  flex: 1;
}

.patron-card__name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--library-primary);
}

.patron-card__id {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: var(--library-secondary);
}

.patron-card__status {
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.patron-card__status.active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--library-success);
}

.patron-card__status.expired {
  background: rgba(239, 68, 68, 0.1);
  color: var(--library-error);
}

.patron-card__details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  margin-bottom: 8px;
}

.detail-item label {
  font-weight: 500;
  min-width: 80px;
  color: var(--library-secondary);
}

.detail-item span {
  color: #374151;
}

.patron-card__actions {
  display: flex;
  gap: 8px;
}

/* Custom button variants */
.btn-library-primary {
  background: var(--library-primary);
  color: white;
  border: 1px solid var(--library-primary);
}

.btn-library-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

/* Responsive design */
@media (max-width: 768px) {
  .patron-card__header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .patron-card__actions {
    flex-direction: column;
  }
  
  .patron-card__actions button {
    width: 100%;
  }
}

/* Print styles */
@media print {
  .patron-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .patron-card__actions {
    display: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .patron-card {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .patron-card__name {
    color: #60a5fa;
  }
  
  .detail-item span {
    color: #d1d5db;
  }
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Components Not Loading
**Symptoms**: Components don't appear or JavaScript errors in console

**Solutions**:
1. Check if all required files are included:
```html
<!-- Verify these are in your template -->
<link rel="stylesheet" href="/intranet-tmpl/prog/en/includes/shadcn-styles.css">
<script src="/intranet-tmpl/prog/en/includes/shadcn-components.js"></script>
```

2. Check file permissions:
```bash
sudo chmod 644 /usr/share/koha/intranet/htdocs/intranet-tmpl/prog/en/includes/*.css
sudo chmod 644 /usr/share/koha/intranet/htdocs/intranet-tmpl/prog/en/includes/*.js
```

3. Clear browser cache and reload

#### Issue: Styling Not Applied
**Symptoms**: Components appear but without proper styling

**Solutions**:
1. Verify CSS file is loaded:
```javascript
// Check in browser console
console.log(document.querySelector('link[href*="shadcn-styles.css"]'));
```

2. Check for CSS conflicts:
```css
/* Add higher specificity if needed */
.koha-main .shadcn-button {
  /* Your styles */
}
```

3. Ensure proper CSS order:
```html
<!-- Load in correct order -->
<link rel="stylesheet" href="/path/to/koha-styles.css">
<link rel="stylesheet" href="/path/to/shadcn-styles.css">
```

#### Issue: Plugin Not Working
**Symptoms**: Plugin fails to load or function

**Solutions**:
1. Check plugin manifest:
```json
{
  "name": "Plugin Name",
  "version": "1.0.0",
  "main": "plugin.js",
  "permissions": ["required.permission"]
}
```

2. Verify plugin registration:
```javascript
// Check if plugin is registered
console.log(window.PluginManager.getInstalledPlugins());
```

3. Check console for errors:
```javascript
// Enable debug mode
window.DeveloperTools.debug(true);
```

#### Issue: Performance Problems
**Symptoms**: Slow loading or high memory usage

**Solutions**:
1. Enable production optimizations:
```javascript
// Use production build
npm run build:production
```

2. Implement lazy loading:
```javascript
// Lazy load components
const LazyComponent = () => import('./HeavyComponent');
```

3. Monitor performance:
```javascript
// Use performance monitoring
window.ProductionOptimizer.optimize();
```

### Debug Mode

#### Enable Debug Mode
```javascript
// Enable debug mode in console
window.DeveloperTools.debug(true);

// Or add to your page
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.hostname === 'localhost' || 
      window.location.search.includes('debug=true')) {
    window.DeveloperTools.debug(true);
  }
});
```

#### Debug Features
- **Component Inspector**: Click components to inspect
- **Performance Profiler**: Monitor component performance
- **Console Logging**: Detailed logging information
- **Error Tracking**: Comprehensive error reporting

#### Keyboard Shortcuts
- `Ctrl/Cmd + F12`: Toggle debug mode
- `Ctrl/Cmd + Shift + I`: Toggle inspector
- `Ctrl/Cmd + Shift + L`: Toggle console
- `Ctrl/Cmd + Shift + P`: Toggle profiler

---

## Performance Optimization

### Frontend Optimization

#### Bundle Optimization
```javascript
// webpack.config.js optimization
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};
```

#### Lazy Loading Implementation
```javascript
// Implement lazy loading for heavy components
class LazyComponentLoader {
  static async loadComponent(componentName) {
    const componentsMap = {
      'DataTable': () => import('./components/DataTable'),
      'Chart': () => import('./components/Chart'),
      'RichEditor': () => import('./components/RichEditor')
    };
    
    const componentLoader = componentsMap[componentName];
    if (componentLoader) {
      const module = await componentLoader();
      return module.default;
    }
    
    throw new Error(`Component ${componentName} not found`);
  }
}

// Usage
async function createDataTable(container, data) {
  const DataTable = await LazyComponentLoader.loadComponent('DataTable');
  const table = new DataTable({ data });
  table.appendTo(container);
}
```

#### Caching Strategy
```javascript
// Implement service worker for caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
    })
    .catch(error => {
      console.log('Service Worker registration failed:', error);
    });
}

// sw.js
const CACHE_NAME = 'koha-shadcn-v1';
const urlsToCache = [
  '/',
  '/intranet-tmpl/prog/en/includes/shadcn-styles.css',
  '/intranet-tmpl/prog/en/includes/shadcn-components.js',
  '/images/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
```

### Backend Optimization

#### Database Optimization
```sql
-- Optimize patron queries
CREATE INDEX idx_patron_cardnumber ON borrowers(cardnumber);
CREATE INDEX idx_patron_email ON borrowers(email);
CREATE INDEX idx_patron_category ON borrowers(categorycode);

-- Optimize circulation queries
CREATE INDEX idx_checkout_date ON issues(issuedate);
CREATE INDEX idx_return_date ON old_issues(returndate);
CREATE INDEX idx_due_date ON issues(date_due);
```

#### API Response Optimization
```javascript
// Implement response compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Implement request rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

### Monitoring and Analytics

#### Performance Monitoring
```javascript
// Implement performance monitoring
class PerformanceMonitor {
  static trackPageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        // Send to analytics
        this.sendMetrics({
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          totalPageLoad: perfData.loadEventEnd - perfData.fetchStart
        });
      }, 0);
    });
  }
  
  static trackComponentRender(componentName, renderTime) {
    this.sendMetrics({
      component: componentName,
      renderTime: renderTime,
      timestamp: Date.now()
    });
  }
  
  static sendMetrics(data) {
    // Send to your analytics service
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }
}

// Initialize monitoring
PerformanceMonitor.trackPageLoad();
```

---

## Maintenance

### Regular Maintenance Tasks

#### Daily Tasks
```bash
#!/bin/bash
# daily-maintenance.sh

# Check system health
echo "Checking system health..."
systemctl status apache2
systemctl status mysql

# Check disk space
df -h

# Check error logs
tail -n 100 /var/log/apache2/error.log

# Update component usage statistics
curl -X POST http://localhost/api/stats/update

echo "Daily maintenance completed"
```

#### Weekly Tasks
```bash
#!/bin/bash
# weekly-maintenance.sh

# Update dependencies
npm audit fix

# Clear old cache files
find /tmp -name "koha-cache-*" -mtime +7 -delete

# Backup configuration
cp -r /etc/koha /backup/koha-config-$(date +%Y%m%d)

# Generate performance report
node scripts/generate-performance-report.js

echo "Weekly maintenance completed"
```

#### Monthly Tasks
```bash
#!/bin/bash
# monthly-maintenance.sh

# Check for component updates
npm outdated

# Run security audit
npm audit

# Update documentation
npm run docs:generate

# Archive old logs
gzip /var/log/koha/*.log.1

echo "Monthly maintenance completed"
```

### Updating Components

#### Update Process
```bash
# 1. Backup current installation
sudo cp -r /usr/share/koha/intranet/htdocs/intranet-tmpl /backup/

# 2. Download latest version
wget https://github.com/koha-community/koha-shadcn/releases/latest/download/koha-shadcn.tar.gz

# 3. Extract and install
tar -xzf koha-shadcn.tar.gz
cd koha-shadcn

# 4. Run update script
sudo ./update.sh

# 5. Test installation
npm test

# 6. Restart services
sudo systemctl restart apache2
```

#### Version Management
```javascript
// Check current version
console.log('Current version:', ShadCNComponents.version);

// Check for updates
fetch('/api/version/latest')
  .then(response => response.json())
  .then(data => {
    if (data.version !== ShadCNComponents.version) {
      console.log('Update available:', data.version);
      // Show update notification
    }
  });
```

### Backup and Recovery

#### Backup Strategy
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/koha-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup templates
cp -r /usr/share/koha/intranet/htdocs/intranet-tmpl $BACKUP_DIR/

# Backup configuration
cp -r /etc/koha $BACKUP_DIR/

# Backup custom components
cp -r /usr/local/share/koha/custom $BACKUP_DIR/

# Create backup manifest
cat > $BACKUP_DIR/MANIFEST << EOF
Backup created: $(date)
Koha version: $(koha-version)
SHAD CN version: $(node -p "require('./package.json').version")
System: $(uname -a)
EOF

echo "Backup created: $BACKUP_DIR"
```

#### Recovery Process
```bash
#!/bin/bash
# restore.sh

BACKUP_DIR=$1

if [ -z "$BACKUP_DIR" ]; then
  echo "Usage: $0 <backup_directory>"
  exit 1
fi

# Stop services
sudo systemctl stop apache2

# Restore templates
sudo cp -r $BACKUP_DIR/intranet-tmpl /usr/share/koha/intranet/htdocs/

# Restore configuration
sudo cp -r $BACKUP_DIR/koha /etc/

# Set permissions
sudo chown -R koha:koha /usr/share/koha/intranet/htdocs/
sudo chown -R koha:koha /etc/koha/

# Start services
sudo systemctl start apache2

echo "Restoration completed from: $BACKUP_DIR"
```

---

## Support and Resources

### Getting Help

#### Documentation
- **Project Documentation**: Available in `docs/` directory
- **API Reference**: `API-DOCUMENTATION.md`
- **Component Guide**: `demo-components.html`
- **Community Framework**: `COMMUNITY-FRAMEWORK.md`

#### Community Support
- **Koha Community**: https://koha-community.org
- **Mailing Lists**: https://lists.koha-community.org
- **IRC**: #koha on irc.oftc.net
- **Discord**: https://discord.gg/koha

#### Professional Support
- **Certified Partners**: https://koha-community.org/support/
- **Training**: https://koha-community.org/training/
- **Consulting**: Available from Koha partners

### Contributing

#### How to Contribute
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests**
5. **Submit a pull request**

#### Contribution Guidelines
- Follow the coding standards
- Add documentation for new features
- Include tests for new functionality
- Update the changelog

#### Development Setup
```bash
# Clone your fork
git clone https://github.com/yourusername/koha-shadcn.git
cd koha-shadcn

# Install dependencies
npm install

# Start development server (watch mode)
npm run css:watch

# Run tests
npm test

# Build for production
npm run build
```

### License and Credits

#### License
This project is licensed under the GPL-3.0 License. See the LICENSE file for details.

#### Credits
- **Koha Community**: For the amazing library management system
- **SHAD CN**: For the beautiful design system
- **Contributors**: All the developers who made this possible

---

## Conclusion

This guide provides comprehensive instructions for deploying and using the Koha SHAD CN modernization project. The system offers a modern, accessible, and extensible interface for library management that can be customized to meet the specific needs of your library.

For additional support or questions, please consult the community resources or contact the development team.

**Happy Library Management!** 📚✨
