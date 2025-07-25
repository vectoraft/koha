# Ubuntu Installation Guide - Koha SHAD CN Modernization
## Complete Step-by-Step Installation on Ubuntu

This guide will walk you through cloning and installing the modernized Koha system on Ubuntu from your GitHub repository.

## 📋 Prerequisites

### System Requirements
- **Ubuntu 20.04 LTS or newer** (22.04 LTS recommended)
- **4GB RAM minimum** (8GB recommended)
- **10GB free disk space** (50GB recommended for production)
- **Root or sudo access**
- **Internet connection**

### Before You Start
Make sure you have your GitHub repository URL ready:
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

---

## 🚀 Step 1: Update Ubuntu System

First, update your Ubuntu system to ensure all packages are current:

```bash
# Update package list
sudo apt update

# Upgrade existing packages
sudo apt upgrade -y

# Install essential build tools
sudo apt install -y curl wget git build-essential software-properties-common
```

---

## 🔧 Step 2: Install Node.js 18.x

The modernized Koha requires Node.js 16+ (18.x recommended):

```bash
# Add NodeSource repository for Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

**Alternative method using snap:**
```bash
sudo snap install node --classic
```

---

## 📦 Step 3: Install Additional Dependencies

Install required system packages:

```bash
# Install development tools
sudo apt install -y \
    gcc \
    g++ \
    make \
    python3-dev \
    libnss3-dev \
    libatk-bridge2.0-dev \
    libdrm2 \
    libxkbcommon0 \
    libgtk-3-dev \
    libgbm-dev

# Install Git (if not already installed)
sudo apt install -y git

# Install optional but recommended packages
sudo apt install -y \
    unzip \
    zip \
    htop \
    tree \
    nano \
    vim
```

---

## 📁 Step 4: Clone Your Repository

Navigate to your desired installation directory and clone the repository:

```bash
# Navigate to your home directory (or chosen location)
cd ~

# Create a projects directory (optional but recommended)
mkdir -p ~/projects
cd ~/projects

# Clone your repository (replace with your actual repository URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Navigate to the cloned directory
cd YOUR_REPO_NAME

# Verify the clone was successful
ls -la
```

**Expected output should show files like:**
- `package.json`
- `README.md` or `README-MODERNIZED.md`
- `tailwind.config.js`
- `build-styles.sh`
- Various directories like `koha-tmpl/`, `assets/`, etc.

---

## 🛠️ Step 5: Install Project Dependencies

Install all Node.js dependencies:

```bash
# Make sure you're in the project directory
cd ~/projects/YOUR_REPO_NAME

# Install dependencies (this may take a few minutes)
npm install

# If you encounter permission errors, try:
npm install --unsafe-perm=true --allow-root
```

**If npm install fails, try these alternatives:**

```bash
# Clear npm cache
npm cache clean --force

# Try with legacy peer deps
npm install --legacy-peer-deps

# Or use yarn if npm continues to fail
npm install -g yarn
yarn install
```

---

## 🎨 Step 6: Build the Modern Interface

Build the SHAD CN modernized styles and components:

```bash
# Make build script executable
chmod +x build-styles.sh

# Build the modern interface
./build-styles.sh
```

**Expected output:**
```
Building SHAD CN styles for Koha...
Building OPAC styles...
✅ OPAC styles: koha-tmpl/opac-tmpl/bootstrap/css/shadcn-opac.css
Building Staff interface styles...
✅ Staff styles: koha-tmpl/intranet-tmpl/prog/css/shadcn-staff.css
✅ SHAD CN styles built successfully!
```

---

## 🔍 Step 7: Verify Installation

Check that everything is properly installed:

```bash
# Check if Node.js and npm are working
node --version
npm --version

# Check if the project built successfully
ls -la koha-tmpl/opac-tmpl/bootstrap/css/
ls -la koha-tmpl/intranet-tmpl/prog/css/

# Verify SHAD CN files exist
test -f koha-tmpl/opac-tmpl/bootstrap/css/shadcn-opac.css && echo "✅ OPAC styles found"
test -f koha-tmpl/intranet-tmpl/prog/css/shadcn-staff.css && echo "✅ Staff styles found"

