# Background Changes - Quick Update

This folder contains **only the changed files** for updating your background.

## 📁 What's Included:

1. **bg.js** - NEW animated gradient mesh background (updated)
2. **bg-css-alternative.js** - Pure CSS background option (new file)
3. **bg-geometric.js** - Geometric shapes background (new file)
4. **BACKGROUND-OPTIONS.md** - Complete guide to all options

---

## 🚀 Quick Installation:

### Step 1: Backup Your Current Background
```bash
cd your-project/scripts
mv bg.js bg-OLD-BACKUP.js
```

### Step 2: Copy New Files
Copy these files to your `scripts/` folder:
- `bg.js` (replace existing)
- `bg-css-alternative.js` (new)
- `bg-geometric.js` (new)

### Step 3: Choose Your Background

**Option A - Use New Gradient Mesh (Recommended)**
Your `index.html` should already have:
```html
<script src="scripts/bg.js"></script>
```
✅ Done! Refresh your browser.

**Option B - Use CSS Animation**
In `index.html`, change to:
```html
<script src="scripts/bg-css-alternative.js"></script>
```

**Option C - Use Geometric Shapes**
In `index.html`, change to:
```html
<script src="scripts/bg-geometric.js"></script>
```

---

## 🎨 Background Comparison:

| Background | File | Three.js Required? | Performance |
|------------|------|-------------------|-------------|
| Gradient Mesh | bg.js | ✅ Yes | ⭐⭐⭐⭐ |
| CSS Animation | bg-css-alternative.js | ❌ No | ⭐⭐⭐⭐⭐ |
| Geometric | bg-geometric.js | ✅ Yes | ⭐⭐⭐⭐ |

---

## 📝 What Changed:

### bg.js (Updated)
**Old:** Particle network with connecting lines
**New:** Animated gradient mesh with floating orbs and stars

**Features:**
- ✨ Flowing gradient waves with shader effects
- 🔮 8 floating glowing orbs
- ⭐ 200 twinkling stars
- 🖱️ Mouse-reactive camera
- 📱 Mobile optimized

### bg-css-alternative.js (NEW)
- Pure CSS animations (no Three.js)
- Floating gradient orbs
- Twinkling stars
- Mouse parallax effect
- Fastest loading

### bg-geometric.js (NEW)
- Wireframe 3D shapes
- Torus, icosahedron, dodecahedron
- Animated grid floor
- Particle field
- Perfect for tech/engineering sites

---

## 🔧 Troubleshooting:

**Background not showing?**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors (F12)
3. Ensure Three.js is loaded (for bg.js and bg-geometric.js)

**Want the old particle background back?**
Use your backup file:
```bash
mv bg-OLD-BACKUP.js bg.js
```

---

## 💡 Pro Tip:

Try all three backgrounds and see which one fits your site best!
1. Test with your content
2. Check on mobile devices
3. Monitor page load speed

**Current recommendation:** Use `bg.js` for the best visual impact! ✨

---

**Need the full project?** Download the complete `nova-nexus-hub.zip` package.
