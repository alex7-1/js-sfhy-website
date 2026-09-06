const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const progress = document.querySelector('.scroll-progress');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 30);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileNav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const cases = [
  {
    image: 'assets/battery-line.webp',
    alt: '18650圆柱电池检测包装线',
    kicker: '新能源 · 自动包装',
    title: '18650 圆柱电池检测包装线',
    description: '集成上料、缺陷检测、良品/不良品分流、装箱与辅料供给，以整线协同满足高速节拍需求。',
    metrics: [['3 台', '并行检测'], ['OK / NG', '自动分流'], ['整线', '包装集成']]
  },
  {
    image: 'assets/bdmu-inspection.webp',
    alt: 'BDMU产品外观检测设备',
    kicker: '汽车零部件 · 机器视觉',
    title: 'BDMU 产品全方位外观检测',
    description: '通过精密模组、伺服转台和多套视觉系统，对产品顶部及四周进行稳定成像与自动判断。',
    metrics: [['4 套', '伺服模组'], ['2 套', '视觉系统'], ['360°', '外观覆盖']]
  },
  {
    image: 'assets/ai-vision.webp',
    alt: '转子AI外观检测系统',
    kicker: '精密部件 · AI 深度学习',
    title: '转子外观 AI 缺陷检测',
    description: '以工业相机、定焦镜头与优化光源获取稳定图像，利用 AI 标记缺陷位置并完成 OK / NG 自动分流。',
    metrics: [['0.1%', '漏检率'], ['<2%', '误检率目标'], ['±0.05 mm', '重复精度']]
  },
  {
    image: 'assets/screen-test-line.webp',
    alt: '屏幕自动化测试生产线',
    kicker: '3C 电子 · 全流程测试',
    title: '屏幕检测自动化测试线',
    description: '集成烧录、触控、白平衡、画质、音频、高压与功率测试，结果可回传制造执行系统。',
    metrics: [['多站', '流程集成'], ['MES', '结果回传'], ['模块化', '设备架构']]
  }
];

const caseImage = document.querySelector('[data-case-image]');
const caseNumber = document.querySelector('[data-case-number]');
const caseKicker = document.querySelector('[data-case-kicker]');
const caseTitle = document.querySelector('[data-case-title]');
const caseDescription = document.querySelector('[data-case-description]');
const metricEls = [
  [document.querySelector('[data-metric-one]'), document.querySelector('[data-label-one]')],
  [document.querySelector('[data-metric-two]'), document.querySelector('[data-label-two]')],
  [document.querySelector('[data-metric-three]'), document.querySelector('[data-label-three]')]
];

document.querySelectorAll('[data-case]').forEach(button => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.case);
    const item = cases[index];
    document.querySelectorAll('[data-case]').forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    caseImage.classList.add('switching');
    window.setTimeout(() => {
      caseImage.onload = () => caseImage.classList.remove('switching');
      caseImage.src = item.image;
      caseImage.alt = item.alt;
      if (caseImage.complete) caseImage.classList.remove('switching');
      caseNumber.textContent = String(index + 1).padStart(2, '0');
      caseKicker.textContent = item.kicker;
      caseTitle.textContent = item.title;
      caseDescription.textContent = item.description;
      item.metrics.forEach((metric, metricIndex) => {
        metricEls[metricIndex][0].textContent = metric[0];
        metricEls[metricIndex][1].textContent = metric[1];
      });
    }, 180);
  });
});

// Subtle pointer parallax keeps the technical hero areas alive without distracting motion.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.landing-hero, .home-hero').forEach(hero => {
    hero.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * -12;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
      hero.style.setProperty('--mx', `${x}px`);
      hero.style.setProperty('--my', `${y}px`);
    });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--mx', '0px');
      hero.style.setProperty('--my', '0px');
    });
  });
}

