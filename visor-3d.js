/**
 * Visor 3D Conceptual - Bóveda de Cañón
 * Handles Three.js visualization, materials, and structural dimensions.
 */

window.init3DVisor = function() {
  const canvasWrapper = document.getElementById('canvas-wrapper');
  if (!canvasWrapper || typeof THREE === 'undefined') {
    console.warn("Three.js or canvas-wrapper not found.");
    return;
  }

  // Prevent multiple initializations
  if (canvasWrapper.querySelector('canvas')) {
    return;
  }

  let scene, camera, renderer, controls;
  let vaultMesh, columns = [];
  let measuresGroup;
  let showMeasures = true;

  const wrapperWidth = canvasWrapper.clientWidth || 750;
  const wrapperHeight = canvasWrapper.clientHeight || 420;

  // --- 1. INITIALIZE SCENE, CAMERA, RENDERER ---
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x161719);
  scene.fog = new THREE.FogExp2(0x161719, 0.04);

  camera = new THREE.PerspectiveCamera(45, wrapperWidth / wrapperHeight, 0.1, 100);
  camera.position.set(6, 4.5, 8.5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(wrapperWidth, wrapperHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  canvasWrapper.appendChild(renderer.domElement);

  // --- 2. ORBIT CONTROLS ---
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent going underground
    controls.minDistance = 4;
    controls.maxDistance = 15;
    controls.target.set(0, 1.2, 0); // Focus camera on the center of the cabin
    
    // Smooth initial rotation
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
  }

  // --- 3. LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffedd5, 1.2);
  sunLight.position.set(8, 8, 5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 25;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xabc7f5, 0.35);
  fillLight.position.set(-8, 4, -5);
  scene.add(fillLight);

  // Warm interior glow
  const insideLight = new THREE.PointLight(0xd36b54, 1.8, 10);
  insideLight.position.set(0, 1.0, 0);
  scene.add(insideLight);

  // --- 4. GEOMETRIES & MATERIALS ---
  const materials = {
    terracotta: new THREE.MeshStandardMaterial({
      color: 0xd36b54,
      roughness: 0.75,
      metalness: 0.1,
      side: THREE.DoubleSide
    }),
    concrete: new THREE.MeshStandardMaterial({
      color: 0x9fa4ac,
      roughness: 0.65,
      metalness: 0.15,
      side: THREE.DoubleSide
    }),
    columns: new THREE.MeshStandardMaterial({
      color: 0x8a7f76,
      roughness: 0.7,
      metalness: 0.1
    }),
    floor: new THREE.MeshStandardMaterial({
      color: 0x1f2126,
      roughness: 0.9,
      metalness: 0.05
    })
  };

  // Base surrounding floor
  const floorGeo = new THREE.PlaneGeometry(40, 40);
  const floor = new THREE.Mesh(floorGeo, materials.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const gridHelper = new THREE.GridHelper(40, 40, 0xd36b54, 0x2e323a);
  gridHelper.position.y = 0.005;
  scene.add(gridHelper);

  // Wood cabin deck
  const deckGeo = new THREE.BoxGeometry(3.9, 0.1, 7.8);
  const deckMesh = new THREE.Mesh(deckGeo, new THREE.MeshStandardMaterial({
    color: 0xc49b76,
    roughness: 0.55,
    metalness: 0.1
  }));
  deckMesh.position.set(0, 0.05, 0);
  deckMesh.receiveShadow = true;
  scene.add(deckMesh);

  // Support pillars
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

  // Half-cylinder vault (pointing UPWARDS)
  const vaultGeo = new THREE.CylinderGeometry(2, 2, 8, 32, 1, true, 0, Math.PI);
  vaultMesh = new THREE.Mesh(vaultGeo, materials.terracotta);
  // Rotate around X to point along Z-axis, and around Z by PI/2 to make it arch upwards
  vaultMesh.rotation.x = Math.PI / 2;
  vaultMesh.rotation.z = Math.PI / 2;
  vaultMesh.position.y = 1.5; // Sit directly on top of 1.5m pillars
  vaultMesh.castShadow = true;
  vaultMesh.receiveShadow = true;
  scene.add(vaultMesh);

  // --- 5. MEASUREMENTS & DIMENSIONS SYSTEM ---
  measuresGroup = new THREE.Group();
  scene.add(measuresGroup);

  // Helper to draw text sprites
  function createTextSprite(text, color = '#ffedd5') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Rounded rectangle background
    ctx.fillStyle = 'rgba(22, 23, 25, 0.9)';
    ctx.strokeStyle = '#d36b54';
    ctx.lineWidth = 3;
    const r = 8;
    const w = canvas.width;
    const h = canvas.height;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text label
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.4, 0.35, 1);
    return sprite;
  }

  // Helper to draw dimension lines
  function createDimensionLine(start, end, offsetDir, offsetDist, labelText) {
    const group = new THREE.Group();

    const startOffset = start.clone().add(offsetDir.clone().multiplyScalar(offsetDist));
    const endOffset = end.clone().add(offsetDir.clone().multiplyScalar(offsetDist));

    // Dashed extension lines
    const extMat = new THREE.LineDashedMaterial({
      color: 0x5a5f6a,
      dashSize: 0.1,
      gapSize: 0.08,
      linewidth: 1
    });

    const ext1Geo = new THREE.BufferGeometry().setFromPoints([start, startOffset]);
    const ext1 = new THREE.Line(ext1Geo, extMat);
    ext1.computeLineDistances();
    group.add(ext1);

    const ext2Geo = new THREE.BufferGeometry().setFromPoints([end, endOffset]);
    const ext2 = new THREE.Line(ext2Geo, extMat);
    ext2.computeLineDistances();
    group.add(ext2);

    // Main dimension line
    const lineMat = new THREE.LineBasicMaterial({ color: 0xd36b54, linewidth: 2 });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([startOffset, endOffset]);
    const line = new THREE.Line(lineGeo, lineMat);
    group.add(line);

    // Dynamic tick marks perpendicular to both line direction and offset direction
    const lineDir = end.clone().sub(start).normalize();
    const perpDir = new THREE.Vector3().crossVectors(lineDir, offsetDir).normalize();
    const tickLength = 0.25;

    const tick1Start = startOffset.clone().add(perpDir.clone().multiplyScalar(-tickLength / 2));
    const tick1End = startOffset.clone().add(perpDir.clone().multiplyScalar(tickLength / 2));
    const tick1Geo = new THREE.BufferGeometry().setFromPoints([tick1Start, tick1End]);
    const tick1 = new THREE.Line(tick1Geo, lineMat);
    group.add(tick1);

    const tick2Start = endOffset.clone().add(perpDir.clone().multiplyScalar(-tickLength / 2));
    const tick2End = endOffset.clone().add(perpDir.clone().multiplyScalar(tickLength / 2));
    const tick2Geo = new THREE.BufferGeometry().setFromPoints([tick2Start, tick2End]);
    const tick2 = new THREE.Line(tick2Geo, lineMat);
    group.add(tick2);

    // Label Sprite
    const label = createTextSprite(labelText);
    const mid = startOffset.clone().add(endOffset).multiplyScalar(0.5);
    mid.y += 0.22; // Lift badge above the line
    label.position.copy(mid);
    group.add(label);

    return group;
  }

  // Generate measurements overlay
  const dimLargo = createDimensionLine(
    new THREE.Vector3(-2, 0.05, -3.9), // start
    new THREE.Vector3(-2, 0.05, 3.9),  // end
    new THREE.Vector3(-1, 0, 0),        // offset left
    0.8,                                // distance
    "Largo: 8.00m"
  );
  measuresGroup.add(dimLargo);

  const dimAncho = createDimensionLine(
    new THREE.Vector3(-2, 0.05, 3.9),  // start
    new THREE.Vector3(2, 0.05, 3.9),   // end
    new THREE.Vector3(0, 0, 1),        // offset forward
    0.8,                               // distance
    "Ancho: 4.00m"
  );
  measuresGroup.add(dimAncho);

  const dimAlto = createDimensionLine(
    new THREE.Vector3(2, 0, -3.9),     // start (floor)
    new THREE.Vector3(2, 3.5, -3.9),   // end (roof apex height: pillars 1.5 + vault 2.0 = 3.5m)
    new THREE.Vector3(1, 0, 0),        // offset right
    0.8,                               // distance
    "Alto: 3.50m"
  );
  measuresGroup.add(dimAlto);

  // --- 6. RENDER LOOP ---
  const animate = () => {
    requestAnimationFrame(animate);
    if (controls) {
      controls.update();
    }
    renderer.render(scene, camera);
  };
  animate();

  // --- 7. EVENT LISTENERS ---
  // Material switches
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

  // Measurements toggle switch
  const btnToggleMeasures = document.getElementById('btn-toggle-measures');
  if (btnToggleMeasures) {
    btnToggleMeasures.addEventListener('click', () => {
      showMeasures = !showMeasures;
      measuresGroup.visible = showMeasures;
      if (showMeasures) {
        btnToggleMeasures.classList.add('active');
      } else {
        btnToggleMeasures.classList.remove('active');
      }
    });
  }

  // Handle container resizing
  const handleResize = () => {
    const width = canvasWrapper.clientWidth;
    const height = canvasWrapper.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', handleResize);
  
  // Also stop autoRotate when the user interacts
  if (controls) {
    controls.addEventListener('start', () => {
      controls.autoRotate = false;
    });
  }
};
