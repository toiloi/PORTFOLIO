# 🚀 Awesome Developer Portfolio

<div align="center">
  <h3>A modern, fully animated, and highly responsive Portfolio Website built with React! 💻</h3>
  <p>Created by Nguyen Anh Toai</p>
</div>

---

## ✨ Features

- 🎬 **Cinematic Splash Screen**: A stunning intro sequence with sliding dark trapezoids and dual spinning SVG hexagons that parts to reveal the entire website!
- 🎨 **Elegant Design System**: Hand-picked color palettes based on elegant Navy Blue (`#143A51`) and Golden highlights (`#FFD66D`), managed exclusively with SCSS Variables.
- 🚀 **Next-Gen Transitions**: Components feature intelligent staggered enter animations (`.slide-from-left`, `.slide-from-right`, `.slide-from-bottom`) leveraging the precise `IntersectionObserver` API! 
- 📱 **Fully Responsive**: Flawless visual structure on Mobile, iPad, and Desktop via modern CSS Grid/Flexbox layouts.
- ♻️ **Component-Driven**: Extremely modular architecture (`Navbar`, `Home`, `Service`, `Education`, `Project`, `Contact`) separated cleanly into distinct folders and `.jsx` & `.scss` assets.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite (for lightning fast HMR)
- **Styling**: SCSS (Vanilla CSS supercharged)
- **Icons**: React-Icons (`vsc`, `fa`, `io5`)
- **Animation**: Pure CSS Transitions & Keyframes (Zero heavy third-party animation libraries!)

## 📁 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/toiloi/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Spin up the development server:**
   ```bash
   npm run dev
   ```
   *Your portfolio should now be running at `http://localhost:5173`!*

4. **Build for Production:**
   ```bash
   npm run build
   ```
   *Ready to be deployed on Vercel, Netlify, or GitHub Pages!*

## 💡 About The Setup
- `SetupConfigs.css` handles the high-performance global splash screen logic and Scroll Reveals using smart `<section>` observers so the animations occur naturally exactly when the user scrolls to them!
- `index.css` acts as the root file supplying standard typographic tokens and global box resets.

---
*If you liked this setup, please consider starring ⭐ the repository!*