# Check project structure
tree -L 2 -d .  # Shows directory structure
```

---

## 🚀 Step 8: Start Development Server (Optional)

If you want to test the interface locally:

```bash
# Make the development server script executable
chmod +x start-dev-server.sh

# Start the development server
./start-dev-server.sh
```

**Or manually start a simple HTTP server:**

```bash
# Using Python 3 (usually pre-installed on Ubuntu)
python3 -m http.server 8000

# Using Node.js http-server (install if needed)
npm install -g http-server
http-server -p 8000

# Using PHP (if installed)
php -S localhost:8000
```

---

## 📖 Step 9: Access Documentation

View the included documentation:

```bash
# View the main README
cat README-MODERNIZED.md

# View deployment guide
cat DEPLOYMENT-USAGE-GUIDE.md

# View project summary
cat PROJECT-SUMMARY.md

# List all documentation files
find . -name "*.md" -type f
```

---

## 🔧 Step 10: Additional Configuration (Production)

For production deployment, you may need additional setup:

### A. Set Environment Variables
```bash
# Copy environment template
cp .env.production .env.local

# Edit environment variables
nano .env.local
```

### B. Set Up Web Server (Apache/Nginx)

**For Apache:**
```bash
# Install Apache
sudo apt install -y apache2

# Enable required modules
sudo a2enmod rewrite
sudo a2enmod headers

# Create virtual host configuration
sudo nano /etc/apache2/sites-available/koha-modernized.conf
```

**For Nginx:**
```bash
# Install Nginx
sudo apt install -y nginx

# Create configuration
sudo nano /etc/nginx/sites-available/koha-modernized
```

### C. Set Up SSL (Let's Encrypt)
```bash
# Install certbot
sudo apt install -y certbot python3-certbot-apache

# Or for Nginx
sudo apt install -y certbot python3-certbot-nginx
```

---

## 🛡️ Step 11: Security & Permissions

Set proper file permissions:

```bash
# Navigate to project directory
cd ~/projects/YOUR_REPO_NAME

# Set proper ownership (replace 'username' with your username)
sudo chown -R $USER:$USER .

# Set directory permissions
find . -type d -exec chmod 755 {} \;

# Set file permissions
find . -type f -exec chmod 644 {} \;

# Make scripts executable
chmod +x *.sh
chmod +x bin/*
```

---

## 📊 Step 12: Testing the Installation

Test different components:

```bash
# Test CSS build
npm run css:build

# Test if development mode works
npm run css:watch &  # Runs in background

# Check component demo
# Open browser and navigate to: http://localhost:8000/demo-components.html

# Kill background process when done
killall npm
```

---

## 🎯 Common Issues and Solutions

### Issue 1: Permission Denied
```bash
# Fix permissions
sudo chown -R $USER:$USER ~/projects/YOUR_REPO_NAME
chmod -R 755 ~/projects/YOUR_REPO_NAME
```

### Issue 2: npm install fails
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Build fails
```bash
# Check Node.js version
node --version  # Should be 16+

# Try manual build
npm run css:build
```

### Issue 4: Missing dependencies
```bash
# Install missing system packages
sudo apt install -y build-essential python3-dev

# Rebuild node modules
npm rebuild
```

---

## 📋 Complete Installation Commands Summary

Here's the complete sequence for a fresh Ubuntu installation:

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install dependencies
sudo apt install -y git build-essential curl wget

# 4. Clone repository
cd ~
mkdir -p projects && cd projects
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# 5. Install and build
npm install
chmod +x build-styles.sh
./build-styles.sh

# 6. Verify installation
node --version
npm --version
ls -la koha-tmpl/*/css/shadcn-*.css
```

---

## 🎉 Success!

If all steps completed successfully, you now have:

✅ **Modernized Koha System** - Complete SHAD CN implementation  
✅ **50+ UI Components** - Ready to use  
✅ **Responsive Design** - Mobile-first interface  
✅ **Development Environment** - Ready for customization  
✅ **Documentation** - Complete guides available  

## 📞 Support

If you encounter issues:

1. **Check the logs**: `npm run css:build` for detailed error messages
2. **Review documentation**: `cat DEPLOYMENT-USAGE-GUIDE.md`
3. **Check system requirements**: Ensure Node.js 16+ is installed
4. **Verify permissions**: Make sure all files are readable/writable

Your modernized Koha system is now ready for use! 🚀
