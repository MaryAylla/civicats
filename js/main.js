/**
 * CiviCats - JavaScript Modular Completo
 */

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupScrollReveal();
  setupParallaxHover();
  setupGameModal();
  setupContactForm();
  detectUserOS();
  setupDownloadFeedback();
});

/* ==========================================================================
   DETECÇÃO AUTOMÁTICA DE SISTEMA OPERACIONAL
   ========================================================================== */
function detectUserOS() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  const cardWindows = document.getElementById('card-windows');
  const cardAndroid = document.getElementById('card-android');

  if (!cardWindows || !cardAndroid) return;

  const isAndroid = /android/i.test(userAgent);
  const isWindows = /windows nt/i.test(userAgent);

  if (isAndroid) {
    cardAndroid.classList.add('is-detected');
  } else if (isWindows) {
    cardWindows.classList.add('is-detected');
  }
}

/* ==========================================================================
   FEEDBACK VISUAL AO CLICAR EM DOWNLOAD
   ========================================================================== */
function setupDownloadFeedback() {
  const downloadButtons = document.querySelectorAll('.download-btn');

  downloadButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const originalHTML = btn.innerHTML;
      const platform = btn.dataset.platform;

      btn.innerHTML = `<span>Iniciando download (${platform})...</span>`;
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.pointerEvents = 'auto';
      }, 3500);
    });
  });
}

/* ==========================================================================
   OUTRAS FUNÇÕES (Menu Mobile, Scroll Reveal, Parallax, Modal, Form)
   ========================================================================== */
function setupMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('is-open');

    toggleBtn.setAttribute(
      'aria-label',
      isExpanded ? 'Abrir menu de navegação' : 'Fechar menu de navegação'
    );
  });

  const navLinks = navMenu.querySelectorAll('.nav-link, .btn');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-item');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = element.getAttribute('data-delay') || 0;

        setTimeout(() => {
          element.classList.add('is-visible');
        }, Number(delay));

        observer.unobserve(element);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

function setupParallaxHover() {
  const heroStage = document.querySelector('.hero-home');
  const logo = document.querySelector('.floating-logo-stage');

  if (!heroStage || !logo || window.innerWidth < 768) return;

  heroStage.addEventListener('mousemove', (e) => {
    const rect = heroStage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    logo.style.transform = `translate(${x * 16}px, ${y * 12}px) rotate(${x * 2}deg)`;
  });

  heroStage.addEventListener('mouseleave', () => {
    logo.style.transform = '';
  });
}

function setupGameModal() {
  const modal = document.getElementById('game-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');

  if (!modal || !closeBtn) return;

  const zoomTriggers = document.querySelectorAll('.btn-zoom-trigger');

  zoomTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      modalImg.src = btn.dataset.preview;
      modalTitle.textContent = btn.dataset.title;
      modalDesc.textContent = btn.dataset.desc;
      modal.showModal();
    });
  });

  closeBtn.addEventListener('click', () => modal.close());

  modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const successBanner = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const requiredInputs = form.querySelectorAll('.form-input');

    requiredInputs.forEach((input) => {
      const parentGroup = input.closest('.form-group');

      if (!input.value.trim()) {
        parentGroup.classList.add('has-error');
        isValid = false;
      } else {
        if (input.type === 'email' && !isValidEmail(input.value)) {
          parentGroup.classList.add('has-error');
          isValid = false;
        } else {
          parentGroup.classList.remove('has-error');
        }
      }

      input.addEventListener('input', () => {
        parentGroup.classList.remove('has-error');
      });
    });

    if (isValid) {
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Enviando mensagem...</span>';
      submitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.pointerEvents = 'auto';
        successBanner.classList.add('is-active');

        setTimeout(() => {
          successBanner.classList.remove('is-active');
        }, 6000);
      }, 1200);
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}