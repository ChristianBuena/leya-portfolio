# Leya's Interactive Journal Portfolio

A whimsical, interactive flipbook-style portfolio website that mimics the look and feel of a personal scrapbook journal. Built with HTML, TailwindCSS, and GSAP animations.

## 🎨 Features

### Design Elements
- **Scrapbook Aesthetics**: Paper textures, sticky notes, doodles, and handwritten fonts
- **Journal Binding**: Realistic spiral binding with ring holes
- **Page Flipping**: Smooth 3D page turn animations using GSAP Flip
- **Polaroid Photos**: Vintage-style photo frames with tape decorations
- **Sticky Notes**: Colorful post-it style notes with rotation and shadows
- **Hand-drawn Elements**: Signature animations, doodles, and sketchy borders

### Interactive Features
- **Smooth Navigation**: Arrow keys, mouse wheel, or click navigation
- **Flip Card Skills**: Hover to reveal skill details
- **Project Cards**: Expandable project showcases with overlay details
- **Contact Form**: Animated form with submission feedback
- **Responsive Design**: Mobile-friendly layout with touch support
- **Sound Effects**: Subtle page flip audio feedback

### Pages Included
1. **Cover Page**: Welcome message with animated signature
2. **About Me**: Personal intro with Polaroid photo and fun facts
3. **Projects**: Interactive project cards with flip animations
4. **Resume Timeline**: Visual journey with animated timeline
5. **Skills & Tools**: Flip cards showing frontend/backend expertise
6. **Contact**: Sticky note form with social links

## 🛠️ Technologies Used

- **HTML5**: Semantic structure and accessibility
- **TailwindCSS**: Utility-first styling with custom color palette
- **GSAP (GreenSock)**: Professional-grade animations
  - GSAP Flip Plugin: Page flipping effects
  - ScrollTrigger: Scroll-based animations
- **Custom CSS**: Paper textures, shadows, and handwritten aesthetics
- **Vanilla JavaScript**: Interactive controls and state management

## 🚀 Quick Start

1. **Clone or Download**: Get the project files
2. **Open**: Double-click `index.html` or serve via local server
3. **Navigate**: Use arrow keys, mouse wheel, or click the dots to flip pages
4. **Interact**: Hover over elements, click project cards, fill out the contact form

## 📱 Browser Support

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Performance Features

- **Optimized Animations**: Reduced motion support for accessibility
- **Lazy Loading**: Content loads as pages are accessed
- **Mobile Responsive**: Touch-friendly navigation
- **Print Friendly**: Printer-optimized styles
- **Performance Monitoring**: Pause animations when tab is hidden

## 🎨 Customization

### Colors
The project uses a custom color palette defined in TailwindCSS:
- `paper`: #fef9e7 (main background)
- `old-paper`: #f4f1e8 (aged paper effect)
- `pink-sticky`: #fde68a (sticky note colors)
- `blue-sticky`: #bfdbfe
- `green-sticky`: #bbf7d0

### Fonts
- **Journal Text**: Kalam (handwritten feel)
- **Signatures**: Caveat (script font)
- **Doodles**: Amatic SC (playful font)

### Animation Timing
- Page flips: 0.8s duration
- Element reveals: 0.6s with stagger
- Hover effects: 0.3s quick response

## 📐 Project Structure

```
leya-portfolio/
├── index.html          # Main HTML structure
├── styles.css          # Custom CSS and animations
├── script.js           # JavaScript interactions and GSAP animations
└── README.md          # This documentation
```

## 🔧 Development Notes

### Key Classes
- `.journal-page`: Individual page container
- `.sticky-note`: Post-it style notes with random rotations
- `.flip-card`: Interactive skill cards with 3D flip effect
- `.timeline-item`: Resume timeline entries with scroll animations
- `.project-card`: Expandable project showcases

### JavaScript Architecture
- `JournalController`: Main class handling page navigation and animations
- `JournalEffects`: Utility class for additional visual effects
- Event-driven architecture with keyboard, mouse, and touch support

### Animation Features
- 3D page turning with GSAP Flip
- Staggered content reveals
- Mouse-following floating elements
- Scroll-triggered animations
- Form submission feedback

## 🎨 Design Philosophy

This portfolio is designed to feel like a **personal, artistic experience** rather than a corporate website. Every element has a handcrafted, whimsical feel:

- **Imperfect Rotations**: Elements are slightly tilted for organic feel
- **Paper Textures**: Subtle noise and grain effects
- **Hand-drawn Elements**: Sketchy borders and doodle decorations
- **Warm Colors**: Pastel palette with paper-inspired tones
- **Playful Interactions**: Delightful micro-animations and feedback

## 🌟 Future Enhancements

Potential additions for further development:
- Audio narration for each page
- More interactive project demos
- Blog integration with journal entries
- Advanced particle effects
- Theme switching (light/dark modes)
- Multi-language support

## 📞 Contact

Built with ❤️ by Leya Thaobunyuen
- Email: leya.thaobunyuen@email.com
- Location: Bangkok, Thailand

---

*This portfolio showcases both technical skills and creative design thinking, demonstrating the perfect blend of functionality and artistic expression.*
