(() => {
  const btn = document.getElementById('runaway-no');
  if (!btn) return;

  const TRIGGER_RADIUS = 150; // px from the button's edge where it starts fleeing
  const MAX_SPEED = 9;        // px per frame (at 60fps) when the cursor is very close
  const MARGIN = 12;          // keeps the button this far from the viewport edges

  // Make sure nothing (like a CSS transition) fights the animation loop
  btn.style.transition = 'none';
  btn.style.willChange = 'transform';

  let mouse = null;
  let offsetX = 0;
  let offsetY = 0;
  let last = performance.now();

  document.addEventListener('mousemove', (e) => {
    mouse = { x: e.clientX, y: e.clientY };
  });
  document.addEventListener('mouseleave', () => { mouse = null; });
  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    mouse = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouse = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  document.addEventListener('touchend', () => { mouse = null; });

  function tick(now) {
    const dt = Math.min((now - last) / 16.667, 3); // frame-rate independent
    last = now;

    if (mouse) {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = cx - mouse.x;
      const dy = cy - mouse.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      const radius = TRIGGER_RADIUS + Math.max(r.width, r.height) / 2;

      if (dist < radius) {
        // The closer the cursor, the faster it moves away
        const strength = 1 - dist / radius;
        const speed = MAX_SPEED * (0.3 + 0.7 * strength) * dt;
        const moveX = (dx / dist) * speed;
        const moveY = (dy / dist) * speed;

        // Where the button would sit with no transform applied
        const baseLeft = r.left - offsetX;
        const baseTop = r.top - offsetY;
        const minX = MARGIN - baseLeft;
        const maxX = window.innerWidth - MARGIN - r.width - baseLeft;
        const minY = MARGIN - baseTop;
        const maxY = window.innerHeight - MARGIN - r.height - baseTop;

        let newX = offsetX + moveX;
        let newY = offsetY + moveY;

        // If it hits a wall, slide along the wall instead of getting stuck
        if (newX < minX || newX > maxX) {
          newY += Math.abs(moveX) * (dy >= 0 ? 1 : -1);
          newX = Math.min(Math.max(newX, minX), maxX);
        }
        if (newY < minY || newY > maxY) {
          newX += Math.abs(moveY) * (dx >= 0 ? 1 : -1);
          newY = Math.min(Math.max(newY, minY), maxY);
          newX = Math.min(Math.max(newX, minX), maxX);
        }

        offsetX = newX;
        offsetY = newY;
        btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();