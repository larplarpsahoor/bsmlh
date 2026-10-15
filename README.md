# Zorandus: Beyond The Gates - Official Website

An atmospheric and cinematic website for the upcoming 2D platformer adventure game "Zorandus: Beyond The Gates" by VALERIA Studios.

## 🎮 About The Game

In the ancient realm of Zorandus, where magic flows through forgotten ruins and shadows dance between worlds, a mystery unfolds that will test the bonds of brotherhood. When your brother vanishes without a trace, only cryptic clues remain—clues that point beyond the legendary gates that have stood sealed for centuries.

## ✨ Website Features

- **Cinematic Design**: Inspired by medieval fantasy aesthetics with rich typography and atmospheric colors
- **Full-Screen Hero**: Immersive background with overlay text and call-to-action buttons
- **Interactive Navigation**: Smooth scrolling between sections with elegant animations
- **Story Section**: Rich narrative content about the game's lore and setting
- **Features Showcase**: Highlight key game mechanics and features
- **Screenshot Gallery**: Interactive gallery with modal lightbox view
- **Video Trailer**: Embedded YouTube trailer section
- **FAQ Section**: Expandable questions and answers with thematic styling
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Coming Soon State**: Professional pre-release presentation
- **Future Demo System**: Built-in password-protected demo download system

## 🎨 Design Theme

- **Color Palette**: Rich golds (#d4af37), warm browns, and dark atmospheric backgrounds
- **Typography**: 
  - Cinzel for headings (medieval serif)
  - Cormorant Garamond for body text (elegant serif)
  - Inter for UI elements (modern sans-serif)
- **Visual Style**: Medieval fantasy with modern web aesthetics
- **Animations**: Smooth fade-ins, hover effects, and parallax scrolling

## 🛠 Technical Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Security**: Password hashing, rate limiting, token-based downloads
- **Notifications**: Discord webhook integration
- **Deployment**: Ready for Vercel, Netlify, or traditional hosting

## 📁 Project Structure

```
zorandus-website/
├── index.html          # Main page with all sections
├── style.css          # Complete styling with medieval theme
├── script.js          # Interactive functionality
├── server.js          # Express server for demo system
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
├── README.md          # This documentation
└── images/            # Game assets and media
    ├── favicon.svg
    ├── capsule.jpg     # Game thumbnail/logo
    ├── maxresdefault.jpg # Hero background
    └── ss01-ss10.jpg   # Screenshot gallery
```

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd zorandus-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Add game assets:**
   - Place your game screenshots in the `images/` folder
   - Update YouTube video ID in `index.html`
   - Replace placeholder images with actual game assets

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Server Configuration
PORT=3000

# Demo Access (SHA256 hash of password)
PASSWORD_HASH=your_password_hash_here

# File Hosting
DROPBOX_DOWNLOAD_URL=your_secure_dropbox_link

# Discord Notifications
DISCORD_WEBHOOK_URL=your_discord_webhook_url

# Security Settings
MAX_ATTEMPTS_PER_IP=5
RATE_LIMIT_WINDOW=900000
```

### Assets Setup

Replace these placeholder images in the `images/` folder:

- `maxresdefault.jpg` - Hero section background (1920x1080+ recommended)
- `capsule.jpg` - Game logo/thumbnail for header and footer
- `ss01.jpg` - Story section image
- `ss02.jpg` to `ss07.jpg` - Gallery screenshots (1280x720+ recommended)
- `favicon.svg` - Site favicon

### YouTube Trailer

Update the YouTube video ID in `index.html`:
```html
src="https://www.youtube.com/embed/YOUR_ACTUAL_VIDEO_ID"
```

## 🎯 Features Breakdown

### Navigation System
- Fixed header with smooth scroll navigation
- Elegant hover effects with gold accents
- Disabled "Coming Soon" download button
- Responsive mobile menu ready

### Hero Section
- Full-viewport immersive design
- Background parallax scrolling effect
- Atmospheric overlay with game title
- Compelling tagline and call-to-action
- Floating particle effects (optional)

### Content Sections
- **Story**: Rich narrative with side-by-side layout
- **Features**: Grid-based feature cards with hover animations  
- **Gallery**: Interactive screenshot gallery with lightbox
- **Trailers**: Responsive video embed with elegant frame
- **FAQ**: Collapsible Q&A with thematic language

### Interactive Elements
- Smooth scrolling between sections
- Gallery modal with keyboard navigation
- FAQ accordion with rotate animations
- Header background change on scroll
- Scroll-triggered content animations

## 🔐 Demo Download System

The site includes a complete demo download system for future activation:

### Security Features
- Password hashing (SHA256)
- Rate limiting (5 attempts per IP per 15 minutes)
- Temporary download tokens (5-minute expiry)
- IP address validation
- Single-use download links

### Discord Integration
- Automatic notifications on password attempts
- Download tracking with user IP and timestamp
- Embedded rich messages with game branding

### Activation Process
1. Enable download buttons by removing `disabled` attribute
2. Set up environment variables in `.env`
3. Configure Discord webhook for notifications
4. Upload demo file to secure hosting (Dropbox, etc.)
5. Share password with beta testers

## 📱 Responsive Design

- **Desktop**: Full cinematic experience with parallax effects
- **Tablet**: Optimized layouts with maintained visual hierarchy
- **Mobile**: Streamlined navigation and touch-optimized interactions
- **Cross-browser**: Compatible with modern browsers (IE11+)

## 🎨 Customization Guide

### Color Scheme
Update CSS variables in `:root` to change the entire color theme:
```css
:root {
    --primary-gold: #d4af37;      /* Main accent color */
    --secondary-gold: #b8860b;    /* Secondary accent */
    --dark-brown: #2c1810;        /* Dark backgrounds */
    --light-cream: #f4e8d0;       /* Text color */
}
```

### Typography
- Headers: Cinzel (medieval serif)
- Body: Cormorant Garamond (elegant serif)  
- UI: Inter (modern sans-serif)

### Animation Speeds
Modify transition durations in CSS for different pacing:
```css
transition: all 0.3s ease; /* Standard timing */
```

## 🚀 Deployment Options

### Vercel/Netlify (Static)
- Remove server-side functionality
- Use frontend-only version
- Environment variables via platform settings

### VPS/Dedicated Server
- Use PM2 for process management
- Configure Nginx reverse proxy
- Set up SSL certificates
- Monitor with system logs

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 SEO Optimization

- Semantic HTML structure
- Meta tags for social sharing
- Optimized images with alt text
- Structured data markup ready
- Fast loading times (<3s)
- Mobile-friendly design

## 🎭 Game Integration Ideas

- **Steam Wishlist**: Add Steam widget integration
- **Social Media**: Share buttons for screenshots
- **Newsletter**: Email signup for updates
- **Press Kit**: Downloadable media assets
- **Community**: Discord/Reddit integration

## 📊 Analytics Ready

The site is prepared for analytics integration:
- Google Analytics 4 ready
- Event tracking for interactions
- Conversion funnel for demo downloads
- User behavior heatmaps compatible

## 🛡 Security Considerations

- Input sanitization and validation
- HTTPS enforcement ready
- CSRF protection for forms
- Rate limiting on API endpoints
- Secure file download system
- Environment variable protection

## 📄 License

© 2024 VALERIA Studios. All rights reserved.
Zorandus: Beyond The Gates™ is a trademark of VALERIA Studios.

## 🤝 Contributing

This is a commercial project. For inquiries about the game or website, please contact VALERIA Studios.

---

*"Your brother is missing. His trail leads beyond the gates."*