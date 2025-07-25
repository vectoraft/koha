# SHAD CN Style Guide for Koha
## Modern UI Design System with Glassmorphism and Neumorphism

### 🎨 Design Philosophy

This style guide implements a modern SHAD CN-inspired design system for Koha, incorporating:

- **Glassmorphism**: Translucent elements with backdrop blur effects
- **Neumorphism**: Soft, extruded surfaces with subtle shadows
- **Minimalism**: Clean, uncluttered interfaces with purposeful whitespace
- **Accessibility**: WCAG 2.1 AA compliant with proper contrast ratios
- **Responsiveness**: Mobile-first approach with fluid layouts
- **Performance**: Optimized animations and efficient CSS

---

## 🎯 Color Palette

### Primary Colors
```css
/* Light Theme */
--primary: 221.2 83.2% 53.3%;          /* #3B82F6 - Vibrant Blue */
--primary-foreground: 210 40% 98%;     /* #FAFAFA - Nearly White */
--secondary: 210 40% 96%;              /* #F4F4F5 - Light Gray */
--secondary-foreground: 222.2 84% 4.9%; /* #0F172A - Dark Blue */

/* Dark Theme */
--primary: 217.2 91.2% 59.8%;          /* #60A5FA - Lighter Blue */
--primary-foreground: 222.2 84% 4.9%;  /* #0F172A - Dark Blue */
--secondary: 217.2 32.6% 17.5%;        /* #1E293B - Dark Gray */
--secondary-foreground: 210 40% 98%;   /* #FAFAFA - Nearly White */
```

### Semantic Colors
```css
/* Status Colors */
--destructive: 0 84.2% 60.2%;          /* #EF4444 - Red */
--success: 142 76% 36%;                /* #22C55E - Green */
--warning: 38 92% 50%;                 /* #F59E0B - Orange */
--info: 199 89% 48%;                   /* #0EA5E9 - Light Blue */
```

### Surface Colors
```css
/* Backgrounds */
--background: 0 0% 100%;               /* #FFFFFF - White */
--card: 0 0% 100%;                     /* #FFFFFF - White */
--popover: 0 0% 100%;                  /* #FFFFFF - White */
--muted: 210 40% 96%;                  /* #F4F4F5 - Light Gray */
--accent: 210 40% 96%;                 /* #F4F4F5 - Light Gray */

/* Borders */
--border: 214.3 31.8% 91.4%;          /* #E2E8F0 - Light Border */
--input: 214.3 31.8% 91.4%;           /* #E2E8F0 - Input Border */
--ring: 221.2 83.2% 53.3%;            /* #3B82F6 - Focus Ring */
```

### Glassmorphism Colors
```css
/* Glass Effects */
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-shadow: rgba(31, 38, 135, 0.37);
```

### Neumorphism Colors
```css
/* Neomorphic Effects */
--neomorph-bg: #f0f0f0;
--neomorph-shadow-light: rgba(255, 255, 255, 0.8);
--neomorph-shadow-dark: rgba(0, 0, 0, 0.1);
```

---

## 📝 Typography

### Font Families
- **Primary**: Inter (Modern, clean sans-serif)
- **Monospace**: JetBrains Mono (Code and technical content)
- **Fallback**: System font stack

### Font Scales
```css
/* Heading Sizes */
h1: 36px / 2.25rem    /* text-4xl */
h2: 30px / 1.875rem   /* text-3xl */
h3: 24px / 1.5rem     /* text-2xl */
h4: 20px / 1.25rem    /* text-xl */
h5: 18px / 1.125rem   /* text-lg */
h6: 16px / 1rem       /* text-base */

/* Body Sizes */
Large: 18px / 1.125rem    /* text-lg */
Base: 16px / 1rem         /* text-base */
Small: 14px / 0.875rem    /* text-sm */
XSmall: 12px / 0.75rem    /* text-xs */
```

### Font Weights
```css
Light: 300
Regular: 400
Medium: 500
Semibold: 600
Bold: 700
```

### Line Heights
```css
Tight: 1.25
Normal: 1.5
Relaxed: 1.75
```

---

## 🎭 Shadows & Effects

### Glassmorphism Shadows
```css
/* Light Glass */
box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);

/* Medium Glass */
box-shadow: 0 8px 32px rgba(31, 38, 135, 0.5);
backdrop-filter: blur(15px);
background: rgba(255, 255, 255, 0.2);
border: 1px solid rgba(255, 255, 255, 0.3);

/* Dark Glass */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
backdrop-filter: blur(10px);
background: rgba(0, 0, 0, 0.1);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Neumorphism Shadows
```css
/* Raised Elements */
box-shadow: 
  8px 8px 16px rgba(0, 0, 0, 0.1),
  -8px -8px 16px rgba(255, 255, 255, 0.8);

/* Pressed/Inset Elements */
box-shadow: 
  inset 8px 8px 16px rgba(0, 0, 0, 0.1),
  inset -8px -8px 16px rgba(255, 255, 255, 0.8);

/* Flat Elements */
box-shadow: 
  4px 4px 8px rgba(0, 0, 0, 0.1),
  -4px -4px 8px rgba(255, 255, 255, 0.8);
```

### Standard Shadows
```css
/* Elevation Shadows */
sm: 0 1px 2px rgba(0, 0, 0, 0.05);
md: 0 4px 6px rgba(0, 0, 0, 0.07);
lg: 0 10px 15px rgba(0, 0, 0, 0.1);
xl: 0 20px 25px rgba(0, 0, 0, 0.1);
2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

