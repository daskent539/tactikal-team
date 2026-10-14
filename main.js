'use strict';

/* ============ НАСТРОЙКИ: меняйте данные здесь ============ */

// Главный участник
const LEADER = { name: 'chudnoy', role: 'Главный', avatar: '' };

// Остальные участники. avatar: путь к картинке, например 'assets/avatars/ara.jpg'
const MEMBERS = [
  'ара','архангел','ars1k','BERKUT editor','бодя','corte11z','FLY','hauzy1','katatoks',
  'казак','llmar krays','МЕТЕЛЬ','militara','monolitzov','Ockolok','пермяк','phantom_editor',
  'Rubezh','simon0','турист_037','тяпа','VORON','ZOV','zovchik16','кокос'
].map(name => ({ name, avatar: '' }));

// Музыка (автор всех треков — Чудной)
const AUTHOR = 'Чудной';
const TRACKS = [
  { title: 'Команда БПЛА',     src: 'music/bpla.mp3' },
  { title: 'Холодный нож',     src: 'music/holodny-nozh.mp3' },
  { title: 'Ходящие мертвецы', src: 'music/mertvetsy.mp3' },
  { title: 'Золотой экран',    src: 'music/zolotoy-ekran.mp3' },
  { title: 'Волокнёная стрела', src: 'music/strela.mp3' }
];

// Работы и эдиты. Пока список пуст — показываются заглушки «Скоро».
// Пример: { title: 'Название', platform: 'YouTube', url: 'https://youtube.com/...' }
const WORKS = [];
const WORK_PLACEHOLDERS = 3;

/* ============ КОД ============ */
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.documentElement.classList.add('js');
$('#year').textContent = new Date().getFullYear();

// Логотип: показываем, только если файл assets/logo.png существует
document.querySelectorAll('[data-logo]').forEach(img => {
  const probe = new Image();
  probe.onload = () => {
    img.hidden = false;
    if (img.classList.contains('logo-img')) { const t = $('.logo-text'); if (t) t.classList.add('with-logo'); }
  };
  probe.src = img.getAttribute('src');
});

// Участники
function memberCard(m, leader) {
  const card = el('article', 'card reveal' + (leader ? ' lead-card' : ''));
  const av = el('div', 'avatar');
  if (m.avatar) { const i = el('img'); i.src = m.avatar; i.alt = m.name; i.loading = 'lazy'; i.width = i.height = 96; av.appendChild(i); }
  else av.appendChild(el('span', 'avatar-ph'));
  card.appendChild(av);
  const info = el('div');
  if (leader) info.appendChild(el('span', 'badge', 'Главный'));
  info.appendChild(el('h3', 'name', esc(m.name)));
  info.appendChild(el('p', 'role', leader ? 'Основатель и лицо TACTICAL TEAM' : 'Участник TACTICAL TEAM'));
  card.appendChild(info);
  return card;
}
const grid = $('#members-grid');
grid.appendChild(memberCard(LEADER, true));
MEMBERS.forEach(m => grid.appendChild(memberCard(m, false)));

// Музыка
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
const setFill = r => r.style.setProperty('--p', (r.value / r.max * 100) + '%');
const audios = [];
TRACKS.forEach(t => {
  const card = el('article', 'track reveal');
  card.innerHTML = `
    <div><h3>${esc(t.title)}</h3><p class="author">Автор: ${esc(AUTHOR)}</p></div>
    <div class="track-error" role="alert">Аудиофайл пока недоступен. Проверьте, что файл лежит по пути <b>${esc(t.src)}</b>.</div>
    <div class="player">
      <button class="play" type="button" aria-label="Воспроизвести: ${esc(t.title)}">
        <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>
        <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
      </button>
      <input class="seek" type="range" min="0" max="100" step="0.1" value="0" aria-label="Перемотка">
      <span class="time">0:00</span>
    </div>
    <label class="vol">Громкость <input class="volume" type="range" min="0" max="1" step="0.01" value="0.8" aria-label="Громкость"></label>`;
  const a = new Audio(); a.preload = 'metadata'; a.src = t.src; a.volume = 0.8; audios.push(a);
  const btn = $('.play', card), seek = $('.seek', card), vol = $('.volume', card), time = $('.time', card);
  setFill(vol);
  a.addEventListener('error', () => card.classList.add('failed'));
  a.addEventListener('loadedmetadata', () => { seek.max = a.duration; time.textContent = fmt(a.duration); });
  a.addEventListener('timeupdate', () => { seek.value = a.currentTime; setFill(seek); time.textContent = fmt(a.currentTime); });
  a.addEventListener('play', () => card.classList.add('playing'));
  a.addEventListener('pause', () => card.classList.remove('playing'));
  a.addEventListener('ended', () => { a.currentTime = 0; });
  btn.addEventListener('click', () => {
    if (a.paused) {
      audios.forEach(o => o !== a && o.pause());
      a.play().catch(() => card.classList.add('failed'));
    } else a.pause();
  });
  seek.addEventListener('input', () => { a.currentTime = seek.value; setFill(seek); });
  vol.addEventListener('input', () => { a.volume = vol.value; setFill(vol); });
  $('#tracks').appendChild(card);
});

// Работы
const wg = $('#works-grid');
if (WORKS.length) {
  WORKS.forEach(w => {
    const a = el('a', 'work reveal');
    a.href = w.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.innerHTML = `<strong>${esc(w.platform || 'Видео')}</strong><div class="work-info"><b>${esc(w.title)}</b></div>`;
    wg.appendChild(a);
  });
} else {
  for (let i = 0; i < WORK_PLACEHOLDERS; i++) {
    wg.appendChild(el('div', 'work reveal', '<div><strong>Скоро</strong><span>Здесь появятся наши работы</span></div>'));
  }
}

// Мобильное меню
const burger = $('.burger'), nav = $('#nav');
const toggle = open => {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
};
burger.addEventListener('click', () => toggle(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });

// Подсветка текущего раздела
const links = [...nav.querySelectorAll('a')];
const secObs = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => secObs.observe(s));

// Появление блоков
const els = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.08 });
  els.forEach(e => io.observe(e));
} else els.forEach(e => e.classList.add('in'));
