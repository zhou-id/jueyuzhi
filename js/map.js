/* =========================================================
   荒野禁区 · 中国地图与路线选择
   ========================================================= */

window.HAZARD_LABEL = {
  cold:'极寒失温', storm:'暴风雪', nav:'迷路', ice:'冰裂缝 / 硬雪坡',
  fatigue:'体力透支', altitude:'高原反应', wildlife:'野生动物', water:'缺水',
  heat:'高温暴晒', sandstorm:'沙尘暴', isolation:'无救援', rain:'连续降雨',
  landslide:'塌方', leech:'蚂蟥', river:'激流', wet:'湿冷', avalanche:'雪崩',
  fog:'浓雾', snow:'深雪', rescue:'通讯中断'
};

const MapView = {
  wrap: null,
  detail: null,
  empty: null,
  selected: null,
  filter: 'all',
  offsets: {
    aotai:      { dx: 10,  dy: -9,  anchor: 'start' },
    qiangtang:  { dx: -10, dy: -9,  anchor: 'end'   },
    luobubo:    { dx: 10,  dy: -9,  anchor: 'start' },
    motuo:      { dx: -10, dy: -9,  anchor: 'end'   },
    kekexili:   { dx: 10,  dy: -9,  anchor: 'start' },
    shennongjia:{ dx: 10,  dy: -9,  anchor: 'start' },
    changbai:   { dx: -10, dy: -10, anchor: 'end'   },
    taklamakan: { dx: -10, dy: -9,  anchor: 'end'   },
    dulong:     { dx: -10, dy: 14,  anchor: 'end'   },
    meili:      { dx: 10,  dy: 14,  anchor: 'start' },
    heizhugou:  { dx: 10,  dy: 14,  anchor: 'start' },
    kunlun:     { dx: -10, dy: -9,  anchor: 'end'   }
  },

  init() {
    this.wrap = document.getElementById('map-svg-wrap');
    this.detail = document.getElementById('route-detail');
    this.empty = document.getElementById('route-empty');
    if (!this.wrap) return;

    this.draw();
    this.bind();
  },

  draw() {
    if (!window.CHINA_MAP) return;
    const unlocked = Engine.secretUnlocked();
    let provinces = '';
    Object.keys(CHINA_MAP.provinces).forEach(name => {
      provinces += `<path class="prov" d="${CHINA_MAP.provinces[name]}" data-prov="${name}"></path>`;
    });

    let markers = '';
    LOCATIONS.forEach(loc => {
      if (loc.secret && !unlocked) {
        const p = CHINA_MAP.project(loc.lon, loc.lat);
        const o = this.offsets[loc.id] || { dx: 10, dy: -9, anchor: 'start' };
        markers += `<g class="site secret locked" data-site="${loc.id}" transform="translate(${p[0].toFixed(1)},${p[1].toFixed(1)})">
          <circle class="site-halo" r="9"></circle>
          <circle class="site-ring" r="4.4"></circle>
          <circle class="site-core" r="1.9"></circle>
          <text class="site-label" x="${o.dx}" y="${o.dy}" text-anchor="${o.anchor}">未解锁 · ???</text>
        </g>`;
        return;
      }
      const p = CHINA_MAP.project(loc.lon, loc.lat);
      const o = this.offsets[loc.id] || { dx: 10, dy: -9, anchor: 'start' };
      const cls = 'site lv' + loc.level + (loc.secret ? ' secret' : '') + (this.filter !== 'all' && String(loc.level) !== this.filter ? ' dim' : '');
      markers += `<g class="${cls}" data-site="${loc.id}" transform="translate(${p[0].toFixed(1)},${p[1].toFixed(1)})">
        <circle class="site-halo" r="11"></circle>
        <circle class="site-ring" r="4.6"></circle>
        <circle class="site-core" r="2.1"></circle>
        <text class="site-label" x="${o.dx}" y="${o.dy}" text-anchor="${o.anchor}">${loc.name}</text>
      </g>`;
    });

    this.wrap.innerHTML = `<svg id="china-map" viewBox="${CHINA_MAP.viewBox}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <g class="map-glow">${provinces}</g>
      <g class="map-markers">${markers}</g>
    </svg>`;

    const countEl = document.getElementById('map-count');
    if (countEl) {
      const total = LOCATIONS.filter(l => this.filter === 'all' || String(l.level) === this.filter)
        .filter(l => !(l.secret && !unlocked)).length;
      countEl.textContent = total;
    }

    if (this.selected) this.setActive(this.selected);
  },

  bind() {
    const filters = document.getElementById('map-filters');
    if (filters) {
      filters.addEventListener('click', e => {
        const chip = e.target.closest('[data-filter]');
        if (!chip) return;
        filters.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
        this.filter = chip.dataset.filter;
        this.draw();
        this.setActive(this.selected);
      });
    }

    this.wrap.addEventListener('click', e => {
      const site = e.target.closest('[data-site]');
      if (!site) return;
      this.pick(site.dataset.site);
    });

    this.wrap.addEventListener('mouseover', e => {
      const site = e.target.closest('[data-site]');
      if (!site) return;
      this.pick(site.dataset.site, true);
    });
  },

  pick(id, preview) {
    const loc = LOC_MAP[id];
    if (!loc) return;
    if (loc.secret && !Engine.secretUnlocked()) {
      if (!preview) App.toast('尚未解锁', '这片区域还在地图之外。已收集彩蛋 ' + Engine.eggCount() + ' / ' + (loc.unlockEggs || 4) + '。', 'bad');
      return;
    }
    this.selected = id;
    this.setActive(id);
    this.renderDetail(loc);
  },

  setActive(id) {
    this.wrap.querySelectorAll('.site').forEach(el => {
      el.classList.toggle('active', el.dataset.site === id);
    });
  },

  renderDetail(loc) {
    if (!this.detail || !this.empty) return;
    this.empty.hidden = true;
    this.detail.hidden = false;

    const stars = '★'.repeat(loc.level) + '<span style="opacity:.22">' + '★'.repeat(5 - loc.level) + '</span>';
    const hazards = loc.hazards.map(h => `<span class="rd-hazard">${HAZARD_LABEL[h] || h}</span>`).join('');
    const quote = loc.intel && loc.intel.length ? loc.intel[1] || loc.intel[0] : '';

    this.detail.innerHTML = `
      <div class="rd-top">
        <div>
          <div class="rd-level">${stars}</div>
          <div class="rd-name">${loc.name}</div>
          <div class="rd-en">${loc.en}</div>
          <div class="rd-province">${loc.province} · ${loc.season}</div>
        </div>
        <button class="rd-close" id="rd-close" aria-label="关闭">
          <svg viewBox="0 0 24 24"><use href="#i-cross"/></svg>
        </button>
      </div>
      <p class="rd-desc">${loc.brief}</p>
      <div class="rd-stats">
        <div class="rd-stat"><i>预算</i><b>¥${loc.budget.toLocaleString()}</b></div>
        <div class="rd-stat"><i>预计天数</i><b>${loc.days} 天</b></div>
        <div class="rd-stat"><i>承重上限</i><b>${loc.weightCap} kg</b></div>
      </div>
      <div class="rd-hazards">${hazards}</div>
      <p class="rd-quote">“${quote}”</p>
      <div class="rd-actions">
        <button class="btn btn-primary" data-brief="${loc.id}">
          <span>查看完整简报</span>
          <svg viewBox="0 0 24 24"><use href="#i-arrow"/></svg>
        </button>
      </div>`;

    const close = document.getElementById('rd-close');
    if (close) close.addEventListener('click', () => this.clear());
  },

  clear() {
    this.selected = null;
    this.setActive(null);
    if (this.detail) { this.detail.hidden = true; this.detail.innerHTML = ''; }
    if (this.empty) this.empty.hidden = false;
  },

  refresh() {
    this.draw();
    if (this.selected) this.setActive(this.selected);
  }
};
