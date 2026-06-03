//навигация, анимации, lightbox

// ── ВКЛАДКИ ──────────────────────────────────
var tabLinks = document.querySelectorAll(".tabs a");
var allPages = document.querySelectorAll(".pg");

tabLinks.forEach(function(link) {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    var key = this.dataset.pg;

    tabLinks.forEach(function(t) { t.classList.remove("on"); });
    allPages.forEach(function(p) { p.classList.remove("on"); });

    this.classList.add("on");
    var pg = document.getElementById("pg-" + key);
    if (pg) {
      pg.classList.add("on");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(initReveal, 60);
      setTimeout(function() { initLightbox("g-" + key); }, 80);
    }
  });
});

// ── REVEAL ───────────────────────────────────
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add("vis");
  });
}, { threshold: 0.06 });

function initReveal() {
  document.querySelectorAll(".rv").forEach(function(el) {
    revealObserver.observe(el);
  });
}

// ── LIGHTBOX ─────────────────────────────────
var lbImages = [];
var lbIndex  = 0;

function initLightbox(gridId) {
  var grid = document.getElementById(gridId);
  if (!grid) return;

  grid.querySelectorAll(".gi").forEach(function(item) {
    item.onclick = function() {
      var img = this.querySelector("img");
      if (!img) return;
      lbImages = Array.from(grid.querySelectorAll(".gi img"));
      lbIndex  = lbImages.indexOf(img);
      if (lbIndex === -1) return;
      openLightbox();
    };
  });
}

function openLightbox() {
  if (!lbImages.length) return;
  var img = lbImages[lbIndex];
  document.getElementById("lb-img").src = img.src;
  document.getElementById("lb-img").alt = img.alt || "";
  document.getElementById("lb-c").textContent = (lbIndex + 1) + " / " + lbImages.length;
  document.getElementById("lb").classList.add("on");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lb").classList.remove("on");
  document.body.style.overflow = "";
}

function lightboxNav(dir) {
  if (!lbImages.length) return;
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  openLightbox();
}

document.getElementById("lb-x").onclick = closeLightbox;
document.getElementById("lb-p").onclick = function(e) { lightboxNav(-1); e.stopPropagation(); };
document.getElementById("lb-n").onclick = function(e) { lightboxNav(1);  e.stopPropagation(); };
document.getElementById("lb").onclick   = function(e) {
  if (e.target === document.getElementById("lb")) closeLightbox();
};

document.addEventListener("keydown", function(e) {
  if (!document.getElementById("lb").classList.contains("on")) return;
  if (e.key === "ArrowLeft")  lightboxNav(-1);
  if (e.key === "ArrowRight") lightboxNav(1);
  if (e.key === "Escape")     closeLightbox();
});

// ── ИНИЦИАЛИЗАЦИЯ ────────────────────────────
initReveal();

// Автозагрузка галерей из JSON
loadGallery("g-arts",        "images/arts",        "FLUX · LoRA");
loadGallery("g-vessel",      "images/vessel",      "LoRA · ComfyUI");
loadGallery("g-td",          "images/3d",          "Maya · Substance");
loadGallery("g-infographic", "images/infographic", "FLUX · Illustrator");
tabLinks.forEach(function(link) {
  link.addEventListener("click", function() {
    lbImages = [];
    lbIndex = 0;
  });
});