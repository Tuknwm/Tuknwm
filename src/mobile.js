import { PROJECTS, TOTAL_SLOTS } from './projects-data.js';

if (window.innerWidth >= 1024) { location.replace('/index.html'); }
window.addEventListener('resize', () => { if (window.innerWidth >= 1024) location.replace('/index.html'); });

const githubIcon = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>';
const webIcon = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 0 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-1.65 1.887-1.855q.26-.487.468-1.068zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/></svg>';

const showMobileImageFallback = (image) => {
  if (!image.isConnected) return;
  image.replaceWith(Object.assign(document.createElement('div'), {
    className: 'mobile-preview-404',
    innerHTML: '<span>⚠ 404</span><span class="error-message">Connection Lost</span>',
  }));
};

function attachImageFallbacks(container) {
  container.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => showMobileImageFallback(image), { once: true });
    if (image.complete && image.naturalWidth === 0) showMobileImageFallback(image);
  });
}

function buildLinkHTML(href, label) {
  const isGithub = href.includes('github');
  return `<a href="${href}" target="_blank" rel="noopener">${isGithub ? githubIcon : webIcon}${label} <span aria-hidden="true">↗</span></a>`;
}

function buildProjectArticle(data, index, isFirst) {
  const images = (data.media || []).filter((item) => item.type === 'img');
  const strip = images.map((item, i) => `<img src="${item.src}" alt="${data.title} preview ${i + 1}" loading="lazy">`).join('');
  const links = data.live2
    ? `${buildLinkHTML(data.live, 'Visit Mobile')}${buildLinkHTML(data.live2, 'Visit Dashboard')}${buildLinkHTML(data.github, 'GitHub')}`
    : `${buildLinkHTML(data.live, 'Visit project')}${buildLinkHTML(data.github, 'GitHub')}`;
  const note = data.note ? `<p class="project-note">${data.note}</p>` : '';
  const slug = `p${index + 1}`;
  return `<article class="mobile-project${isFirst ? ' is-open' : ''}" data-project="${slug}">
    <button class="project-toggle" type="button" aria-expanded="${isFirst ? 'true' : 'false'}">
      <span class="project-number">—</span><span class="project-name">${data.title}</span><span class="project-kind">${data.tag}</span><span class="project-symbol">${isFirst ? '×' : '+'}</span>
    </button>
    <div class="project-detail">
      <div class="preview-strip">${strip}</div>
      <div><p>${data.desc}</p>${note}<div class="project-links">${links}</div></div>
    </div>
  </article>`;
}

function renderProjects() {
  const list = document.getElementById('mobile-projects');
  if (!list) return;

  list.innerHTML = PROJECTS.map((data, i) => buildProjectArticle(data, i, i === 0)).join('');

  for (let i = PROJECTS.length; i < TOTAL_SLOTS; i++) {
    const slotNumber = String(i + 1).padStart(2, '0');
    list.insertAdjacentHTML('beforeend', `<article class="mobile-project mobile-project-empty"><button class="project-toggle" type="button" disabled aria-disabled="true"><span class="project-number">—</span><span class="project-name">[ COMING SOON ]</span><span class="project-kind">PROJECT_${slotNumber} // —</span><span class="project-symbol">+</span></button><div class="project-detail coming-soon-detail"><div class="coming-soon-preview"></div><div><p class="coming-soon-label">Not yet available</p></div></div></article>`);
  }

  attachImageFallbacks(list);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderProjects);
} else {
  renderProjects();
}

document.querySelector('[data-shuffle]').addEventListener('click', () => {
  const list = document.querySelector('.mobile-projects');
  const items = [...list.querySelectorAll('.mobile-project:not(.mobile-project-empty)')];
  items.sort(() => Math.random() - 0.5).forEach((project) => list.prepend(project));
  document.querySelector('#work').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const cvModal = document.getElementById('mobile-cv-modal');
const closeCv = () => { cvModal.classList.remove('is-open'); cvModal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
document.querySelectorAll('[data-open-cv]').forEach((button) => button.addEventListener('click', () => { cvModal.classList.add('is-open'); cvModal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }));
document.querySelector('[data-close-cv]').addEventListener('click', closeCv);
cvModal.addEventListener('click', (event) => { if (event.target === cvModal) closeCv(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCv(); });

const contactVideo = document.querySelector('.contact-video');
if (contactVideo) {
  contactVideo.addEventListener('loadedmetadata', () => {
    contactVideo.loop = true;
    contactVideo.play().catch(() => {});
  });
}
