/**
 * Admin Panel Logic - Gift Card Editor
 * Handles design uploads, storage, and management
 */

const adminApp = {
  STORAGE_KEY: 'gce-custom-designs',
  BRANDS_KEY: 'gce-custom-brands',
  MAX_FILE_SIZE_MB: 10,

  designs: [],   // loaded from localStorage
  brands: [],    // ['eid', 'match', 'salfa', ...custom]
  pendingFile: null,

  // ─── Default built-in brands ──────────────────────────────────────────
  DEFAULT_BRANDS: [
    { value: 'eid',   label: 'Eid Mubarak / عيد مبارك' },
    { value: 'match', label: 'MATCH / ماتش' },
    { value: 'salfa', label: 'Salfa / صالحة' },
  ],

  // ─── Init ─────────────────────────────────────────────────────────────
  init() {
    this.loadDesigns();
    this.loadBrands();
    this.buildBrandSelect();
    this.renderDesignsList();
    this.updateStats();
    this.setupEvents();
  },

  // ─── Load from localStorage ────────────────────────────────────────────
  loadDesigns() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      this.designs = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(this.designs)) this.designs = [];
    } catch (e) {
      this.designs = [];
    }
  },

  saveDesigns() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.designs));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        this.showNotification('Storage full. Please delete some designs first.', 'error');
      } else {
        this.showNotification('Failed to save design.', 'error');
      }
      throw e;
    }
  },

  loadBrands() {
    try {
      const raw = localStorage.getItem(this.BRANDS_KEY);
      const custom = raw ? JSON.parse(raw) : [];
      this.brands = [...this.DEFAULT_BRANDS];
      if (Array.isArray(custom)) {
        custom.forEach(b => {
          if (!this.brands.find(x => x.value === b.value)) {
            this.brands.push(b);
          }
        });
      }
    } catch (e) {
      this.brands = [...this.DEFAULT_BRANDS];
    }
  },

  saveBrands() {
    const custom = this.brands.filter(
      b => !this.DEFAULT_BRANDS.find(d => d.value === b.value)
    );
    localStorage.setItem(this.BRANDS_KEY, JSON.stringify(custom));
  },

  // ─── Build the brand <select> and new-brand option ────────────────────
  buildBrandSelect() {
    const select = document.getElementById('design-brand');
    if (!select) return;
    select.innerHTML = '';

    this.brands.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.value;
      opt.textContent = b.label;
      select.appendChild(opt);
    });

    // "Add new brand…" option
    const newOpt = document.createElement('option');
    newOpt.value = '__new__';
    newOpt.textContent = '➕ Add new brand…';
    select.appendChild(newOpt);
  },

  // ─── Setup DOM events ─────────────────────────────────────────────────
  setupEvents() {
    // File drop zone
    const zone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');

    if (zone) {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('dragover');
      });
      zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const file = e.dataTransfer?.files?.[0];
        if (file) this.handleFileSelected(file);
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (file) this.handleFileSelected(file);
      });
    }

    // Brand select – show new-brand input if __new__ selected
    const brandSelect = document.getElementById('design-brand');
    const newBrandRow = document.getElementById('new-brand-row');
    if (brandSelect) {
      brandSelect.addEventListener('change', () => {
        if (newBrandRow) {
          newBrandRow.style.display = brandSelect.value === '__new__' ? 'flex' : 'none';
        }
      });
    }

    // Upload form submit
    const form = document.getElementById('upload-form');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        this.handleUpload();
      });
    }

    // Modal close
    const modalOverlay = document.getElementById('preview-modal');
    const modalClose = document.getElementById('modal-close');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) this.closeModal();
      });
    }
    if (modalClose) {
      modalClose.addEventListener('click', () => this.closeModal());
    }
  },

  // ─── Handle file selection ────────────────────────────────────────────
  handleFileSelected(file) {
    const maxBytes = this.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      this.showNotification(`File too large. Max ${this.MAX_FILE_SIZE_MB} MB allowed.`, 'error');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      this.showNotification('Only image files (PNG, JPEG, WebP) and PDF files are supported.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.pendingFile = { data: e.target.result, type: file.type, name: file.name };
      this.showFilePreview(file, e.target.result);
      // Auto-fill name from filename
      const nameInput = document.getElementById('design-name');
      if (nameInput && !nameInput.value) {
        nameInput.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      }
    };
    reader.readAsDataURL(file);
  },

  showFilePreview(file, dataURL) {
    const previewWrap = document.getElementById('upload-preview');
    if (!previewWrap) return;

    previewWrap.innerHTML = '';
    previewWrap.style.display = 'block';

    if (file.type === 'application/pdf') {
      const div = document.createElement('div');
      div.className = 'pdf-preview';
      div.innerHTML = `<span class="pdf-preview-icon">📄</span><span>${this._escapeHtml(file.name)}</span>`;
      previewWrap.appendChild(div);
    } else {
      const img = document.createElement('img');
      img.src = dataURL;
      img.alt = 'Preview';
      previewWrap.appendChild(img);
    }

    // Update upload zone text
    const zoneText = document.getElementById('upload-zone-text');
    if (zoneText) zoneText.textContent = '✅ File selected – fill in details below';
  },

  // ─── Save the upload ──────────────────────────────────────────────────
  handleUpload() {
    if (!this.pendingFile) {
      this.showNotification('Please select a file first.', 'warning');
      return;
    }

    const nameInput = document.getElementById('design-name');
    const brandSelect = document.getElementById('design-brand');
    const newBrandInput = document.getElementById('new-brand-name');
    const nameColorInput = document.getElementById('name-color');
    const namePosYInput = document.getElementById('name-pos-y');
    const nameSizeInput = document.getElementById('name-size');

    const name = nameInput?.value.trim();
    if (!name) {
      this.showNotification('Please enter a design name.', 'warning');
      nameInput?.focus();
      return;
    }

    let brand = brandSelect?.value || 'custom';
    if (brand === '__new__') {
      brand = newBrandInput?.value.trim().toLowerCase().replace(/\s+/g, '-');
      if (!brand) {
        this.showNotification('Please enter a new brand name.', 'warning');
        newBrandInput?.focus();
        return;
      }
      // Save new brand
      const brandLabel = newBrandInput.value.trim();
      if (!this.brands.find(b => b.value === brand)) {
        this.brands.push({ value: brand, label: brandLabel });
        this.saveBrands();
        this.buildBrandSelect();
      }
    }

    const nameColor = nameColorInput?.value || '#3A2A14';
    const namePosY = parseInt(namePosYInput?.value || '1700', 10);
    const nameFontSize = parseInt(nameSizeInput?.value || '68', 10);

    const id = 'custom-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    const isPdf = this.pendingFile.type === 'application/pdf';

    const design = {
      id,
      name,
      brand,
      type: isPdf ? 'pdf' : 'image',
      data: this.pendingFile.data,
      nameKey: 'custom.' + id,
      nameArea: {
        x: 1000,
        y: namePosY,
        maxWidth: 1400,
        fontSize: nameFontSize,
        fontFamily: 'Amiri, Georgia, serif',
        color: nameColor,
        align: 'center',
        direction: 'auto'
      },
      uploadedAt: new Date().toISOString()
    };

    try {
      this.designs.push(design);
      this.saveDesigns();
      this.renderDesignsList();
      this.updateStats();
      this.resetForm();
      this.showNotification(`✅ Design "${name}" uploaded successfully!`, 'success');
    } catch (e) {
      // saveDesigns already showed notification
      this.designs.pop();
    }
  },

  // ─── Delete a design ──────────────────────────────────────────────────
  deleteDesign(id) {
    if (!confirm('Delete this design? This cannot be undone.')) return;
    this.designs = this.designs.filter(d => d.id !== id);
    this.saveDesigns();
    this.renderDesignsList();
    this.updateStats();
    this.showNotification('Design deleted.', 'success');
  },

  // ─── Preview a design ─────────────────────────────────────────────────
  previewDesign(id) {
    const design = this.designs.find(d => d.id === id);
    if (!design) return;

    const overlay = document.getElementById('preview-modal');
    const img = document.getElementById('modal-preview-img');
    if (!overlay || !img) return;

    if (design.type === 'pdf') {
      img.src = '';
      img.alt = '';
      img.style.display = 'none';
      const pdfMsg = document.getElementById('modal-pdf-msg');
      if (pdfMsg) pdfMsg.style.display = 'flex';
    } else {
      img.src = design.data;
      img.alt = design.name;
      img.style.display = 'block';
      const pdfMsg = document.getElementById('modal-pdf-msg');
      if (pdfMsg) pdfMsg.style.display = 'none';
    }

    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = design.name;

    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('show'));
  },

  closeModal() {
    const overlay = document.getElementById('preview-modal');
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
  },

  // ─── Render the designs list ──────────────────────────────────────────
  renderDesignsList() {
    const grid = document.getElementById('designs-grid');
    if (!grid) return;

    if (this.designs.length === 0) {
      grid.innerHTML = `
        <div class="designs-empty">
          <span class="designs-empty-icon">📭</span>
          <p>No designs uploaded yet.<br>Upload your first design using the form.</p>
        </div>`;
      return;
    }

    grid.innerHTML = '';
    // Show newest first
    [...this.designs].reverse().forEach(design => {
      const card = document.createElement('div');
      card.className = 'design-card';
      card.innerHTML = `
        ${design.type === 'pdf'
          ? `<div class="design-card-thumb pdf-thumb">📄<br>${this._escapeHtml(design.name)}</div>`
          : `<img class="design-card-thumb" src="${design.data}" alt="${this._escapeHtml(design.name)}" loading="lazy" />`
        }
        <div class="design-card-info">
          <div class="design-card-name">${this._escapeHtml(design.name)}</div>
          <div class="design-card-brand">${this._escapeHtml(design.brand)}</div>
          <div class="design-card-type">${design.type.toUpperCase()} &bull; ${this._formatDate(design.uploadedAt)}</div>
          <div class="design-card-actions">
            <button class="btn-preview-card" data-id="${design.id}" title="Preview">
              👁️ Preview
            </button>
            <button class="btn-delete" data-id="${design.id}" title="Delete">
              🗑️ Delete
            </button>
          </div>
        </div>`;

      card.querySelector('.btn-delete').addEventListener('click', () => this.deleteDesign(design.id));
      card.querySelector('.btn-preview-card').addEventListener('click', () => this.previewDesign(design.id));

      grid.appendChild(card);
    });
  },

  // ─── Update stats ─────────────────────────────────────────────────────
  updateStats() {
    const el = id => document.getElementById(id);
    if (el('stat-total')) el('stat-total').textContent = this.designs.length;
    if (el('stat-images')) el('stat-images').textContent = this.designs.filter(d => d.type === 'image').length;
    if (el('stat-pdfs'))   el('stat-pdfs').textContent   = this.designs.filter(d => d.type === 'pdf').length;

    const brands = new Set(this.designs.map(d => d.brand));
    if (el('stat-brands')) el('stat-brands').textContent = brands.size;
  },

  // ─── Reset form ───────────────────────────────────────────────────────
  resetForm() {
    const form = document.getElementById('upload-form');
    if (form) form.reset();
    this.pendingFile = null;

    const preview = document.getElementById('upload-preview');
    if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }

    const zoneText = document.getElementById('upload-zone-text');
    if (zoneText) zoneText.textContent = 'Click or drag & drop your file here';

    const newBrandRow = document.getElementById('new-brand-row');
    if (newBrandRow) newBrandRow.style.display = 'none';
  },

  // ─── Notification ─────────────────────────────────────────────────────
  showNotification(msg, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = msg;
    document.body.appendChild(notif);

    requestAnimationFrame(() => notif.classList.add('show'));
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 400);
    }, 3500);
  },

  // ─── Utilities ────────────────────────────────────────────────────────
  _escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  _formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return ''; }
  }
};

document.addEventListener('DOMContentLoaded', () => adminApp.init());
