/* shared.js — logo renderer, theme, auth helpers, toast */
'use strict';

/* ── Logo SVG ─────────────────────────────────────────────── */
function renderLogo(size = 36) {
  const r = size / 2;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg" aria-label="Onion Communication logo">
    <circle cx="${r}" cy="${r}" r="${r-1}"   stroke="var(--accent)" stroke-width="1.2" fill="none" opacity="0.18"/>
    <circle cx="${r}" cy="${r}" r="${r-6}"   stroke="var(--accent)" stroke-width="1.3" fill="none" opacity="0.38"/>
    <circle cx="${r}" cy="${r}" r="${r-12}"  stroke="var(--accent)" stroke-width="1.5" fill="none" opacity="0.65"/>
    <circle cx="${r}" cy="${r}" r="${r-17}"  fill="var(--accent)" opacity="0.9"/>
    <path d="M${r} ${r-1-1} L${r+2} ${r-6} L${r} ${r-4} L${r-2} ${r-6} Z" fill="var(--accent-lt)" opacity="0.85"/>
  </svg>`;
}

/* ── Theme ────────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('oc_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('oc_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.innerHTML = theme === 'dark'
    ? `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
    : `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

/* ── Auth ─────────────────────────────────────────────────── */
function getToken()    { return localStorage.getItem('oc_token') || (window.LocalAuth && LocalAuth.user() ? 'local-prototype' : null); }
function getUsername() { const u=window.LocalAuth && LocalAuth.user ? LocalAuth.user() : null; return localStorage.getItem('oc_user') || (u ? u.name : null); }
function getGroupCode(){ return localStorage.getItem('oc_group_code'); }
function getGroupType(){ return localStorage.getItem('oc_group_type'); }

function requireAuth() {
  if (!getToken()) { location.href = '/login'; return false; }
  return true;
}

function doLogout() {
  if (window.OCAuth) { OCAuth.logout(); return; }
  if (window.LocalAuth && LocalAuth.user()) { LocalAuth.logout(); return; }
  const t = getToken();
  if (t && t !== 'local-prototype') fetch('/api/auth/logout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token:t}) }).catch(()=>{});
  localStorage.removeItem('oc_token'); localStorage.removeItem('oc_user');
  location.href = '/login';
}

function setNavUser() {
  const u = getUsername();
  const av = document.getElementById('navAvatar');
  const un = document.getElementById('navUsername');
  if (av && u) av.textContent = u[0].toUpperCase();
  if (un && u) un.textContent = u;
}

/* ── Toast ────────────────────────────────────────────────── */
function toast(msg, type = '') {
  const t = document.createElement('div');
  t.className = 'toast' + (type === 'err' ? ' err' : '');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ── Escape HTML ──────────────────────────────────────────── */
function esc(s) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(s || '')));
  return d.innerHTML;
}

/* ── On every page ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  // Inject logo wherever .logo-placeholder exists
  document.querySelectorAll('.logo-placeholder').forEach(el => {
    const sz = parseInt(el.dataset.size || '36');
    el.innerHTML = renderLogo(sz);
  });
  // Mark active nav link
  document.querySelectorAll('.nav-link[data-page]').forEach(l => {
    if (l.dataset.page === document.body.dataset.page) l.classList.add('active');
  });
});
