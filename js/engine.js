/* =========================================================
   荒野禁区 · 规则引擎
   ========================================================= */

const Engine = {
  loc: null,
  cart: {},
  run: null,
  pendingEvent: null,
  nextEventId: null,
  storageKey: 'wild_zone_v1',
  meta: null,

  /* ---------- 存档 ---------- */
  loadMeta() {
    let m = { eggs: [], ach: [], records: [], runs: 0, deaths: 0 };
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) m = Object.assign(m, JSON.parse(raw));
    } catch (e) { /* ignore */ }
    this.meta = m;
    return m;
  },
  saveMeta() {
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.meta)); } catch (e) { /* ignore */ }
  },
  hasEgg(id) { return this.meta.eggs.indexOf(id) >= 0; },
  discoverEgg(id) {
    const egg = EGG_MAP[id];
    if (!egg) return null;
    const isNew = !this.hasEgg(id);
    if (isNew) {
      this.meta.eggs.push(id);
      this.saveMeta();
      if (this.run && this.run.eggs.indexOf(id) < 0) this.run.eggs.push(id);
      App.toast('发现彩蛋', egg.name, 'egg');
    }
    return egg;
  },
  eggCount() { return this.meta.eggs.length; },
  secretUnlocked() { return this.eggCount() >= 4; },

  /* ---------- 装备 ---------- */
  gearWeight(cart) {
    let w = DEFAULT_WEIGHT;
    Object.keys(cart).forEach(id => {
      const g = GEAR_MAP[id];
      if (g) w += g.weight * cart[id];
    });
    return Math.round(w * 10) / 10;
  },
  cartCost(cart) {
    let c = 0;
    Object.keys(cart).forEach(id => {
      const g = GEAR_MAP[id];
      if (g) c += g.price * cart[id];
    });
    return c;
  },
  cartList(cart) {
    const arr = [];
    Object.keys(cart).forEach(id => { if (cart[id] > 0) arr.push({ gear: GEAR_MAP[id], qty: cart[id] }); });
    return arr;
  },

  /* ---------- 出发 ---------- */
  start(locId, cart) {
    const loc = LOC_MAP[locId];
    if (!loc) return null;
    this.loc = loc;
    this.cart = Object.assign({}, cart);
    const gear = DEFAULT_KIT.slice();
    Object.keys(cart).forEach(id => {
      const g = GEAR_MAP[id];
      if (!g || g.qty) return;
      for (let i = 0; i < cart[id]; i++) gear.push(id);
    });

    const foodQty = (cart.food || 0) + (cart.freeze || 0);
    this.run = {
      locId,
      day: 1,
      progress: 0,
      hp: 100, stamina: 100, warmth: 100, morale: 100,
      food: foodQty,
      water: cart.water || 0,
      fuel: cart.fuel || 0,
      gear,
      load: this.gearWeight(cart),
      weather: this.rollWeather(loc),
      injuries: [],
      flags: {},
      seen: [],
      eggs: [],
      log: [],
      starveDays: 0,
      thirstDays: 0,
      stormDays: 0,
      arrived: false,
      finished: false,
      deathReason: null,
      startTime: Date.now()
    };
    this.pendingEvent = null;
    this.nextEventId = null;
    this.addLog('第 1 天，从' + loc.route[0] + '出发。', 'good');
    this.addLog('天气预报：' + this.run.weather.name + '，' + this.run.weather.temp + '。');
    return this.run;
  },

  rollWeather(loc) {
    const pool = WEATHER[loc.scene] || WEATHER.plateau;
    return this.weighted(pool.map(w => ({ w: w.w, v: w })));
  },
  weatherText(run) {
    return run.weather.name + ' · ' + run.weather.temp;
  },

  /* ---------- 工具 ---------- */
  weighted(arr) {
    let total = 0;
    arr.forEach(a => { total += (a.w || a.weight || 1); });
    let r = Math.random() * total;
    for (let i = 0; i < arr.length; i++) {
      r -= (arr[i].w || arr[i].weight || 1);
      if (r <= 0) return arr[i].v !== undefined ? arr[i].v : arr[i];
    }
    const last = arr[arr.length - 1];
    return last.v !== undefined ? last.v : last;
  },
  clamp(v, a, b) { return Math.max(a, Math.min(b, v)); },
  hasGear(id) { return this.run && this.run.gear.indexOf(id) >= 0; },
  reqMet(req) {
    if (!req) return true;
    if (Array.isArray(req)) return req.every(r => this.hasGear(r));
    return this.hasGear(req);
  },
  addLog(text, type) {
    if (!this.run) return;
    this.run.log.unshift({ text, type: type || '', day: this.run.day });
    if (this.run.log.length > 80) this.run.log.pop();
  },
  insulation() {
    const map = { shell:5, down:18, fleece:8, base:2, hat:2, gloves:2, bag:18, pad:5, tent:5, bivy:2, gaiter:1 };
    let sum = 0;
    this.run.gear.forEach(id => { sum += (map[id] || 0); });
    return sum;
  },
  exposure() {
    const w = this.run.weather;
    return Math.max(0, w.cold - this.insulation() * 0.55) + w.wet * 0.6;
  },
  hasInjury(name) { return this.run.injuries.indexOf(name) >= 0; },

  /* ---------- 行动 ---------- */
  actionInfo(action) {
    const loc = this.loc;
    const w = this.run.weather;
    const altitude = loc.hazards.indexOf('altitude') >= 0;
    const heat = w.heat > 10;
    const wet = w.wet >= 4;
    const wind = w.wind >= 6;
    if (action === 'march') {
      let st = 20 + (altitude ? 8 : 0) + (heat ? 5 : 0) + (wet ? 3 : 0) + (wind ? 3 : 0);
      if (this.hasInjury('脚踝扭伤') || this.hasInjury('膝盖撞伤')) st += 6;
      return { stamina: st, food: 2, water: heat ? 4 : 3, warmth: this.exposure() };
    }
    if (action === 'scout') {
      return { stamina: 12 + (altitude ? 4 : 0), food: 1, water: 2, warmth: this.exposure() * 0.7 };
    }
    if (action === 'camp') {
      return { stamina: -18, food: 1, water: 2, warmth: -Math.max(4, this.exposure() * 0.35) - (this.hasGear('tent') ? 6 : 0) };
    }
    if (action === 'scavenge') {
      return { stamina: 15 + (altitude ? 4 : 0), food: 1, water: 2, warmth: this.exposure() * 0.8 };
    }
    return {};
  },

  act(action) {
    const run = this.run;
    if (!run || run.finished) return { type: 'none' };
    const cost = this.actionInfo(action);

    run.stamina = this.clamp(run.stamina - cost.stamina, 0, 100);
    run.food = Math.max(0, run.food - cost.food);
    run.water = Math.max(0, run.water - cost.water);
    run.warmth = this.clamp(run.warmth - cost.warmth, 0, 100);

    let narrative = '';
    if (action === 'march') {
      if (run.progress < this.loc.route.length - 1) run.progress += 1;
      narrative = '你向下一个节点推进。' + (run.progress >= this.loc.route.length - 1 ? '前方就是' + this.loc.route[this.loc.route.length - 1] + '。' : '');
      this.addLog('行军至' + this.loc.route[run.progress] + '。', '');
      if (run.progress >= this.loc.route.length - 1) run.arrived = true;
    } else if (action === 'camp') {
      run.stamina = this.clamp(run.stamina + 18, 0, 100);
      run.warmth = this.clamp(run.warmth + 8, 0, 100);
      if (run.food > 0 && run.water > 0) run.hp = this.clamp(run.hp + 4, 0, 100);
      narrative = '你扎下营地。风在帐篷外面，至少今晚它是外面的。';
      this.addLog('在' + this.loc.route[run.progress] + '附近扎营休整。', 'good');
    } else if (action === 'scout') {
      narrative = '你离开主路线，向侧面侦察。';
      this.addLog('离开主路线侦察周边。', '');
    } else if (action === 'scavenge') {
      narrative = '你翻找附近的旧营地与石缝。';
      this.addLog('翻找前人留下的痕迹。', '');
    }

    // 强制到达终点
    if (run.arrived) {
      this.finish(true, '抵达' + this.loc.route[this.loc.route.length - 1]);
      return { type: 'arrived', narrative };
    }

    if (run.hp <= 0) {
      this.finish(false, '力竭');
      return { type: 'dead', narrative };
    }

    // 触发事件
    const event = this.pickEvent(action);
    if (event) {
      this.pendingEvent = event;
      run.seen.push(event.id);
      this.addLog('遭遇：' + event.title, 'bad');
      return { type: 'event', event, narrative };
    }

    // 无事发生的小结算
    this.scoutLuck(action);
    const died = this.endDay();
    return { type: died ? 'dead' : 'day', narrative };
  },

  scoutLuck(action) {
    const run = this.run;
    if (action === 'scout') {
      if (Math.random() < 0.45) {
        const gain = Math.random() < 0.6 ? 'water' : 'food';
        run[gain] += gain === 'water' ? 2 : 1;
        this.addLog(gain === 'water' ? '找到一小片积水，补水 2L。' : '采到一些可食用的野果，口粮 +1。', 'good');
      } else {
        run.morale = this.clamp(run.morale - 3, 0, 100);
        this.addLog('周围什么也没有。', '');
      }
    } else if (action === 'scavenge') {
      const r = Math.random();
      if (r < 0.5) {
        run.food += 2;
        this.addLog('在一处旧营地找到两包口粮。', 'good');
      } else if (r < 0.7) {
        run.fuel += 1;
        this.addLog('找到半罐还能用的气。', 'good');
      } else if (r < 0.85) {
        run.morale = this.clamp(run.morale - 5, 0, 100);
        this.addLog('只翻到一些垃圾和一件破衣服。', '');
      } else {
        run.hp = this.clamp(run.hp - 6, 0, 100);
        this.addLog('翻找时被碎石划伤了手。', 'bad');
        if (!this.hasInjury('手部划伤')) run.injuries.push('手部划伤');
      }
    }
  },

  pickEvent(action) {
    const rate = { march: 0.58, scout: 0.82, scavenge: 0.8, camp: 0.32 }[action] || 0.5;
    const bonus = this.run.weather.wind >= 6 ? 0.06 : 0;
    if (Math.random() > rate + bonus) return null;

    const stage = this.run.progress + 1;
    const hazards = this.loc.hazards;
    const pool = [];

    const local = (EVENTS[this.loc.id] || []).filter(e => {
      if (this.run.seen.indexOf(e.id) >= 0) return false;
      if (e.stage && (stage < e.stage[0] || stage > e.stage[1])) return false;
      return true;
    });
    local.forEach(e => pool.push({ v: e, w: 3 }));

    COMMON_EVENTS.forEach(e => {
      if (this.run.seen.indexOf(e.id) >= 0) return;
      if (e.stage && (stage < e.stage[0] || stage > e.stage[1])) return;
      if (e.tag && hazards.indexOf(e.tag) >= 0) pool.push({ v: e, w: 1 });
    });

    if (!pool.length) return null;
    return this.weighted(pool);
  },

  /* ---------- 事件选择 ---------- */
  choose(index) {
    const ev = this.pendingEvent;
    if (!ev) return null;
    const opt = ev.options[index];
    if (!opt) return null;
    if (!this.reqMet(opt.req)) {
      App.toast('装备不足', '缺少：' + (Array.isArray(opt.req) ? opt.req.map(id => GEAR_MAP[id] ? GEAR_MAP[id].name : id).join('、') : GEAR_MAP[opt.req].name), 'bad');
      return null;
    }
    const outcome = this.weighted(opt.outcomes);
    this.applyEffects(outcome.eff || {});
    this.nextEventId = outcome.next || null;

    // 接续事件
    let nextEvent = null;
    if (this.nextEventId) {
      nextEvent = (EVENTS[this.loc.id] || []).find(e => e.id === this.nextEventId) || COMMON_EVENTS.find(e => e.id === this.nextEventId);
      if (nextEvent) this.run.seen.push(nextEvent.id);
    }
    this.pendingEvent = nextEvent || null;
    this.addLog(ev.title + '：' + outcome.text, 'bad');
    return { outcome, nextEvent };
  },

  continueAfterOutcome() {
    if (this.pendingEvent) return { type: 'event', event: this.pendingEvent };
    if (this.run.arrived) { this.finish(true, '抵达终点'); return { type: 'finished' }; }
    if (this.run.hp <= 0) { this.finish(false, '力竭'); return { type: 'finished' }; }
    const died = this.endDay();
    return { type: died ? 'finished' : 'day' };
  },

  applyEffects(eff) {
    const run = this.run;
    ['hp', 'stamina', 'warmth', 'morale'].forEach(k => {
      if (typeof eff[k] === 'number') {
        run[k] = this.clamp(run[k] + eff[k], 0, 100);
      }
    });
    if (typeof eff.food === 'number') run.food = Math.max(0, run.food + eff.food);
    if (typeof eff.water === 'number') run.water = Math.max(0, run.water + eff.water);
    if (typeof eff.fuel === 'number') run.fuel = Math.max(0, run.fuel + eff.fuel);
    if (typeof eff.progress === 'number') {
      run.progress = this.clamp(run.progress + eff.progress, 0, this.loc.route.length - 1);
      if (run.progress >= this.loc.route.length - 1) run.arrived = true;
    }
    if (eff.flag) run.flags[eff.flag] = true;
    if (eff.injury && !this.hasInjury(eff.injury)) run.injuries.push(eff.injury);
    if (eff.item) {
      const g = GEAR_MAP[eff.item];
      if (g) { run.gear.push(eff.item); App.toast('获得物资', g.name); }
    }
    if (eff.egg) this.discoverEgg(eff.egg);
    // 极端状态即时死亡
    if (run.hp <= 0) run.deathReason = run.warmth <= 0 ? '失温' : '伤重';
  },

  /* ---------- 昼夜 ---------- */
  endDay() {
    const run = this.run;
    if (!run || run.finished) return true;
    if (run.arrived) { this.finish(true, '抵达终点'); return true; }

    // 饥饿 / 脱水
    if (run.food <= 0) {
      run.starveDays += 1;
      run.hp = this.clamp(run.hp - 8, 0, 100);
      run.morale = this.clamp(run.morale - 6, 0, 100);
      this.addLog('没有食物。' + (run.starveDays >= 2 ? '身体开始拆自己的肌肉。' : '胃里空得发疼。'), 'bad');
    } else run.starveDays = 0;

    if (run.water <= 0) {
      run.thirstDays += 1;
      run.hp = this.clamp(run.hp - 12, 0, 100);
      run.stamina = this.clamp(run.stamina - 10, 0, 100);
      this.addLog('水袋空了。嘴唇开始裂开。', 'bad');
    } else run.thirstDays = 0;

    if (run.warmth <= 0) {
      run.hp = this.clamp(run.hp - 20, 0, 100);
      run.morale = this.clamp(run.morale - 10, 0, 100);
      this.addLog('核心体温过低，你开始分不清方向。', 'bad');
    }

    if (run.stamina <= 0) {
      run.hp = this.clamp(run.hp - 12, 0, 100);
      this.addLog('体力透支，你摔倒在路边。', 'bad');
    }

    // 天气
    const oldWeather = run.weather;
    run.weather = this.rollWeather(this.loc);
    if (run.weather.wind >= 6) run.stormDays += 1;

    // 判定
    if (run.hp <= 0) {
      let reason = '力竭';
      if (run.warmth <= 0) reason = '失温';
      else if (run.thirstDays >= 2) reason = '脱水';
      else if (run.starveDays >= 2) reason = '饥饿';
      else if (this.hasInjury('高原肺水肿')) reason = '高原肺水肿';
      this.finish(false, reason);
      return true;
    }
    if (run.thirstDays >= 2) { this.finish(false, '脱水'); return true; }
    if (run.starveDays >= 3) { this.finish(false, '饥饿'); return true; }
    if (run.warmth <= 0 && Math.random() < 0.5) { this.finish(false, '失温'); return true; }

    run.day += 1;
    if (run.day > this.loc.days + 2) {
      this.finish(false, '失联');
      return true;
    }
    if (run.day > 1 && run.weather !== oldWeather) {
      this.addLog('天气转为' + run.weather.name + '（' + run.weather.temp + '）。', '');
    }
    return false;
  },

  /* ---------- 结算 ---------- */
  finish(success, reason) {
    const run = this.run;
    if (run.finished) return this.result;
    run.finished = true;
    run.success = success;
    run.deathReason = success ? null : reason;

    const loc = this.loc;
    const progressRatio = run.progress / (loc.route.length - 1);
    let score = loc.level * 100 + progressRatio * 280;
    score += (run.hp + run.stamina + run.warmth + run.morale) * 1.4;
    score += run.food * 6 + run.water * 3 + run.fuel * 10;
    score += run.eggs.length * 45;
    score -= run.injuries.length * 25;
    score -= Math.max(0, run.day - loc.days) * 20;
    if (success) score += 200;
    else score *= 0.45;
    if (run.flags.rescued) score += 30;

    const maxScore = loc.level * 100 + 280 + 560 + 200 + 100 + 180;
    const ratio = score / maxScore;
    let rank = 'D';
    for (const t of RANK_TIERS) { if (ratio >= t.min) { rank = t.rank; break; } }

    const ach = this.checkAchievements(success, rank);
    const result = {
      success, reason, rank, score: Math.round(score),
      loc, run: JSON.parse(JSON.stringify(run)),
      eggsRun: run.eggs.slice(),
      ach
    };
    this.result = result;

    // 记录
    this.meta.runs += success ? 1 : 0;
    if (!success) this.meta.deaths += 1;
    const rec = this.meta.records.find(r => r.locId === loc.id);
    if (success && (!rec || score > rec.score)) {
      const nr = { locId: loc.id, name: loc.name, score: Math.round(score), rank, days: run.day, date: new Date().toISOString().slice(0, 10) };
      if (rec) Object.assign(rec, nr); else this.meta.records.push(nr);
    }
    this.saveMeta();
    return result;
  },

  checkAchievements(success, rank) {
    const unlocked = [];
    const grant = id => {
      if (this.meta.ach.indexOf(id) >= 0) return;
      const a = ACHIEVEMENTS.find(x => x.id === id);
      if (!a) return;
      this.meta.ach.push(id);
      unlocked.push(a);
      App.toast('成就解锁', a.name, 'good');
    };
    if (success) {
      grant('first_blood');
      if (this.loc.level === 5) grant('hard_route');
      if (rank === 'S') grant('s_rank');
      if (this.run.hp < 10) grant('close_call');
      if (!this.hasGear('satphone')) grant('no_satphone');
      if ((this.loc.id === 'changbai' || this.loc.id === 'meili') && this.run.stormDays > 0) grant('winter_survivor');
      const uniqueWins = this.meta.records.filter(r => r.locId !== this.loc.id).length + 1;
      if (uniqueWins >= 3) grant('three_routes');
      if (uniqueWins >= LOCATIONS.length) grant('all_routes');
      if (this.run.day < this.loc.route.length) grant('speedrun');
    }
    if (this.eggCount() >= 8) grant('egg_hunter');
    if (this.eggCount() >= 16) grant('egg_master');
    if (this.loc.id === 'kunlun') grant('secret_found');
    this.saveMeta();
    return unlocked;
  },

  /* ---------- 档案 ---------- */
  resetMeta() {
    this.meta = { eggs: [], ach: [], records: [], runs: 0, deaths: 0 };
    this.saveMeta();
  }
};

Engine.loadMeta();
