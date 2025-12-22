# Copilot Instructions for Ostrobazar DBMS

## Project Overview
Ostrobazar DBMS is a React + TypeScript e-commerce frontend using Vite, Tailwind CSS, and Context API for state management. The architecture follows a component-based structure with centralized cart state management.

## Architecture & Key Patterns

### State Management
- **CartContext** (`context/CartContext.tsx`): Central state for cart operations using React Context API
  - Manages: cart items, sidebar open/close state, discount application
  - Provides hooks: `useCart()` - always access cart state via this hook
  - Key functions: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `applyDiscount()`
  - Discount codes hardcoded: SAVE10 (10%), SAVE20 (20%), SAVE50 (50%)

### Component Structure
- **Page-level components** (`App.tsx`): Wraps app with `CartProvider`
- **Feature components** (`components/*.tsx`):
  - `CartSidebar.tsx` - Fixed-position overlay cart with quantity controls and checkout
  - `Navbar.tsx`, `Footer.tsx` - Layout shells
  - `ProductCard.tsx` - Reusable product display with "Add to Cart" button
  - `HeroSlider.tsx`, `CategorySection.tsx` - Content sections

### Data Types (`types.ts`)
```typescript
interface Product { id, title, price, image?, category, description? }
interface CartItem extends Product { quantity: number }
```

## Styling Conventions
- **Framework**: Tailwind CSS (processed via PostCSS + Autoprefixer)
- **Custom colors**: primary (#FF6B6B), secondary (#4ECDC4) defined in `tailwind.config.js`
- **Custom font**: Orbitron loaded from Google Fonts, applied via `.font-orbitron` class
- **Animations**: Custom `fadeIn` animation defined in config
- **Responsive**: Mobile-first approach with md: breakpoints

## Service Layer
- **productService.ts**: Currently a placeholder with utility function `getProductImage()`
  - Returns product.image or placeholder if missing
  - TODO: Implement `fetchProducts()` and `fetchProductById()` for API integration

## Build & Development
- **Dev server**: `npm run dev` (Vite default: localhost:5173)
- **Build**: `npm run build` (TypeScript check + Vite bundle)
- **Key config files**:
  - `vite.config.ts` - Uses @vitejs/plugin-react for JSX transformation
  - `tsconfig.json` - JSX mode: "react-jsx", strict mode enabled
  - `tailwind.config.js` - Color/font extensions, line-clamp plugin

## Common Tasks

### Adding a New Component
1. Create file in `/components` as `.tsx`
2. Use `React.FC<Props>` typing pattern
3. Use `useCart()` hook if cart state needed
4. Import and add to `App.tsx` or parent component

### Extending Cart Functionality
1. Add logic to `CartContext.tsx` provider function
2. Export new hook or context method
3. Call `useCart()` in components needing state

### Adding Product Data
1. Implement API call in `productService.ts` `fetchProducts()` or `fetchProductById()`
2. Call from component and pass to `ProductCard` array
3. ProductCard handles "Add to Cart" integration via `useCart().addToCart()`

### Styling Changes
- Edit `tailwind.config.js` for new colors/animations
- Edit `index.css` for global styles
- Use Tailwind utility classes in JSX (no separate CSS files needed)

## Important Notes
- **Dependencies**: Must run `npm install` before dev (TypeScript, React, Tailwind all required)
- **Font Awesome**: Loaded from CDN; use `<i className="fas fa-*">` syntax
- **Discount system**: Currently in-memory only; prices calculated as: `total = (subtotal + shipping) - discount`
- **Cart persistence**: NOT implemented; cart resets on page reload
- **Type safety**: Always import types from `types.ts` for Product/CartItem

## File Locations
- **Entry point**: `index.tsx` → `App.tsx`
- **Cart logic**: `context/CartContext.tsx` (single source of truth)
- **Shared utilities**: `services/productService.ts`
- **Styling**: `index.css` + `tailwind.config.js`
- **API integration**: Would go in `services/productService.ts`
