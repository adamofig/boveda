document.addEventListener('DOMContentLoaded', () => {

  // --- MODULAR SECTION CONFIGURATION ---
  const sectionsToLoad = [
    { id: 'hero', file: 'sections/hero.html' },
    { id: 'boceto-ai', file: 'sections/boceto-ai.html' },
    { id: 'ficha-tecnica', file: 'sections/ficha-tecnica.html' },
    { id: 'objetivos', file: 'sections/objetivos.html' },
    { id: 'distribucion', file: 'sections/distribucion.html' },
    { id: 'visor-3d', file: 'sections/visor-3d.html' },
    { id: 'renders', file: 'sections/renders.html' },
    { id: 'inspiracion', file: 'sections/inspiracion.html' },
    { id: 'cuestionario', file: 'sections/cuestionario.html' }
  ];

  // Asynchronously fetch all sections and inject them into the DOM
  const loadSections = async () => {
    try {
      const promises = sectionsToLoad.map(async (sec) => {
        const response = await fetch(sec.file);
        if (!response.ok) {
          throw new Error(`Error loading section ${sec.file}: ${response.statusText}`);
        }
        const htmlText = await response.text();
        const placeholder = document.getElementById(sec.id);
        if (placeholder) {
          placeholder.innerHTML = htmlText;
        }
      });

      // Wait for all fetches to resolve
      await Promise.all(promises);

      // Once all section markups are injected, initialize all dynamic page components
      initComponents();
    } catch (error) {
      console.error("Modular section loading failed:", error);
    }
  };

  // Launch the loading cycle
  loadSections();

  // --- INITIALIZE INTEGRATED PAGE COMPONENTS ---
  function initComponents() {
    
    // Refresh references to newly injected elements
    const sections = document.querySelectorAll('section');
    const sideNav = document.getElementById('side-dots-nav');
    const sideDots = document.querySelectorAll('.side-dot');
    const header = document.querySelector('.header-nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    // --- FULL-PAGE SNAP AND SIDE DOTS ---
    sideDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const sectionId = dot.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Track active section to update dots and header
    const updateScrollIndicators = () => {
      let current = 'hero';
      const scrollMid = window.scrollY + window.innerHeight / 2;
      
      sections.forEach(section => {
        const secTop = section.offsetTop;
        const secHeight = section.offsetHeight;
        if (scrollMid >= secTop && scrollMid <= secTop + secHeight) {
          current = section.getAttribute('id');
        }
      });

      // Update Side Dots
      sideDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === current) {
          dot.classList.add('active');
        }
      });

      // Show/hide side dot navigation
      if (window.scrollY > window.innerHeight * 0.3) {
        sideNav.classList.add('visible');
      } else {
        sideNav.classList.remove('visible');
      }

      // Shrink header
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Sync header navbar links
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', updateScrollIndicators);
    updateScrollIndicators(); // Trigger initial scroll check

    // --- INTERACTIVE SPACE VIEWER ---
    const spaceButtons = document.querySelectorAll('.space-tab-button');
    const viewerImg = document.querySelector('.space-viewer-img');
    const viewerTitle = document.querySelector('.space-viewer-title');
    const viewerLvl = document.querySelector('.space-viewer-lvl');
    const viewerDesc = document.querySelector('.space-viewer-desc');

    const levelData = {
      level1: {
        lvl: 'Nivel 1 — Acceso',
        title: 'Área Social y Estancia Principal',
        img: 'images/Proyecto Cabaña Boveda de Cañon Plano 1.png',
        desc: 'Ingreso principal directo a la sala. Distribución abierta que optimiza el espacio y da la bienvenida con vistas directas al terreno.'
      },
      level2: {
        lvl: 'Nivel 2 — Estancia',
        title: 'Zona de Estar Intermedia',
        img: 'images/Proyecto Cabaña Boveda de Cañon ISo Int.png',
        desc: 'Nivel intermedio adaptado al desnivel del lote, actuando como transición fluida entre las áreas comunes y las habitaciones.'
      },
      level3: {
        lvl: 'Nivel 3 — Habitaciones',
        title: 'Habitación Baja y Tapanco/Mezzanine',
        img: 'images/Proyecto Cabaña Boveda de Cañon ISo Int.png',
        desc: 'Doble altura optimizada. La recámara principal se ubica en la parte baja, y las escaleras conducen al tapanco bajo el arco de la bóveda.'
      }
    };

    spaceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        spaceButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const levelKey = btn.getAttribute('data-level');
        const data = levelData[levelKey];

        if (data && viewerImg) {
          viewerImg.style.opacity = 0;
          setTimeout(() => {
            viewerImg.src = data.img;
            viewerTitle.textContent = data.title;
            viewerLvl.textContent = data.lvl;
            viewerDesc.textContent = data.desc;
            
            if (levelKey === 'level1') {
              viewerImg.classList.add('zoom-fit');
            } else {
              viewerImg.classList.remove('zoom-fit');
            }
            
            viewerImg.style.opacity = 1;
          }, 150);
        }
      });
    });

    // --- THREE.JS 3D INTERACTIVE VISOR ---
    if (typeof window.init3DVisor === 'function') {
      window.init3DVisor();
    }

    // --- GALLERY DECK SCROLL LOGIC & CONTROLS ---
    const scroller = document.querySelector('.gallery-scroller');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const dotsContainer = document.querySelector('.gallery-dots');
    const prevBtn = document.querySelector('.gallery-arrow-btn.prev');
    const nextBtn = document.querySelector('.gallery-arrow-btn.next');

    // Create dot indicators
    if (scroller && dotsContainer) {
      galleryItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          const scrollWidth = scroller.scrollWidth / galleryItems.length;
          scroller.scrollTo({
            left: index * scrollWidth,
            behavior: 'smooth'
          });
        });
        dotsContainer.appendChild(dot);
      });

      const dots = document.querySelectorAll('.gallery-dot');

      const updateActiveDot = () => {
        const scrollPosition = scroller.scrollLeft;
        const itemWidth = scroller.clientWidth * 0.8;
        const activeIndex = Math.round(scrollPosition / (itemWidth + 24));
        
        dots.forEach((dot, index) => {
          if (index === activeIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      };

      scroller.addEventListener('scroll', updateActiveDot);

      prevBtn.addEventListener('click', () => {
        scroller.scrollBy({ left: -320, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', () => {
        scroller.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }

    // --- SCROLL-DRIVEN ANIMATION JS FALLBACK ---
    if (scroller && galleryItems.length > 0 && !CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
      const animations = new Map();

      galleryItems.forEach(item => {
        const anim = item.animate(
          [
            { transform: 'scale(0.92)', opacity: 0.6, filter: 'blur(2px)' },
            { transform: 'scale(1.0)', opacity: 1, filter: 'blur(0px)' },
            { transform: 'scale(0.92)', opacity: 0.6, filter: 'blur(2px)' }
          ],
          {
            duration: 1,
            fill: 'both'
          }
        );
        anim.pause();
        animations.set(item, anim);
      });

      const tick = () => {
        const scrollerRect = scroller.getBoundingClientRect();

        galleryItems.forEach(item => {
          const animation = animations.get(item);
          if (!animation) return;

          const itemRect = item.getBoundingClientRect();
          const itemCenter = itemRect.left + itemRect.width / 2;
          const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;
          
          const maxDist = scrollerRect.width;
          const dist = itemCenter - scrollerCenter;
          
          let progress = (dist + maxDist) / (maxDist * 2);
          progress = Math.max(0, Math.min(1, progress));
          
          animation.currentTime = progress;
        });
      };

      scroller.addEventListener('scroll', tick);
      tick();
    }

    // --- FAQ ACCORDION ---
    const faqCards = document.querySelectorAll('.faq-card');

    faqCards.forEach(card => {
      const trigger = card.querySelector('.faq-trigger');
      trigger.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        faqCards.forEach(c => c.classList.remove('open'));
        if (!isOpen) {
          card.classList.add('open');
        }
      });
    });

    // --- LIGHTBOX GALLERY VIEWER ---
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const lightboxTitle = lightbox.querySelector('.lightbox-title');
      const lightboxDesc = lightbox.querySelector('.lightbox-desc');
      const lightboxClose = lightbox.querySelector('.lightbox-close');

      const openLightbox = (src, title, desc) => {
        lightboxImg.src = src;
        lightboxTitle.textContent = title || 'Visualización de Proyecto';
        lightboxDesc.textContent = desc || '';
        lightbox.classList.add('active');
      };

      const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
          lightboxImg.src = '';
        }, 300);
      };

      // Add click to Renders Grid
      document.querySelectorAll('.render-card').forEach(card => {
        card.addEventListener('click', () => {
          const img = card.querySelector('img');
          const title = card.querySelector('h3').textContent;
          const desc = card.querySelector('p').textContent;
          openLightbox(img.src, title, desc);
        });
      });

      // Add click to Gallery slides
      galleryItems.forEach(item => {
        item.addEventListener('click', () => {
          const img = item.querySelector('img');
          const title = item.querySelector('h4').textContent;
          const desc = item.querySelector('p').textContent;
          openLightbox(img.src, title, desc);
        });
      });

      // Close actions
      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
          closeLightbox();
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
  }
});
