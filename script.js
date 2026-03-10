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
const navLinks = document.getElementById("nav-links");
hamburger?.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// ===== FEATURED SLIDER (nouveau — fs-slide) =====
(function () {
  var slides  = document.querySelectorAll('.fs-slide');
  var dots    = document.querySelectorAll('.fs-dot');
  var counter = document.getElementById('fs-cur');
  var btnPrev = document.getElementById('fs-prev');
  var btnNext = document.getElementById('fs-next');
  var total   = slides.length;
  var cur     = 0;
  var timer   = null;

  if (!slides.length) return;

  function goTo(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = (n + total) % total;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
    if (counter) counter.textContent = cur + 1;
  }

  function autoPlay() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(cur + 1); }, 5000);
  }

  if (btnPrev) btnPrev.addEventListener('click', function () { goTo(cur - 1); autoPlay(); });
  if (btnNext) btnNext.addEventListener('click', function () { goTo(cur + 1); autoPlay(); });
  dots.forEach(function (d) {
    d.addEventListener('click', function () { goTo(parseInt(d.dataset.goto)); autoPlay(); });
  });

  // Swipe mobile
  var startX = 0;
  var sliderEl = document.querySelector('.fs-slides');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    sliderEl.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(cur + 1) : goTo(cur - 1); autoPlay(); }
    });
  }

  // Lightbox helpers
  window.fsOpenLb = function (id) {
    var lb = document.getElementById(id);
    if (lb) lb.style.display = 'flex';
  };
  window.fsCloseLb = function (el) {
    if (el) el.style.display = 'none';
  };
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.fs-lb').forEach(function (lb) { lb.style.display = 'none'; });
    }
  });

  autoPlay();
})();

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll(".filter-btn");
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
const fadeEls = document.querySelectorAll(".service-card, .project-card, .skill-category");
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
const form = document.getElementById("contact-form");
const formMsg = document.getElementById("form-msg");
const honeypot = document.getElementById("website");

function sanitize(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

let submitCount = parseInt(sessionStorage.getItem("submitCount") || "0");

form?.addEventListener("submit", async e => {
  e.preventDefault();

  if (honeypot && honeypot.value !== "") { console.log("Bot détecté"); return; }

  const turnstileResponse = form.querySelector('[name="cf-turnstile-response"]');
  if (!turnstileResponse || !turnstileResponse.value) {
    formMsg.className = "form-msg error";
    formMsg.textContent = "⚠️ Veuillez compléter la vérification anti-spam.";
    return;
  }

  if (submitCount >= 3) {
    formMsg.className = "form-msg error";
    formMsg.textContent = "⚠️ Trop de tentatives. Réessayez plus tard.";
    return;
  }

  const nom     = sanitize(document.getElementById("nom").value.trim());
  const email   = sanitize(document.getElementById("email").value.trim());
  const message = sanitize(document.getElementById("message").value.trim());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nom.length < 2) {
    formMsg.className = "form-msg error"; formMsg.textContent = "❌ Nom trop court."; return;
  }
  if (!emailRegex.test(email)) {
    formMsg.className = "form-msg error"; formMsg.textContent = "❌ Email invalide."; return;
  }
  if (message.length < 10) {
    formMsg.className = "form-msg error"; formMsg.textContent = "❌ Message trop court (min. 10 caractères)."; return;
  }

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
      if (window.turnstile) window.turnstile.reset();
    } else { throw new Error(); }
  } catch {
    formMsg.className = "form-msg error";
    formMsg.textContent = "❌ Erreur d'envoi. Veuillez réessayer dans quelques instants.";
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
});
