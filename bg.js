const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
if (isMobile) return;

const canvas = document.getElementById("bg-canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

const geometry = new THREE.BufferGeometry();
const COUNT = 2000;
const positions = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0x00ccff,
  size: 0.04,
  transparent: true,
  opacity: 0.8
});

const points = new THREE.Points(geometry, material);
scene.add(points);

function animate() {
  requestAnimationFrame(animate);
  points.rotation.y += 0.0007;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
