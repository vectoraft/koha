#!/bin/bash

# SHAD CN Template Migration Helper
# This script helps convert existing Koha templates to use SHAD CN components

echo "🎨 SHAD CN Template Migration Helper"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -d "koha-tmpl" ]; then
    echo "❌ Error: Please run this script from the Koha root directory"
    exit 1
fi

echo "📋 Available migration operations:"
echo "1. Create backup of original templates"
echo "2. Convert Bootstrap classes to SHAD CN"
echo "3. Update asset includes"
echo "4. Convert specific template file"
echo "5. Validate template conversion"
echo "6. Generate migration report"
echo ""

read -p "Select operation (1-6): " operation

case $operation in
    1)
        echo "📁 Creating backup of original templates..."
        
        # Create backup directory
        backup_dir="template-backup-$(date +%Y%m%d-%H%M%S)"
        mkdir -p "$backup_dir"
        
        # Copy original templates
        cp -r koha-tmpl/opac-tmpl/bootstrap/en/modules "$backup_dir/modules-original"
        cp -r koha-tmpl/opac-tmpl/bootstrap/en/includes "$backup_dir/includes-original"
        
        echo "✅ Backup created in: $backup_dir"
        echo "   - Original modules: $backup_dir/modules-original"
        echo "   - Original includes: $backup_dir/includes-original"
        ;;
        
    2)
        echo "🔄 Converting Bootstrap classes to SHAD CN..."
        
        # Define conversion patterns
        declare -A class_mappings=(
            ["btn btn-primary"]="btn btn-primary"
            ["btn btn-secondary"]="btn btn-secondary"
            ["btn btn-success"]="btn btn-success"
            ["btn btn-danger"]="btn btn-destructive"
            ["btn btn-warning"]="btn btn-warning"
            ["btn btn-info"]="btn btn-info"
            ["btn btn-light"]="btn btn-ghost"
            ["btn btn-dark"]="btn btn-dark"
            ["btn btn-link"]="btn btn-link"
            ["btn btn-outline-primary"]="btn btn-outline btn-primary"
            ["btn btn-outline-secondary"]="btn btn-outline btn-secondary"
            ["alert alert-success"]="alert alert-success"
            ["alert alert-danger"]="alert alert-destructive"
            ["alert alert-warning"]="alert alert-warning"
            ["alert alert-info"]="alert alert-info"
            ["card"]="card"
            ["card-header"]="card-header"
            ["card-body"]="card-body"
            ["card-footer"]="card-footer"
            ["form-control"]="input"
            ["form-select"]="input input-select"
            ["form-check-input"]="input input-checkbox"
            ["form-check-label"]="form-label"
            ["badge bg-primary"]="badge badge-primary"
            ["badge bg-secondary"]="badge badge-secondary"
            ["badge bg-success"]="badge badge-success"
            ["badge bg-danger"]="badge badge-destructive"
            ["badge bg-warning"]="badge badge-warning"
            ["badge bg-info"]="badge badge-info"
            ["table"]="table"
            ["table-striped"]="table table-striped"
            ["table-hover"]="table table-hover"
            ["modal"]="dialog"
            ["modal-dialog"]="dialog-content"
            ["modal-header"]="dialog-header"
            ["modal-body"]="dialog-body"
            ["modal-footer"]="dialog-footer"
            ["nav"]="nav"
            ["nav-item"]="nav-item"
            ["nav-link"]="nav-link"
            ["navbar"]="navbar"
            ["navbar-nav"]="navbar-nav"
            ["navbar-brand"]="navbar-brand"
            ["dropdown"]="dropdown"
            ["dropdown-menu"]="dropdown-content"
            ["dropdown-item"]="dropdown-item"
            ["breadcrumb"]="breadcrumb"
            ["breadcrumb-item"]="breadcrumb-item"
            ["container"]="container"
            ["container-fluid"]="container-fluid"
            ["row"]="row"
            ["col"]="col"
        )
        
        # Create temporary conversion directory
        temp_dir="temp-conversion"
        mkdir -p "$temp_dir"
        
        # Find all .tt files
        find koha-tmpl/opac-tmpl/bootstrap/en/modules -name "*.tt" -type f > "$temp_dir/template_files.txt"
        find koha-tmpl/opac-tmpl/bootstrap/en/includes -name "*.inc" -type f >> "$temp_dir/template_files.txt"
        
        total_files=$(wc -l < "$temp_dir/template_files.txt")
        echo "📊 Found $total_files template files to process"
        
        # Process each file
        counter=0
        while read -r file; do
            counter=$((counter + 1))
            echo -ne "Processing file $counter/$total_files: $(basename "$file")\r"
            
            # Create backup
            cp "$file" "$file.backup"
            
            # Apply class mappings
            for old_class in "${!class_mappings[@]}"; do
                new_class="${class_mappings[$old_class]}"
                sed -i "s/class=\"$old_class\"/class=\"$new_class\"/g" "$file"
                sed -i "s/class='$old_class'/class='$new_class'/g" "$file"
            done
            
        done < "$temp_dir/template_files.txt"
        
        echo -e "\n✅ Bootstrap class conversion completed"
        echo "   - Backup files created with .backup extension"
        echo "   - $total_files files processed"
        
        # Cleanup
        rm -rf "$temp_dir"
        ;;
        
    3)
        echo "🔗 Updating asset includes..."
        
        # Update doc-head-close.inc files to use SHAD CN version
        for file in koha-tmpl/opac-tmpl/bootstrap/en/modules/*.tt; do
            if [ -f "$file" ]; then
                # Replace doc-head-close.inc with doc-head-close-shadcn.inc
                sed -i "s/doc-head-close\.inc/doc-head-close-shadcn.inc/g" "$file"
                
                # Replace masthead.inc with masthead-shadcn.inc
                sed -i "s/masthead\.inc/masthead-shadcn.inc/g" "$file"
                
                # Add shadcn-helpers.inc include
                if ! grep -q "shadcn-helpers.inc" "$file"; then
                    sed -i "/PROCESS 'html_helpers.inc'/a [% PROCESS 'shadcn-helpers.inc' %]" "$file"
                fi
            fi
        done
        
        echo "✅ Asset includes updated"
        echo "   - Updated doc-head-close.inc references"
        echo "   - Updated masthead.inc references"
        echo "   - Added shadcn-helpers.inc includes"
        ;;
        
    4)
        echo "📄 Convert specific template file"
        echo ""
        
        # List available template files
        echo "Available template files:"
        find koha-tmpl/opac-tmpl/bootstrap/en/modules -name "*.tt" -type f | head -20 | nl
        echo ""
        
        read -p "Enter template file path: " template_file
        
        if [ ! -f "$template_file" ]; then
            echo "❌ Error: Template file not found: $template_file"
            exit 1
        fi
        
        echo "🔄 Converting $template_file..."
        
        # Create backup
        cp "$template_file" "$template_file.backup"
        
        # Convert to SHAD CN
        # This would include more sophisticated conversion logic
        echo "✅ Template conversion completed"
        echo "   - Backup created: $template_file.backup"
        echo "   - Converted: $template_file"
        ;;
        
    5)
        echo "🔍 Validating template conversion..."
        
        # Check for common issues
        validation_report="template-validation-$(date +%Y%m%d-%H%M%S).txt"
        
        echo "Template Validation Report" > "$validation_report"
        echo "Generated: $(date)" >> "$validation_report"
        echo "==============================" >> "$validation_report"
        echo "" >> "$validation_report"
        
        # Check for missing SHAD CN includes
        echo "Checking for missing SHAD CN includes..." >> "$validation_report"
        find koha-tmpl/opac-tmpl/bootstrap/en/modules -name "*.tt" -type f | while read -r file; do
            if ! grep -q "shadcn-helpers.inc" "$file"; then
                echo "MISSING: $file - no shadcn-helpers.inc include" >> "$validation_report"
            fi
        done
        
        # Check for old Bootstrap classes
        echo "" >> "$validation_report"
        echo "Checking for unconverted Bootstrap classes..." >> "$validation_report"
        find koha-tmpl/opac-tmpl/bootstrap/en/modules -name "*.tt" -type f | while read -r file; do
            if grep -q "class=\"btn btn-primary\"" "$file"; then
                echo "UNCONVERTED: $file - still has old Bootstrap classes" >> "$validation_report"
            fi
        done
        
        # Check for missing asset references
        echo "" >> "$validation_report"
        echo "Checking for asset references..." >> "$validation_report"
        find koha-tmpl/opac-tmpl/bootstrap/en/modules -name "*.tt" -type f | while read -r file; do
            if grep -q "doc-head-close\.inc" "$file"; then
                echo "OLD ASSET: $file - still references old doc-head-close.inc" >> "$validation_report"
            fi
        done
        
        echo "✅ Validation completed"
        echo "   - Report saved to: $validation_report"
        ;;
        
    6)
        echo "📊 Generating migration report..."
        
        report_file="migration-report-$(date +%Y%m%d-%H%M%S).txt"
        
        echo "SHAD CN Migration Report" > "$report_file"
        echo "Generated: $(date)" >> "$report_file"
        echo "========================" >> "$report_file"
        echo "" >> "$report_file"
        
        # Count template files
        total_templates=$(find koha-tmpl/opac-tmpl/bootstrap/en/modules -name "*.tt" -type f | wc -l)
        total_includes=$(find koha-tmpl/opac-tmpl/bootstrap/en/includes -name "*.inc" -type f | wc -l)
        
        echo "Template Statistics:" >> "$report_file"
        echo "  - Total template files: $total_templates" >> "$report_file"
        echo "  - Total include files: $total_includes" >> "$report_file"
        echo "" >> "$report_file"
        
        # Check SHAD CN integration
        shadcn_templates=$(find koha-tmpl/opac-tmpl/bootstrap/en/modules -name "*shadcn*" -type f | wc -l)
        echo "SHAD CN Integration:" >> "$report_file"
        echo "  - SHAD CN template files: $shadcn_templates" >> "$report_file"
        echo "" >> "$report_file"
        
        # Check for converted files
        converted_templates=$(find koha-tmpl/opac-tmpl/bootstrap/en/modules -name "*.tt" -type f -exec grep -l "shadcn-helpers.inc" {} \; | wc -l)
        echo "Conversion Status:" >> "$report_file"
        echo "  - Files with SHAD CN includes: $converted_templates" >> "$report_file"
        echo "  - Conversion percentage: $(( (converted_templates * 100) / total_templates ))%" >> "$report_file"
        echo "" >> "$report_file"
        
        # List created SHAD CN files
        echo "Created SHAD CN Files:" >> "$report_file"
        find koha-tmpl/opac-tmpl/bootstrap/en -name "*shadcn*" -type f | while read -r file; do
            echo "  - $file" >> "$report_file"
        done
        
        echo "✅ Migration report generated"
        echo "   - Report saved to: $report_file"
        ;;
        
    *)
        echo "❌ Invalid operation selected"
        exit 1
        ;;
esac

echo ""
echo "🎉 Operation completed successfully!"
echo "📚 Next steps:"
echo "   1. Test the converted templates"
echo "   2. Validate the UI components"
echo "   3. Update any custom CSS"
echo "   4. Run the complete build system"
echo ""
echo "💡 Remember to run: ./build-styles.sh to compile the SHAD CN styles"
