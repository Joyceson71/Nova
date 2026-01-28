
  const canvas = document.getElementById("bg-canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

// Particles
const count = 2500;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0x00ccff,
  size: 0.035,
  transparent: true,
  opacity: 0.85
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / innerWidth - 0.5) * 2;
  mouseY = (e.clientY / innerHeight - 0.5) * 2;
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  particles.rotation.y += 0.0006;
  particles.rotation.x += 0.0003;

  particles.position.x += (mouseX - particles.position.x) * 0.02;
  particles.position.y += (-mouseY - particles.position.y) * 0.02;

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});