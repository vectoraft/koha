# Koha SHAD CN Modernization - Quick Installation Commands

## 🚀 One-Line Installation

For experienced users who want to install quickly:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/ubuntu-quick-install.sh | bash
```

## 📋 Manual Step-by-Step Installation

### 1. Prepare Ubuntu System
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential
```

### 2. Install Node.js 18.x
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version && npm --version
```

### 3. Clone Your Repository
```bash
# Navigate to home directory
cd ~

# Create projects directory
mkdir -p projects && cd projects

# Clone your repository (REPLACE with your actual URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Navigate to project
cd YOUR_REPO_NAME
```

### 4. Install and Build
```bash
# Install dependencies
npm install

# Build the modern interface
chmod +x build-styles.sh
./build-styles.sh
```

### 5. Verify Installation
```bash
# Check versions
node --version
npm --version

# Check if CSS files were built
ls -la koha-tmpl/opac-tmpl/bootstrap/css/shadcn-opac.css
ls -la koha-tmpl/intranet-tmpl/prog/css/shadcn-staff.css

# View project structure
tree -L 2 -d .
```

## 🔧 Development Server

Start a local development server to test:

```bash
# Option 1: Use included script
chmod +x start-dev-server.sh
./start-dev-server.sh

# Option 2: Use Python
python3 -m http.server 8000

# Option 3: Use Node.js http-server
npm install -g http-server
http-server -p 8000
```

Then open: http://localhost:8000/demo-components.html

## 📖 Access Documentation

```bash
# View main documentation
cat README-MODERNIZED.md

# View installation guide
cat UBUNTU-INSTALLATION-GUIDE.md

# View deployment guide
cat DEPLOYMENT-USAGE-GUIDE.md

# View project summary
cat PROJECT-SUMMARY.md
```

## 🎯 Complete Command Sequence

Copy and paste this entire sequence for a complete installation:

```bash
# Update system and install Node.js
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone and setup (REPLACE YOUR_USERNAME and YOUR_REPO_NAME)
cd ~ && mkdir -p projects && cd projects
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Install and build
npm install
chmod +x build-styles.sh
./build-styles.sh

# Verify and test
node --version && npm --version
ls -la koha-tmpl/*/css/shadcn-*.css
python3 -m http.server 8000
```

## 🛠️ Troubleshooting

### Common Issues:

**Permission denied:**
```bash
sudo chown -R $USER:$USER ~/projects/YOUR_REPO_NAME
chmod -R 755 ~/projects/YOUR_REPO_NAME
```

**npm install fails:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Build fails:**
```bash
# Check Node.js version (should be 16+)
node --version

# Try manual build
npm run css:build
```

**Missing system dependencies:**
```bash
sudo apt install -y python3-dev libnss3-dev libatk-bridge2.0-dev
npm rebuild
```

## ✅ Success Indicators

You'll know the installation was successful when you see:

✅ Node.js 16+ installed  
✅ All npm dependencies installed without errors  
✅ SHAD CN CSS files built successfully  
✅ Demo components accessible via browser  
✅ No error messages in terminal  

Your modernized Koha system is now ready! 🎉
