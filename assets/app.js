const body = document.body;
const focusables = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';

function trapFocus(container, event) {
  const nodes = [...container.querySelectorAll(focusables)];
  if (!nodes.length) return;
  const first = nodes[0], last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

const langDropdowns = document.querySelectorAll('.lang-dropdown');
langDropdowns.forEach((langDropdown) => {
  const trigger = langDropdown.querySelector('.lang-trigger');
  trigger?.addEventListener('click', () => {
    const open = langDropdown.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(open));
  });
});
document.addEventListener('click', (e) => {
  langDropdowns.forEach((langDropdown) => {
    const trigger = langDropdown.querySelector('.lang-trigger');
    if (!langDropdown.contains(e.target)) {
      langDropdown.classList.remove('open');
      trigger?.setAttribute('aria-expanded', 'false');
    }
  });
});

const drawer = document.querySelector('.mobile-drawer');
const burger = document.querySelector('.burger');
const closeDrawer = () => {
  drawer?.classList.remove('open');
  drawer?.setAttribute('aria-hidden', 'true');
  burger?.setAttribute('aria-expanded', 'false');
  body.style.overflow = '';
};
if (burger && drawer) {
  burger.addEventListener('click', () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    drawer.querySelector('.drawer-close')?.focus();
  });
  drawer.querySelector('.drawer-close')?.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closePrivacy();
  }
  if (e.key === 'Tab' && drawer?.classList.contains('open')) trapFocus(drawer.querySelector('.drawer-panel'), e);
  if (e.key === 'Tab' && modal?.classList.contains('open')) trapFocus(modal.querySelector('.privacy-dialog'), e);
});

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  item.addEventListener('click', () => {
    faqItems.forEach((other) => { if (other !== item) other.setAttribute('aria-expanded', 'false'); });
    item.setAttribute('aria-expanded', item.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  });
});

const modal = document.querySelector('.privacy-modal');
const openPrivacyBtn = document.querySelector('.privacy-link');
function closePrivacy() {
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
}
if (modal && openPrivacyBtn) {
  openPrivacyBtn.addEventListener('click', () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    modal.querySelector('.privacy-x')?.focus();
  });
  modal.querySelector('.privacy-x')?.addEventListener('click', closePrivacy);
  modal.querySelector('.privacy-footer .btn')?.addEventListener('click', closePrivacy);
  modal.addEventListener('click', (e) => { if (e.target === modal) closePrivacy(); });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.transform = 'translateY(0)';
      entry.target.style.opacity = '1';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section, .kpi-strip').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'transform .5s ease, opacity .5s ease';
  observer.observe(el);
});
