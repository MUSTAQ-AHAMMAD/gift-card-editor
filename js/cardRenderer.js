/**
 * Card Renderer Module
 * Handles Canvas-based rendering of gift cards with custom name overlays
 */

const cardRenderer = {
  CANVAS_WIDTH: 2000,
  CANVAS_HEIGHT: 2000,

  cards: [
    {
      id: 'eid1',
      brand: 'eid',
      nameKey: 'brands.eid1',
      // Name area configuration (relative to canvas 2000x2000)
      nameArea: {
        x: 1000,
        y: 1640,
        maxWidth: 1400,
        fontSize: 72,
        fontFamily: 'Amiri, Georgia, serif',
        color: '#5C3D1E',
        align: 'center',
        direction: 'auto'
      },
      bgColor: '#F5ECD7',
      drawBackground: function(ctx, w, h) {
        cardRenderer.drawEidBackground(ctx, w, h);
      }
    },
    {
      id: 'match1',
      brand: 'match',
      nameKey: 'brands.match1',
      nameArea: {
        x: 1000,
        y: 1600,
        maxWidth: 1300,
        fontSize: 68,
        fontFamily: 'Amiri, Georgia, serif',
        color: '#2C3E6B',
        align: 'center',
        direction: 'auto'
      },
      bgColor: '#F7F3EC',
      drawBackground: function(ctx, w, h) {
        cardRenderer.drawMatchBackground1(ctx, w, h);
      }
    },
    {
      id: 'match2',
      brand: 'match',
      nameKey: 'brands.match2',
      nameArea: {
        x: 1000,
        y: 1650,
        maxWidth: 1300,
        fontSize: 68,
        fontFamily: 'Amiri, Georgia, serif',
        color: '#2C3E6B',
        align: 'center',
        direction: 'auto'
      },
      bgColor: '#EEF2F7',
      drawBackground: function(ctx, w, h) {
        cardRenderer.drawMatchBackground2(ctx, w, h);
      }
    },
    {
      id: 'salfa',
      brand: 'salfa',
      nameKey: 'brands.salfa',
      nameArea: {
        x: 1000,
        y: 1620,
        maxWidth: 1300,
        fontSize: 68,
        fontFamily: 'Amiri, Georgia, serif',
        color: '#4A2C0A',
        align: 'center',
        direction: 'auto'
      },
      bgColor: '#FDF6E3',
      drawBackground: function(ctx, w, h) {
        cardRenderer.drawSalfaBackground(ctx, w, h);
      }
    }
  ],

  // ─── DESIGN 1: Eid Mubarak ────────────────────────────────────────────
  drawEidBackground(ctx, w, h) {
    // Creamy beige base
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#F5ECD7');
    bg.addColorStop(0.5, '#EFE0C4');
    bg.addColorStop(1, '#E8D5B0');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Topographic flowing lines (decorative)
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#8B6F47';
    ctx.lineWidth = 6;
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      const offsetY = -200 + i * 100;
      ctx.moveTo(0, offsetY + 300);
      ctx.bezierCurveTo(
        w * 0.2, offsetY + 100,
        w * 0.5, offsetY + 500,
        w * 0.8, offsetY + 200
      );
      ctx.bezierCurveTo(w * 0.9, offsetY + 150, w, offsetY + 250, w, offsetY + 300);
      ctx.stroke();
    }
    ctx.restore();

    // Bottom topographic wave band
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#C4934A';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.78);
    ctx.bezierCurveTo(w * 0.25, h * 0.74, w * 0.5, h * 0.82, w * 0.75, h * 0.77);
    ctx.bezierCurveTo(w * 0.88, h * 0.74, w, h * 0.79, w, h * 0.78);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Outer border frame
    const borderMargin = 60;
    ctx.save();
    ctx.strokeStyle = '#8B6F47';
    ctx.lineWidth = 12;
    this._roundRect(ctx, borderMargin, borderMargin, w - borderMargin * 2, h - borderMargin * 2, 30);
    ctx.stroke();

    ctx.strokeStyle = '#C4934A';
    ctx.lineWidth = 5;
    this._roundRect(ctx, borderMargin + 18, borderMargin + 18, w - (borderMargin + 18) * 2, h - (borderMargin + 18) * 2, 22);
    ctx.stroke();
    ctx.restore();

    // Arabic calligraphy: عيد مبارك
    ctx.save();
    ctx.font = 'bold 220px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';

    // Shadow
    ctx.shadowColor = 'rgba(90,50,10,0.25)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;

    const grad = ctx.createLinearGradient(0, 400, 0, 750);
    grad.addColorStop(0, '#7A4F1E');
    grad.addColorStop(0.5, '#B5782A');
    grad.addColorStop(1, '#6B3F12');
    ctx.fillStyle = grad;
    ctx.fillText('عيد مبارك', w / 2, h * 0.36);
    ctx.restore();

    // Subtitle line
    ctx.save();
    ctx.font = '80px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#8B6F47';
    ctx.globalAlpha = 0.8;
    ctx.fillText('Eid Mubarak', w / 2, h * 0.50);
    ctx.restore();

    // Decorative divider
    this._drawDivider(ctx, w, h * 0.57, '#8B6F47');

    // Name label line
    ctx.save();
    ctx.font = '55px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#6B4C1E';
    ctx.globalAlpha = 0.75;
    ctx.fillText('المُهدى إليه:', w / 2, h * 0.78);
    ctx.restore();

    // Decorative name underline area
    ctx.save();
    ctx.strokeStyle = '#A07840';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.845);
    ctx.lineTo(w * 0.8, h * 0.845);
    ctx.stroke();
    ctx.restore();

    // Corner ornaments
    this._drawCornerOrnament(ctx, 100, 100, '#8B6F47');
    this._drawCornerOrnament(ctx, w - 100, 100, '#8B6F47', true);
    this._drawCornerOrnament(ctx, 100, h - 100, '#8B6F47', false, true);
    this._drawCornerOrnament(ctx, w - 100, h - 100, '#8B6F47', true, true);
  },

  // ─── DESIGN 2: MATCH Design 1 ─────────────────────────────────────────
  drawMatchBackground1(ctx, w, h) {
    // Base warm beige
    ctx.fillStyle = '#F7F3EC';
    ctx.fillRect(0, 0, w, h);

    // Blue striped border (top/bottom bands)
    const stripeColors = ['#1A3A6B', '#2E5494', '#4A76C8', '#2E5494', '#1A3A6B'];
    const stripeH = 55;
    const totalStripeH = stripeColors.length * stripeH;

    // Top border stripes
    stripeColors.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(0, i * stripeH, w, stripeH);
    });

    // Bottom border stripes (reversed)
    [...stripeColors].reverse().forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(0, h - totalStripeH + i * stripeH, w, stripeH);
    });

    // Side subtle stripe lines
    ctx.save();
    stripeColors.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(i * stripeH, totalStripeH, stripeH, h - totalStripeH * 2);
      ctx.fillRect(w - totalStripeH + i * stripeH, totalStripeH, stripeH, h - totalStripeH * 2);
    });
    ctx.restore();

    // Inner content area
    const innerMargin = totalStripeH + 20;
    ctx.fillStyle = '#F7F3EC';
    ctx.fillRect(innerMargin, innerMargin, w - innerMargin * 2, h - innerMargin * 2);

    // Inner border line
    ctx.save();
    ctx.strokeStyle = '#1A3A6B';
    ctx.lineWidth = 6;
    ctx.strokeRect(innerMargin + 20, innerMargin + 20, w - (innerMargin + 20) * 2, h - (innerMargin + 20) * 2);
    ctx.restore();

    // MATCH brand text at top
    ctx.save();
    ctx.font = 'bold 160px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1A3A6B';
    ctx.letterSpacing = '20px';
    ctx.fillText('MATCH', w / 2, innerMargin + 180);
    ctx.restore();

    // Decorative logo mark
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, innerMargin + 380, 60, 0, Math.PI * 2);
    ctx.strokeStyle = '#1A3A6B';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.font = 'bold 70px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1A3A6B';
    ctx.fillText('M', w / 2, innerMargin + 380);
    ctx.restore();

    // عيد مبارك Arabic text
    ctx.save();
    ctx.font = 'bold 170px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#1A3A6B';
    ctx.shadowColor = 'rgba(26,58,107,0.2)';
    ctx.shadowBlur = 15;
    ctx.fillText('عيد مبارك', w / 2, h * 0.52);
    ctx.restore();

    // English subtitle
    ctx.save();
    ctx.font = 'italic 75px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#2E5494';
    ctx.fillText('Eid Mubarak', w / 2, h * 0.63);
    ctx.restore();

    // Divider
    this._drawDivider(ctx, w, h * 0.70, '#1A3A6B');

    // Name label
    ctx.save();
    ctx.font = '55px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#1A3A6B';
    ctx.globalAlpha = 0.7;
    ctx.fillText('المُهدى إليه:', w / 2, h * 0.78);
    ctx.restore();

    // Name underline
    ctx.save();
    ctx.strokeStyle = '#1A3A6B';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.845);
    ctx.lineTo(w * 0.8, h * 0.845);
    ctx.stroke();
    ctx.restore();
  },

  // ─── DESIGN 3: MATCH Design 2 ─────────────────────────────────────────
  drawMatchBackground2(ctx, w, h) {
    // Light blue-grey base
    ctx.fillStyle = '#EEF2F7';
    ctx.fillRect(0, 0, w, h);

    // Top section: dark navy
    ctx.fillStyle = '#1A3A6B';
    ctx.fillRect(0, 0, w, h * 0.45);

    // Diagonal split
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h * 0.45);
    ctx.lineTo(w, h * 0.42);
    ctx.lineTo(w, h * 0.45);
    ctx.closePath();
    ctx.fillStyle = '#2E5494';
    ctx.fill();
    ctx.restore();

    // Gold accent line
    ctx.save();
    ctx.strokeStyle = '#C4A84A';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.44);
    ctx.lineTo(w * 0.9, h * 0.44);
    ctx.stroke();
    ctx.restore();

    // MATCH brand text (white on dark)
    ctx.save();
    ctx.font = 'bold 170px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 20;
    ctx.fillText('MATCH', w / 2, h * 0.17);
    ctx.restore();

    // Star/diamond decorations on dark part
    ctx.save();
    ctx.fillStyle = '#C4A84A';
    ctx.globalAlpha = 0.6;
    this._drawStar(ctx, w * 0.15, h * 0.08, 25);
    this._drawStar(ctx, w * 0.85, h * 0.08, 25);
    this._drawStar(ctx, w * 0.5, h * 0.07, 18);
    ctx.restore();

    // عيد مبارك on dark section
    ctx.save();
    ctx.font = 'bold 160px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#F0D98A';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 15;
    ctx.fillText('عيد مبارك', w / 2, h * 0.33);
    ctx.restore();

    // Bottom section content (light bg)
    ctx.save();
    ctx.font = 'italic 80px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#2E5494';
    ctx.fillText('Eid Mubarak', w / 2, h * 0.57);
    ctx.restore();

    // Decorative arch
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.65, 180, Math.PI, 0, false);
    ctx.strokeStyle = '#1A3A6B';
    ctx.lineWidth = 6;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.restore();

    // MATCH logo at bottom
    ctx.save();
    ctx.font = 'bold 100px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1A3A6B';
    ctx.globalAlpha = 0.4;
    ctx.fillText('MATCH', w / 2, h * 0.92);
    ctx.restore();

    // Divider
    this._drawDivider(ctx, w, h * 0.70, '#1A3A6B');

    // Name label
    ctx.save();
    ctx.font = '55px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#1A3A6B';
    ctx.globalAlpha = 0.7;
    ctx.fillText('المُهدى إليه:', w / 2, h * 0.79);
    ctx.restore();

    // Name underline
    ctx.save();
    ctx.strokeStyle = '#1A3A6B';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.845);
    ctx.lineTo(w * 0.8, h * 0.845);
    ctx.stroke();
    ctx.restore();
  },

  // ─── DESIGN 4: Salfa ──────────────────────────────────────────────────
  drawSalfaBackground(ctx, w, h) {
    // Warm parchment base
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#FDF6E3');
    bg.addColorStop(0.5, '#F5E8C0');
    bg.addColorStop(1, '#EDDBA0');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Arched frame
    ctx.save();
    ctx.beginPath();
    const archX = w * 0.12;
    const archY = h * 0.07;
    const archW = w * 0.76;
    const archH = h * 0.82;
    const archR = archW / 2;

    // Draw arch shape
    ctx.moveTo(archX, archY + archH);
    ctx.lineTo(archX, archY + archR);
    ctx.arc(archX + archR, archY + archR, archR, Math.PI, 0, false);
    ctx.lineTo(archX + archW, archY + archH);
    ctx.closePath();
    ctx.strokeStyle = '#7A4F1E';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Inner arch border
    const inset = 25;
    ctx.beginPath();
    ctx.moveTo(archX + inset, archY + archH);
    ctx.lineTo(archX + inset, archY + archR + inset * 0.3);
    ctx.arc(archX + archR, archY + archR, archR - inset, Math.PI, 0, false);
    ctx.lineTo(archX + archW - inset, archY + archH);
    ctx.strokeStyle = '#C4934A';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    // Hoopoe birds (stylized) at top of arch
    ctx.save();
    ctx.fillStyle = '#7A4F1E';
    ctx.globalAlpha = 0.8;
    this._drawHoopoe(ctx, w / 2 - 200, h * 0.13);
    this._drawHoopoe(ctx, w / 2 + 200, h * 0.13, true);
    ctx.restore();

    // Small decorative elements at arch top
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.09, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#7A4F1E';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.09, 35, 0, Math.PI * 2);
    ctx.fillStyle = '#FDF6E3';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.09, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#C4934A';
    ctx.fill();
    ctx.restore();

    // عيد مبارك large Arabic text
    ctx.save();
    ctx.font = 'bold 190px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    const grad = ctx.createLinearGradient(0, h * 0.28, 0, h * 0.52);
    grad.addColorStop(0, '#5C2E00');
    grad.addColorStop(0.5, '#A0621A');
    grad.addColorStop(1, '#5C2E00');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(90,40,0,0.2)';
    ctx.shadowBlur = 20;
    ctx.fillText('عيد مبارك', w / 2, h * 0.37);
    ctx.restore();

    // Decorative subtitle
    ctx.save();
    ctx.font = 'italic 75px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#8B5E1A';
    ctx.fillText('Eid Mubarak', w / 2, h * 0.49);
    ctx.restore();

    // Small ornament divider
    this._drawDivider(ctx, w, h * 0.56, '#7A4F1E');

    // Salfa brand name
    ctx.save();
    ctx.font = 'bold 110px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#5C2E00';
    ctx.globalAlpha = 0.9;
    ctx.fillText('صالحة', w / 2, h * 0.635);
    ctx.restore();

    ctx.save();
    ctx.font = 'bold 75px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#7A4F1E';
    ctx.globalAlpha = 0.7;
    ctx.fillText('SALFA', w / 2, h * 0.71);
    ctx.restore();

    // Name label
    ctx.save();
    ctx.font = '55px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#5C2E00';
    ctx.globalAlpha = 0.7;
    ctx.fillText('المُهدى إليه:', w / 2, h * 0.79);
    ctx.restore();

    // Name underline
    ctx.save();
    ctx.strokeStyle = '#7A4F1E';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.845);
    ctx.lineTo(w * 0.78, h * 0.845);
    ctx.stroke();
    ctx.restore();
  },

  // ─── Helper: Draw name text on canvas ─────────────────────────────────
  drawName(ctx, card, name) {
    if (!name) return;
    const na = card.nameArea;
    ctx.save();
    ctx.font = `bold ${na.fontSize}px ${na.fontFamily}`;
    ctx.textAlign = na.align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = na.color;
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Auto-detect direction
    const isArabic = /[\u0600-\u06FF]/.test(name);
    ctx.direction = isArabic ? 'rtl' : 'ltr';

    // Wrap/shrink text if too wide
    let fontSize = na.fontSize;
    ctx.font = `bold ${fontSize}px ${na.fontFamily}`;
    while (ctx.measureText(name).width > na.maxWidth && fontSize > 30) {
      fontSize -= 4;
      ctx.font = `bold ${fontSize}px ${na.fontFamily}`;
    }

    ctx.fillText(name, na.x, na.y);
    ctx.restore();
  },

  // ─── Load custom cards uploaded by admin from localStorage ───────────
  loadCustomCards() {
    try {
      const stored = localStorage.getItem('gce-custom-designs');
      if (!stored) return;
      const customs = JSON.parse(stored);
      if (!Array.isArray(customs)) return;

      // Remove previously loaded custom cards to avoid duplicates
      this.cards = this.cards.filter(c => !c._custom);

      customs.forEach(design => {
        if (!design.id || !design.data) return;
        const card = {
          id: design.id,
          brand: design.brand || 'custom',
          nameKey: design.nameKey || 'brands.' + design.id,
          _custom: true,
          _customName: design.name || design.id,
          nameArea: design.nameArea || {
            x: 1000, y: 1700, maxWidth: 1400, fontSize: 68,
            fontFamily: 'Amiri, Georgia, serif', color: '#3A2A14',
            align: 'center', direction: 'auto'
          },
          bgColor: '#FDF6E3',
          _imageData: design.data,
          drawBackground: null // set below
        };

        // Build a drawBackground that draws the uploaded image (placeholder for sync render path)
        card.drawBackground = (ctx, w, h) => {
          cardRenderer._drawImageCard(ctx, w, h);
        };
        this.cards.push(card);
      });
    } catch (e) {
      console.warn('Failed to load custom designs:', e);
    }
  },

  // ─── Draw placeholder for custom image cards in the sync render path ────
  // (Actual image rendering is handled asynchronously via renderPreview/renderAsync)
  _drawImageCard(ctx, w, h) {
    ctx.fillStyle = '#FDF6E3';
    ctx.fillRect(0, 0, w, h);
    ctx.font = 'bold 60px Amiri, serif';
    ctx.fillStyle = '#8B6F47';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🖼️', w / 2, h / 2);
  },

  // ─── Async render for image-based cards (handles img.onload) ──────────
  renderAsync(canvas, cardId, name, callback) {
    const card = this.cards.find(c => c.id === cardId);
    if (!card) { if (callback) callback(); return; }

    const ctx = canvas.getContext('2d');
    canvas.width = this.CANVAS_WIDTH;
    canvas.height = this.CANVAS_HEIGHT;

    if (card._imageData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        if (name && name.trim()) this.drawName(ctx, card, name.trim());
        if (callback) callback();
      };
      img.onerror = () => {
        card.drawBackground(ctx, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        if (name && name.trim()) this.drawName(ctx, card, name.trim());
        if (callback) callback();
      };
      img.src = card._imageData;
    } else {
      card.drawBackground(ctx, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
      if (name && name.trim()) this.drawName(ctx, card, name.trim());
      if (callback) callback();
    }
  },

  // ─── Main render function ──────────────────────────────────────────────
  render(canvas, cardId, name) {
    const card = this.cards.find(c => c.id === cardId);
    if (!card) return;

    const ctx = canvas.getContext('2d');
    canvas.width = this.CANVAS_WIDTH;
    canvas.height = this.CANVAS_HEIGHT;

    // Draw background design
    card.drawBackground(ctx, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    // Draw name
    if (name && name.trim()) {
      this.drawName(ctx, card, name.trim());
    }
  },

  // ─── Preview render (scaled for display) ──────────────────────────────
  renderPreview(previewCanvas, cardId, name, displaySize) {
    const card = this.cards.find(c => c.id === cardId);
    const size = displaySize || 600;

    if (card && card._imageData) {
      // Async path for uploaded images
      const img = new Image();
      img.onload = () => {
        previewCanvas.width = size;
        previewCanvas.height = size;
        const ctx = previewCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        if (name && name.trim()) {
          // scale nameArea for the preview size
          const scale = size / this.CANVAS_WIDTH;
          const scaledCard = Object.assign({}, card, {
            nameArea: Object.assign({}, card.nameArea, {
              x: card.nameArea.x * scale,
              y: card.nameArea.y * scale,
              maxWidth: card.nameArea.maxWidth * scale,
              fontSize: card.nameArea.fontSize * scale
            })
          });
          this.drawName(ctx, scaledCard, name.trim());
        }
      };
      img.src = card._imageData;
      return;
    }

    const offscreen = document.createElement('canvas');
    this.render(offscreen, cardId, name);

    previewCanvas.width = size;
    previewCanvas.height = size;
    const ctx = previewCanvas.getContext('2d');
    ctx.drawImage(offscreen, 0, 0, size, size);
  },

  // ─── Thumbnail render ─────────────────────────────────────────────────
  renderThumbnail(canvas, cardId) {
    this.renderPreview(canvas, cardId, '', 400);
  },

  // ─── Helper Utilities ─────────────────────────────────────────────────
  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  _drawDivider(ctx, w, y, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.4;

    const cx = w / 2;
    // Center diamond
    ctx.beginPath();
    ctx.moveTo(cx, y - 14);
    ctx.lineTo(cx + 14, y);
    ctx.lineTo(cx, y + 14);
    ctx.lineTo(cx - 14, y);
    ctx.closePath();
    ctx.stroke();

    // Lines extending from diamond
    ctx.beginPath();
    ctx.moveTo(cx - 20, y);
    ctx.lineTo(cx - w * 0.33, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 20, y);
    ctx.lineTo(cx + w * 0.33, y);
    ctx.stroke();

    // Small diamonds at line ends
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.33, y - 8);
    ctx.lineTo(cx - w * 0.33 + 8, y);
    ctx.lineTo(cx - w * 0.33, y + 8);
    ctx.lineTo(cx - w * 0.33 - 8, y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + w * 0.33, y - 8);
    ctx.lineTo(cx + w * 0.33 + 8, y);
    ctx.lineTo(cx + w * 0.33, y + 8);
    ctx.lineTo(cx + w * 0.33 - 8, y);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  },

  _drawCornerOrnament(ctx, x, y, color, flipX = false, flipY = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.5;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(60, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 60);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI / 2);
    ctx.stroke();

    ctx.restore();
  },

  _drawStar(ctx, x, y, r) {
    const points = 4;
    const outerR = r;
    const innerR = r * 0.4;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const rad = i % 2 === 0 ? outerR : innerR;
      if (i === 0) ctx.moveTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
      else ctx.lineTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fill();
  },

  _drawHoopoe(ctx, x, y, flip = false) {
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 55, 32, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(52, -18, 22, 0, Math.PI * 2);
    ctx.fill();

    // Crest (hoopoe crown)
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const cx = 45 + i * 6;
      const baseY = -30;
      ctx.moveTo(cx, baseY);
      ctx.bezierCurveTo(cx - 8, baseY - 30, cx + 8, baseY - 30, cx, baseY - 45);
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();

    // Beak
    ctx.beginPath();
    ctx.moveTo(72, -20);
    ctx.lineTo(105, -15);
    ctx.lineTo(72, -14);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(58, -22, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FDF6E3';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(59, -22, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#2A1200';
    ctx.fill();

    ctx.restore();
  }
};
