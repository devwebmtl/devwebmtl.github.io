// ===== NAVBAR =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");
hamburger?.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks?.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ===== BACK TO TOP =====
const backTop = document.getElementById("back-top");
window.addEventListener("scroll", () =>
  backTop.classList.toggle("visible", window.scrollY > 400)
);
backTop?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ===== FADE-UP =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

// ===== BILINGUAL FR / EN =====
let lang = "fr";

function applyLang(l) {
  lang = l;
  document.documentElement.setAttribute("data-lang", l);

  // Textes simples
  document.querySelectorAll("[data-fr][data-en]").forEach(el => {
    if (el.tagName.match(/^H[1-6]$/)) return;
    const val = el.getAttribute(`data-${l}`);
    if (val) el.textContent = val;
  });

  // Titres avec <span> coloré
  document.querySelectorAll("h1[data-fr],h2[data-fr]").forEach(el => {
    const val = el.getAttribute(`data-${l}`);
    if (val) el.innerHTML = val;
  });

  // Options select
  document.querySelectorAll("option[data-fr]").forEach(opt => {
    const val = opt.getAttribute(`data-${l}`);
    if (val) opt.textContent = val;
  });

  // Bouton langue
  const flag = l === "fr" ? "🇬🇧 EN" : "🇫🇷 FR";
  document.getElementById("lang-btn").textContent         = flag;
  document.getElementById("lang-btn-mobile").textContent  = flag;

  // Placeholder textarea
  const ta = document.querySelector("textarea[name='message']");
  if (ta) ta.placeholder = l === "fr" ? "Mon projet consiste à..." : "My project involves...";
}

document.getElementById("lang-btn")?.addEventListener("click",
  () => applyLang(lang === "fr" ? "en" : "fr")
);
document.getElementById("lang-btn-mobile")?.addEventListener("click",
  () => applyLang(lang === "fr" ? "en" : "fr")
);

// ===== CONTACT FORM =====
// ===== CONTACT FORM — MODE DÉMO (envoi désactivé) =====
const form = document.getElementById("contact-form");
const formMsg = document.getElementById("form-msg");

form?.addEventListener("submit", e => {
  e.preventDefault();
  formMsg.className = "form-msg error";
  formMsg.innerHTML = lang === "fr"
    ? "⚠️ <strong>Mode démo</strong> — L'envoi est désactivé sur cette version de démonstration."
    : "⚠️ <strong>Demo mode</strong> — Sending is disabled on this demo version.";
});


