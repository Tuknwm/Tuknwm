if (window.innerWidth >= 1024) { location.replace('/index.html'); }
window.addEventListener('resize', () => { if (window.innerWidth >= 1024) location.replace('/index.html'); });
const projects = [...document.querySelectorAll('.mobile-project')];
const desktopGithubIcon = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>';
const desktopWebIcon = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 0 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-1.65 1.887-1.855q.26-.487.468-1.068zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/></svg>';
projects.forEach((project) => project.querySelectorAll('.project-links a').forEach((link) => {
  const isMonotaro = project.dataset.project === 'monotaro';
  const label = isMonotaro ? link.textContent.replace('↗', '').trim() : (link.href.includes('github') ? 'GitHub' : 'Visit project');
  link.innerHTML = `${link.href.includes('github') ? desktopGithubIcon : desktopWebIcon}${label} <span aria-hidden="true">↗</span>`;
}));
const showMobileImageFallback = (image) => {
  if (!image.isConnected) return;
  image.replaceWith(Object.assign(document.createElement('div'), {
    className: 'mobile-preview-404',
    innerHTML: '<span>⚠ 404</span><span class="error-message">Connection Lost</span>',
  }));
};
document.querySelectorAll('.project-detail img').forEach((image) => {
  image.addEventListener('error', () => showMobileImageFallback(image), { once: true });
  if (image.complete && image.naturalWidth === 0) showMobileImageFallback(image);
});
const projectMedia = {
  altar: ['/ProjectList/P1/Img1.png', '/ProjectList/P1/Img2.png', '/ProjectList/P1/Img3.png', '/ProjectList/P1/Img4.png'],
  kuroyu: ['/ProjectList/P2/Img1.png', '/ProjectList/P2/Img2.png', '/ProjectList/P2/Img3.png', '/ProjectList/P2/Img4.png', '/ProjectList/P2/Img5.png', '/ProjectList/P2/Img6.png', '/ProjectList/P2/Img7.png'],
  downloader: ['/ProjectList/P3/Img1.png', '/ProjectList/P3/Img2.png', '/ProjectList/P3/Img3.png'],
  iclick: ['/ProjectList/P4/Img1.png', '/ProjectList/P4/Img2.png', '/ProjectList/P4/Img3.png', '/ProjectList/P4/Img4.png'],
  trilife: ['/ProjectList/P5/Img1.png', '/ProjectList/P5/Img2.png', '/ProjectList/P5/Img3.png', '/ProjectList/P5/Img4.png'],
  chilltea: ['/ProjectList/P6/Img1.png', '/ProjectList/P6/Img2.png', '/ProjectList/P6/Img3.png', '/ProjectList/P6/Img4.png', '/ProjectList/P6/Img5.png'],
  trainity: ['/ProjectList/P7/Img1.png', '/ProjectList/P7/Img2.png', '/ProjectList/P7/Img3.png', '/ProjectList/P7/Img4.png', '/ProjectList/P7/Img5.png', '/ProjectList/P7/Img6.png'],
  learra: ['/ProjectList/P8/Img1.png', '/ProjectList/P8/Img2.png', '/ProjectList/P8/Img3.png'],
  monotaro: ['/ProjectList/P8/Img1.png', '/ProjectList/P8/Img2.png', '/ProjectList/P8/Img3.png'],
};
projects.forEach((project) => {
  const media = projectMedia[project.dataset.project];
  const firstImage = project.querySelector('.project-detail img');
  if (!media || !firstImage) return;
  const strip = document.createElement('div');
  strip.className = 'preview-strip';
  strip.innerHTML = media.map((src, index) => `<img src="${src}" alt="${project.querySelector('.project-name')?.textContent || 'Project'} preview ${index + 1}">`).join('');
  firstImage.replaceWith(strip);
  strip.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => showMobileImageFallback(image), { once: true });
    if (image.complete && image.naturalWidth === 0) showMobileImageFallback(image);
  });
});
const mobileProjectKeys = {
  altar: 'ALTAR Powered by UNTAR', kuroyu: 'Kuroyu', downloader: 'URL Downloader Project',
  iclick: 'iClick Project', trilife: 'TrilifePlus', chilltea: 'ChillTea', trainity: 'Trainity',
  learra: 'Learra', monotaro: 'Monotaro.id',
};

async function syncMobileProjectsFromDesktopData() {
  try {
    const source = await fetch('/script.js').then((response) => response.text());
    const match = source.match(/const PROJECTS = (\[[\s\S]*?\]);\s*const TOTAL_SLOTS = (\d+)/);
    if (!match) return;
    const desktopProjects = Function(`return ${match[1]}`)();
    const totalSlots = Number(match[2]);
    projects.forEach((project) => {
      const data = desktopProjects.find((item) => item.title === mobileProjectKeys[project.dataset.project]);
      if (!data) return;
      project.querySelector('.project-kind').textContent = data.tag;
      project.querySelector('.project-detail p').textContent = data.desc;
      const note = project.querySelector('.project-note');
      if (note) {
        note.textContent = data.note || '';
        note.hidden = !data.note;
      }
      const links = project.querySelectorAll('.project-links a');
      if (data.live2) {
        if (links[0]) links[0].href = data.live;
        if (links[1]) links[1].href = data.live2;
        if (links[2]) links[2].href = data.github;
      } else {
        if (links[0]) links[0].href = data.live;
        if (links[1]) links[1].href = data.github;
      }
      const strip = project.querySelector('.preview-strip');
      const media = (data.media || []).filter((item) => item.type === 'img');
      if (strip && media.length) {
        strip.innerHTML = media.map((item, index) => `<img src="${item.src}" alt="${data.title} preview ${index + 1}">`).join('');
        strip.querySelectorAll('img').forEach((image) => {
          image.addEventListener('error', () => showMobileImageFallback(image), { once: true });
          if (image.complete && image.naturalWidth === 0) showMobileImageFallback(image);
        });
      }
    });
    const list = document.getElementById('mobile-projects');
    list.querySelectorAll('.mobile-project-empty').forEach((item) => item.remove());
    for (let index = desktopProjects.length; index < totalSlots; index += 1) {
      const slotNumber = String(index + 1).padStart(2, '0');
      list.insertAdjacentHTML('beforeend', `<article class="mobile-project mobile-project-empty"><button class="project-toggle" type="button" disabled aria-disabled="true"><span class="project-number">—</span><span class="project-name">[ COMING SOON ]</span><span class="project-kind">PROJECT_${slotNumber} // —</span><span class="project-symbol">+</span></button><div class="project-detail coming-soon-detail"><div class="coming-soon-preview"></div><div><p class="coming-soon-label">Not yet available</p></div></div></article>`);
    }
  } catch (error) {
  }
}

syncMobileProjectsFromDesktopData();

document.querySelector('[data-shuffle]').addEventListener('click', () => {
  const list = document.getElementById('mobile-projects');
  [...projects].sort(() => Math.random() - 0.5).forEach((project) => list.appendChild(project));
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
