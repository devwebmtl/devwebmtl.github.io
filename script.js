// ===== TYPED EFFECT =====
const texts = [
  "Développeur Web Full-Stack",
  "Spécialiste Laravel & PHP",
  "Intégrateur WordPress & WooCommerce",
  "Support Technique IT",
  "Développeur Freelance — Montréal"
];
let textIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById("typed-text");

function typeEffect() {
  if (!typedEl) return;
  const current = texts[textIndex];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);
  if (!isDeleting && charIndex === current.length + 1) {
    isDeleting = true; setTimeout(typeEffect, 1800); return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }
  setTimeout(typeEffect, isDeleting ? 45 : 85);
}
typeEffect();


// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 50);
});


// ===== HAMBURGER =====
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");
hamburger?.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));


// ===== FEATURED SLIDER =====
(function () {
  const slides   = document.querySelectorAll(".slide");
  const dots     = document.querySelectorAll(".sl-dot");
  const progress = document.getElementById("sl-progress");
  let current = 0, autoTimer = null;
  const total = slides.length;

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + total) % total;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    if (progress) progress.style.width = ((current + 1) / total * 100) + "%";
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
  function stopAuto()  { clearInterval(autoTimer); }

  document.getElementById("sl-prev")?.addEventListener("click", () => { stopAuto(); goTo(current - 1); startAuto(); });
  document.getElementById("sl-next")?.addEventListener("click", () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach(d => d.addEventListener("click", () => { stopAuto(); goTo(parseInt(d.dataset.dot)); startAuto(); }));

  // Swipe mobile
  let touchStartX = 0;
  const wrapper = document.querySelector(".slider-wrapper");
  wrapper?.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; });
  wrapper?.addEventListener("touchend", e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
  });

  wrapper?.addEventListener("mouseenter", stopAuto);
  wrapper?.addEventListener("mouseleave", startAuto);
  startAuto();
})();


// ===== PROJECT FILTER =====
const filterBtns   = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cats = card.dataset.category || "";
      card.classList.toggle("hidden", filter !== "all" && !cats.includes(filter));
    });
  });
});


// ===== SCROLL FADE-UP ANIMATION =====
const fadeEls = document.querySelectorAll(".service-card, .project-card, .skill-category, .slide-info");
fadeEls.forEach(el => el.classList.add("fade-up"));
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));


// ===== BACK TO TOP =====
const backTop = document.getElementById("back-top");
window.addEventListener("scroll", () => backTop?.classList.toggle("visible", window.scrollY > 400));
backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));


// ===== CONTACT FORM SÉCURISÉ =====
const form    = document.getElementById("contact-form");
const formMsg = document.getElementById("form-msg");
const honeypot = document.getElementById("website");

// Sanitisation — supprime balises HTML
function sanitize(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Limite envoi : max 3 soumissions par session
let submitCount = parseInt(sessionStorage.getItem("submitCount") || "0");

form?.addEventListener("submit", async e => {
  e.preventDefault();

  // 1. Vérif honeypot — si rempli = bot
  if (honeypot && honeypot.value !== "") {
    console.log("Bot détecté");
    return;
  }

  // 2. Vérif Turnstile — token obligatoire
  const turnstileResponse = form.querySelector('[name="cf-turnstile-response"]');
  if (!turnstileResponse || !turnstileResponse.value) {
    formMsg.className = "form-msg error";
    formMsg.textContent = "⚠️ Veuillez compléter la vérification anti-spam.";
    return;
  }

  // 3. Limite anti-spam session
  if (submitCount >= 3) {
    formMsg.className = "form-msg error";
    formMsg.textContent = "⚠️ Trop de tentatives. Réessayez plus tard.";
    return;
  }

  // 4. Validation + sanitisation
  const nom     = sanitize(document.getElementById("nom").value.trim());
  const email   = sanitize(document.getElementById("email").value.trim());
  const message = sanitize(document.getElementById("message").value.trim());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nom.length < 2) {
    formMsg.className = "form-msg error";
    formMsg.textContent = "❌ Nom trop court.";
    return;
  }
  if (!emailRegex.test(email)) {
    formMsg.className = "form-msg error";
    formMsg.textContent = "❌ Email invalide.";
    return;
  }
  if (message.length < 10) {
    formMsg.className = "form-msg error";
    formMsg.textContent = "❌ Message trop court (min. 10 caractères).";
    return;
  }

  // 5. Envoi
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (res.ok) {
      formMsg.className = "form-msg success";
      formMsg.textContent = "✅ Message envoyé ! Je vous réponds sous 24h.";
      form.reset();
      submitCount++;
      sessionStorage.setItem("submitCount", submitCount);
      // Reset Turnstile widget après envoi réussi
      if (window.turnstile) window.turnstile.reset();
    } else {
      throw new Error();
    }
  } catch {
    formMsg.className = "form-msg error";
    formMsg.textContent = "❌ Erreur d'envoi. Veuillez réessayer dans quelques instants.";
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
});
