/**
 * ===============================
 * 2D GEOMETRIC LINE BACKGROUND
 * Circuit Board / Tech Grid Aesthetic
 * ===============================
 */

class GeometricLineBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.circuits = [];
    this.waves = [];
    this.animationId = null;
    this.time = 0;
    
    // Device detection
    this.isMobile = window.innerWidth < 768;
    
    // Configuration
    this.config = {
      nodeCount: this.isMobile ? 20 : 40,
      circuitCount: this.isMobile ? 3 : 5,
      waveCount: this.isMobile ? 2 : 4,
      maxConnectionDistance: this.isMobile ? 150 : 200,
      colors: {
        primary: '#3b82f6',
        secondary: '#ff2e63',
        tertiary: '#fcd34d',
        accent: '#8b5cf6',
        glow: '#00d9ff'
      }
    };

    this.init();
  }

  init() {
    this.resize();
    this.createNodes();
    this.createCircuits();
    this.createWaves();
    this.setupEventListeners();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // ============ NODES (Connection Points) ============
  createNodes() {
    this.nodes = [];
    
    for (let i = 0; i < this.config.nodeCount; i++) {
      this.nodes.push(new Node(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        this.config.colors
      ));
    }
  }

  drawNodes() {
    this.nodes.forEach(node => {
      node.update(this.canvas.width, this.canvas.height, this.time);
      node.draw(this.ctx);
    });
  }

  // ============ CONNECTIONS (Lines between nodes) ============
  createConnections() {
    this.connections = [];
    const maxDistance = this.config.maxConnectionDistance;

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          this.connections.push({
            start: this.nodes[i],
            end: this.nodes[j],
            distance: distance,
            maxDistance: maxDistance
          });
        }
      }
    }
  }

  drawConnections() {
    this.connections.forEach(connection => {
      const opacity = 1 - connection.distance / connection.maxDistance;
      const pulseOffset = Math.sin(this.time * 2 + connection.distance * 0.01) * 0.3;
      
      this.ctx.beginPath();
      this.ctx.moveTo(connection.start.x, connection.start.y);
      this.ctx.lineTo(connection.end.x, connection.end.y);
      this.ctx.strokeStyle = `rgba(59, 130, 246, ${(opacity * 0.3) + pulseOffset * 0.1})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      // Draw data packets traveling along lines
      if (Math.random() > 0.95) {
        this.drawDataPacket(connection);
      }
    });
  }

  drawDataPacket(connection) {
    const progress = (this.time * 0.5) % 1;
    const x = connection.start.x + (connection.end.x - connection.start.x) * progress;
    const y = connection.start.y + (connection.end.y - connection.start.y) * progress;

    this.ctx.beginPath();
    this.ctx.arc(x, y, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = this.config.colors.glow;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = this.config.colors.glow;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  // ============ CIRCUITS (Complex path lines) ============
  createCircuits() {
    this.circuits = [];
    
    for (let i = 0; i < this.config.circuitCount; i++) {
      this.circuits.push(new Circuit(
        this.canvas.width,
        this.canvas.height,
        this.config.colors
      ));
    }
  }

  drawCircuits() {
    this.circuits.forEach(circuit => {
      circuit.update(this.time);
      circuit.draw(this.ctx);
    });
  }

  // ============ WAVES (Scanning lines) ============
  createWaves() {
    this.waves = [];
    
    for (let i = 0; i < this.config.waveCount; i++) {
      this.waves.push(new ScanWave(
        this.canvas.width,
        this.canvas.height,
        this.config.colors,
        i
      ));
    }
  }

  drawWaves() {
    this.waves.forEach(wave => {
      wave.update(this.time);
      wave.draw(this.ctx);
    });
  }

  // ============ GRID LINES ============
  drawGrid() {
    const gridSize = this.isMobile ? 50 : 40;
    const offset = (this.time * 10) % gridSize;

    this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
    this.ctx.lineWidth = 1;

    // Animated vertical lines
    for (let x = -offset; x < this.canvas.width + gridSize; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Animated horizontal lines
    for (let y = -offset; y < this.canvas.height + gridSize; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  // ============ HEXAGON PATTERN ============
  drawHexagonPattern() {
    const hexRadius = this.isMobile ? 60 : 50;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;
    const vertDist = hexHeight;
    const horizDist = hexWidth * 0.75;

    this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
    this.ctx.lineWidth = 1;

    const offset = (this.time * 5) % horizDist;

    for (let row = -2; row < this.canvas.height / vertDist + 2; row++) {
      for (let col = -2; col < this.canvas.width / horizDist + 2; col++) {
        const x = col * horizDist - offset;
        const y = row * vertDist + (col % 2) * (vertDist / 2);
        
        this.drawHexagon(x, y, hexRadius * 0.8);
      }
    }
  }

  drawHexagon(x, y, radius) {
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + radius * Math.cos(angle);
      const hy = y + radius * Math.sin(angle);
      
      if (i === 0) {
        this.ctx.moveTo(hx, hy);
      } else {
        this.ctx.lineTo(hx, hy);
      }
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }

  // ============ DIAGONAL SCAN LINES ============
  drawScanLines() {
    const spacing = 4;
    const offset = (this.time * 30) % (spacing * 2);

    this.ctx.strokeStyle = 'rgba(252, 211, 77, 0.03)';
    this.ctx.lineWidth = 1;

    for (let i = -this.canvas.height; i < this.canvas.width + this.canvas.height; i += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(i - offset, 0);
      this.ctx.lineTo(i - offset - this.canvas.height, this.canvas.height);
      this.ctx.stroke();
    }
  }

  // ============ EVENT LISTENERS ============
  setupEventListeners() {
    window.addEventListener('resize', () => this.handleResize());
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  handleResize() {
    this.isMobile = window.innerWidth < 768;
    this.resize();
    this.createNodes();
    this.createCircuits();
    this.createWaves();
  }

  // ============ ANIMATION LOOP ============
  animate() {
    this.time += 0.016; // ~60fps

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw layers (back to front)
    this.drawGrid();
    this.drawHexagonPattern();
    this.drawScanLines();
    this.drawWaves();
    this.drawCircuits();
    
    // Update and draw connections
    this.createConnections();
    this.drawConnections();
    this.drawNodes();

    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.animationId) {
      this.animate();
    }
  }

  destroy() {
    this.pause();
    console.log('GeometricLineBackground destroyed');
  }
}

// ============ NODE CLASS ============
class Node {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.colors = colors;
    
    // Appearance
    this.size = Math.random() * 4 + 2;
    this.color = colors.primary;
    
    // Movement
    this.floatRadius = Math.random() * 30 + 20;
    this.floatSpeed = Math.random() * 0.5 + 0.3;
    this.floatOffset = Math.random() * Math.PI * 2;
    
    // Pulse
    this.pulseSpeed = Math.random() * 2 + 1;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update(canvasWidth, canvasHeight, time) {
    // Floating motion
    this.x = this.baseX + Math.cos(time * this.floatSpeed + this.floatOffset) * this.floatRadius;
    this.y = this.baseY + Math.sin(time * this.floatSpeed + this.floatOffset) * this.floatRadius;
    
    // Keep in bounds
    if (this.x < 0) this.baseX += canvasWidth;
    if (this.x > canvasWidth) this.baseX -= canvasWidth;
    if (this.y < 0) this.baseY += canvasHeight;
    if (this.y > canvasHeight) this.baseY -= canvasHeight;
    
    // Pulse effect
    this.pulsePhase = time * this.pulseSpeed;
  }

  draw(ctx) {
    const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
    const currentSize = this.size + pulse * 2;
    
    // Outer glow
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentSize * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59, 130, 246, ${pulse * 0.2})`;
    ctx.fill();
    
    // Node core
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Inner highlight
    ctx.beginPath();
    ctx.arc(this.x - currentSize * 0.3, this.y - currentSize * 0.3, currentSize * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
  }
}

// ============ CIRCUIT CLASS ============
class Circuit {
  constructor(canvasWidth, canvasHeight, colors) {
    this.colors = colors;
    this.points = [];
    this.pathProgress = 0;
    
    // Generate circuit path
    const pointCount = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < pointCount; i++) {
      this.points.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight
      });
    }
    
    // Style
    this.color = colors[Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)]];
    this.thickness = Math.random() * 2 + 1;
    this.speed = Math.random() * 0.3 + 0.2;
  }

  update(time) {
    this.pathProgress = (time * this.speed) % 1;
  }

  draw(ctx) {
    if (this.points.length < 2) return;
    
    ctx.strokeStyle = this.hexToRgba(this.color, 0.3);
    ctx.lineWidth = this.thickness;
    
    // Draw path
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    
    for (let i = 1; i < this.points.length; i++) {
      const prevPoint = this.points[i - 1];
      const currPoint = this.points[i];
      
      // Control points for curves
      const cpX = (prevPoint.x + currPoint.x) / 2;
      const cpY = prevPoint.y;
      
      ctx.quadraticCurveTo(cpX, cpY, currPoint.x, currPoint.y);
    }
    ctx.stroke();
    
    // Draw traveling signal
    const totalSegments = this.points.length - 1;
    const currentSegment = Math.floor(this.pathProgress * totalSegments);
    const segmentProgress = (this.pathProgress * totalSegments) % 1;
    
    if (currentSegment < totalSegments) {
      const start = this.points[currentSegment];
      const end = this.points[currentSegment + 1];
      const signalX = start.x + (end.x - start.x) * segmentProgress;
      const signalY = start.y + (end.y - start.y) * segmentProgress;
      
      // Signal glow
      ctx.beginPath();
      ctx.arc(signalX, signalY, 5, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

// ============ SCAN WAVE CLASS ============
class ScanWave {
  constructor(canvasWidth, canvasHeight, colors, index) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.colors = colors;
    this.index = index;
    
    this.isVertical = Math.random() > 0.5;
    this.position = 0;
    this.speed = Math.random() * 0.5 + 0.5;
    this.thickness = Math.random() * 100 + 50;
    this.color = colors[Object.keys(colors)[index % Object.keys(colors).length]];
  }

  update(time) {
    const maxPos = this.isVertical ? this.canvasWidth : this.canvasHeight;
    this.position = ((time * this.speed * 50) + (this.index * maxPos / 4)) % (maxPos + this.thickness * 2) - this.thickness;
  }

  draw(ctx) {
    const gradient = this.isVertical
      ? ctx.createLinearGradient(this.position, 0, this.position + this.thickness, 0)
      : ctx.createLinearGradient(0, this.position, 0, this.position + this.thickness);
    
    gradient.addColorStop(0, this.hexToRgba(this.color, 0));
    gradient.addColorStop(0.5, this.hexToRgba(this.color, 0.1));
    gradient.addColorStop(1, this.hexToRgba(this.color, 0));
    
    ctx.fillStyle = gradient;
    
    if (this.isVertical) {
      ctx.fillRect(this.position, 0, this.thickness, this.canvasHeight);
    } else {
      ctx.fillRect(0, this.position, this.canvasWidth, this.thickness);
    }
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
  const bg = new GeometricLineBackground('bg-canvas');
  window.geometricBackground = bg;
  
  console.log('✨ Geometric Line Background initialized');
});

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeometricLineBackground;
}