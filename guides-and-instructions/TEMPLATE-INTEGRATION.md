# SHAD CN Template Integration Guide

## Overview

This guide covers Phase 3 of the Koha SHAD CN modernization project: integrating the SHAD CN design system with existing Koha Template Toolkit (.tt) templates.

## Architecture

### File Structure
```
koha-tmpl/opac-tmpl/bootstrap/en/
├── includes/
│   ├── shadcn-helpers.inc          # SHAD CN component helpers
│   ├── doc-head-close-shadcn.inc   # Updated asset loading
│   └── masthead-shadcn.inc         # Modernized header
├── modules/
│   └── opac-main-shadcn.tt         # Example converted template
└── css/
    └── shadcn-opac.css             # Generated SHAD CN styles
```

### Integration Components

#### 1. Template Helpers (`shadcn-helpers.inc`)
Provides Template Toolkit macros for all SHAD CN components:

- **Button Helper**: `shadcn_button()`
- **Card Helper**: `shadcn_card()`
- **Form Input Helper**: `shadcn_input()`
- **Alert Helper**: `shadcn_alert()`
- **Badge Helper**: `shadcn_badge()`
- **Navigation Helper**: `shadcn_nav_item()`
- **Breadcrumb Helper**: `shadcn_breadcrumb()`
- **Theme Toggle Helper**: `shadcn_theme_toggle()`
- **Table Helper**: `shadcn_table()`
- **Modal Helper**: `shadcn_modal()`

#### 2. Asset Management (`doc-head-close-shadcn.inc`)
Updated asset loading system:

- **SHAD CN Styles**: Loads `shadcn-opac.css` first
- **Feather Icons**: Includes icon system
- **JavaScript Framework**: Loads `shadcn-interactions.js`
- **Theme Initialization**: Automatic theme and interaction setup
- **Backward Compatibility**: Maintains existing asset loading

#### 3. Modernized Header (`masthead-shadcn.inc`)
Complete header redesign:

- **Glassmorphism Navigation**: Modern glass effect styling
- **SHAD CN Components**: Uses button and card helpers
- **Responsive Design**: Mobile-first approach
- **Icon System**: Feather icons throughout
- **Theme Toggle**: Integrated theme switching
- **Improved Accessibility**: Better ARIA labels and structure

## Template Conversion Process

### 1. Basic Conversion Steps

1. **Include SHAD CN Helpers**
   ```tt
   [% PROCESS 'shadcn-helpers.inc' %]
   ```

2. **Update Asset Includes**
   ```tt
   [% INCLUDE 'doc-head-close-shadcn.inc' %]
   [% INCLUDE 'masthead-shadcn.inc' %]
   ```

3. **Convert Components**
   ```tt
   <!-- Old Bootstrap Button -->
   <button class="btn btn-primary">Click me</button>
   
   <!-- New SHAD CN Button -->
   [% shadcn_button(
       text = "Click me",
       variant = "primary"
   ) %]
   ```

### 2. Component Migration Examples

#### Buttons
```tt
<!-- Bootstrap -->
<a href="/path" class="btn btn-primary">Link Button</a>
<button type="submit" class="btn btn-success">Submit</button>
<button class="btn btn-outline-secondary">Cancel</button>

<!-- SHAD CN -->
[% shadcn_button(text = "Link Button", href = "/path", variant = "primary") %]
[% shadcn_button(text = "Submit", type = "submit", variant = "success") %]
[% shadcn_button(text = "Cancel", variant = "secondary", outline = 1) %]
```

#### Cards
```tt
<!-- Bootstrap -->
<div class="card">
    <div class="card-header">
        <h3>Title</h3>
    </div>
    <div class="card-body">
        <p>Content</p>
    </div>
</div>

<!-- SHAD CN -->
[% shadcn_card(
    title = "Title",
    body = "<p>Content</p>"
) %]
```

#### Forms
```tt
<!-- Bootstrap -->
<div class="form-group">
    <label for="username">Username</label>
    <input type="text" id="username" name="username" class="form-control">
</div>

<!-- SHAD CN -->
[% shadcn_input(
    type = "text",
    id = "username",
    name = "username",
    label = "Username"
) %]
```

#### Alerts
```tt
<!-- Bootstrap -->
<div class="alert alert-success">
    <strong>Success!</strong> Operation completed.
</div>

<!-- SHAD CN -->
[% shadcn_alert(
    variant = "success",
    title = "Success!",
    message = "Operation completed."
) %]
```

### 3. Advanced Integration Patterns

#### Dynamic Content in Cards
```tt
[% shadcn_card(
    variant = "glass",
    class = "news-card",
    header = BLOCK
) %]
    <div class="news-header">
        <h2>[% news.title | html %]</h2>
        [% shadcn_badge(text = news.date, variant = "secondary") %]
    </div>
[% END %]
[% body = BLOCK %]
    <div class="news-content">
        [% news.content | $raw %]
    </div>
[% END %]
[% footer = BLOCK %]
    [% shadcn_button(text = "Read more", href = news.url, variant = "ghost") %]
[% END %]
```

