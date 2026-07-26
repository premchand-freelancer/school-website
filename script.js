document.addEventListener('DOMContentLoaded', () => {
  // ============ Mobile Menu Toggle ============
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

  // ============ Story Modal ============
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

  // ============ Forms Handling ============
  const visitForm = document.getElementById('visit-form');
  const visitMessage = visitForm.querySelector('.form-message');
  
  visitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = visitForm.querySelector('input');
    const submitBtn = visitForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    if (!email.validity.valid) {
      visitMessage.textContent = 'Please enter a valid email address.';
      visitMessage.className = 'form-message error';
      email.focus();
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    // Simulate API call
    setTimeout(() => {
      visitMessage.textContent = 'Thank you! Our admissions team will be in touch soon.';
      visitMessage.className = 'form-message success';
      visitForm.reset();
      
      // Reset button
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    }, 1500);
  });

  const footerForm = document.getElementById('footer-form');
  const footerMessage = footerForm.querySelector('.footer-message');
  
  footerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = footerForm.querySelector('input');
    const submitBtn = footerForm.querySelector('button');
    
    if (!email.validity.valid) {
      footerMessage.textContent = 'Please enter a valid email to subscribe.';
      footerMessage.className = 'footer-message error';
      email.focus();
      return;
    }
    
    submitBtn.disabled = true;
    
    setTimeout(() => {
      footerMessage.textContent = 'You're on the list. Welcome!';
      footerMessage.className = 'footer-message success';
      footerForm.reset();
      submitBtn.disabled = false;
    }, 1200);
  });

  // ============ Counter Animation ============
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      
      const counter = entry.target;
      const target = Number(counter.dataset.count);
      const suffix = counter.dataset.suffix || '';
      const duration = 1500;
      const startTime = performance.now();
      
      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      
      requestAnimationFrame(update);
      counterObserver.unobserve(counter);
    });
  }, { threshold: 0.45 });
  
  counters.forEach((counter) => counterObserver.observe(counter));

  // ============ Scroll Animations ============
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right').forEach((el) => {
    observer.observe(el);
  });

  // ============ Testimonials Carousel ============
  const testimonialDots = document.querySelectorAll('.carousel-dot');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  function showTestimonial(index) {
    testimonialCards.forEach((card) => card.classList.remove('active'));
    testimonialDots.forEach((dot) => dot.classList.remove('active'));
    
    if (testimonialCards[index]) {
      testimonialCards[index].classList.add('active');
      testimonialDots[index].classList.add('active');
    }
  }

  testimonialDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showTestimonial(parseInt(dot.dataset.slide));
    });
  });

  // Auto-rotate testimonials every 5 seconds
  let currentTestimonial = 0;
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
  }, 5000);

  // ============ Smooth Scroll Behavior ============
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============ Active Nav Link on Scroll ============
  const sections = document.querySelectorAll('main > section');
  const navLinks = document.querySelectorAll('.primary-nav a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // ============ Scroll Indicator ============
  const scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#about');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ============ Hover Effects on Cards ============
  const programItems = document.querySelectorAll('.program-item');
  programItems.forEach((item) => {
    item.addEventListener('mouseenter', function () {
      this.style.transform = 'translateX(8px)';
    });
    item.addEventListener('mouseleave', function () {
      this.style.transform = 'translateX(0)';
    });
  });

  // ============ Button Hover Feedback ============
  const buttons = document.querySelectorAll('.button-hover');
  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.02)';
    });
    btn.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
    });
  });
});
