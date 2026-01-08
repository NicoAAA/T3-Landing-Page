// src/scripts/Fashion-News/controller.js

export function initFashionPage({ uniqueYears, clientMappings }) {
  // --- 1. NORMALIZACIÓN DE DATOS ---
  const uniqueYearsString = uniqueYears.map(y => String(y));
  console.log("🏁 initFashionPage iniciado");

  // 2. SELECTORES
  const container = document.getElementById('fashion-news-container'); 
  const btn = document.getElementById('mode-toggle-btn');
  const btnText = document.getElementById('mode-text');
  const standardContainer = document.getElementById('standard-view-container');
  const immersiveContainer = document.getElementById('immersive-view-container');
  const yearWrapper = document.getElementById('year-sticky-wrapper');
  const scrollHint = document.getElementById('scroll-hint');
  
  const digitStrips = document.querySelectorAll('.digit-strip');
  const articles = document.querySelectorAll('.news-article-wrapper');
  const mainNavbar = document.querySelector('header') || document.querySelector('nav');
  
  // Variables de estado
  let YEAR_HEIGHT = 80; 
  let isImmersiveMode = true;
  let isAnimating = false;

  function updateDimensions() {
    YEAR_HEIGHT = window.innerWidth < 768 ? 64 : 80;
  }

  // --- LÓGICA NAVBAR ---
  function manageNavbarVisibility() {
      if (!mainNavbar) return;
      if (!isImmersiveMode) {
          mainNavbar.style.transform = 'translateY(0)';
          mainNavbar.style.pointerEvents = 'auto';
          return;
      }
      if (yearWrapper) {
          const rect = yearWrapper.getBoundingClientRect();
          if (rect.top <= 2) { 
              mainNavbar.style.transform = 'translateY(-100%)';
              mainNavbar.style.pointerEvents = 'none';
          } else {
              mainNavbar.style.transform = 'translateY(0)';
              mainNavbar.style.pointerEvents = 'auto';
          }
      }
  }

  function checkMode() {
    if (isImmersiveMode) {
      if(standardContainer) standardContainer.classList.add('hidden');
      if(immersiveContainer) immersiveContainer.classList.remove('hidden');
      if(yearWrapper) {
          yearWrapper.classList.remove('hidden');
          yearWrapper.style.display = 'block'; 
      }
      if(btnText) btnText.innerText = "Modo Inmersivo";
      
      checkScrollHint(); 
      setupLines();
    } else {
      if(standardContainer) standardContainer.classList.remove('hidden');
      if(immersiveContainer) immersiveContainer.classList.add('hidden');
      if(yearWrapper) {
          yearWrapper.classList.add('hidden');
          yearWrapper.style.display = 'none';
      }
      if(btnText) btnText.innerText = "Modo Estándar";

      if(scrollHint) scrollHint.classList.add('opacity-0');
    }
    manageNavbarVisibility();
  }

  // --- NUEVA LÓGICA DEL INDICADOR DE SCROLL (ACTUALIZADA) ---
  function checkScrollHint() {
      if (!scrollHint || !container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // 1. ¿El usuario está viendo la sección? (La parte superior ya pasó o está en pantalla)
      // Usamos viewportHeight * 0.9 para que aparezca un poquito antes de que el contenedor ocupe toda la pantalla.
      const isVisible = rect.top < (viewportHeight * 0.9);

      // 2. ¿Todavía queda contenido? (La parte inferior del contenedor sigue por debajo del final de la pantalla)
      // Si rect.bottom es menor que la altura de la ventana, significa que ya vimos el final (y el footer está entrando).
      const hasContentLeft = rect.bottom > viewportHeight;

      if (isImmersiveMode && isVisible && hasContentLeft) {
          scrollHint.classList.remove('opacity-0');
      } else {
          scrollHint.classList.add('opacity-0');
      }
  }

  function setupLines() {
    if (!articles.length) return;
    articles.forEach(article => {
      const container = article.querySelector('.line-reveal-container');
      if (!container || container.dataset.ready === "true") return;
      
      const fullText = article.dataset.description || "";
      const words = fullText.split(' ').map(word => 
        `<span class="word-span inline-block transition-opacity duration-600 opacity-0 mr-1">${word}</span>`
      ).join('');
      container.innerHTML = words;
      container.dataset.ready = "true";
      container.dataset.hasTyped = "false";
    });
  }

  // --- LISTENERS ---
  if (btn) {
    btn.addEventListener('click', () => {
      if(isAnimating) return;
      isAnimating = true;
      isImmersiveMode = !isImmersiveMode;
      checkMode();
      
      btn.style.width = "210px";
      if(btnText) btnText.style.opacity = "1";
      
      const iconStd = document.getElementById('icon-to-standard');
      const iconImm = document.getElementById('icon-to-immersive');
      if(isImmersiveMode) {
          if(iconStd) { iconStd.style.opacity = '1'; iconStd.style.transform = 'rotate(0deg)'; }
          if(iconImm) { iconImm.style.opacity = '0'; iconImm.style.transform = 'rotate(-90deg)'; }
      } else {
          if(iconStd) { iconStd.style.opacity = '0'; iconStd.style.transform = 'rotate(90deg)'; }
          if(iconImm) { iconImm.style.opacity = '1'; iconImm.style.transform = 'rotate(0deg)'; }
      }

      setTimeout(() => {
        btn.style.width = "56px";
        if(btnText) btnText.style.opacity = "0";
        isAnimating = false;
      }, 3000);
    });
  }

  updateDimensions();
  window.addEventListener('resize', () => {
      updateDimensions();
      if(digitStrips.length > 0) window.dispatchEvent(new Event('scroll'));
  });

  setupLines();
  checkMode(); 

  // --- SCROLL PRINCIPAL ---
  window.addEventListener('scroll', () => {
    manageNavbarVisibility();
    checkScrollHint(); // Verificamos constantemente

    if (!isImmersiveMode) return;
    
    const windowHeight = window.innerHeight;
    let activeYearIndex = -1; 
    let maxVisibility = 0;

    articles.forEach((article) => {
        const immersiveContainer = article.querySelector('.immersive-view');
        if (!immersiveContainer) return;

        const rect = immersiveContainer.getBoundingClientRect();
        
        // Calcular visibilidad
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibility = Math.max(0, visibleHeight / windowHeight);

        // Detectar año activo
        if (visibility > maxVisibility) {
            maxVisibility = visibility;
            const currentYear = article.dataset.year;
            activeYearIndex = uniqueYearsString.indexOf(String(currentYear));
        }
        
        // Si no está en pantalla, saltar cálculos visuales pesados
        if (rect.bottom < 0 || rect.top > windowHeight) return;
        
        const containerHeight = immersiveContainer.offsetHeight;
        const totalScrollableDistance = containerHeight - windowHeight;
        const scrolledDistance = -rect.top;
        
        let progress = scrolledDistance / totalScrollableDistance;
        progress = Math.max(0, Math.min(1, progress));

        const imgWrapper = article.querySelector('.immersive-image-wrapper');
        const title = article.querySelector('.immersive-title');
        const btnElement = article.querySelector('.immersive-btn');
        const textContainer = article.querySelector('.line-reveal-container');

        if (textContainer) {
            if (progress > 0.01 && textContainer.dataset.hasTyped !== "true") {
                textContainer.dataset.hasTyped = "true";
                const allSpans = textContainer.querySelectorAll('.word-span');
                allSpans.forEach((span, i) => {
                    setTimeout(() => { 
                        if (textContainer.dataset.hasTyped === "true") span.style.opacity = "1"; 
                    }, i * 30); 
                });
            } else if (progress < 0.005 && textContainer.dataset.hasTyped === "true") {
                textContainer.dataset.hasTyped = "false";
                textContainer.querySelectorAll('.word-span').forEach(span => span.style.opacity = "0");
            }
        }
        
        if (imgWrapper) {
            const imageOpacity = Math.min(1, progress * 2.5);
            imgWrapper.style.opacity = imageOpacity.toString();
            imgWrapper.style.filter = `blur(${(1 - imageOpacity) * 5}px) grayscale(${(1 - imageOpacity) * 100}%)`;
            imgWrapper.style.transform = `scale(${0.9 + (imageOpacity * 0.1)})`;
        }
        if (title) title.style.opacity = Math.min(1, progress * 20).toString();
        if (btnElement) btnElement.style.opacity = (progress > 0.1 ? 1 : 0).toString();
    });

    if (activeYearIndex !== -1 && digitStrips.length > 0) {
        digitStrips.forEach((strip, colIndex) => {
            if(clientMappings[colIndex] && clientMappings[colIndex][activeYearIndex] !== undefined) {
                const targetStripIndex = clientMappings[colIndex][activeYearIndex];
                strip.style.transform = `translateY(-${targetStripIndex * YEAR_HEIGHT}px)`;
            }
        });
    }
  });

  setTimeout(() => {
     window.dispatchEvent(new Event('scroll'));
  }, 100);
}