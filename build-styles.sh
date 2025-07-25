#!/bin/bash

# Build SHAD CN styles for Koha
echo "Building SHAD CN styles for Koha..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Create output directory if it doesn't exist
mkdir -p koha-tmpl/opac-tmpl/bootstrap/css
mkdir -p koha-tmpl/intranet-tmpl/prog/css

# Build OPAC styles
echo "Building OPAC styles..."
npx tailwindcss -i assets/css/tailwind-input.css -o koha-tmpl/opac-tmpl/bootstrap/css/shadcn-opac.css --watch=false

# Build Staff interface styles
echo "Building Staff interface styles..."
npx tailwindcss -i assets/css/tailwind-input.css -o koha-tmpl/intranet-tmpl/prog/css/shadcn-staff.css --watch=false

echo "✅ SHAD CN styles built successfully!"
echo "📁 OPAC styles: koha-tmpl/opac-tmpl/bootstrap/css/shadcn-opac.css"
echo "📁 Staff styles: koha-tmpl/intranet-tmpl/prog/css/shadcn-staff.css"
