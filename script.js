(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('#main-nav');
  var hero = document.querySelector('.hero');
  var heroImage = document.querySelector('[data-hero-image]');
  var heroEyebrow = document.querySelector('[data-hero-eyebrow]');
  var heroTitle = document.querySelector('[data-hero-title]');
  var heroCopy = document.querySelector('[data-hero-copy]');
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var toTop = document.querySelector('.to-top');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var currentSlide = 0;
  var timer;

  var slides = [
    {
      image: 'images/storefront.jpg',
      alt: 'Ocean Massage Spa storefront at 607 Princess Ave',
      eyebrow: 'A calm place in the heart of London',
      title: 'Ocean Massage Spa<br><em>Feel renewed.</em>',
      copy: 'A welcoming massage spa for quiet moments, thoughtful care, and a deeper sense of balance.'
    },
    {
      image: 'images/relaxation-massage-original.jpg',
      alt: 'Relaxation massage service image',
      eyebrow: 'Massage services',
      title: 'Relaxation massage<br><em>for your rhythm.</em>',
      copy: 'Choose 30, 45, 60, or 90 minutes of gentle care, starting at $50.'
    },
    {
      image: 'images/four-hands-massage-original.jpg',
      alt: 'Four hands massage service image',
      eyebrow: 'Signature experience',
      title: 'Four-hands massage<br><em>in perfect harmony.</em>',
      copy: 'Two therapists, one deeper level of relaxation. Sessions from 30 to 60 minutes.'
    }
  ];

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      var parent = button.closest('.nav-dropdown');
      var open = parent.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', function (event) {
    document.querySelectorAll('.nav-dropdown.is-open').forEach(function (dropdown) {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('is-open');
        var button = dropdown.querySelector('.nav-dropdown-toggle');
        if (button) button.setAttribute('aria-expanded', 'false');
      }
    });
  });

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    var slide = slides[currentSlide];
    if (!heroImage || !heroEyebrow || !heroTitle || !heroCopy) return;

    heroImage.classList.add('is-changing');
    window.setTimeout(function () {
      heroImage.src = slide.image;
      heroImage.alt = slide.alt;
      heroImage.style.objectPosition = currentSlide === 0 ? 'center 8%' : 'center bottom';
      heroEyebrow.textContent = slide.eyebrow;
      heroTitle.innerHTML = slide.title;
      heroCopy.textContent = slide.copy;
      heroImage.classList.remove('is-changing');
    }, reducedMotion ? 0 : 180);

    dots.forEach(function (dot, dotIndex) {
      var active = dotIndex === currentSlide;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  function startCarousel() {
    if (reducedMotion) return;
    window.clearInterval(timer);
    timer = window.setInterval(function () { showSlide(currentSlide + 1); }, 5200);
  }

  function stopCarousel() {
    window.clearInterval(timer);
  }

  if (hero && heroImage) {
    document.querySelector('[data-hero-prev]').addEventListener('click', function () {
      showSlide(currentSlide - 1);
      startCarousel();
    });
    document.querySelector('[data-hero-next]').addEventListener('click', function () {
      showSlide(currentSlide + 1);
      startCarousel();
    });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')));
        startCarousel();
      });
    });
    hero.addEventListener('mouseenter', stopCarousel);
    hero.addEventListener('mouseleave', startCarousel);
    hero.addEventListener('focusin', stopCarousel);
    hero.addEventListener('focusout', startCarousel);
    startCarousel();
  }

  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, instance) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  function updateToTop() {
    if (!toTop) return;
    toTop.classList.toggle('is-visible', window.scrollY > 420);
  }

  if (toTop) {
    window.addEventListener('scroll', updateToTop, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    updateToTop();
  }
}());
