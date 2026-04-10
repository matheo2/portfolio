const revealNodes = document.querySelectorAll(".reveal");
const glitchTitle = document.querySelector(".glitch-title");
const noiseLayer = document.getElementById("noiseLayer");
const cursor = document.getElementById("cursor");
const portfolioLoader = document.getElementById("portfolioLoader");
const detailModal = document.getElementById("detailModal");
const detailModalContent = document.getElementById("detailModalContent");
const detailTriggers = document.querySelectorAll("[data-modal-template]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const interactiveSelectors = "a, button, .project-card, .skill-pill, .modal-close, [data-close-modal], .panel, .topbar";

let lastFocusedTrigger = null;
const loaderStartedAt = Date.now();

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
    { threshold: 0.06, rootMargin: "0px 0px -2% 0px" }
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
  window.setTimeout(() => glitchTitle.classList.remove("is-glitching"), 180);
}

if (glitchTitle && !prefersReducedMotion) {
  triggerGlitch();
  window.setInterval(triggerGlitch, 3400);
}

function randomFlicker() {
  if (prefersReducedMotion) {
    return;
  }

  const targets = [...document.querySelectorAll(".panel, .topbar, .detail-dialog")];
  const target = targets[Math.floor(Math.random() * targets.length)];

  if (!target) {
    return;
  }

  target.classList.add("is-flicker");
  window.setTimeout(() => target.classList.remove("is-flicker"), 220);
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

  window.setTimeout(() => glyph.remove(), 12000);
}

if (!prefersReducedMotion) {
  for (let i = 0; i < 6; i += 1) {
    window.setTimeout(spawnNoiseGlyph, i * 280);
  }

  window.setInterval(spawnNoiseGlyph, 1800);
}

if (cursor && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursor.classList.add("is-visible");
    cursor.style.transform = `translate(${event.clientX - 18}px, ${event.clientY - 18}px)`;
  });

  document.addEventListener("mouseover", (event) => {
    if (event.target.closest(interactiveSelectors)) {
      cursor.classList.add("is-hovering");
    }
  });

  document.addEventListener("mouseout", (event) => {
    const related = event.relatedTarget;
    if (!related || !related.closest(interactiveSelectors)) {
      cursor.classList.remove("is-hovering");
    }
  });
}

function finishLoader() {
  if (!portfolioLoader || !document.body.classList.contains("is-loading")) {
    return;
  }

  const minimumDisplay = prefersReducedMotion ? 450 : 2200;
  const elapsed = Date.now() - loaderStartedAt;
  const remaining = Math.max(0, minimumDisplay - elapsed);

  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
    window.setTimeout(() => {
      portfolioLoader.remove();
    }, 720);
  }, remaining);
}

if (portfolioLoader) {
  if (document.readyState === "complete") {
    finishLoader();
  } else {
    window.addEventListener("load", finishLoader, { once: true });
  }
}

function closeModal() {
  if (!detailModal) {
    return;
  }

  detailModal.classList.remove("is-open");
  detailModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (detailModalContent) {
    detailModalContent.innerHTML = "";
  }

  if (lastFocusedTrigger) {
    lastFocusedTrigger.focus();
    lastFocusedTrigger = null;
  }
}

function openModal(templateId, trigger) {
  if (!detailModal || !detailModalContent) {
    return;
  }

  const template = document.getElementById(templateId);

  if (!(template instanceof HTMLTemplateElement)) {
    return;
  }

  detailModalContent.innerHTML = "";
  detailModalContent.appendChild(template.content.cloneNode(true));
  detailModal.classList.add("is-open");
  detailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  lastFocusedTrigger = trigger;

  const closeButton = detailModal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }
}

detailTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openModal(trigger.dataset.modalTemplate, trigger));
});

if (detailModal) {
  detailModal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && detailModal?.classList.contains("is-open")) {
    closeModal();
  }
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !prefersReducedMotion) {
    triggerGlitch();
  }
});
