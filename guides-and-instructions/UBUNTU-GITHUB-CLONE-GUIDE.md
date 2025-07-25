# Complete Ubuntu GitHub Clone Guide - Fresh Start
## Step-by-Step Guide to Clone Koha SHAD CN from GitHub on Fresh Ubuntu

This guide assumes you have a completely fresh Ubuntu installation and want to clone your modernized Koha project from GitHub.

---

## 🖥️ **Step 1: Open Terminal**

On Ubuntu, you can open the terminal in several ways:

### **Method 1: Keyboard Shortcut**
```bash
# Press these keys together
Ctrl + Alt + T
```

### **Method 2: Application Menu**
1. Click on "Show Applications" (9-dot grid icon)
2. Type "terminal" in the search
3. Click on "Terminal" application

### **Method 3: Right-click Desktop**
1. Right-click on empty desktop space
2. Select "Open in Terminal" (if available)

---

## 🔄 **Step 2: Update Your Ubuntu System**

First, update your package list and system:

```bash
# Update package database
sudo apt update

# Upgrade existing packages
sudo apt upgrade -y
```

**Note**: You may be prompted for your password. Type it (it won't show on screen) and press Enter.

---

## 📦 **Step 3: Install Essential Tools**

Install Git and other essential tools:

```bash
# Install Git and basic development tools
sudo apt install -y git curl wget build-essential

# Verify Git installation
git --version
```

**Expected output**: `git version 2.x.x`

---

## 🔧 **Step 4: Configure Git (First Time Setup)**

Set up your Git identity (replace with your actual information):

```bash
# Set your name (use your real name or GitHub username)
git config --global user.name "Your Name"

# Set your email (use the email associated with your GitHub account)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

---

## 📂 **Step 5: Choose Installation Directory**

Navigate to where you want to clone the project:

### **Option A: Clone to Home Directory**
```bash
# Go to your home directory
cd ~

# See where you are
pwd
```

### **Option B: Create a Projects Directory (Recommended)**
```bash
# Go to home directory
cd ~

# Create a projects folder
mkdir -p projects

# Navigate to projects folder
cd projects

# Verify location
pwd
```

---

## 🌐 **Step 6: Clone Your Repository from GitHub**

### **Method 1: HTTPS Clone (Recommended for beginners)**

```bash
# Clone using HTTPS (replace with your actual repository URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Example:
# git clone https://github.com/johndoe/koha-modernized.git
```

### **Method 2: SSH Clone (If you have SSH keys set up)**

```bash
# Clone using SSH (replace with your actual repository URL)
git clone git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# Example:
# git clone git@github.com:johndoe/koha-modernized.git
```

### **If you don't know your repository URL:**
1. Go to your repository on GitHub.com
2. Click the green "Code" button
3. Copy the HTTPS URL (it starts with `https://github.com/`)

---

## 📁 **Step 7: Navigate to Your Project**

```bash
# Enter the cloned directory (replace with your actual repo name)
cd YOUR_REPO_NAME

# Example:
# cd koha-modernized

# List files to verify the clone worked
ls -la

# See the current directory
pwd
```

**You should see files like:**
- `package.json`
- `README.md` or `README-MODERNIZED.md`
- `build-styles.sh`
- `ubuntu-quick-install.sh`
- Various directories like `koha-tmpl/`, `assets/`, etc.

---

## 🚀 **Step 8: Install Node.js (Required for the Project)**

Your Koha modernization requires Node.js. Install it:

```bash
# Add NodeSource repository for Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

**Expected output:**
- Node.js: `v18.x.x`
- npm: `9.x.x` or higher

---

## 🔨 **Step 9: Install Project Dependencies**

```bash
# Make sure you're in the project directory
pwd

# Install all project dependencies (this may take a few minutes)
npm install

# If you get permission errors, try:
# npm install --unsafe-perm=true --allow-root
```

---

## 🎨 **Step 10: Build the Modern Interface**

```bash
# Make the build script executable
chmod +x build-styles.sh

# Build the SHAD CN styles
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

## ✅ **Step 11: Verify Everything Works**

```bash
# Check Node.js and npm versions
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Check if CSS files were built successfully
ls -la koha-tmpl/opac-tmpl/bootstrap/css/shadcn-opac.css
ls -la koha-tmpl/intranet-tmpl/prog/css/shadcn-staff.css

# View project structure
tree -L 2 -d . || ls -la
```

---

## 🌐 **Step 12: Test with Development Server (Optional)**

Start a local server to test the interface:

```bash
# Option 1: Use included development server script
chmod +x start-dev-server.sh
./start-dev-server.sh

# Option 2: Use Python's built-in server
python3 -m http.server 8000

# Option 3: Use Node.js http-server (install first)
npm install -g http-server
http-server -p 8000
```

Then open your web browser and go to:
- `http://localhost:8000/demo-components.html`

---

## 📖 **Step 13: Read Documentation**

Explore the included documentation:

```bash
# View main README
cat README-MODERNIZED.md

# View Ubuntu installation guide
cat UBUNTU-INSTALLATION-GUIDE.md

# View quick commands
cat QUICK-INSTALL-COMMANDS.md

# List all documentation files
find . -name "*.md" -type f
```

---

## 🛠️ **Troubleshooting Common Issues**

### **Problem: "git: command not found"**
```bash
sudo apt update
sudo apt install -y git
```

### **Problem: "node: command not found"**
```bash
# Install Node.js using snap (alternative method)
sudo snap install node --classic
```

### **Problem: "Permission denied" during npm install**
```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ./node_modules
```

### **Problem: Build script fails**
```bash
# Check if Node.js version is correct (should be 16+)
node --version

# Try manual build
npm run css:build

# Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Problem: Repository not found**
```bash
# Make sure your repository URL is correct
# Check if repository is public or if you have access
# Try cloning with HTTPS instead of SSH
```

---

## 📋 **Complete Command Summary**

Here's the complete sequence for copying and pasting:

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Git and tools
sudo apt install -y git curl wget build-essential

# 3. Configure Git (replace with your info)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 4. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 5. Create projects directory and navigate
cd ~ && mkdir -p projects && cd projects

# 6. Clone repository (replace with your URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 7. Navigate to project
cd YOUR_REPO_NAME

# 8. Install dependencies and build
npm install
chmod +x build-styles.sh
./build-styles.sh

# 9. Verify installation
node --version && npm --version
ls -la koha-tmpl/*/css/shadcn-*.css
```

---

## 🎉 **Success!**

If you've followed all steps successfully, you now have:

✅ **Fresh Ubuntu system updated**  
✅ **Git installed and configured**  
✅ **Node.js 18.x installed**  
✅ **Your repository cloned locally**  
✅ **All dependencies installed**  
✅ **Modern SHAD CN interface built**  
✅ **Ready for development or deployment**  

## 📞 **Need Help?**

If you encounter any issues:

1. **Check the error messages** - they usually tell you what's wrong
2. **Verify your repository URL** - make sure it's correct and accessible
3. **Ensure Node.js version** - should be 16 or higher
4. **Review the documentation** - check the included guides in your project

Your modernized Koha system is now ready to use! 🚀

---

**Remember to replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name in all commands above.**