// Real-workshop carousel: automatic rotation, manual controls and responsive slide count.
document.querySelectorAll('[data-workshop-carousel]').forEach(carousel => {
  const track = carousel.querySelector('[data-workshop-track]');
  const slides = [...track.children];
  const previous = carousel.querySelector('[data-workshop-prev]');
  const next = carousel.querySelector('[data-workshop-next]');
  const count = carousel.querySelector('[data-workshop-count]');
  let index = 0;
  let timer;

  const perView = () => window.innerWidth <= 760 ? 1 : 2;
  const update = () => {
    const max = Math.max(0, slides.length - perView());
    index = Math.min(Math.max(index, 0), max);
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translate3d(${-index * (slideWidth + 16)}px, 0, 0)`;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  const move = direction => {
    const max = Math.max(0, slides.length - perView());
    index = direction > 0 ? (index >= max ? 0 : index + 1) : (index <= 0 ? max : index - 1);
    update();
  };
  const start = () => {
    window.clearInterval(timer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = window.setInterval(() => move(1), 4200);
  };

  previous.addEventListener('click', () => { move(-1); start(); });
  next.addEventListener('click', () => { move(1); start(); });
  carousel.addEventListener('pointerenter', () => window.clearInterval(timer));
  carousel.addEventListener('pointerleave', start);
  window.addEventListener('resize', update, { passive: true });
  update();
  start();
});

// Rotary die cards support mouse hover, touch/click and keyboard-driven 3D flips.
document.querySelectorAll('[data-flip-card]').forEach(card => {
  const toggle = () => {
    const flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(flipped));
  };
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  });
});

// Automation project cards open the full set of original proposal pages from the latest deck.
const automationDialog = document.querySelector('[data-case-dialog]');
if (automationDialog) {
  const dialogImage = automationDialog.querySelector('[data-case-dialog-image]');
  const dialogTitle = automationDialog.querySelector('[data-case-dialog-title]');
  const dialogCategory = automationDialog.querySelector('[data-case-dialog-category]');
  const dialogSummary = automationDialog.querySelector('[data-case-dialog-summary]');
  const dialogCount = automationDialog.querySelector('[data-case-dialog-count]');
  const dialogThumbs = automationDialog.querySelector('[data-case-dialog-thumbs]');
  let dialogImages = [];
  let dialogIndex = 0;

  const caseImagePath = slide => `assets/automation-cases/slide-${slide}.webp`;
  const renderDialogSlide = (index, animate = true) => {
    if (!dialogImages.length) return;
    dialogIndex = (index + dialogImages.length) % dialogImages.length;
    const source = caseImagePath(dialogImages[dialogIndex]);
    if (animate) dialogImage.classList.add('switching');
    window.setTimeout(() => {
      dialogImage.src = source;
      dialogImage.alt = `${dialogTitle.textContent} · 方案第 ${dialogIndex + 1} 页`;
      dialogImage.onload = () => dialogImage.classList.remove('switching');
      if (dialogImage.complete) dialogImage.classList.remove('switching');
      dialogCount.textContent = `${String(dialogIndex + 1).padStart(2, '0')} / ${String(dialogImages.length).padStart(2, '0')}`;
      [...dialogThumbs.children].forEach((thumb, thumbIndex) => {
        const active = thumbIndex === dialogIndex;
        thumb.classList.toggle('active', active);
        thumb.setAttribute('aria-current', String(active));
      });
    }, animate ? 130 : 0);
  };

  const openAutomationCase = card => {
    dialogImages = card.dataset.images.split(',').map(value => value.trim()).filter(Boolean);
    dialogTitle.textContent = card.dataset.title;
    dialogCategory.textContent = card.dataset.category;
    dialogSummary.textContent = card.dataset.summary;
    dialogThumbs.replaceChildren();
    dialogImages.forEach((slide, index) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.setAttribute('aria-label', `查看方案第 ${index + 1} 页`);
      const image = document.createElement('img');
      image.src = caseImagePath(slide);
      image.alt = '';
      thumb.appendChild(image);
      thumb.addEventListener('click', () => renderDialogSlide(index));
      dialogThumbs.appendChild(thumb);
    });
    renderDialogSlide(0, false);
    automationDialog.showModal();
    document.body.classList.add('case-dialog-open');
  };

  document.querySelectorAll('[data-case-dialog-open]').forEach(card => card.addEventListener('click', () => openAutomationCase(card)));
  automationDialog.querySelector('[data-case-dialog-close]').addEventListener('click', () => automationDialog.close());
  automationDialog.querySelector('[data-case-dialog-prev]').addEventListener('click', () => renderDialogSlide(dialogIndex - 1));
  automationDialog.querySelector('[data-case-dialog-next]').addEventListener('click', () => renderDialogSlide(dialogIndex + 1));
  automationDialog.addEventListener('click', event => { if (event.target === automationDialog) automationDialog.close(); });
  automationDialog.addEventListener('close', () => document.body.classList.remove('case-dialog-open'));
  automationDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') renderDialogSlide(dialogIndex - 1);
    if (event.key === 'ArrowRight') renderDialogSlide(dialogIndex + 1);
  });
}
