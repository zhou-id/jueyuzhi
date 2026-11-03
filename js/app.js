/* =========================================================
   荒野禁区 · 界面与流程
   ========================================================= */

const App = {
  screen: 'title',
  locId: null,
  cart: {},
  marketCat: 'must',
  archiveTab: 'eggs',
  busy: false,
  modalRoot: null,

  init() {
    this.modalRoot = document.getElementById('modal-root');
    Engine.loadMeta();
    this.bind();
    this.updateTopStats();
    MapView.init();
    this.show('title');
  },

  bind() {
    document.addEventListener('click', e => {
      const nav = e.target.closest('[data-nav]');
      if (nav) {
        const target = nav.dataset.nav;
        if (target === 'brief' && !this.locId) this.show('map');
        else this.show(target);
        return;
      }

      const briefBtn = e.target.closest('[data-brief]');
      if (briefBtn) { this.openBrief(briefBtn.dataset.brief); return; }

      if (e.target.closest('#btn-about')) { this.openAbout(); return; }
      if (e.target.closest('#btn-goto-market')) { this.openMarket(); return; }
      if (e.target.closest('#btn-clear')) { this.cart = {}; this.renderMarket(); return; }
      if (e.target.closest('#btn-depart')) { this.depart(); return; }

      if (e.target.closest('#btn-log')) { document.getElementById('log-panel').classList.toggle('open'); return; }
      if (e.target.closest('#btn-log-close')) { document.getElementById('log-panel').classList.remove('open'); return; }

      const action = e.target.closest('[data-action]');
      if (action) { this.doAction(action.dataset.action); return; }

      const tab = e.target.closest('#market-tabs [data-cat]');
      if (tab) { this.marketCat = tab.dataset.cat; this.renderMarket(); return; }

      const buy = e.target.closest('[data-buy]');
      if (buy) { this.changeQty(buy.dataset.buy, buy.dataset.dir === 'minus' ? -1 : 1); return; }

      const archTab = e.target.closest('#archive-tabs [data-tab]');
      if (archTab) { this.archiveTab = archTab.dataset.tab; this.renderArchive(); return; }

      if (e.target.closest('[data-close-modal]')) { this.closeModal(); return; }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (!this.modalRoot.hidden) this.closeModal();
      }
    });
  },

  /* ================= 基础 ================= */
  show(name) {
    const target = document.getElementById('screen-' + name);
    if (!target) return;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    target.classList.add('active');
    this.screen = name;
    document.body.classList.toggle('in-run', name === 'run');
    const bar = document.querySelector('.topbar');
    if (bar) bar.classList.toggle('solid', name !== 'title');
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.nav === name);
    });
    if (name !== 'run') document.getElementById('log-panel').classList.remove('open');
    if (name === 'archive') this.renderArchive();
    window.scrollTo(0, 0);
  },

  updateTopStats() {
    const meta = Engine.meta;
    const userEl = document.getElementById('stat-user');
    if (userEl) userEl.textContent = (this.profile && this.profile.name ? this.profile.name : '无名氏');
    document.getElementById('stat-runs').textContent = meta.runs;
    document.getElementById('stat-eggs').textContent = meta.eggs.length;
    const order = ['S', 'A', 'B', 'C', 'D'];
    let best = null;
    meta.records.forEach(r => {
      if (!best || order.indexOf(r.rank) < order.indexOf(best)) best = r.rank;
    });
    document.getElementById('stat-rank').textContent = best || '—';
  },

  toast(title, text, type) {
    const stack = document.getElementById('toast-stack');
    const el = document.createElement('div');
    el.className = 'toast ' + (type || '');
    el.innerHTML = `<b>${title}</b>${text || ''}`;
    stack.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 420); }, 3600);
  },

  closeModal() {
    if (!this.modalRoot) return;
    this.modalRoot.hidden = true;
    this.modalRoot.innerHTML = '';
    document.body.classList.remove('locked');
    this.busy = false;
    if (this.screen === 'run') this.setActionsEnabled(true);
  },

  /* ================= 简报 ================= */
  openBrief(id) {
    const loc = LOC_MAP[id];
    if (!loc) return;
    if (loc.secret && !Engine.secretUnlocked()) {
      this.toast('尚未解锁', '继续收集彩蛋，才能拿到这条线路的坐标。', 'bad');
      return;
    }
    this.locId = id;
    this.cart = {};
    this.marketCat = 'must';

    document.getElementById('brief-province').textContent = loc.province;
    document.getElementById('brief-name').textContent = loc.name;
    document.getElementById('brief-en').textContent = loc.en;
    document.getElementById('brief-text').textContent = loc.brief;
    document.getElementById('brief-coord').textContent = this.coord(loc.lon, loc.lat);
    document.getElementById('brief-season').textContent = loc.season;
    document.getElementById('brief-stamp').textContent = loc.stamp;

    document.getElementById('brief-scene').innerHTML = Scene.render(loc, { variant: 'brief', fade: true });
    this.watermark(document.querySelector('.brief-visual'), loc.en);
    document.getElementById('brief-numbers').innerHTML = `
      <div class="brief-num"><i>预算</i><b>¥${loc.budget.toLocaleString()}</b></div>
      <div class="brief-num"><i>天数</i><b>${loc.days} 天</b></div>
      <div class="brief-num"><i>难度</i><b class="brief-stars">${this.stars ? this.stars(loc.level) : loc.level + ' / 5'}</b><em>${loc.level} / 5</em></div>
      <div class="brief-num"><i>承重</i><b>${loc.weightCap} kg</b></div>`;

    document.getElementById('brief-route').innerHTML = loc.route
      .map(n => `<span class="route-node">${n}</span>`).join('');

    document.getElementById('brief-hazards').innerHTML = loc.hazards
      .map(h => `<span class="hazard"><svg viewBox="0 0 24 24"><use href="#i-skull"/></svg>${HAZARD_LABEL[h] || h}</span>`).join('');

    document.getElementById('brief-intel').innerHTML = loc.intel
      .map(t => `<li>${t}</li>`).join('');

    this.show('brief');
  },

  watermark(container, text) {
    if (!container) return;
    let el = container.querySelector('.visual-watermark');
    if (!el) {
      el = document.createElement('div');
      el.className = 'visual-watermark';
      container.insertBefore(el, container.firstChild);
    }
    el.textContent = text;
  },

  coord(lon, lat) {
    const ns = lat >= 0 ? 'N' : 'S';
    const ew = lon >= 0 ? 'E' : 'W';
    return Math.abs(lat).toFixed(2) + '°' + ns + ' · ' + Math.abs(lon).toFixed(2) + '°' + ew;
  },

  /* ================= 采购 ================= */
  openMarket() {
    if (!this.locId) { this.show('map'); return; }
    this.renderMarket();
    this.show('market');
  },

  renderMarket() {
    const loc = LOC_MAP[this.locId];
    if (!loc) return;
    document.getElementById('market-name').textContent = '补给站 · ' + loc.name;
    document.getElementById('market-sub').textContent =
      `预算 ¥${loc.budget.toLocaleString()} ｜ 承重上限 ${loc.weightCap} kg ｜ 预计行程 ${loc.days} 天 ｜ 推荐里已包含口粮与饮水`;
    this.renderTabs();
    this.renderGear();
    this.renderDock();
    this.updateGauges();
  },

  tabInfo() {
    const cats = [{ id: 'must', name: '情报推荐' }].concat(GEAR_CATS);
    return cats.map(c => {
      let count = 0;
      if (c.id === 'must') {
        const loc = LOC_MAP[this.locId];
        const ids = loc.must.concat(['food', 'water']);
        if (loc.must.indexOf('stove') >= 0 || loc.must.indexOf('fuel') >= 0) ids.push('fuel');
        count = ids.filter((id, i) => GEAR_MAP[id] && ids.indexOf(id) === i).length;
      } else {
        count = GEAR.filter(g => g.cat === c.id).length;
      }
      return { id: c.id, name: c.name, count };
    });
  },

  renderTabs() {
    const tabs = document.getElementById('market-tabs');
    tabs.innerHTML = this.tabInfo().map(t =>
      `<button class="chip ${this.marketCat === t.id ? 'active' : ''}" data-cat="${t.id}">${t.name}<b>${t.count}</b></button>`
    ).join('');
  },

  renderGear() {
    const loc = LOC_MAP[this.locId];
    const grid = document.getElementById('gear-grid');
    let list;
    if (this.marketCat === 'must') {
      const ids = loc.must.concat(['food', 'water']);
      if (loc.must.indexOf('stove') >= 0 || loc.must.indexOf('fuel') >= 0) ids.push('fuel');
      const seen = {};
      list = ids.filter(id => { if (seen[id] || !GEAR_MAP[id]) return false; seen[id] = true; return true; })
        .map(id => GEAR_MAP[id]);
    } else {
      list = GEAR.filter(g => g.cat === this.marketCat);
    }
    grid.innerHTML = list.map(g => {
      const qty = this.cart[g.id] || 0;
      const essential = loc.must.indexOf(g.id) >= 0;
      const cat = GEAR_CATS.find(c => c.id === g.cat);
      const unit = g.unit || '';
      return `<div class="gear-card ${qty ? 'in-cart' : ''} ${essential ? 'essential' : ''}">
        <div class="gc-top">
          <div><span class="gc-cat">${cat ? cat.name : ''}</span><div class="gc-name">${g.name}</div></div>
          <span class="gc-price">¥${g.price}</span>
        </div>
        <p class="gc-desc">${g.desc}</p>
        <div class="gc-foot">
          <div class="gc-meta"><span>${g.weight} kg${unit ? ' / ' + unit : ''}</span>${qty ? `<span>已选 <b>×${qty}</b></span>` : ''}</div>
          <div class="gc-buy">
            <button class="gc-add" data-buy="${g.id}" data-dir="plus">加入</button>
            <div class="gc-qty">
              <button data-buy="${g.id}" data-dir="minus">−</button>
              <span>${qty}</span>
              <button data-buy="${g.id}" data-dir="plus">＋</button>
            </div>
          </div>
        </div>
      </div>`;
    }).join('') || `<p style="color:var(--faint);font-size:12px">这一类还没有装备。</p>`;
  },

  changeQty(id, delta) {
    const g = GEAR_MAP[id];
    const loc = LOC_MAP[this.locId];
    if (!g || !loc) return;
    const cur = this.cart[id] || 0;
    if (delta > 0 && cur >= 1 && !g.qty) {
      this.toast('无需重复', g.name + ' 带一件就够了。', 'bad');
      return;
    }
    const next = Math.max(0, cur + delta);
    if (delta > 0) {
      const test = Object.assign({}, this.cart, { [id]: next });
      if (Engine.cartCost(test) > loc.budget) {
        this.toast('预算不足', '再加' + g.name + '就要超支了。', 'bad');
        return;
      }
      if (Engine.gearWeight(test) > loc.weightCap) {
        this.toast('背不动了', '已经超过 ' + loc.weightCap + ' kg 的承重上限。', 'bad');
        return;
      }
    }
    if (next === 0) delete this.cart[id];
    else this.cart[id] = next;
    this.renderMarket();
  },

  renderDock() {
    const dock = document.getElementById('dock-items');
    const items = Engine.cartList(this.cart);
    if (!items.length) { dock.textContent = '空背囊'; return; }
    dock.innerHTML = items.map(it =>
      `${it.gear.name}<b> ×${it.qty}${it.gear.unit || ''}</b>`
    ).join(' &nbsp;·&nbsp; ');
  },

  updateGauges() {
    const loc = LOC_MAP[this.locId];
    const cost = Engine.cartCost(this.cart);
    const weight = Engine.gearWeight(this.cart);
    const food = (this.cart.food || 0) + (this.cart.freeze || 0);
    const water = this.cart.water || 0;
    const fuel = this.cart.fuel || 0;

    document.getElementById('g-budget').textContent = '¥' + (loc.budget - cost).toLocaleString();
    document.getElementById('g-budget').classList.toggle('over', cost > loc.budget);
    document.getElementById('g-budget-used').textContent = '已花 ¥' + cost.toLocaleString();
    document.getElementById('g-budget-total').textContent = '总预算 ¥' + loc.budget.toLocaleString();
    const bbar = document.getElementById('g-budget-bar');
    bbar.style.width = Math.min(100, (cost / loc.budget) * 100) + '%';
    bbar.classList.toggle('over', cost > loc.budget);

    document.getElementById('g-weight').textContent = weight.toFixed(1) + ' kg';
    document.getElementById('g-weight').classList.toggle('over', weight > loc.weightCap);
    document.getElementById('g-weight-bar').style.width = Math.min(100, (weight / loc.weightCap) * 100) + '%';
    document.getElementById('g-weight-bar').classList.toggle('over', weight > loc.weightCap);
    document.getElementById('g-weight-cap').textContent = '上限 ' + loc.weightCap + ' kg';

    document.getElementById('g-food').textContent = food + ' 份';
    document.getElementById('g-extra').textContent = `水 ${water} L · 燃料 ${fuel} 罐`;
  },

  depart() {
    const loc = LOC_MAP[this.locId];
    if (!loc) return;
    const cost = Engine.cartCost(this.cart);
    const weight = Engine.gearWeight(this.cart);
    if (cost > loc.budget) { this.toast('无法出发', '超支了。先去掉一些东西。', 'bad'); return; }
    if (weight > loc.weightCap) { this.toast('无法出发', '背囊超过承重上限。', 'bad'); return; }
    const food = (this.cart.food || 0) + (this.cart.freeze || 0);
    const water = this.cart.water || 0;
    if (food < 1) { this.toast('无法出发', '至少带一份口粮。无人区没有外卖。', 'bad'); return; }
    if (water < 1) { this.toast('无法出发', '至少带一升水。', 'bad'); return; }

    const run = Engine.start(loc.id, this.cart);
    if (!run) return;
    this.busy = false;
    this.enterRun();
  },

  /* ================= 远征 ================= */
  enterRun() {
    this.show('run');
    this.renderRunTop();
    this.renderScene('d1');
    this.renderHUD();
    this.renderLog();
    this.renderWeather();
    this.setCaption(`第 1 天，你从${this.loc().route[0]}出发。${this.loc().season}，${Engine.run.weather.name}，${Engine.run.weather.temp}。`);
    this.setActionsEnabled(true);
  },

  loc() { return Engine.loc; },
  run() { return Engine.run; },

  renderScene(variant) {
    const frame = document.getElementById('scene-frame');
    frame.innerHTML = Scene.render(this.loc(), { variant: variant || 'run' });
  },

  renderRunTop() {
    const run = this.run();
    const loc = this.loc();
    document.getElementById('run-province').textContent = loc.province;
    document.getElementById('run-name').textContent = loc.name;
    document.getElementById('run-day').textContent = 'DAY ' + String(run.day).padStart(2, '0');
    const idx = Math.min(run.progress, loc.route.length - 1);
    document.getElementById('run-stage-label').textContent =
      `节点 ${idx + 1} / ${loc.route.length} · ${loc.route[idx]}`;
    const pct = loc.route.length > 1 ? (run.progress / (loc.route.length - 1)) * 100 : 0;
    document.getElementById('run-progress-bar').style.width = pct + '%';
    document.getElementById('run-progress-dot').style.left = pct + '%';
    document.getElementById('progress-nodes').innerHTML = loc.route.map((n, i) =>
      `<span class="${i <= run.progress ? 'done' : ''}">${n}</span>`
    ).join('');

    document.getElementById('weather-icon').textContent = run.weather.icon;
    document.getElementById('weather-name').textContent = run.weather.name;
    document.getElementById('weather-temp').textContent = run.weather.temp;

    if (!document.getElementById('run-abandon')) {
      const btn = document.createElement('button');
      btn.id = 'run-abandon';
      btn.className = 'link-btn';
      btn.style.marginTop = '6px';
      btn.textContent = '放弃本次远征';
      btn.addEventListener('click', () => {
        if (!confirm('确定要撤离？这一次不会记录为生还。')) return;
        Engine.finish(false, '主动撤离');
        this.showResult();
      });
      document.getElementById('run-name').insertAdjacentElement('afterend', btn);
    }
  },

  renderHUD() {
    const run = this.run();
    const loc = this.loc();
    const meters = [
      ['hp', '生命'], ['stamina', '体力'], ['warmth', '体温'], ['morale', '意志']
    ];
    meters.forEach(([key]) => {
      document.getElementById('m-' + key).textContent = Math.round(run[key]);
      const bar = document.getElementById('bar-' + key);
      bar.style.width = run[key] + '%';
      bar.classList.toggle('low', run[key] <= 25);
    });

    document.getElementById('s-food').textContent = run.food;
    document.getElementById('s-water').textContent = run.water;
    document.getElementById('s-fuel').textContent = run.fuel;
    document.getElementById('s-load').textContent = run.load.toFixed(1);
    document.getElementById('s-food').classList.toggle('low', run.food <= 2);
    document.getElementById('s-water').classList.toggle('low', run.water <= 3);
    document.getElementById('s-fuel').classList.toggle('low', run.fuel <= 1);

    const inj = document.getElementById('injury-line');
    if (run.injuries.length) {
      inj.hidden = false;
      inj.innerHTML = '伤情：<b>' + run.injuries.join(' · ') + '</b>';
    } else {
      inj.hidden = true;
      inj.innerHTML = '';
    }

    const count = {};
    run.gear.forEach(id => { count[id] = (count[id] || 0) + 1; });
    const chips = Object.keys(count).map(id => {
      const g = GEAR_MAP[id];
      if (!g) return '';
      const key = loc.must.indexOf(id) >= 0 ? ' key' : '';
      return `<span class="gear-chip${key}">${g.name}${count[id] > 1 ? ' ×' + count[id] : ''}</span>`;
    }).join('');
    document.getElementById('gear-chips').innerHTML = chips;
    document.getElementById('gear-count').textContent = run.gear.length + ' 件';

    document.getElementById('action-hint').textContent = this.actionHint();
  },

  actionHint() {
    const run = this.run();
    if (!run) return '';
    if (run.warmth <= 30) return '核心体温过低，再走下去会失温。';
    if (run.stamina <= 25) return '体力见底了，扎营能换回半天命。';
    if (run.food <= 2) return '口粮快见底，留意可翻找的旧营地。';
    if (run.water <= 3) return '饮水不足，优先找水源。';
    const w = run.weather;
    if (w.wind >= 6) return '风很大，行军消耗会明显增加。';
    if (w.heat >= 20) return '高温时段赶路会加速脱水。';
    return '判断天气与体力，再决定。';
  },

  setCaption(text) {
    const run = this.run();
    const loc = this.loc();
    const idx = Math.min(run.progress, loc.route.length - 1);
    document.getElementById('scene-caption').innerHTML =
      `<span class="cap-day">DAY ${String(run.day).padStart(2, '0')} · ${loc.route[idx]}</span>${text}`;
  },

  renderLog() {
    const run = this.run();
    document.getElementById('log-list').innerHTML = run.log.map(item =>
      `<div class="log-item ${item.type || ''}"><b>D${item.day}</b> ${item.text}</div>`
    ).join('');
    document.getElementById('log-count').textContent = run.log.length;
  },

  renderWeather() {
    const run = this.run();
    const w = run.weather;
    const layer = document.getElementById('scene-overlay');
    let html = '';
    if (w.icon === '❄' || w.name.indexOf('雪') >= 0) {
      for (let i = 0; i < 44; i++) {
        const size = 2 + Math.random() * 3.5;
        html += `<div class="wflake" style="left:${Math.random() * 100}%;width:${size}px;height:${size}px;--drift:${(Math.random() * 30 - 15).toFixed(0)}vw;animation-duration:${(4 + Math.random() * 5).toFixed(1)}s;animation-delay:${(-Math.random() * 6).toFixed(1)}s;opacity:${(.35 + Math.random() * .5).toFixed(2)}"></div>`;
      }
    } else if (w.icon === '☂') {
      for (let i = 0; i < 46; i++) {
        html += `<div class="rain-line" style="left:${Math.random() * 100}%;animation-duration:${(.7 + Math.random() * .6).toFixed(2)}s;animation-delay:${(-Math.random() * 2).toFixed(2)}s;opacity:${(.25 + Math.random() * .4).toFixed(2)}"></div>`;
      }
    } else if (w.icon === '≋' || w.icon === '◭') {
      for (let i = 0; i < 34; i++) {
        html += `<div class="dust" style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-duration:${(1.3 + Math.random() * 2).toFixed(1)}s;animation-delay:${(-Math.random() * 3).toFixed(1)}s;opacity:${(.25 + Math.random() * .4).toFixed(2)}"></div>`;
      }
    }
    if (w.name.indexOf('雾') >= 0 || w.name === '雾凇') {
      html += `<div class="fog-band" style="top:32%"></div><div class="fog-band" style="top:56%;animation-delay:-7s"></div><div class="fog-band" style="top:74%;animation-delay:-13s"></div>`;
    }
    let flash = '';
    if (w.name === '沙暴') flash = '<div class="weather-tint" style="position:absolute;inset:0;background:rgba(150,110,50,.18)"></div>';
    if (w.name === '暴雪' || w.name === '白毛风') flash = '<div class="weather-tint" style="position:absolute;inset:0;background:rgba(180,200,210,.08)"></div>';
    layer.innerHTML = flash + html;
  },

  setActionsEnabled(on) {
    document.querySelectorAll('[data-action]').forEach(b => { b.disabled = !on; });
  },

  showDayTransition(day, cb) {
    const run = this.run();
    const el = document.createElement('div');
    el.className = 'day-transition';
    el.innerHTML = `<div class="dt-inner">
      <span class="dt-day">DAY ${String(day).padStart(2, '0')}</span>
      <h3>第 ${day} 天</h3>
      <span class="dt-weather">${run.weather.name} · ${run.weather.temp}</span>
    </div>`;
    document.body.appendChild(el);
    setTimeout(() => {
      if (cb) cb();
    }, 1150);
    setTimeout(() => el.remove(), 2200);
  },

  doAction(action) {
    if (this.busy || !this.run() || this.run().finished) return;
    this.busy = true;
    this.setActionsEnabled(false);

    const res = Engine.act(action);
    this.renderRunTop();
    this.renderHUD();
    this.renderLog();
    this.renderWeather();
    this.setCaption(res.narrative || '你继续向前。');

    if (res.type === 'event') {
      setTimeout(() => { this.renderScene('d' + this.run().day); this.openEvent(res.event); }, 420);
      return;
    }
    if (res.type === 'arrived' || res.type === 'dead') {
      if (res.type === 'dead') this.flash();
      setTimeout(() => this.showResult(), 900);
      return;
    }
    if (res.type === 'day') {
      this.showDayTransition(this.run().day, () => {
        this.renderScene('d' + this.run().day);
        this.renderRunTop();
        this.renderHUD();
        this.renderLog();
        this.renderWeather();
        this.setActionsEnabled(true);
        this.busy = false;
      });
    }
  },

  flash() {
    const el = document.createElement('div');
    el.className = 'flash-red';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
    document.getElementById('screen-run').classList.add('shake');
    setTimeout(() => document.getElementById('screen-run').classList.remove('shake'), 600);
  },

  /* ================= 事件 ================= */
  openEvent(ev) {
    if (!ev) return;
    this.busy = true;
    this.setActionsEnabled(false);
    this.modalRoot.hidden = false;
    document.body.classList.add('locked');
    this.renderEvent(ev);
  },

  renderEvent(ev) {
    const run = this.run();
    const loc = this.loc();
    const idx = Math.min(run.progress, loc.route.length - 1);
    const opts = ev.options.map((o, i) => {
      const ok = Engine.reqMet(o.req);
      const need = ok ? '' : `<span class="opt-req">缺少：${this.reqNames(o.req)}</span>`;
      return `<button class="option" data-opt="${i}" ${ok ? '' : 'disabled'}>
        <span class="opt-no">${String(i + 1).padStart(2, '0')}</span>
        <span class="opt-body">
          <span class="opt-label">${o.label}</span>
          <span class="opt-hint">${o.hint || ''}</span>
          ${need}
        </span>
        <svg class="opt-arrow" viewBox="0 0 24 24"><use href="#i-arrow"/></svg>
      </button>`;
    }).join('');

    this.modalRoot.innerHTML = `<div class="modal">
      <div class="modal-inner">
        <div class="modal-tag"><span>EVENT · ${ev.tag || 'SURVIVAL'}</span><i>第 ${String(run.day).padStart(2, '0')} 天 · ${loc.route[idx]}</i></div>
        <h2>${ev.title}</h2>
        <div class="modal-text"><p>${ev.text}</p></div>
        <div class="options">${opts}</div>
      </div>
    </div>`;

    this.modalRoot.querySelectorAll('[data-opt]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = Engine.choose(parseInt(btn.dataset.opt, 10));
        if (!r) return;
        this.renderHUD();
        this.renderLog();
        this.renderOutcome(ev, r);
      });
    });
  },

  reqNames(req) {
    const arr = Array.isArray(req) ? req : [req];
    return arr.map(id => GEAR_MAP[id] ? GEAR_MAP[id].name : id).join('、');
  },

  renderOutcome(ev, r) {
    const eff = r.outcome.eff || {};
    const chips = this.effChips(eff);
    this.modalRoot.innerHTML = `<div class="modal">
      <div class="modal-inner">
        <div class="modal-tag"><span>OUTCOME</span><i>${ev.title}</i></div>
        <h2>${r.nextEvent ? '事情还没有结束' : '结果'}</h2>
        <div class="modal-outcome">
          <div class="outcome-label">发生了什么</div>
          <p class="outcome-text">${r.outcome.text}</p>
          ${chips ? `<div class="eff-chips">${chips}</div>` : ''}
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" id="btn-outcome-continue">
            <span>${r.nextEvent ? '继续' : '天快黑了，继续'}</span>
            <svg viewBox="0 0 24 24"><use href="#i-arrow"/></svg>
          </button>
        </div>
      </div>
    </div>`;
    const btn = document.getElementById('btn-outcome-continue');
    if (btn) btn.addEventListener('click', () => this.continueAfterEvent());
  },

  effChips(eff) {
    const labels = { hp: '生命', stamina: '体力', warmth: '体温', morale: '意志', food: '口粮', water: '饮水', fuel: '燃料', progress: '进度' };
    const units = { food: ' 份', water: ' L', fuel: ' 罐', progress: ' 节点' };
    const parts = [];
    Object.keys(labels).forEach(k => {
      if (typeof eff[k] !== 'number' || eff[k] === 0) return;
      const v = eff[k];
      if (k === 'progress') {
        parts.push(this.chip((v > 0 ? '推进 +' : '后退 ') + v + units[k], v > 0 ? 'good' : 'bad'));
      } else {
        parts.push(this.chip(labels[k] + ' ' + (v > 0 ? '+' : '') + v + (units[k] || ''), v > 0 ? 'good' : 'bad'));
      }
    });
    if (eff.injury) parts.push(this.chip('受伤 · ' + eff.injury, 'bad'));
    if (eff.item && GEAR_MAP[eff.item]) parts.push(this.chip('获得 · ' + GEAR_MAP[eff.item].name, 'good'));
    if (eff.egg) {
      const egg = EGG_MAP[eff.egg];
      parts.push(this.chip('彩蛋 · ' + (egg ? egg.name : eff.egg), 'egg'));
    }
    return parts.join('');
  },

  chip(text, type) {
    return `<span class="eff ${type}">${text}</span>`;
  },

  continueAfterEvent() {
    const next = Engine.continueAfterOutcome();
    this.closeModal();
    this.renderRunTop();
    this.renderHUD();
    this.renderLog();

    if (next.type === 'event') {
      this.openEvent(next.event);
      return;
    }
    if (next.type === 'finished' || this.run().finished) {
      setTimeout(() => this.showResult(), 320);
      return;
    }
    if (next.type === 'day') {
      this.showDayTransition(this.run().day, () => {
        this.renderScene('d' + this.run().day);
        this.renderRunTop();
        this.renderHUD();
        this.renderLog();
        this.renderWeather();
        this.busy = false;
        this.setActionsEnabled(true);
      });
    }
  },

  /* ================= 结算 ================= */
  showResult() {
    const res = Engine.result;
    this.closeModal();
    this.setActionsEnabled(true);
    this.busy = false;
    if (!res) return;
    this.renderResult(res);
    this.show('result');
    this.updateTopStats();
    MapView.refresh();
  },

  renderResult(res) {
    const run = res.run;
    const loc = res.loc;
    const ok = res.success;

    document.getElementById('result-kicker').textContent = ok ? 'EXPEDITION REPORT' : 'LOST EXPEDITION REPORT';
    document.getElementById('result-title').textContent = ok ? '你走出来了。' : '你没能走出来。';
    document.getElementById('result-rank').textContent = res.rank;
    document.getElementById('result-score').textContent = res.score + ' pts';

    const last = loc.route[Math.min(run.progress, loc.route.length - 1)];
    document.getElementById('result-sub').textContent = ok
      ? `${run.day} 天，你从${loc.route[0]}走到${loc.route[loc.route.length - 1]}。背包里还剩 ${run.food} 份口粮、${run.water} 升水。`
      : `${run.day} 天，你在${last}停下了。档案上写下的原因：${res.reason}。`;

    document.getElementById('result-stamp').textContent = ok ? '生还' : '未归';
    document.getElementById('result-stamp').classList.toggle('dead', !ok);
    document.getElementById('result-scene').innerHTML = Scene.render(loc, { variant: ok ? 'result' : 'lost' });
    this.watermark(document.querySelector('.result-visual'), loc.en);

    const intel = loc.intel && loc.intel.length ? loc.intel[loc.intel.length - 1] : '';
    document.getElementById('result-note').textContent = ok
      ? `“${intel}” —— 你把这句话带回来了。`
      : `“${intel}” —— 这句话留在了山里。`;

    document.getElementById('result-stats').innerHTML = `
      <div class="result-stat"><i>在野天数</i><b>${run.day}</b></div>
      <div class="result-stat"><i>推进节点</i><b>${run.progress} / ${loc.route.length - 1}</b></div>
      <div class="result-stat"><i>本次彩蛋</i><b>${run.eggs.length}</b></div>
      <div class="result-stat"><i>伤情</i><b>${run.injuries.length}</b></div>`;

    document.getElementById('result-timeline').innerHTML = loc.route.map((n, i) => {
      let cls = i <= run.progress ? 'done' : '';
      if (!ok && i === run.progress) cls = 'dead';
      return `<span class="tl-node ${cls}">${n}</span>`;
    }).join('');

    const eggsWrap = document.getElementById('result-eggs-wrap');
    if (run.eggs.length) {
      eggsWrap.hidden = false;
      document.getElementById('result-eggs').innerHTML = run.eggs.map(id => {
        const e = EGG_MAP[id];
        return e ? `<div class="egg-card"><b>${e.name}</b><p>${e.desc}</p></div>` : '';
      }).join('');
    } else eggsWrap.hidden = true;

    const achWrap = document.getElementById('result-ach-wrap');
    if (res.ach && res.ach.length) {
      achWrap.hidden = false;
      document.getElementById('result-ach').innerHTML = res.ach.map(a =>
        `<span class="ach-pill">${a.name}</span>`
      ).join('');
    } else achWrap.hidden = true;
  },

  /* ================= 档案库 ================= */
  openArchive() {
    this.renderArchive();
    this.show('archive');
  },

  renderArchive() {
    document.querySelectorAll('#archive-tabs .chip').forEach(c => {
      c.classList.toggle('active', c.dataset.tab === this.archiveTab);
    });
    const body = document.getElementById('archive-body');
    if (this.archiveTab === 'eggs') body.innerHTML = this.renderEggArchive();
    else if (this.archiveTab === 'ach') body.innerHTML = this.renderAchArchive();
    else body.innerHTML = this.renderRecords();
  },

  renderEggArchive() {
    return `<div class="eggs-grid">` + EGGS.map((e, i) => {
      const found = Engine.hasEgg(e.id);
      const loc = LOC_MAP[e.loc];
      return `<div class="egg-item ${found ? 'found' : 'masked'}">
        <span class="egg-no">EGG ${String(i + 1).padStart(2, '0')}</span>
        <div class="egg-icon"><svg viewBox="0 0 24 24"><use href="#i-egg"/></svg></div>
        <h4>${found ? e.name : '未解档案'}</h4>
        <p>${found ? e.desc : '线索：' + e.hint}</p>
        <span class="egg-loc">${loc ? loc.name : ''} · ${found ? '已收录' : '未发现'}</span>
      </div>`;
    }).join('') + `</div>`;
  },

  renderAchArchive() {
    return `<div class="ach-grid">` + ACHIEVEMENTS.map(a => {
      const on = Engine.meta.ach.indexOf(a.id) >= 0;
      return `<div class="ach-item ${on ? 'on' : ''}">
        <span class="ach-medal">${a.icon}</span>
        <div><b>${a.name}</b><p>${a.desc}</p></div>
      </div>`;
    }).join('') + `</div>`;
  },

  renderRecords() {
    if (!Engine.meta.records.length) {
      return `<div class="record-empty">还没有活着带回来的记录。<br>地图上的每一条线，都在等第一个名字。</div>`;
    }
    const rows = Engine.meta.records.slice().sort((a, b) => b.score - a.score).map(r =>
      `<div class="record-row">
        <span><b>${r.name}</b></span>
        <span class="rank">${r.rank}</span>
        <span><i>${r.score} pts</i></span>
        <span><i>${r.days} 天</i></span>
        <span><i>${r.date}</i></span>
      </div>`).join('');
    return `<div class="records">
      <div class="record-row head"><span>路线</span><span>评级</span><span>得分</span><span>天数</span><span>日期</span></div>
      ${rows}
    </div>`;
  },

  /* ================= 关于 ================= */
  openAbout() {
    this.modalRoot.hidden = false;
    document.body.classList.add('locked');
    this.busy = true;
    this.modalRoot.innerHTML = `<div class="modal">
      <button class="modal-close" data-close-modal aria-label="关闭"><svg viewBox="0 0 24 24"><use href="#i-cross"/></svg></button>
      <div class="modal-inner">
        <div class="modal-tag"><span>BRIEFING</span><i>WILDERNESS DOSSIER</i></div>
        <h2>行动须知</h2>
        <div class="modal-text">
          <p>这是一场关于“如果”的模拟：如果预算只有几千块，如果背囊只装得下这些，如果你在一条没有信号、没有补给、也没有退路的线上，走进去几天。</p>
          <p>每一条路线都有独立的节点、天气池、事件与彩蛋。装备会改变你能做的选择；物资会决定你还能走多远。没有人能保证一次就活着出来。</p>
        </div>
        <div class="about-grid">
          <div class="about-block"><h4>玩法</h4><p>选路线 → 看简报 → 用固定预算采购 → 在“行军 / 侦察 / 扎营 / 翻找”之间分配体力与物资。每天结束会结算饥饿、脱水与失温。</p></div>
          <div class="about-block"><h4>彩蛋</h4><p>部分事件只在特定装备、特定节点出现。收集彩蛋会逐步解锁隐藏线路，也会进入档案库。</p></div>
          <div class="about-block"><h4>评级</h4><p>根据推进度、身体状态、剩余物资、彩蛋与伤情综合评分。S 级意味着你几乎把这条线走成了教科书。</p></div>
          <div class="about-block"><h4>记录</h4><p>生还记录保存在本机浏览器。换设备或清理缓存会丢失，但无人区本来也不负责保存你。</p></div>
        </div>
        <div class="about-warn">本作为虚构演绎，事件、人物与部分地理细节经过改编。真实的羌塘、罗布泊、鳌太、墨脱等地属于受管控或极度危险区域，进入需依法审批、专业向导与完整救援预案。请勿把游戏里的任何选择当作现实建议。</div>
        <div class="modal-actions"><button class="btn btn-primary" data-close-modal><span>知道了</span></button></div>
      </div>
    </div>`;
  }
};

App.init();
