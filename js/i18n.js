/**
 * Internationalization module for Gift Card Editor
 * Supports Arabic (RTL) and English (LTR)
 */

const i18n = {
  currentLang: localStorage.getItem('gce-lang') || 'ar',

  translations: {
    ar: {
      appTitle: 'محرر بطاقات الهدايا',
      appSubtitle: 'أنشئ بطاقتك الخاصة وحمّلها',
      selectBrand: 'اختر الماركة',
      selectBrandHint: 'اختر ماركة لعرض تصاميمها',
      allBrands: 'الكل',
      selectCard: 'اختر تصميم البطاقة',
      enterName: 'أدخل اسمك',
      namePlaceholder: 'اكتب اسمك هنا...',
      preview: 'معاينة البطاقة',
      download: 'تحميل البطاقة',
      downloadPDF: 'تحميل PDF',
      downloadJPEG: 'تحميل JPEG',
      downloadPNG: 'تحميل PNG',
      clearName: 'مسح',
      selectCardFirst: 'الرجاء اختيار تصميم أولاً',
      enterNameFirst: 'الرجاء كتابة اسمك أولاً',
      downloadSuccess: 'تم التحميل بنجاح!',
      adminLink: 'لوحة الإدارة',
      brands: {
        eid1: 'عيد مبارك - تصميم ١',
        match1: 'ماتش - تصميم ١',
        match2: 'ماتش - تصميم ٢',
        salfa: 'صالحة - تصميم كلاسيكي',
        eid: 'عيد مبارك',
        match: 'ماتش',
        salfa_brand: 'صالحة'
      },
      langToggle: 'English',
      footer: '© ٢٠٢٥ محرر بطاقات الهدايا',
      nameOnCard: 'اسمك على البطاقة:',
      noCardSelected: 'اختر تصميماً لعرض المعاينة',
      noBrandSelected: 'اختر ماركة أولاً لعرض التصاميم',
      charCount: 'حرف',
    },
    en: {
      appTitle: 'Gift Card Editor',
      appSubtitle: 'Create your personalized gift card and download it',
      selectBrand: 'Select Brand',
      selectBrandHint: 'Choose a brand to view its designs',
      allBrands: 'All',
      selectCard: 'Select Card Design',
      enterName: 'Enter Your Name',
      namePlaceholder: 'Type your name here...',
      preview: 'Card Preview',
      download: 'Download Card',
      downloadPDF: 'Download PDF',
      downloadJPEG: 'Download JPEG',
      downloadPNG: 'Download PNG',
      clearName: 'Clear',
      selectCardFirst: 'Please select a design first',
      enterNameFirst: 'Please enter your name first',
      downloadSuccess: 'Downloaded successfully!',
      adminLink: 'Admin Panel',
      brands: {
        eid1: 'Eid Mubarak - Design 1',
        match1: 'MATCH - Design 1',
        match2: 'MATCH - Design 2',
        salfa: 'Salfa - Classic Design',
        eid: 'Eid Mubarak',
        match: 'MATCH',
        salfa_brand: 'Salfa'
      },
      langToggle: 'عربي',
      footer: '© 2025 Gift Card Editor',
      nameOnCard: 'Your name on card:',
      noCardSelected: 'Select a design to see preview',
      noBrandSelected: 'Choose a brand first to see its designs',
      charCount: 'chars',
    }
  },

  t(key) {
    const keys = key.split('.');
    let val = this.translations[this.currentLang];
    for (const k of keys) {
      if (val == null) return key;
      val = val[k];
    }
    return val ?? key;
  },

  setLang(lang) {
    this.currentLang = lang;
    localStorage.setItem('gce-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', lang === 'ar');
    document.body.classList.toggle('ltr', lang === 'en');
    this.applyTranslations();
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });
  },

  init() {
    this.setLang(this.currentLang);
  }
};
