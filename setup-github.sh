#!/bin/bash

echo "🚀 Setting up GitHub repository for Koha SHAD CN Modernization"
echo "=============================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the modern interface
echo "Building modern interface..."
chmod +x build-styles.sh
./build-styles.sh

# Stage all files
echo "Staging files for commit..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "feat: Initial deployment of Koha SHAD CN modernization

- Complete SHAD CN design system implementation
- 50+ modern UI components
- Modernized OPAC and Staff interfaces
- Plugin architecture and service integrations
- Comprehensive documentation
- GitHub Actions for automated deployment"

echo ""
echo "✅ Repository setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo ""
echo "Your modernized Koha is ready for GitHub! 🎉"
