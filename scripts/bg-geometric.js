// ===============================
// GEOMETRIC PATTERN BACKGROUND
// Modern geometric shapes with animations
// ===============================

(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 15;

  // Create geometric shapes
  const shapes = [];
  
  // Torus
  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0x0066ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.set(-5, 3, -5);
  scene.add(torus);
  shapes.push({ mesh: torus, speedX: 0.005, speedY: 0.003, speedZ: 0.007 });

  // Icosahedron
  const icosahedronGeometry = new THREE.IcosahedronGeometry(1.5, 0);
  const icosahedronMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d9ff,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
  icosahedron.position.set(5, -2, -3);
  scene.add(icosahedron);
  shapes.push({ mesh: icosahedron, speedX: 0.007, speedY: 0.005, speedZ: 0.004 });

  // Octahedron
  const octahedronGeometry = new THREE.OctahedronGeometry(1.8, 0);
  const octahedronMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
  octahedron.position.set(0, 4, -8);
  scene.add(octahedron);
  shapes.push({ mesh: octahedron, speedX: 0.004, speedY: 0.006, speedZ: 0.005 });

  // Torus Knot
  const torusKnotGeometry = new THREE.TorusKnotGeometry(1.5, 0.3, 100, 16);
  const torusKnotMaterial = new THREE.MeshBasicMaterial({
    color: 0x0066ff,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
  torusKnot.position.set(-4, -3, -6);
  scene.add(torusKnot);
  shapes.push({ mesh: torusKnot, speedX: 0.003, speedY: 0.008, speedZ: 0.006 });

  // Dodecahedron
  const dodecahedronGeometry = new THREE.DodecahedronGeometry(1.2, 0);
  const dodecahedronMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d9ff,
    wireframe: true,
    transparent: true,
    opacity: 0.38
  });
  const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
  dodecahedron.position.set(3, 2, -4);
  scene.add(dodecahedron);
  shapes.push({ mesh: dodecahedron, speedX: 0.006, speedY: 0.004, speedZ: 0.007 });

  // Add grid helper
  const gridHelper = new THREE.GridHelper(30, 30, 0x0066ff, 0x00d9ff);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.1;
  gridHelper.position.y = -5;
  scene.add(gridHelper);

  // Add subtle particle field
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  
  // Animation
  function animate() {
    requestAnimationFrame(animate);
    
    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    
    // Rotate camera slightly based on mouse
    camera.position.x = targetX * 2;
    camera.position.y = targetY * 2;
    camera.lookAt(scene.position);
    
    // Animate each shape
    shapes.forEach(shape => {
      shape.mesh.rotation.x += shape.speedX;
      shape.mesh.rotation.y += shape.speedY;
      shape.mesh.rotation.z += shape.speedZ;
      
      // Floating motion
      shape.mesh.position.y += Math.sin(Date.now() * 0.001 + shape.speedX * 100) * 0.01;
    });
    
    // Rotate grid
    gridHelper.rotation.y += 0.001;
    
    // Rotate particles
    particles.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Performance optimization for mobile
  if (window.innerWidth < 768) {
    // Reduce shapes on mobile
    shapes.forEach((shape, index) => {
      if (index > 2) {
        scene.remove(shape.mesh);
      }
    });
    
    // Reduce particles
    const reducedPositions = new Float32Array(200 * 3);
    for (let i = 0; i < 200 * 3; i++) {
      reducedPositions[i] = (Math.random() - 0.5) * 50;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(reducedPositions, 3));
  }
  
  console.log('Geometric background loaded with ' + shapes.length + ' shapes');
})();
