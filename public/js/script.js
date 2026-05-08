// Global UI scripts

function initializeNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('nav-active');
      hamburger.classList.toggle('toggle');
    });
  }

  // Initialize language selector
  initializeLanguageSelector();
}

function initializeLanguageSelector() {
  const selector = document.getElementById('language-selector');
  if (selector && typeof i18n !== 'undefined') {
    selector.value = i18n.getLanguage();
    selector.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }
}

document.addEventListener('DOMContentLoaded', initializeNavbar);

