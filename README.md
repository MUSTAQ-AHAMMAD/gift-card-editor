# 🎁 Gift Card Editor

A beautiful, bilingual (Arabic/English) web application that lets employees create and download personalized Eid gift cards from multiple brands.

## ✨ Features

- **4 Elegant Card Designs**: Eid Mubarak classic, MATCH Design 1, MATCH Design 2, Salfa Classic
- **Bilingual Support**: Full Arabic (RTL) and English (LTR) interface
- **Live Preview**: Real-time canvas rendering as you type your name
- **Download Formats**: PDF, JPEG, and PNG (high resolution 2000×2000px)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **No Server Required**: Pure HTML/CSS/JavaScript — open `index.html` directly in a browser

## 🚀 Quick Start

1. Clone or download this repository
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
3. No build step or server required!

## 📁 File Structure

```
/
├── index.html          # Main application page
├── css/
│   └── styles.css      # Styles with RTL/LTR support, animations
├── js/
│   ├── i18n.js         # Translations (Arabic & English)
│   ├── cardRenderer.js # Canvas-based card drawing engine
│   └── app.js          # Application logic, download handlers
├── assets/
│   ├── cards/          # Card template assets (optional external images)
│   └── fonts/          # Custom font files if needed
└── README.md
```

## 🎨 Card Designs

| ID | Brand | Description |
|----|-------|-------------|
| `eid1` | Eid | Beige parchment with topographic patterns and Arabic calligraphy |
| `match1` | MATCH | Blue-striped border, centered bilingual text, MATCH branding |
| `match2` | MATCH | Navy top section with gold accent, diagonal split layout |
| `salfa` | Salfa | Arched frame with hoopoe birds, warm gold tones |

## 🌐 Language Support

- Toggle between **Arabic** and **English** using the button in the header
- Language preference is saved in `localStorage`
- Arabic names render RTL; English names render LTR automatically

## 📥 Download Formats

| Format | Quality | Use Case |
|--------|---------|----------|
| PDF | Print-ready | Physical printing |
| JPEG | 92% quality | Digital sharing, email |
| PNG | Lossless | Social media, transparency |

All downloads are **2000×2000px** high resolution.

## 🛠 Technology Stack

- **HTML5 Canvas** for card rendering
- **jsPDF** (CDN) for PDF generation
- **Google Fonts**: Amiri, Cairo (Arabic); Playfair Display, Lora (English)
- Pure vanilla JavaScript — no frameworks or build tools needed

## 📱 Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📄 License

MIT
