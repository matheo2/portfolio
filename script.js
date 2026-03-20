const revealNodes = document.querySelectorAll(".reveal");
const glitchTitle = document.querySelector(".glitch-title");
const noiseLayer = document.getElementById("noiseLayer");
const cursor = document.getElementById("cursor");
const interactiveSelectors = "a, button, .skill-card, .panel, .topbar";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

function triggerGlitch() {
  if (!glitchTitle || prefersReducedMotion) {
    return;
  }

  glitchTitle.classList.add("is-glitching");
  window.setTimeout(() => {
    glitchTitle.classList.remove("is-glitching");
  }, 180);
}

if (glitchTitle && !prefersReducedMotion) {
  triggerGlitch();
  window.setInterval(triggerGlitch, 3400);
}

function randomFlicker() {
  if (prefersReducedMotion) {
    return;
  }

  const targets = [...document.querySelectorAll(".panel, .topbar")];
  const target = targets[Math.floor(Math.random() * targets.length)];

  if (!target) {
    return;
  }

  target.classList.add("is-flicker");
  window.setTimeout(() => {
    target.classList.remove("is-flicker");
  }, 220);
}

if (!prefersReducedMotion) {
  window.setInterval(randomFlicker, 2600);
}

function spawnNoiseGlyph() {
  if (!noiseLayer || prefersReducedMotion) {
    return;
  }

  const glyph = document.createElement("span");
  const tokens = ["//", "[SYS]", "[00]", ">", "TRACK", "NODE", "IO", "[]"];
  glyph.className = "noise-glyph";
  glyph.textContent = tokens[Math.floor(Math.random() * tokens.length)];
  glyph.style.left = `${Math.random() * 100}%`;
  glyph.style.top = `${20 + Math.random() * 65}%`;
  glyph.style.animationDuration = `${7 + Math.random() * 6}s`;
  noiseLayer.appendChild(glyph);

  window.setTimeout(() => {
    glyph.remove();
  }, 12000);
}

if (!prefersReducedMotion) {
  for (let i = 0; i < 6; i += 1) {
    window.setTimeout(spawnNoiseGlyph, i * 280);
  }

  window.setInterval(spawnNoiseGlyph, 1800);
}

if (cursor && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const activateCursor = () => cursor.classList.add("is-visible");
  const moveCursor = (event) => {
    cursor.style.transform = `translate(${event.clientX - 18}px, ${event.clientY - 18}px)`;
  };

  window.addEventListener("mousemove", (event) => {
    activateCursor();
    moveCursor(event);
  });

  document.querySelectorAll(interactiveSelectors).forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursor.classList.add("is-hovering");
    });

    item.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hovering");
    });
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden || prefersReducedMotion) {
    return;
  }

  triggerGlitch();
});
