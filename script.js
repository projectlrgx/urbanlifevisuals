// ---- Settings ----
// Booking delivery. Paste a Formspree endpoint (https://formspree.io/f/xxxxxxx) to send
// inquiries straight to your inbox. Left empty, the form opens the visitor's email app
// with the request filled in, addressed to CONTACT_EMAIL.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'erwinurbano@urbanlifevisuals.com';

// Quote builder rates (PLACEHOLDER — set your real pricing here)
const RATE_PER_SHOOTER_HOUR = 150, RATE_PER_PHOTO = 3, RATE_PER_VIDEO_MIN = 150;
// Editing throughput used for the turnaround estimate (working days)
const PHOTOS_PER_EDIT_DAY = 60, EDIT_DAYS_PER_VIDEO_MIN = 1.5, CULL_DAYS_PER_SHOOTER_HOUR = 0.25;

const $ = id => document.getElementById(id);

// ---- Nav: scroll state + mobile menu ----
const nav = $('nav'), navLinks = $('navLinks'), navToggle = $('navToggle');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20));
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
}
navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// ---- Motion: honor reduced-motion, plus a manual pause for the hero video & marquee ----
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = $('heroVideo'), motionToggle = $('motionToggle');
function readPref() { try { return localStorage.getItem('ulv-motion'); } catch (e) { return null; } }
function savePref(v) { try { localStorage.setItem('ulv-motion', v); } catch (e) { /* storage blocked */ } }
function setMotion(paused, remember) {
  document.documentElement.classList.toggle('motion-paused', paused);
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? '▶ Play motion' : '❚❚ Pause motion';
  if (heroVideo) {
    if (paused) heroVideo.pause();
    else heroVideo.play().catch(() => {});
  }
  if (remember) savePref(paused ? 'paused' : 'on');
}
const saved = readPref();
setMotion(saved ? saved === 'paused' : reduceMotion.matches, false);
motionToggle.addEventListener('click', () => setMotion(motionToggle.getAttribute('aria-pressed') !== 'true', true));

// ---- Scroll reveal (skipped when motion is reduced) ----
if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ---- Package quote builder ----
const hours = $('hours'), shooters = $('shooters'), photos = $('photos'), video = $('video');
const fmt = n => '$' + Math.round(n).toLocaleString();
let currentQuote = null;
function calcQuote() {
  const h = +hours.value, sh = +shooters.value, ph = +photos.value, v = +video.value;
  const total = h * sh * RATE_PER_SHOOTER_HOUR + ph * RATE_PER_PHOTO + v * RATE_PER_VIDEO_MIN;
  const editDays = ph / PHOTOS_PER_EDIT_DAY + v * EDIT_DAYS_PER_VIDEO_MIN + h * sh * CULL_DAYS_PER_SHOOTER_HOUR;
  const weeks = Math.max(1, Math.ceil(editDays / 5));
  $('outHours').textContent = h + (h === 1 ? ' hr' : ' hrs');
  $('outShooters').textContent = sh;
  $('outPhotos').textContent = ph;
  $('outVideo').textContent = v + ' min';
  $('resTotal').textContent = fmt(total);
  $('resDeliv').textContent = ph + (v ? ' + 1' : '');
  $('resTurn').textContent = weeks + (weeks === 1 ? ' wk' : ' wks');
  currentQuote = { h, sh, ph, v, total, weeks };
}
[hours, shooters, photos, video].forEach(s => s.addEventListener('input', calcQuote));
calcQuote();

function describePackage(q) {
  const parts = [`${q.h} hr${q.h === 1 ? '' : 's'} coverage`, `${q.sh} shooter${q.sh === 1 ? '' : 's'}`,
    `${q.ph} edited photos`, q.v ? `${q.v}-min film` : 'no film'];
  return `${parts.join(', ')} · est. ${fmt(q.total)}, ~${q.weeks} wk${q.weeks === 1 ? '' : 's'} turnaround`;
}
const packageField = $('packageField'), packageInput = $('package');
$('usePackage').addEventListener('click', () => {
  packageInput.value = describePackage(currentQuote);
  packageField.hidden = false;
  $('contact').scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  $('name').focus({ preventScroll: true });
});
$('clearPackage').addEventListener('click', () => {
  packageInput.value = ''; packageField.hidden = true; $('usePackage').focus();
});

// ---- Lightbox (dialog with focus management) ----
const lb = $('lightbox'), lbImg = $('lightboxImg'), lbCap = $('lightboxCap'), lbClose = $('lightboxClose');
let lbOpener = null;
// Everything behind the dialog becomes inert while it is open, so focus cannot leave it.
const background = () => document.querySelectorAll('body > .skip, body > header, body > main, body > footer');
function openLB(src, cap, opener) {
  lbOpener = opener;
  lbImg.src = src; lbImg.alt = cap || ''; lbCap.textContent = cap || '';
  lb.hidden = false; lb.classList.add('open'); document.body.style.overflow = 'hidden';
  background().forEach(el => { el.inert = true; });
  lbClose.focus();
}
function closeLB() {
  if (lb.hidden) return;
  background().forEach(el => { el.inert = false; });
  lb.classList.remove('open'); lb.hidden = true; document.body.style.overflow = ''; lbImg.src = '';
  if (lbOpener) lbOpener.focus();
}
lb.addEventListener('focusout', e => { if (!lb.hidden && !lb.contains(e.relatedTarget)) lbClose.focus(); });
document.querySelectorAll('[data-full]').forEach(el =>
  el.addEventListener('click', () => openLB(el.dataset.full, el.dataset.caption, el)));
lbClose.addEventListener('click', closeLB);
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') { e.preventDefault(); closeLB(); }
  if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); } // only control inside the dialog
});

// ---- Contact form: confirm only after real delivery; never lose what was typed ----
const form = $('contactForm'), note = $('formNote'), submitBtn = $('formSubmit');
function setNote(text, kind) {
  note.textContent = text;
  note.className = 'form__note' + (kind ? ' form__note--' + kind : '');
}
function mailtoLink(data) {
  const body = [
    `Name: ${data.get('name')}`, `Email: ${data.get('email')}`,
    `Event date: ${data.get('event_date') || 'not set'}`, `Service: ${data.get('service')}`,
    data.get('package') ? `Package: ${data.get('package')}` : null,
    '', data.get('message') || '',
  ].filter(l => l !== null).join('\n');
  const subject = `Booking request — ${data.get('service')} — ${data.get('name')}`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const data = new FormData(form);
  if (data.get('_gotcha')) return; // bot filled the hidden field

  if (!FORM_ENDPOINT) {
    location.href = mailtoLink(data);
    setNote(`Your email app should open with this request addressed to ${CONTACT_EMAIL} — press Send there to deliver it. ` +
            `Nothing opened? Email ${CONTACT_EMAIL} or call (707) 704-9567. Your details are still filled in below.`, 'info');
    return;
  }

  submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; setNote('Sending your request…');
  try {
    const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    form.reset(); packageField.hidden = true;
    setNote('Request sent — thank you! We reply within one business day.', 'ok');
  } catch (err) {
    setNote(`We couldn't send that just now. Your details are still here — try again, or email ${CONTACT_EMAIL}.`, 'error');
  } finally {
    submitBtn.disabled = false; submitBtn.textContent = 'Send Booking Request';
  }
});

// ---- Year ----
$('year') && ($('year').textContent = new Date().getFullYear());