---

## 🔲 Border Radius

### Radius Scale
```css
--radius: 8px;               /* Default radius */
sm: calc(var(--radius) - 4px);  /* 4px */
md: calc(var(--radius) - 2px);  /* 6px */
lg: var(--radius);               /* 8px */
xl: calc(var(--radius) + 4px);  /* 12px */
2xl: calc(var(--radius) + 8px); /* 16px */
3xl: calc(var(--radius) + 16px); /* 24px */
full: 9999px;                    /* Fully rounded */
```

---

## 🎬 Animations

### Timing Functions
```css
--animation-easing: cubic-bezier(0.4, 0, 0.2, 1);  /* ease-out */
--animation-duration: 300ms;                        /* Standard duration */
```

### Keyframe Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide In */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Bounce Gentle */
@keyframes bounceGentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Pulse Soft */
@keyframes pulseSoft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## 🧩 Component Patterns

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)));
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 300ms ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Neumorphic Button */
.btn-neomorph {
  background: var(--neomorph-bg);
  border: none;
  box-shadow: 
    8px 8px 16px var(--neomorph-shadow-dark),
    -8px -8px 16px var(--neomorph-shadow-light);
  transition: all 300ms ease;
  cursor: pointer;
}

.btn-neomorph:hover {
  box-shadow: 
    4px 4px 8px var(--neomorph-shadow-dark),
    -4px -4px 8px var(--neomorph-shadow-light);
  transform: translateY(-1px);
}
```

### Cards
```css
/* Glass Card */
.card-glass {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px var(--glass-shadow);
  transition: all 300ms ease;
}

.card-glass:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

### Forms
```css
/* Glass Input */
.input-glass {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 12px 16px;
  color: hsl(var(--foreground));
  transition: all 300ms ease;
}

.input-glass:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 3px rgba(var(--primary), 0.1);
}

/* Neumorphic Input */
.input-neomorph {
  background: var(--neomorph-bg);
  border: none;
  box-shadow: 
    inset 8px 8px 16px var(--neomorph-shadow-dark),
    inset -8px -8px 16px var(--neomorph-shadow-light);
  border-radius: 8px;
  padding: 12px 16px;
  transition: all 300ms ease;
}

.input-neomorph:focus {
  box-shadow: 
    inset 4px 4px 8px var(--neomorph-shadow-dark),
    inset -4px -4px 8px var(--neomorph-shadow-light),
    0 0 0 3px hsl(var(--primary) / 0.1);
}
```

---

## 📱 Responsive Breakpoints

### Screen Sizes
```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Container Sizes
```css
sm: 100%
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## ♿ Accessibility Guidelines

### Color Contrast
- **AA Standard**: 4.5:1 for normal text, 3:1 for large text
- **AAA Standard**: 7:1 for normal text, 4.5:1 for large text
- All color combinations in this guide meet AA standards

### Focus Management
- Visible focus indicators on all interactive elements
- Proper tab order throughout the interface
- Skip links for keyboard navigation

### Screen Reader Support
- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels and descriptions where needed
- Alt text for all images

### Motion Sensitivity
- Respect `prefers-reduced-motion` settings
- Provide motion alternatives
- Avoid autoplay animations

---

## 🎯 Implementation Guidelines

### CSS Architecture
1. **Base Layer**: Reset styles, typography, global variables
2. **Components Layer**: Reusable component styles
3. **Utilities Layer**: Single-purpose utility classes
4. **Shame Layer**: Quick fixes and temporary styles

### Naming Conventions
- **BEM Methodology**: Block__Element--Modifier
- **Semantic Classes**: Based on purpose, not appearance
- **Utility Classes**: Prefixed with purpose (e.g., `.glass-`, `.neomorph-`)

### Performance Optimization
- Minimize CSS bundle size
- Use CSS custom properties for theming
- Leverage hardware acceleration for animations
- Optimize critical rendering path

---

## 📋 Component Checklist

### ✅ Completed Components
- [ ] Foundation CSS with variables
- [ ] Typography system
- [ ] Color palette
- [ ] Basic animations

### 🔄 In Progress
- [ ] Button components
- [ ] Card components
- [ ] Form elements
- [ ] Navigation components

### ⏳ Pending
- [ ] Table components
- [ ] Modal components
- [ ] Notification components
- [ ] Icon system integration

---

## 🔧 Development Tools

### Build Process
1. **Tailwind CSS**: Utility-first framework
2. **PostCSS**: CSS preprocessing
3. **Autoprefixer**: Vendor prefixing
4. **PurgeCSS**: Unused CSS removal

### Testing
- **Cross-browser testing**: Chrome, Firefox, Safari, Edge
- **Device testing**: Mobile, tablet, desktop
- **Accessibility testing**: Screen readers, keyboard navigation
- **Performance testing**: Lighthouse, WebPageTest

---

## 📚 Resources

### Design References
- [SHAD CN UI](https://ui.shadcn.com/)
- [Glassmorphism Generator](https://glassmorphism.com/)
- [Neumorphism Guide](https://neumorphism.io/)

### Accessibility Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Performance Resources
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [CSS Triggers](https://csstriggers.com/)

---

*This style guide is a living document that will evolve with the project. Last updated: 2025-07-18*
