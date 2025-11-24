/**
 * src/scripts/navbar-logic.js
 */
export const initNavbar = () => {
  const elements = {
    header: document.getElementById('main-header'),
    hamburgerBtn: document.getElementById('hamburger-btn'),
    mobileMenu: document.getElementById('mobile-menu'),
  };

  if (!elements.header || !elements.hamburgerBtn) return;

  let lastScrollY = window.scrollY;

  // --- Funciones Auxiliares ---
  const toggleMenu = () => {
    elements.header.classList.toggle('menu-open');
  };

  const closeMenu = () => {
    elements.header.classList.remove('menu-open');
    document.body.classList.remove('overflow-hidden');
  };

  // ACTUALIZACIÓN AQUÍ: Lógica modificada para soportar páginas sin Hero
  const updateNavbarState = () => {
    const currentScrollY = window.scrollY;
    
    // Verificamos si el header tiene el atributo para forzar el color sólido
    const isForcedSolid = elements.header.hasAttribute('data-force-solid');

    // Si está forzado O si hay scroll > 50, activamos el fondo sólido
    if (isForcedSolid || currentScrollY > 50) {
      elements.header.classList.add('is-active');
    } else {
      elements.header.classList.remove('is-active');
    }
  };

  // --- Event Listeners ---
  elements.hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', (event) => {
    if (elements.header.classList.contains('menu-open') && !elements.header.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    updateNavbarState();

    if (Math.abs(currentScrollY - lastScrollY) <= 10) return;

    if (currentScrollY > lastScrollY && currentScrollY > 70) {
      elements.header.classList.add('-translate-y-full');
      closeMenu();
    } else {
      elements.header.classList.remove('-translate-y-full');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  updateNavbarState();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateNavbarState();
  });

  window.addEventListener('pageshow', () => {
    updateNavbarState();
  });
};