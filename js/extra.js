/* =========================================================
   绝域志 · 登录档案 / 新板块 / 氛围
   ========================================================= */
(function () {
  const PROFILE_KEY = 'terra_profile_v1';

  const AVATARS = [
    { id:'peak',    name:'山脊', svg:'<path d="M2 20L9 7l4 6.5L16 9l6 11H2z"/><path d="M9 7l2 3.2"/>' },
    { id:'skull',   name:'骸骨', svg:'<path d="M12 3a7.5 7.5 0 0 1 7.5 7.5c0 2.6-1 3.7-2.8 4.7V19H7.3v-3.8C5.5 14.2 4.5 13.1 4.5 10.5A7.5 7.5 0 0 1 12 3z"/><circle cx="9" cy="10" r="1.3"/><circle cx="15" cy="10" r="1.3"/><path d="M9 21h6M12 15.6v2.8"/>' },
    { id:'compass', name:'罗盘', svg:'<circle cx="12" cy="12" r="8.5"/><path d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z"/><path d="M12 3.5v1.6M12 18.9v1.6M3.5 12h1.6M18.9 12h1.6"/>' },
    { id:'tent',    name:'帐篷', svg:'<path d="M12 3L3 20h18L12 3z"/><path d="M12 11v9"/><path d="M8.6 20l3.4-9 3.4 9"/>' },
    { id:'eye',     name:'窥视', svg:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>' },
    { id:'wolf',    name:'狼', svg:'<path d="M5 20l1-7-2-6 4 3h8l4-3-2 6 1 7-4-2-2 2-2-2-4 2z"/><circle cx="9.4" cy="12" r=".9"/><circle cx="14.6" cy="12" r=".9"/>' },
    { id:'lantern', name:'风灯', svg:'<path d="M9 3h6M10 3v2M14 3v2"/><rect x="7" y="5" width="10" height="9" rx="1"/><path d="M9.4 18h5.2M12 14v4"/><path d="M12 7.6l1.6 2.6-1.6 2.4-1.6-2.4z"/>' },
    { id:'moon',    name:'月', svg:'<path d="M15.6 3.4a8.6 8.6 0 1 0 5 14.6A9.4 9.4 0 0 1 15.6 3.4z"/><path d="M18 4l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>' }
  ];

  const TITLES = [
    { id:'nameless', name:'无名氏', cond:() => true, desc:'还没有人知道你是谁。' },
    { id:'walker',   name:'行者',   cond:() => Engine.meta.runs >= 1, desc:'至少活着走出过一次。' },
    { id:'picker',   name:'拾遗者', cond:() => Engine.meta.eggs.length >= 4, desc:'收集四处隐藏档案。' },
    { id:'survivor', name:'生还者', cond:() => Engine.meta.records.length >= 3, desc:'留下三份生还记录。' },
    { id:'hunter',   name:'老猎人', cond:() => Engine.meta.runs >= 8, desc:'成功穿越八次。' },
    { id:'lost',     name:'失踪者', cond:() => Engine.meta.deaths >= 5, desc:'被山留下过五次。' },
    { id:'legend',   name:'传说',   cond:() => Engine.meta.eggs.length >= 16 || Engine.meta.records.some(r => r.rank === 'S'), desc:'集齐十六份档案，或拿到一个 S。' }
  ];

  const DEFAULT_PROFILE = { name:'无名氏', avatar:'peak', title:'nameless', seen:false };

  Object.assign(App, {
    profile: Object.assign({}, DEFAULT_PROFILE),
    routeLevel: 'all',
    routeQuery: '',
    gearCat: 'wear',
    loreTab: 'eggs',

    /* ---------- 档案 ---------- */
    loadProfile() {
      try {
        const raw = localStorage.getItem(PROFILE_KEY);
        if (raw) this.profile = Object.assign({}, DEFAULT_PROFILE, JSON.parse(raw));
      } catch (e) { /* ignore */ }
      return this.profile;
    },
    saveProfile() {
      try { localStorage.setItem(PROFILE_KEY, JSON.stringify(this.profile)); } catch (e) { /* ignore */ }
    },

    /* ---------- 氛围 ---------- */
    moodFor(level) {
      if (level <= 2) return 'calm';
      if (level === 3) return 'tense';
      return 'horror';
    },
    applyMood(mood) {
      document.body.dataset.mood = mood || 'horror';
    },
    stars(level) {
      return '★'.repeat(level) + '<span class="off">' + '★'.repeat(5 - level) + '</span>';
    },

    /* ---------- 登录 ---------- */
    renderLogin() {
      const av = document.getElementById('avatar-grid');
      if (av) {
        av.innerHTML = AVATARS.map(a =>
          `<button class="avatar-btn ${this.profile.avatar === a.id ? 'active' : ''}" data-avatar="${a.id}" title="${a.name}">
            <svg viewBox="0 0 24 24">${a.svg}</svg>
          </button>`).join('');
      }
      const name = document.getElementById('login-name');
      if (name) name.value = this.profile.name === DEFAULT_PROFILE.name ? '' : this.profile.name;

      const tp = document.getElementById('title-pick');
      if (tp) {
        const unlocked = TITLES.filter(t => t.cond());
        if (!unlocked.some(t => t.id === this.profile.title)) this.profile.title = 'nameless';
        tp.innerHTML = TITLES.map(t => {
          const on = t.cond();
          return `<button class="title-chip ${this.profile.title === t.id ? 'active' : ''} ${on ? '' : 'locked'}"
            data-title="${t.id}" ${on ? '' : 'disabled'} title="${t.desc}">${t.name}</button>`;
        }).join('');
        const hint = document.getElementById('title-hint');
        if (hint) hint.textContent = `已解锁 ${unlocked.length} / ${TITLES.length}`;
      }
      this.applyMood('horror');
    },

    enterSite(guest) {
      if (guest) {
        this.profile.name = '无名氏';
      } else {
        const input = document.getElementById('login-name');
        const nm = input && input.value.trim();
        if (nm) this.profile.name = nm.slice(0, 12);
      }
      const t = document.getElementById('login-name');
      if (t && !t.value.trim()) this.profile.name = '无名氏';
      this.profile.seen = true;
      this.saveProfile();
      document.body.classList.remove('on-login');
      this.updateTopStats();
      this.show('title');
      setTimeout(() => this.toast('入册完成', this.profile.name + ' · ' + this.titleName(this.profile.title), 'good'), 400);
    },

    titleName(id) {
      const t = TITLES.find(x => x.id === id);
      return t ? t.name : '无名氏';
    },

    /* ---------- 路线编目 ---------- */
    renderRoutes() {
      const grid = document.getElementById('routes-grid');
      if (!grid) return;
      const q = this.routeQuery.trim().toLowerCase();
      let list = LOCATIONS.filter(loc => {
        if (this.routeLevel !== 'all' && String(loc.level) !== this.routeLevel) return false;
        if (!q) return true;
        return (loc.name + loc.province + loc.en).toLowerCase().indexOf(q) >= 0;
      });
      list.sort((a, b) => b.level - a.level || a.province.localeCompare(b.province, 'zh'));
      grid.innerHTML = list.map(loc => {
        const locked = loc.secret && !Engine.secretUnlocked();
        return `<div class="route-item ${locked ? 'locked' : ''}" ${locked ? '' : `data-brief="${loc.id}"`}>
          <div class="ri-stars">${this.stars(loc.level)}</div>
          <h4>${locked ? '未解锁 · ???' : loc.name}</h4>
          <div class="ri-en">${locked ? 'SECRET COORDINATE' : loc.en}</div>
          <div class="ri-prov">${loc.province} · ${loc.season}</div>
          <div class="ri-foot"><span>预算 <b>¥${loc.budget.toLocaleString()}</b></span><span>行程 <b>${loc.days}</b> 天</span><span>承重 <b>${loc.weightCap}</b> kg</span></div>
        </div>`;
      }).join('') || `<p class="routes-empty">没有符合条件的坐标。</p>`;
    },

    /* ---------- 装备库 ---------- */
    renderGearCodex() {
      const tabs = document.getElementById('gear-tabs');
      const grid = document.getElementById('gear-codex');
      if (!tabs || !grid) return;
      tabs.innerHTML = GEAR_CATS.map(c =>
        `<button class="chip ${this.gearCat === c.id ? 'active' : ''}" data-gear-cat="${c.id}">${c.name}</button>`
      ).join('');
      const cat = GEAR_CATS.find(c => c.id === this.gearCat);
      grid.innerHTML = GEAR.filter(g => g.cat === this.gearCat).map(g => `
        <div class="codex-item">
          <span class="ci-cat">${cat ? cat.name : ''}</span>
          <h4>${g.name}</h4>
          <p>${g.desc}</p>
          <div class="ci-meta"><span>¥<b>${g.price}</b></span><span><b>${g.weight}</b> kg${g.unit ? ' / ' + g.unit : ''}</span><span>${g.tags ? g.tags.join(' · ') : ''}</span></div>
        </div>`).join('');
    },

    /* ---------- 异闻录 ---------- */
    renderLore() {
      const body = document.getElementById('lore-body');
      if (!body) return;
      document.querySelectorAll('#lore-tabs .chip').forEach(c => c.classList.toggle('active', c.dataset.lore === this.loreTab));
      if (this.loreTab === 'eggs') { body.innerHTML = this.renderEggArchive(); return; }
      const withLegend = LOCATIONS.filter(l => l.legend);
      body.innerHTML = `<div class="legends-grid">` + withLegend.map(l => `
        <div class="legend-item">
          <h4>${l.name}</h4>
          <span>${l.province} · ${this.stars(l.level)}</span>
          <p>${l.legend}</p>
        </div>`).join('') + `</div>`;
    },

    /* ---------- 启动 ---------- */
    bootProfile() {
      this.loadProfile();
      this.renderLogin();
      this.updateTopStats();
      this.show('login');
    }
  });

  /* ---------- 顶栏用户 ---------- */
  const _updateTopStats = App.updateTopStats.bind(App);
  App.updateTopStats = function () {
    _updateTopStats();
    const el = document.getElementById('stat-user');
    if (el) {
      const nm = this.profile.name || '无名氏';
      const tn = this.titleName(this.profile.title);
      el.textContent = (tn && tn !== '无名氏' && tn !== nm) ? nm + ' · ' + tn : nm;
    }
  };

  /* ---------- show 扩展 ---------- */
  const _show = App.show.bind(App);
  App.show = function (name) {
    _show(name);
    document.body.classList.toggle('on-login', name === 'login');
    document.body.classList.toggle('in-run', name === 'run');
    const foot = document.getElementById('site-foot');
    if (foot) foot.hidden = (name === 'run' || name === 'login');

    if (name === 'routes') this.renderRoutes();
    if (name === 'gear') this.renderGearCodex();
    if (name === 'lore') this.renderLore();

    if (name === 'login' || name === 'title') this.applyMood('horror');
    else if (name === 'brief' || name === 'market' || name === 'run' || name === 'result') {
      const loc = Engine.loc || (this.locId ? LOC_MAP[this.locId] : null);
      if (loc) this.applyMood(this.moodFor(loc.level));
    } else this.applyMood('tense');
  };

  /* ---------- 交互 ---------- */
  document.addEventListener('click', e => {
    const av = e.target.closest('[data-avatar]');
    if (av) {
      App.profile.avatar = av.dataset.avatar;
      document.querySelectorAll('.avatar-btn').forEach(b => b.classList.toggle('active', b === av));
      return;
    }
    const ti = e.target.closest('[data-title]');
    if (ti && !ti.disabled) {
      App.profile.title = ti.dataset.title;
      document.querySelectorAll('.title-chip').forEach(b => b.classList.toggle('active', b === ti));
      return;
    }
    if (e.target.closest('#btn-enter')) { App.enterSite(false); return; }
    if (e.target.closest('#btn-guest')) { App.enterSite(true); return; }

    const rf = e.target.closest('#routes-filters [data-level]');
    if (rf) {
      App.routeLevel = rf.dataset.level;
      document.querySelectorAll('#routes-filters .chip').forEach(c => c.classList.toggle('active', c === rf));
      App.renderRoutes();
      return;
    }
    const gc = e.target.closest('#gear-tabs [data-gear-cat]');
    if (gc) { App.gearCat = gc.dataset.gearCat; App.renderGearCodex(); return; }
    const lt = e.target.closest('#lore-tabs [data-lore]');
    if (lt) { App.loreTab = lt.dataset.lore; App.renderLore(); return; }
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'routes-search') {
      App.routeQuery = e.target.value || '';
      clearTimeout(App._routeTimer);
      App._routeTimer = setTimeout(() => App.renderRoutes(), 120);
    }
  });

  App.bootProfile();
})();
