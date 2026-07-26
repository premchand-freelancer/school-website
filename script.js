document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', isOpen);
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('modal-open', isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      document.body.classList.remove('modal-open');
    });
  });

  const modal = document.getElementById('story-modal');
  const openModal = document.querySelector('[data-modal-open]');
  const closeModal = modal.querySelector('[data-modal-close]');
  let lastFocusedElement;

  function toggleModal(show) {
    modal.classList.toggle('open', show);
    modal.setAttribute('aria-hidden', String(!show));
    document.body.classList.toggle('modal-open', show);
    if (show) {
      lastFocusedElement = document.activeElement;
      closeModal.focus();
    } else if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  openModal.addEventListener('click', () => toggleModal(true));
  closeModal.addEventListener('click', () => toggleModal(false));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) toggleModal(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) toggleModal(false);
  });

  const visitForm = document.getElementById('visit-form');
  const visitMessage = visitForm.querySelector('.form-message');
  visitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = visitForm.querySelector('input');
    if (!email.validity.valid) {
      visitMessage.textContent = 'Please enter a valid email address.';
      email.focus();
      return;
    }
    visitMessage.textContent = 'Thank you — our admissions team will be in touch soon.';
    visitForm.reset();
  });

  const footerForm = document.getElementById('footer-form');
  const footerMessage = footerForm.querySelector('.footer-message');
  footerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = footerForm.querySelector('input');
    if (!email.validity.valid) {
      footerMessage.textContent = 'Enter a valid email to subscribe.';
      email.focus();
      return;
    }
    footerMessage.textContent = 'You’re on the list. Welcome!';
    footerForm.reset();
  });

  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.count);
      const suffix = counter.dataset.suffix || '';
      const duration = 1100;
      const startTime = performance.now();
      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(counter);
    });
  }, { threshold: 0.45 });
  counters.forEach((counter) => counterObserver.observe(counter));
});
