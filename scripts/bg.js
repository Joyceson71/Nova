// ===============================
// BACKGROUND ANIMATION WITH THREE.JS
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
  camera.position.z = 50;

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 1500;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  const color1 = new THREE.Color(0x0066ff); // Primary blue
  const color2 = new THREE.Color(0x00d9ff); // Accent cyan
  const color3 = new THREE.Color(0x8b5cf6); // Purple
  
  for (let i = 0; i < particleCount; i++) {
    // Positions
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    
    // Colors - mix between blue and cyan
    const mixColor = Math.random();
    let finalColor;
    
    if (mixColor < 0.6) {
      finalColor = color1;
    } else if (mixColor < 0.9) {
      finalColor = color2;
    } else {
      finalColor = color3;
    }
    
    colors[i * 3] = finalColor.r;
    colors[i * 3 + 1] = finalColor.g;
    colors[i * 3 + 2] = finalColor.b;
    
    // Sizes
    sizes[i] = Math.random() * 2 + 0.5;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Particle material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });
  
  const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSystem);
  
  // Create connecting lines
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(particleCount * particleCount * 6);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0066ff,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending
  });
  
  const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineSystem);
  
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
    targetX += (mouseX - targetX) * 0.02;
    targetY += (mouseY - targetY) * 0.02;
    
    // Rotate particle system
    particleSystem.rotation.y += 0.0003;
    particleSystem.rotation.x = targetY * 0.1;
    particleSystem.rotation.y = targetX * 0.1;
    
    // Animate individual particles
    const positions = particleSystem.geometry.attributes.position.array;
    const time = Date.now() * 0.0001;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Wave motion
      positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.01;
      
      // Boundary check and reset
      if (positions[i3 + 1] > 50) positions[i3 + 1] = -50;
      if (positions[i3 + 1] < -50) positions[i3 + 1] = 50;
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    // Update connecting lines
    const linePositions = lineSystem.geometry.attributes.position.array;
    let lineIndex = 0;
    const maxDistance = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      for (let j = i + 1; j < particleCount; j++) {
        const j3 = j * 3;
        
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < maxDistance && lineIndex < linePositions.length - 6) {
          linePositions[lineIndex++] = positions[i3];
          linePositions[lineIndex++] = positions[i3 + 1];
          linePositions[lineIndex++] = positions[i3 + 2];
          
          linePositions[lineIndex++] = positions[j3];
          linePositions[lineIndex++] = positions[j3 + 1];
          linePositions[lineIndex++] = positions[j3 + 2];
        }
      }
    }
    
    lineSystem.geometry.setDrawRange(0, lineIndex / 3);
    lineSystem.geometry.attributes.position.needsUpdate = true;
    
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
    particlesMaterial.size = 1;
    lineMaterial.opacity = 0.05;
  }
})();