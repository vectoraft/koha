# Koha SHAD CN Modernization

A modernized version of the Koha library management system featuring a complete SHAD CN design system implementation.

## ✨ Features

- **Modern UI/UX**: Complete SHAD CN design system integration
- **50+ Components**: Reusable, accessible components
- **Responsive Design**: Mobile-first approach
- **Plugin Architecture**: Extensible system for custom features
- **Performance Optimized**: Modern build tools and optimization
- **Accessibility**: WCAG 2.1 compliant interface

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Linux/Unix environment (recommended)

### Installation

1. Clone the repository:
```bash
git clone <your-github-repo-url>
cd koha-modernized
```

2. Install dependencies:
```bash
npm install
```

3. Build the modern interface:
```bash
chmod +x build-styles.sh
./build-styles.sh
```

4. Start development server (optional):
```bash
chmod +x start-dev-server.sh
./start-dev-server.sh
```

## 📖 Usage Guide

### Building Styles

Build CSS for both OPAC and Staff interfaces:
```bash
./build-styles.sh
```

### Development Mode

For development with file watching:
```bash
npm run css:watch
```

### Production Build

For production deployment:
```bash
npm run css:build:prod
```

## 🏗️ Architecture

### Component System
- **SHAD CN Components**: Located in `assets/` directory
- **Template Integration**: Modernized Template Toolkit files
- **Style System**: Tailwind CSS with custom SHAD CN theme

### Key Directories
- `assets/` - Modern component library
- `koha-tmpl/` - Modernized templates
- `docs/` - Documentation and guides
- `bin/` - Utility scripts

## 🔧 Configuration

### Tailwind Configuration
The design system is configured in `tailwind.config.js` with:
- SHAD CN color palette
- Custom component variants
- Responsive breakpoints
- Accessibility features

### Build Configuration
- `rspack.config.js` - Modern build system
- `gulpfile.js` - Legacy build support
- `package.json` - Dependencies and scripts

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT-USAGE-GUIDE.md) - Complete deployment instructions
- [Project Summary](PROJECT-SUMMARY.md) - Project overview and phases
- [Style Guide](docs/style-guide.md) - Component usage and styling
- [Template Integration](TEMPLATE-INTEGRATION.md) - Template modernization details

## 🤝 Contributing

This is a modernized fork of Koha. For the original Koha project:
- Visit: https://koha-community.org
- Bug Tracker: http://bugs.koha-community.org

For this modernized version:
1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project maintains the original Koha license:
- **License**: GNU GPL version 3 or later
- **Original Project**: https://koha-community.org

## 🎯 Project Status

This modernization project includes:
- ✅ Complete SHAD CN component library
- ✅ Staff interface modernization
- ✅ OPAC interface modernization  
- ✅ Plugin architecture
- ✅ Performance optimization
- ✅ Accessibility improvements
- ✅ Documentation and guides

---

**Note**: This is a modernized version of Koha with SHAD CN design system. For the official Koha project, visit https://koha-community.org
