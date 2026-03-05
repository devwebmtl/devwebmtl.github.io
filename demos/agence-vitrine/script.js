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
const form     = document.getElementById("contact-form");
const formMsg  = document.getElementById("form-msg");
const honeypot = document.getElementById("website");
let submitCount = parseInt(sessionStorage.getItem("sc") || "0");

form?.addEventListener("submit", async e => {
  e.preventDefault();
  if (honeypot?.value) return;
  if (submitCount >= 3) {
    formMsg.className = "form-msg error";
    formMsg.textContent = lang === "fr"
      ? "⚠️ Trop de tentatives. Réessayez plus tard."
      : "⚠️ Too many attempts. Please try again later.";
    return;
  }
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  try {
    const res = await fetch(form.action, {
      method: "POST", body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (res.ok) {
      formMsg.className = "form-msg success";
      formMsg.textContent = lang === "fr"
        ? "✅ Demande envoyée ! Nous vous répondons sous 24h."
        : "✅ Request sent! We'll get back to you within 24h.";
      form.reset();
      submitCount++;
      sessionStorage.setItem("sc", submitCount);
    } else throw new Error();
  } catch {
    formMsg.className = "form-msg error";
    formMsg.textContent = lang === "fr"
      ? "❌ Erreur d'envoi. Réessayez."
      : "❌ Send error. Please try again.";
  }
  btn.disabled = false;
  btn.innerHTML = lang === "fr"
    ? '<i class="fas fa-paper-plane"></i> Envoyer ma demande'
    : '<i class="fas fa-paper-plane"></i> Send my request';
});
