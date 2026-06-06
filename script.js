// ---- Nav: scroll state + mobile menu ----
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20));
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ---- Scroll reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Animated count-up stats ----
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const dec = parseInt(el.dataset.dec || '0', 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const dur = 1400; const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = (target * eased).toFixed(dec);
    el.textContent = prefix + val + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); countObserver.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.stat__num').forEach(el => countObserver.observe(el));

// ---- Interactive ROI estimator ----
const $ = id => document.getElementById(id);
const budget = $('budget'), cpl = $('cpl'), closeR = $('close'), value = $('value');
const fmt = n => '$' + Math.round(n).toLocaleString();
function calcROI() {
  const b = +budget.value, c = +cpl.value, cl = +closeR.value / 100, v = +value.value;
  const leads = b / c;
  const customers = leads * cl;
  const revenue = customers * v;
  const roas = revenue / b;
  $('outBudget').textContent = fmt(b);
  $('outCpl').textContent = fmt(c);
  $('outClose').textContent = closeR.value + '%';
  $('outValue').textContent = fmt(v);
  $('resLeads').textContent = Math.round(leads);
  $('resCust').textContent = Math.round(customers);
  $('resRev').textContent = fmt(revenue);
  $('resRoas').textContent = roas.toFixed(1) + 'x';
}
[budget, cpl, closeR, value].forEach(s => s.addEventListener('input', calcROI));
calcROI();

// ---- Lightbox ----
const lb = $('lightbox'), lbImg = $('lightboxImg'), lbCap = $('lightboxCap'), lbClose = $('lightboxClose');
function openLB(src, cap) {
  lbImg.src = src; lbImg.alt = cap || ''; lbCap.textContent = cap || '';
  lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
}
function closeLB() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; lbImg.src = ''; }
document.querySelectorAll('[data-full]').forEach(el =>
  el.addEventListener('click', () => openLB(el.dataset.full, el.dataset.caption)));
lbClose.addEventListener('click', closeLB);
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

// ---- Contact form (front-end only) ----
const form = $('contactForm'), note = $('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  note.hidden = false; form.reset();
});

// ---- Year ----
$('year') && ($('year').textContent = new Date().getFullYear());
