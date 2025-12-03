/**
 * src/scripts/navbar-logic.js
 */
export const initNavbar = () => {
  const elements = {
    header: document.getElementById('main-header'),
    hamburgerBtn: document.getElementById('hamburger-btn'),
    mobileMenu: document.getElementById('mobile-menu'),
    // Seleccionamos TODOS los botones de tema (Desktop y Mobile)
    themeToggles: document.querySelectorAll('.theme-toggle-btn'), 
  };

  if (!elements.header || !elements.hamburgerBtn) return;

  // --- 1. LÓGICA MODO OSCURO (NUEVO) ---
  const initTheme = () => {
    // Revisar preferencia guardada o del sistema
    const theme = (() => {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme');
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    })();

    // Aplicar clase inicial
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Event Listeners para los botones
    elements.themeToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    });
  };

  // Inicializamos el tema
  initTheme();


  // --- 2. LÓGICA SCROLL Y MENÚ (TU LÓGICA EXISTENTE) ---
  let lastScrollY = window.scrollY;

  const toggleMenu = () => {
    elements.header.classList.toggle('menu-open');
  };

  const closeMenu = () => {
    elements.header.classList.remove('menu-open');
    document.body.classList.remove('overflow-hidden');
  };

  const updateNavbarState = () => {
    const currentScrollY = window.scrollY;
    const isForcedSolid = elements.header.hasAttribute('data-force-solid');

    if (isForcedSolid || currentScrollY > 50) {
      elements.header.classList.add('is-active');
    } else {
      elements.header.classList.remove('is-active');
    }
  };

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