/**
 * Inicializa el comportamiento del Navbar
 * Se exporta como función para control total sobre cuándo se ejecuta
 */
export const initNavbar = () => {
  const elements = {
    header: document.getElementById('main-header'),
    hamburgerBtn: document.getElementById('hamburger-btn'),
    mobileMenu: document.getElementById('mobile-menu'),
  };

  // Si no existen los elementos, salimos para evitar errores
  if (!elements.header || !elements.hamburgerBtn) return;

  let lastScrollY = window.scrollY;

  // --- Funciones Auxiliares ---
  const toggleMenu = () => {
    elements.header.classList.toggle('menu-open');
    // Bloquear scroll del body cuando el menú está abierto (Mejor UX)
    //document.body.classList.toggle('overflow-hidden', elements.header.classList.contains('menu-open'));
  };

  const closeMenu = () => {
    elements.header.classList.remove('menu-open');
    document.body.classList.remove('overflow-hidden');
  };

  // --- Event Listeners ---
  
  // Click en Hamburguesa
  elements.hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Click fuera del header para cerrar
  document.addEventListener('click', (event) => {
    if (elements.header.classList.contains('menu-open') && !elements.header.contains(event.target)) {
      closeMenu();
    }
  });

  // Lógica de Scroll
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Optimización: Evitar cálculos en micro-scrolls
    if (Math.abs(currentScrollY - lastScrollY) <= 10) return;

    // Ocultar/Mostrar Header
    if (currentScrollY > lastScrollY && currentScrollY > 70) {
      elements.header.classList.add('-translate-y-full');
      closeMenu(); // Cerrar menú si scrollea hacia abajo
    } else {
      elements.header.classList.remove('-translate-y-full');
    }

    // Estilo "Active" (fondo sólido)
    if (currentScrollY > 50) {
      elements.header.classList.add('is-active');
    } else {
      elements.header.classList.remove('is-active');
    }

    lastScrollY = currentScrollY;
  }, { passive: true }); // passive: true mejora el rendimiento del scroll
};