#### Complex Navigation
```tt
<nav class="main-nav">
    [% FOREACH item IN nav_items %]
        [% shadcn_nav_item(
            text = item.text,
            href = item.href,
            icon = item.icon,
            active = (item.href == current_page),
            badge = item.badge
        ) %]
    [% END %]
</nav>
```

#### Data Tables
```tt
[% SET table_headers = [
    { text = "Title", sortable = 1 },
    { text = "Author", sortable = 1 },
    { text = "Date", sortable = 1 },
    { text = "Actions", sortable = 0 }
] %]

[% SET table_rows = [] %]
[% FOREACH book IN books %]
    [% table_rows.push([
        { content = book.title },
        { content = book.author },
        { content = book.date },
        { content = shadcn_button(text = "View", href = "/book/" _ book.id, size = "sm") }
    ]) %]
[% END %]

[% shadcn_table(
    headers = table_headers,
    rows = table_rows,
    sortable = 1,
    selectable = 1
) %]
```

## Migration Utilities

### 1. Migration Script (`migrate-templates.sh`)
Automated conversion tool with options:

1. **Backup Creation**: Saves original templates
2. **Class Conversion**: Bootstrap to SHAD CN class mapping
3. **Asset Updates**: Updates include references
4. **Validation**: Checks conversion completeness
5. **Reporting**: Generates migration status reports

### 2. Usage Examples
```bash
# Create backup
./migrate-templates.sh
# Select option 1

# Convert Bootstrap classes
./migrate-templates.sh
# Select option 2

# Validate conversion
./migrate-templates.sh
# Select option 5
```

## Best Practices

### 1. Template Organization
- Keep SHAD CN helpers in consistent locations
- Use meaningful component variant names
- Maintain accessibility standards
- Document custom component variations

### 2. Performance Considerations
- Load SHAD CN styles early in document head
- Use CSS custom properties for theme variables
- Minimize JavaScript dependencies
- Optimize asset loading order

### 3. Accessibility
- Maintain proper ARIA labels
- Use semantic HTML structure
- Ensure keyboard navigation
- Test with screen readers

### 4. Backward Compatibility
- Maintain existing class names where possible
- Provide fallbacks for older browsers
- Keep original templates as backups
- Test thoroughly before deployment

## Testing Strategy

### 1. Visual Testing
- Compare before/after screenshots
- Test in multiple browsers
- Verify responsive behavior
- Check print styles

### 2. Functional Testing
- Test form submissions
- Verify JavaScript interactions
- Check modal/dropdown functionality
- Test theme switching

### 3. Accessibility Testing
- Run WAVE accessibility scanner
- Test keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios

### 4. Performance Testing
- Measure CSS load times
- Check JavaScript execution
- Test on slow connections
- Verify mobile performance

## Deployment Checklist

### Pre-Deployment
- [ ] Complete template conversion
- [ ] Run migration validation
- [ ] Test all major user flows
- [ ] Verify accessibility compliance
- [ ] Check performance metrics
- [ ] Update documentation

### Deployment
- [ ] Deploy SHAD CN assets
- [ ] Update template includes
- [ ] Run build process
- [ ] Clear template cache
- [ ] Test in production environment

### Post-Deployment
- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Track performance metrics
- [ ] Document any issues
- [ ] Plan iterative improvements

## Troubleshooting

### Common Issues

1. **Missing Styles**
   - Check `shadcn-opac.css` is loaded
   - Verify build process completed
   - Check for CSS conflicts

2. **JavaScript Errors**
   - Ensure `shadcn-interactions.js` is loaded
   - Check for missing dependencies
   - Verify Feather icons are loaded

3. **Component Rendering**
   - Check helper include statements
   - Verify macro syntax
   - Test with simple examples

4. **Theme Issues**
   - Verify theme initialization
   - Check CSS custom properties
   - Test theme toggle functionality

### Debug Tools
- Browser developer tools
- Template Toolkit debugging
- CSS custom property inspection
- JavaScript console logging

## Future Enhancements

### Phase 4: Advanced Features
- Staff interface integration
- Custom component library
- Advanced animation system
- Performance optimizations

### Phase 5: Ecosystem Integration
- Plugin system compatibility
- Third-party tool integration
- API documentation
- Community contributions

## Support and Resources

### Documentation
- Component API reference
- Template conversion examples
- Troubleshooting guides
- Best practice documentation

### Community
- GitHub issues and discussions
- Koha community forums
- Developer documentation
- Video tutorials

---

*This guide is part of the comprehensive Koha SHAD CN modernization project. For additional support, consult the project documentation or reach out to the development team.*
