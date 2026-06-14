document.addEventListener('DOMContentLoaded', () => {

  // --- MODULAR SECTION CONFIGURATION ---
  const sectionsToLoad = [
    { id: 'hero', file: 'sections/hero.html' },
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
    const canvasWrapper = document.getElementById('canvas-wrapper');
    
    if (canvasWrapper && typeof THREE !== 'undefined') {
      let scene, camera, renderer, controls;
      let vaultMesh, columns = [];
      
      const wrapperWidth = canvasWrapper.clientWidth || 750;
      const wrapperHeight = canvasWrapper.clientHeight || 420;
      
      // Init Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x161719);
      scene.fog = new THREE.FogExp2(0x161719, 0.04);
      
      // Init Camera
      camera = new THREE.PerspectiveCamera(45, wrapperWidth / wrapperHeight, 0.1, 100);
      camera.position.set(6, 4, 8);
      
      // Init Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(wrapperWidth, wrapperHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      canvasWrapper.appendChild(renderer.domElement);
      
      // Init Controls
      if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        controls.minDistance = 4;
        controls.maxDistance = 15;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
      }
      
      // --- LIGHTS ---
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const sunLight = new THREE.DirectionalLight(0xffedd5, 1.0);
      sunLight.position.set(8, 6, 5);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 20;
      sunLight.shadow.bias = -0.0005;
      scene.add(sunLight);
      
      const fillLight = new THREE.DirectionalLight(0xabc7f5, 0.3);
      fillLight.position.set(-8, 4, -5);
      scene.add(fillLight);
      
      const insideLight = new THREE.PointLight(0xd36b54, 1.8, 12);
      insideLight.position.set(0, 1.2, 0);
      scene.add(insideLight);

      // --- GEOMETRIES & MATERIALS ---
      const materials = {
        terracotta: new THREE.MeshStandardMaterial({
          color: 0xd36b54,
          roughness: 0.8,
          metalness: 0.15,
          side: THREE.DoubleSide
        }),
        concrete: new THREE.MeshStandardMaterial({
          color: 0x9fa4ac,
          roughness: 0.6,
          metalness: 0.2,
          side: THREE.DoubleSide
        }),
        columns: new THREE.MeshStandardMaterial({
          color: 0x8a7f76,
          roughness: 0.7,
          metalness: 0.1
        }),
        floor: new THREE.MeshStandardMaterial({
          color: 0x22242a,
          roughness: 0.9,
          metalness: 0.05
        })
      };
      
      // base floor
      const floorGeo = new THREE.PlaneGeometry(30, 30);
      const floor = new THREE.Mesh(floorGeo, materials.floor);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);
      
      const gridHelper = new THREE.GridHelper(30, 30, 0xd36b54, 0x2e323a);
      gridHelper.position.y = 0.01;
      scene.add(gridHelper);
      
      // half-cylinder roof
      const vaultGeo = new THREE.CylinderGeometry(2, 2, 8, 32, 1, true, 0, Math.PI);
      vaultMesh = new THREE.Mesh(vaultGeo, materials.terracotta);
      vaultMesh.rotation.x = Math.PI / 2;
      vaultMesh.rotation.z = Math.PI / 2;
      vaultMesh.position.y = 1.5;
      vaultMesh.castShadow = true;
      vaultMesh.receiveShadow = true;
      scene.add(vaultMesh);
      
      // support pillars
      const colGeo = new THREE.BoxGeometry(0.2, 1.5, 0.2);
      const colCoords = [
        { x: -2, z: -3 }, { x: -2, z: 0 }, { x: -2, z: 3 },
        { x: 2, z: -3 }, { x: 2, z: 0 }, { x: 2, z: 3 }
      ];
      
      colCoords.forEach(coord => {
        const colMesh = new THREE.Mesh(colGeo, materials.columns);
        colMesh.position.set(coord.x, 1.5 / 2, coord.z);
        colMesh.castShadow = true;
        colMesh.receiveShadow = true;
        scene.add(colMesh);
        columns.push(colMesh);
      });
      
      // wood deck
      const deckGeo = new THREE.BoxGeometry(3.9, 0.1, 7.8);
      const deckMesh = new THREE.Mesh(deckGeo, new THREE.MeshStandardMaterial({
        color: 0xd4b28c,
        roughness: 0.5,
        metalness: 0.1
      }));
      deckMesh.position.set(0, 0.05, 0);
      deckMesh.receiveShadow = true;
      scene.add(deckMesh);
      
      // rendering loop
      const animate = () => {
        requestAnimationFrame(animate);
        if (controls) controls.update();
        renderer.render(scene, camera);
      };
      
      animate();
      
      // resize canvas container
      window.addEventListener('resize', () => {
        const width = canvasWrapper.clientWidth;
        const height = canvasWrapper.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      });
      
      // dynamic material buttons
      const btnTerracotta = document.getElementById('btn-mat-terracotta');
      const btnConcrete = document.getElementById('btn-mat-concrete');
      
      if (btnTerracotta && btnConcrete) {
        btnTerracotta.addEventListener('click', () => {
          btnConcrete.classList.remove('active');
          btnTerracotta.classList.add('active');
          vaultMesh.material = materials.terracotta;
        });
        
        btnConcrete.addEventListener('click', () => {
          btnTerracotta.classList.remove('active');
          btnConcrete.classList.add('active');
          vaultMesh.material = materials.concrete;
        });
      }
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
