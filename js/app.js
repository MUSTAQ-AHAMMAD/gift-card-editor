/**
 * Main Application Logic
 * Gift Card Editor - app.js
 */

const app = {
  selectedCard: null,
  name: '',
  previewDebounce: null,

  init() {
    // Apply language from storage
    i18n.init();

    // Build the brand cards grid
    this.buildCardGrid();

    // Set up event listeners
    this.setupEvents();

    // Render all thumbnails
    this.renderThumbnails();

    // Initial UI state
    this.updateUI();
  },

  buildCardGrid() {
    const grid = document.getElementById('card-grid');
    if (!grid) return;
    grid.innerHTML = '';

    cardRenderer.cards.forEach(card => {
      const div = document.createElement('div');
      div.className = 'card-item';
      div.dataset.cardId = card.id;
      div.setAttribute('tabindex', '0');
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label', i18n.t(card.nameKey));

      const canvasWrapper = document.createElement('div');
      canvasWrapper.className = 'card-thumbnail-wrapper';

      const canvas = document.createElement('canvas');
      canvas.className = 'card-thumbnail';
      canvas.id = `thumb-${card.id}`;

      const label = document.createElement('div');
      label.className = 'card-label';
      label.textContent = i18n.t(card.nameKey);
      label.setAttribute('data-card-label', card.id);

      canvasWrapper.appendChild(canvas);
      div.appendChild(canvasWrapper);
      div.appendChild(label);
      grid.appendChild(div);

      // Click / keyboard
      div.addEventListener('click', () => this.selectCard(card.id));
      div.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectCard(card.id);
        }
      });
    });
  },

  renderThumbnails() {
    cardRenderer.cards.forEach(card => {
      const canvas = document.getElementById(`thumb-${card.id}`);
      if (canvas) {
        cardRenderer.renderThumbnail(canvas, card.id);
      }
    });
  },

  setupEvents() {
    // Language toggle
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const newLang = i18n.currentLang === 'ar' ? 'en' : 'ar';
        i18n.setLang(newLang);
        langBtn.textContent = i18n.t('langToggle');
        // Refresh card labels
        document.querySelectorAll('[data-card-label]').forEach(el => {
          const cardId = el.dataset.cardLabel;
          const card = cardRenderer.cards.find(c => c.id === cardId);
          if (card) el.textContent = i18n.t(card.nameKey);
        });
        this.updatePreview();
      });
    }

    // Name input
    const nameInput = document.getElementById('name-input');
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        this.name = nameInput.value;
        this.updateCharCount();
        clearTimeout(this.previewDebounce);
        this.previewDebounce = setTimeout(() => this.updatePreview(), 300);
      });
    }

    // Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('name-input');
        if (nameInput) {
          nameInput.value = '';
          this.name = '';
          this.updateCharCount();
          this.updatePreview();
        }
      });
    }

    // Download buttons
    ['pdf', 'jpeg', 'png'].forEach(fmt => {
      const btn = document.getElementById(`download-${fmt}`);
      if (btn) {
        btn.addEventListener('click', () => this.download(fmt));
      }
    });
  },

  selectCard(cardId) {
    this.selectedCard = cardId;

    // Update visual selection
    document.querySelectorAll('.card-item').forEach(el => {
      el.classList.toggle('selected', el.dataset.cardId === cardId);
    });

    this.updatePreview();
    this.updateUI();

    // Scroll to preview on mobile
    const previewSection = document.getElementById('preview-section');
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  updatePreview() {
    const canvas = document.getElementById('preview-canvas');
    const placeholder = document.getElementById('preview-placeholder');

    if (!this.selectedCard) {
      if (canvas) canvas.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
      return;
    }

    if (canvas) canvas.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';

    const containerWidth = canvas ? canvas.parentElement.clientWidth || 600 : 600;
    const size = Math.min(containerWidth - 20, 700);

    cardRenderer.renderPreview(canvas, this.selectedCard, this.name, size);
  },

  updateCharCount() {
    const counter = document.getElementById('char-count');
    if (counter) {
      const len = (document.getElementById('name-input')?.value || '').length;
      counter.textContent = `${len} ${i18n.t('charCount')}`;
    }
  },

  updateUI() {
    // Enable/disable download buttons
    const hasCard = !!this.selectedCard;
    ['pdf', 'jpeg', 'png'].forEach(fmt => {
      const btn = document.getElementById(`download-${fmt}`);
      if (btn) {
        btn.disabled = !hasCard;
        btn.classList.toggle('disabled', !hasCard);
      }
    });
  },

  getHighResCanvas() {
    const offscreen = document.createElement('canvas');
    cardRenderer.render(offscreen, this.selectedCard, this.name);
    return offscreen;
  },

  generateFilename(ext) {
    const card = cardRenderer.cards.find(c => c.id === this.selectedCard);
    const brand = card ? card.brand : 'gift';
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `${brand}-gift-card-${ts}.${ext}`;
  },

  async download(format) {
    if (!this.selectedCard) {
      this.showNotification(i18n.t('selectCardFirst'), 'warning');
      return;
    }

    const btn = document.getElementById(`download-${format}`);
    if (btn) {
      btn.classList.add('loading');
      btn.disabled = true;
    }

    try {
      const canvas = this.getHighResCanvas();

      if (format === 'png') {
        this.downloadDataURL(canvas.toDataURL('image/png'), this.generateFilename('png'));
      } else if (format === 'jpeg') {
        this.downloadDataURL(canvas.toDataURL('image/jpeg', 0.92), this.generateFilename('jpg'));
      } else if (format === 'pdf') {
        await this.downloadPDF(canvas);
      }

      this.showNotification(i18n.t('downloadSuccess'), 'success');
    } catch (err) {
      console.error('Download error:', err);
      this.showNotification('Download failed. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.classList.remove('loading');
        btn.disabled = false;
      }
    }
  },

  downloadDataURL(dataURL, filename) {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  async downloadPDF(canvas) {
    // jsPDF is loaded via CDN
    const { jsPDF } = window.jspdf;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [200, 200]
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, 200, 200);
    pdf.save(this.generateFilename('pdf'));
  },

  showNotification(msg, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = msg;
    document.body.appendChild(notif);

    requestAnimationFrame(() => {
      notif.classList.add('show');
    });

    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 400);
    }, 3000);
  }
};

// Wait for fonts + DOM
document.addEventListener('DOMContentLoaded', () => {
  if (document.fonts) {
    document.fonts.ready.then(() => {
      app.init();
      // Re-render thumbnails after fonts load
      setTimeout(() => app.renderThumbnails(), 500);
    });
  } else {
    app.init();
  }
});

// Handle window resize for preview
window.addEventListener('resize', () => {
  clearTimeout(app._resizeTimer);
  app._resizeTimer = setTimeout(() => app.updatePreview(), 200);
});
