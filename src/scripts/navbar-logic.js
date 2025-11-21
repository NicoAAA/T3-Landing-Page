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

  // 1. NUEVA FUNCIÓN: Lógica aislada para el color/estado del navbar
  // Esta función solo se encarga de ver si debe ser transparente o solido
  const updateNavbarState = () => {
    const currentScrollY = window.scrollY;
    
    // Estilo "Active" (fondo sólido e iconos oscuros)
    if (currentScrollY > 50) {
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

  // Lógica de Scroll
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Ejecutamos nuestra función de estado de color
    updateNavbarState();

    // Optimización para el hide/show (evitar micro-scrolls)
    if (Math.abs(currentScrollY - lastScrollY) <= 10) return;

    // Ocultar/Mostrar Header (Lógica de movimiento)
    if (currentScrollY > lastScrollY && currentScrollY > 70) {
      elements.header.classList.add('-translate-y-full');
      closeMenu();
    } else {
      elements.header.classList.remove('-translate-y-full');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });


  // 2. Ejecutar al inicio: Para que si recargas la página a mitad de scroll, se vea bien.
  updateNavbarState();

  // 3. Evento 'visibilitychange': Detecta cuando vuelves a la pestaña
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // Forzamos la actualización del estado visual sin esperar scroll
      updateNavbarState();
    }
  });

  // 4. Evento 'pageshow': Asegura que funcione si el usuario usa el botón "Atrás" del navegador
  window.addEventListener('pageshow', () => {
    updateNavbarState();
  });
};
