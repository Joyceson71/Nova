# 🎨 Background Options Guide

Your Nova Nexus Hub project now includes **4 different background styles**! Choose the one you like best.

## 📁 Available Backgrounds:

### 1. **Animated Gradient Mesh** (Default - NEW!)
**File:** `scripts/bg.js`
- ✨ Flowing gradient waves with shader effects
- 🔮 Floating glowing orbs
- ⭐ Subtle star field
- 🖱️ Mouse-reactive camera movement
- **Best for:** Modern, fluid, colorful look

### 2. **Pure CSS Animation** (Lightweight)
**File:** `scripts/bg-css-alternative.js`
- 🎨 CSS-only animated gradients (no Three.js)
- 💨 Floating colored orbs
- ✨ Twinkling stars
- 🖱️ Mouse parallax effect
- **Best for:** Fast loading, simple animations
- **Advantage:** Works without JavaScript libraries

### 3. **Geometric Shapes** (Technical)
**File:** `scripts/bg-geometric.js`
- 🔷 Wireframe 3D geometric shapes
- 📐 Torus, icosahedron, dodecahedron
- 🌐 Animated grid floor
- ⭐ Particle field
- **Best for:** Technical, engineering aesthetic

### 4. **Particle Network** (Original)
**File:** Available in the old bg.js (backup below)
- 🔵 1500 animated particles
- 🔗 Connecting lines between particles
- 🌊 Wave motion effects
- **Best for:** Tech/data visualization look

---

## 🔄 How to Switch Backgrounds:

### Method 1: Replace the Script File

**In your `index.html`, find this line around line 423:**
```html
<script src="scripts/bg.js"></script>
```

**Change it to one of these:**

For **CSS Animation** (no Three.js needed):
```html
<script src="scripts/bg-css-alternative.js"></script>
```

For **Geometric Shapes**:
```html
<script src="scripts/bg-geometric.js"></script>
```

For **Animated Gradient Mesh** (current default):
```html
<script src="scripts/bg.js"></script>
```

### Method 2: Copy & Rename

1. **Backup current bg.js:**
   ```bash
   mv scripts/bg.js scripts/bg-backup.js
   ```

2. **Copy your preferred background:**
   ```bash
   # For CSS animation:
   cp scripts/bg-css-alternative.js scripts/bg.js
   
   # For geometric:
   cp scripts/bg-geometric.js scripts/bg.js
   ```

3. **Refresh your browser**

---

## 🎯 Recommendations:

**For Performance:** Use `bg-css-alternative.js`
- Fastest loading
- No Three.js dependency
- Best for mobile devices

**For Visual Impact:** Use `bg.js` (Gradient Mesh)
- Most modern look
- Smooth shader animations
- Great balance of performance and beauty

**For Technical Sites:** Use `bg-geometric.js`
- Perfect for engineering/tech content
- Professional wireframe aesthetics
- Matches ECE theme

---

## ⚙️ Customizing Each Background:

### Gradient Mesh (bg.js)
**Change colors** (lines 42-44):
```javascript
color1: { value: new THREE.Color(0x0066ff) },  // Blue
color2: { value: new THREE.Color(0x00d9ff) },  // Cyan
color3: { value: new THREE.Color(0x8b5cf6) }   // Purple
```

**Change orb count** (line 80):
```javascript
for (let i = 0; i < 8; i++) {  // Change 8 to any number
```

### CSS Animation (bg-css-alternative.js)
**Change orb colors** (lines 31-59):
```css
background: radial-gradient(circle, #0066ff 0%, transparent 70%);
```

**Change animation speed** (lines 75-85):
```css
animation: float 20s infinite ease-in-out;  // Change 20s
```

### Geometric (bg-geometric.js)
**Add/remove shapes** (lines 27-90):
```javascript
// Comment out shapes you don't want:
// scene.add(torus);
```

**Change wireframe colors** (lines 30, 42, 54, etc.):
```javascript
color: 0x0066ff,  // Change hex color
```

---

## 🔧 Troubleshooting:

**Background not showing?**
- Check browser console (F12) for errors
- Ensure Three.js CDN is loaded (for non-CSS backgrounds)
- Clear browser cache and refresh

**Slow performance?**
- Switch to CSS animation background
- Reduce particle/shape counts in the code
- Check if mobile optimization is working

**Want to disable background?**
- Remove or comment out the bg.js script tag
- Or add this CSS:
  ```css
  #bg-canvas { display: none !important; }
  ```

---

## 💡 Pro Tips:

1. **Test on mobile devices** - Different backgrounds perform differently
2. **Match your content** - Technical sites → geometric, creative sites → gradient
3. **Consider your audience** - Older devices → CSS animation
4. **Combine with custom colors** - Edit CSS color variables to match background

---

## 📊 Performance Comparison:

| Background | Load Time | CPU Usage | Mobile Friendly | Visual Impact |
|------------|-----------|-----------|-----------------|---------------|
| CSS Animation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Gradient Mesh | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Geometric | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Particle Network | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

**Current Default:** Animated Gradient Mesh (bg.js)
**Recommended:** Try them all and pick your favorite!

🎨 **Enjoy customizing your background!**
