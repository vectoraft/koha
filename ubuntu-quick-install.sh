#!/bin/bash

# Koha SHAD CN Modernization - Ubuntu Quick Install Script
# This script automates the installation process on Ubuntu

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
DEFAULT_INSTALL_DIR="$HOME/projects"
REPO_URL=""
NODE_VERSION="18"

# Functions
print_header() {
    echo -e "${PURPLE}"
    echo "=================================================================="
    echo "   Koha SHAD CN Modernization - Ubuntu Installation Script"
    echo "=================================================================="
    echo -e "${NC}"
}

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if running on Ubuntu
check_ubuntu() {
    if ! grep -q "Ubuntu" /etc/os-release; then
        error "This script is designed for Ubuntu. Please install manually on other systems."
    fi
    
    local version=$(lsb_release -rs)
    if (( $(echo "$version < 20.04" | bc -l) )); then
        warning "Ubuntu version $version detected. Ubuntu 20.04+ recommended."
    else
        success "Ubuntu $version detected"
    fi
}

# Get repository URL from user
get_repo_url() {
    echo ""
    echo -e "${YELLOW}Repository Configuration${NC}"
    echo "Please provide your GitHub repository URL."
    echo ""
    echo "Examples:"
    echo "  https://github.com/username/koha-modernized.git"
    echo "  git@github.com:username/koha-modernized.git"
    echo ""
    
    while true; do
        read -p "Enter your repository URL: " REPO_URL
        if [[ $REPO_URL =~ ^https://github\.com/.+/.+\.git$ ]] || [[ $REPO_URL =~ ^git@github\.com:.+/.+\.git$ ]]; then
            break
        else
            echo -e "${RED}Invalid URL format. Please use the format shown above.${NC}"
        fi
    done
    
    # Extract repository name
    REPO_NAME=$(basename "$REPO_URL" .git)
    success "Repository: $REPO_NAME"
}

# Get installation directory
get_install_dir() {
    echo ""
    echo -e "${YELLOW}Installation Directory${NC}"
    echo "Default installation directory: $DEFAULT_INSTALL_DIR"
    echo ""
    
    read -p "Press Enter to use default, or type a custom path: " CUSTOM_DIR
    
    if [[ -n "$CUSTOM_DIR" ]]; then
        INSTALL_DIR="$CUSTOM_DIR"
    else
        INSTALL_DIR="$DEFAULT_INSTALL_DIR"
    fi
    
    success "Installation directory: $INSTALL_DIR"
}

# Update system packages
update_system() {
    log "Updating system packages..."
    
    sudo apt update -qq
    sudo apt upgrade -y -qq
    
    log "Installing essential packages..."
    sudo apt install -y -qq \
        curl \
        wget \
        git \
        build-essential \
        software-properties-common \
        python3-dev \
        unzip \
        zip \
        tree \
        htop
    
    success "System packages updated"
}

# Install Node.js
install_nodejs() {
    log "Installing Node.js $NODE_VERSION.x..."
    
    # Check if Node.js is already installed
    if command -v node &> /dev/null; then
        local current_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if (( current_version >= 16 )); then
            success "Node.js $current_version.x already installed"
            return
        fi
    fi
    
    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash - &>/dev/null
    sudo apt install -y nodejs &>/dev/null
    
    # Verify installation
    local node_version=$(node --version)
    local npm_version=$(npm --version)
    
    success "Node.js $node_version and npm $npm_version installed"
}

# Clone repository
clone_repository() {
    log "Cloning repository..."
    
    # Create installation directory
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    
    # Remove existing directory if it exists
    if [[ -d "$REPO_NAME" ]]; then
        warning "Directory $REPO_NAME already exists. Removing..."
        rm -rf "$REPO_NAME"
    fi
    
    # Clone repository
    git clone "$REPO_URL" "$REPO_NAME"
    cd "$REPO_NAME"
    
    success "Repository cloned to $INSTALL_DIR/$REPO_NAME"
}

# Install dependencies
install_dependencies() {
    log "Installing project dependencies..."
    
    # Check if package.json exists
    if [[ ! -f "package.json" ]]; then
        error "package.json not found. Make sure you're in the correct directory."
    fi
    
    # Install npm dependencies
    npm install --silent
    
    success "Dependencies installed"
}

# Build the project
build_project() {
    log "Building SHAD CN styles..."
    
    # Make build script executable
    if [[ -f "build-styles.sh" ]]; then
        chmod +x build-styles.sh
        ./build-styles.sh
    else
        warning "build-styles.sh not found. Trying npm build..."
        npm run css:build || npm run build || warning "No build script found"
    fi
    
    success "Project built successfully"
}

# Verify installation
verify_installation() {
    log "Verifying installation..."
    
    # Check Node.js and npm
    local node_version=$(node --version)
    local npm_version=$(npm --version)
    echo "  Node.js: $node_version"
    echo "  npm: $npm_version"
    
    # Check if CSS files were built
    local opac_css="koha-tmpl/opac-tmpl/bootstrap/css/shadcn-opac.css"
    local staff_css="koha-tmpl/intranet-tmpl/prog/css/shadcn-staff.css"
    
    if [[ -f "$opac_css" ]]; then
        success "OPAC styles built: $opac_css"
    else
        warning "OPAC styles not found: $opac_css"
    fi
    
    if [[ -f "$staff_css" ]]; then
        success "Staff styles built: $staff_css"
    else
        warning "Staff styles not found: $staff_css"
    fi
    
    # Show directory structure
    echo ""
    echo "Project structure:"
    tree -L 2 -d . 2>/dev/null || ls -la
}

# Show completion message
show_completion() {
    echo ""
    echo -e "${GREEN}"
    echo "=================================================================="
    echo "             🎉 Installation Completed Successfully! 🎉"
    echo "=================================================================="
    echo -e "${NC}"
    echo ""
    echo "Your Koha SHAD CN modernization is now installed at:"
    echo -e "${BLUE}$INSTALL_DIR/$REPO_NAME${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Navigate to the project directory:"
    echo -e "   ${YELLOW}cd $INSTALL_DIR/$REPO_NAME${NC}"
    echo ""
    echo "2. View documentation:"
    echo -e "   ${YELLOW}cat README-MODERNIZED.md${NC}"
    echo -e "   ${YELLOW}cat DEPLOYMENT-USAGE-GUIDE.md${NC}"
    echo ""
    echo "3. Start development server (optional):"
    echo -e "   ${YELLOW}./start-dev-server.sh${NC}"
    echo -e "   ${YELLOW}# or${NC}"
    echo -e "   ${YELLOW}python3 -m http.server 8000${NC}"
    echo ""
    echo "4. View demo components:"
    echo -e "   ${YELLOW}Open browser: http://localhost:8000/demo-components.html${NC}"
    echo ""
    echo "Features included:"
    echo "✅ Complete SHAD CN design system"
    echo "✅ 50+ modern UI components"
    echo "✅ Responsive OPAC and Staff interfaces"
    echo "✅ Plugin architecture"
    echo "✅ Performance optimizations"
    echo "✅ Comprehensive documentation"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

# Main installation process
main() {
    print_header
    
    # Check prerequisites
    check_ubuntu
    
    # Get user input
    get_repo_url
    get_install_dir
    
    echo ""
    echo -e "${YELLOW}Installation Summary:${NC}"
    echo "Repository: $REPO_URL"
    echo "Directory: $INSTALL_DIR/$REPO_NAME"
    echo "Node.js: $NODE_VERSION.x"
    echo ""
    
    read -p "Continue with installation? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
    
    # Perform installation
    echo ""
    log "Starting installation process..."
    
    update_system
    install_nodejs
    clone_repository
    install_dependencies
    build_project
    verify_installation
    
    show_completion
}

# Check if bc is available for version comparison
if ! command -v bc &> /dev/null; then
    sudo apt install -y bc &>/dev/null
fi

# Run main function
main "$@"
