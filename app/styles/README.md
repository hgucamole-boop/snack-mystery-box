# Modular CSS Architecture

This directory contains the modularized CSS for the Snack Mystery Box project. The CSS has been organized into focused, maintainable files for better code organization and scalability.

## File Structure

### Core Files

- **`variables.css`** - CSS custom properties, color scheme, spacing, typography, and design tokens
- **`animations.css`** - All keyframe animations used throughout the site
- **`global.css`** - Global reset, font imports, and base element styles

### Layout & Navigation

- **`layout.css`** - Landing container, page content layout, and responsive container utilities
- **`navbar.css`** - Navigation bar styling with responsive breakpoints

### Sections & Components

- **`hero.css`** - Hero section, title animations, CTA buttons, and floating elements
- **`features.css`** - Features grid, feature cards, and feature-related styling
- **`pricing.css`** - Pricing cards, plans, popular badge, and pricing-specific buttons
- **`forms.css`** - Email input, signup form, and submit button styling
- **`footer.css`** - Footer layout and text styling
- **`sustainability.css`** - Sustainability section layout, story steps, and impact displays
- **`products.css`** - Products intro, product showcase, scrolling grid, and scroll tracks
- **`slot-machine.css`** - Slot machine body, reels, controls, and delivery reveal section

## How to Use

The main `globals.css` file imports all modular CSS files in a logical order:

1. Variables (design tokens)
2. Animations (keyframes)
3. Global base styles
4. Layout foundation
5. Individual components/sections

## Adding New Styles

When adding new styles:

1. **For new sections/pages**: Create a new CSS file (e.g., `checkout.css`) and import it in `globals.css`
2. **For component-specific styles**: Add to the corresponding section file
3. **For global utilities**: Add to `global.css`
4. **For new design tokens**: Add to `variables.css`

## Variable Usage

All colors, spacing, fonts, and transitions use CSS custom properties from `variables.css`:

```css
/* Colors */
color: var(--primary);
color: var(--secondary);
color: var(--accent);

/* Spacing */
padding: var(--spacing-md);
margin: var(--spacing-lg);

/* Typography */
font-family: var(--font-display);
font-family: var(--font-mono);

/* Transitions */
transition: all var(--transition-base);
```

## Responsive Design

Media queries for responsive breakpoints are kept within their component files for better maintainability. The primary breakpoint is `768px` for mobile devices.

```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

## Maintenance Benefits

- **Modularity**: Each file handles a specific section or component
- **Scalability**: Easy to add new sections without affecting existing code
- **Findability**: Quickly locate styles for specific components
- **Collaboration**: Multiple developers can work on different sections simultaneously
- **Reusability**: CSS variables are easily shared across all files
- **Performance**: Better organization can help with future optimization
