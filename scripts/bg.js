// ===============================
// ANIMATED GRADIENT MESH BACKGROUND
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
  camera.position.z = 5;

  // Create animated gradient waves
  const geometry = new THREE.PlaneGeometry(20, 20, 50, 50);
  
  // Custom shader material for gradient effect
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(0x0066ff) },
      color2: { value: new THREE.Color(0x00d9ff) },
      color3: { value: new THREE.Color(0x8b5cf6) }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        vUv = uv;
        
        vec3 pos = position;
        
        // Create multiple wave patterns
        float wave1 = sin(pos.x * 2.0 + time) * 0.5;
        float wave2 = sin(pos.y * 2.0 - time * 0.7) * 0.5;
        float wave3 = sin((pos.x + pos.y) * 1.5 + time * 0.5) * 0.3;
        
        pos.z = wave1 + wave2 + wave3;
        vElevation = pos.z;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        // Create animated gradient
        float mixValue = vElevation * 0.5 + 0.5;
        vec3 color = mix(color1, color2, vUv.x);
        color = mix(color, color3, vUv.y);
        color = mix(color, color1, sin(time * 0.5) * 0.5 + 0.5);
        
        // Add glow effect
        float alpha = 0.3 + mixValue * 0.2;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    wireframe: false,
    side: THREE.DoubleSide
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI * 0.3;
  scene.add(mesh);

  // Add floating orbs
  const orbs = [];
  const orbGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  
  for (let i = 0; i < 8; i++) {
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x0066ff : 0x00d9ff,
      transparent: true,
      opacity: 0.6
    });
    
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.x = (Math.random() - 0.5) * 10;
    orb.position.y = (Math.random() - 0.5) * 10;
    orb.position.z = (Math.random() - 0.5) * 5;
    
    orb.userData.speed = Math.random() * 0.02 + 0.01;
    orb.userData.offset = Math.random() * Math.PI * 2;
    
    orbs.push(orb);
    scene.add(orb);
  }

  // Add subtle stars in the background
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  
  for (let i = 0; i < 200; i++) {
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 50;
    starVertices.push(x, y, z);
  }
  
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

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
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Update shader time
    material.uniforms.time.value = elapsedTime;
    
    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    
    // Rotate mesh based on mouse
    mesh.rotation.x = -Math.PI * 0.3 + targetY * 0.3;
    mesh.rotation.y = targetX * 0.3;
    
    // Animate orbs
    orbs.forEach((orb, i) => {
      orb.position.y = Math.sin(elapsedTime * orb.userData.speed + orb.userData.offset) * 3;
      orb.position.x = Math.cos(elapsedTime * orb.userData.speed * 0.5 + orb.userData.offset) * 4;
      
      // Pulse effect
      const scale = 1 + Math.sin(elapsedTime * 2 + i) * 0.2;
      orb.scale.set(scale, scale, scale);
    });
    
    // Rotate stars slowly
    stars.rotation.y = elapsedTime * 0.05;
    stars.rotation.x = elapsedTime * 0.03;
    
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
    // Reduce orb count on mobile
    orbs.forEach((orb, i) => {
      if (i > 4) {
        scene.remove(orb);
        orbs.splice(i, 1);
      }
    });
    
    // Reduce star count
    const reducedStars = [];
    for (let i = 0; i < starVertices.length; i += 6) {
      reducedStars.push(starVertices[i], starVertices[i + 1], starVertices[i + 2]);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(reducedStars, 3));
  }
})();
