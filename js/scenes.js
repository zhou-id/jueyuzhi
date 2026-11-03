/* =========================================================
   荒野禁区 · 场景绘制（纯 SVG，无外部图片）
   ========================================================= */

const Scene = (function () {
  let uid = 0;

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h) % 2147483647;
  }
  function rng(seed) {
    let s = seed || 1;
    return function () { s = (s * 16807) % 2147483647; return s / 2147483647; };
  }
  function round(n) { return Math.round(n * 10) / 10; }

  function sky(id, top, bottom) {
    return `<linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
    </linearGradient>`;
  }

  function sun(x, y, r, color, opacity) {
    return `<g opacity="${opacity}">
      <circle cx="${x}" cy="${y}" r="${r * 3}" fill="${color}" opacity=".07"/>
      <circle cx="${x}" cy="${y}" r="${r * 1.8}" fill="${color}" opacity=".12"/>
      <circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity=".9"/>
    </g>`;
  }

  function stars(rnd, count, yMax) {
    let s = '';
    for (let i = 0; i < count; i++) {
      s += `<circle cx="${round(rnd() * 800)}" cy="${round(rnd() * (yMax || 260))}" r="${round(.4 + rnd() * 1.1)}" fill="#e8e1cf" opacity="${round(.2 + rnd() * .6)}"/>`;
    }
    return s;
  }

  function ridge(rnd, baseY, amp, segs, color, opacity) {
    let pts = [[0, baseY + rnd() * 20]];
    for (let i = 1; i <= segs; i++) {
      const x = (800 / segs) * i;
      const y = baseY - rnd() * amp * (i % 2 === 0 ? 1 : .55) + rnd() * 8;
      pts.push([x, y]);
    }
    let d = 'M0 560 L0 ' + round(pts[0][1]);
    pts.forEach(p => { d += ' L' + round(p[0]) + ' ' + round(p[1]); });
    d += ' L800 560 Z';
    return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
  }

  function trees(rnd, baseY, count, color, opacity, height) {
    let s = '';
    for (let i = 0; i < count; i++) {
      const x = rnd() * 820 - 10;
      const h = height * (.5 + rnd() * .9);
      const w = h * .26;
      s += `<path d="M${round(x)} ${round(baseY)} L${round(x - w)} ${round(baseY)} L${round(x)} ${round(baseY - h)} L${round(x + w)} ${round(baseY)} Z" fill="${color}" opacity="${opacity}"/>`;
    }
    return s;
  }

  function mist(y, h, color) {
    return `<ellipse cx="400" cy="${y}" rx="520" ry="${h}" fill="${color}" opacity=".16"/>
      <ellipse cx="250" cy="${y + 20}" rx="330" ry="${h * .7}" fill="${color}" opacity=".12"/>
      <ellipse cx="600" cy="${y + 8}" rx="300" ry="${h * .8}" fill="${color}" opacity=".1"/>`;
  }

  const builders = {
    ridge(rnd, loc) {
      return `
        <rect width="800" height="560" fill="url(#sky${loc.uid})"/>
        ${stars(rnd, 26, 240)}
        ${sun(600, 110, 26, '#cfd8d2', .5)}
        ${ridge(rnd, 330, 150, 9, '#26322a', .9)}
        ${ridge(rnd, 400, 95, 11, '#121812', .96)}
        ${mist(418, 22, '#aebbb0')}
        <path d="M0 470 Q200 440 380 468 T800 452 L800 560 L0 560 Z" fill="#0a0e0a"/>
        <g transform="translate(650 508)">
          <ellipse cx="0" cy="12" rx="44" ry="9" fill="#050706" opacity=".6"/>
          <path d="M-32 8 L0 -25 L32 8 Z" fill="#0f140f"/>
          <path d="M0 -25 L32 8 L0 8 Z" fill="#1b231a"/>
          <path d="M-9 8 L0 -6 L9 8 Z" fill="#e8a35e" opacity=".75"/>
          <circle cx="0" cy="2" r="30" fill="#e29a52" opacity=".07"/>
        </g>`;
    },

    plateau(rnd, loc) {
      return `
        <rect width="800" height="560" fill="url(#sky${loc.uid})"/>
        ${stars(rnd, 18, 220)}
        ${sun(200, 130, 30, '#d9c9a4', .45)}
        ${ridge(rnd, 300, 70, 7, '#2c3430', .7)}
        <path d="M0 380 Q220 350 420 378 T800 362 L800 560 L0 560 Z" fill="#182019"/>
        <ellipse cx="470" cy="420" rx="190" ry="26" fill="#31464a" opacity=".55"/>
        <ellipse cx="470" cy="416" rx="140" ry="12" fill="#5b7c80" opacity=".28"/>
        <path d="M0 470 Q300 450 520 474 T800 456 L800 560 L0 560 Z" fill="#0d120d"/>
        <g fill="#080b08" opacity=".7">
          <path d="M180 438 l14 -4 l2 8 l-16 2 z"/><path d="M205 434 l10 2 l-2 7 l-9 -1 z"/>
          <path d="M640 444 l16 -5 l2 9 l-18 2 z"/>
        </g>
        ${mist(450, 24, '#c9d3c6')}`;
    },

    desert(rnd, loc) {
      let dunes = '';
      const ys = [360, 420, 470, 520];
      ys.forEach((y, i) => {
        const c = ['#42351f', '#332916', '#241d10', '#151108'][i];
        dunes += `<path d="M0 ${y} Q180 ${y - 36 + rnd() * 20} 360 ${y - 10} T800 ${y - 26} L800 560 L0 560 Z" fill="${c}"/>`;
      });
      return `
        <rect width="800" height="560" fill="url(#sky${loc.uid})"/>
        ${sun(590, 120, 34, '#f2d299', .75)}
        <path d="M0 300 Q200 270 400 292 T800 276 L800 340 L0 340 Z" fill="#5a4728" opacity=".28"/>
        ${dunes}
        <path d="M60 400 Q220 388 340 402" stroke="#8a6c3c" stroke-width="1" opacity=".35" fill="none"/>
        <path d="M470 470 Q580 456 700 472" stroke="#8a6c3c" stroke-width="1" opacity=".28" fill="none"/>
        <g fill="#1a1409" opacity=".65">
          <path d="M120 430 l2 -34 l4 0 l2 34 z"/><path d="M118 406 l8 -10 l8 10 z"/>
        </g>`;
    },

    forest(rnd, loc) {
      let layer1 = trees(rnd, 400, 22, '#1b241b', .8, 150);
      let layer2 = trees(rnd, 470, 18, '#121a12', .95, 120);
      let layer3 = trees(rnd, 540, 26, '#080c08', 1, 90);
      return `
        <rect width="800" height="560" fill="url(#sky${loc.uid})"/>
        ${mist(210, 40, '#c8d2c5')}
        <path d="M0 400 Q200 370 400 398 T800 382 L800 560 L0 560 Z" fill="#1a2219" opacity=".7"/>
        ${layer1}${layer2}${layer3}
        ${mist(360, 30, '#b9c7ba')}
        <path d="M160 560 Q200 470 240 560" stroke="#39493a" stroke-width="2" fill="none" opacity=".3"/>`;
    },

    gorge(rnd, loc) {
      return `
        <rect width="800" height="560" fill="url(#sky${loc.uid})"/>
        ${mist(220, 30, '#c6d2cd')}
        <path d="M0 0 L250 0 L210 560 L0 560 Z" fill="#1a2420"/>
        <path d="M800 0 L560 0 L600 560 L800 560 Z" fill="#151e1a"/>
        <path d="M250 0 L210 560 L300 560 L320 120 Z" fill="#26332c" opacity=".6"/>
        <path d="M560 0 L600 560 L520 560 L500 100 Z" fill="#1b2721" opacity=".7"/>
        <path d="M300 560 Q380 420 350 300 Q330 260 348 200 L380 200 Q360 300 386 420 L420 560 Z" fill="#4b6a66" opacity=".35"/>
        <path d="M350 200 L352 560" stroke="#8fb0aa" stroke-width="2" opacity=".3"/>
        <path d="M0 560 L280 560 L300 520 L500 520 L520 560 L800 560" fill="#080c0a"/>
        ${mist(420, 40, '#cfe0dc')}`;
    },

    caldera(rnd, loc) {
      return `
        <rect width="800" height="560" fill="url(#sky${loc.uid})"/>
        ${stars(rnd, 14, 200)}
        ${sun(160, 120, 28, '#c8d7dc', .35)}
        <path d="M0 320 Q150 250 300 310 Q400 350 500 300 Q650 240 800 320 L800 560 L0 560 Z" fill="#1c2426"/>
        <ellipse cx="400" cy="390" rx="230" ry="60" fill="#3c5b64" opacity=".65"/>
        <ellipse cx="400" cy="382" rx="190" ry="40" fill="#6d8f96" opacity=".3"/>
        <path d="M170 360 Q400 300 630 360" stroke="#a9bdc2" stroke-width="2" opacity=".25" fill="none"/>
        <g fill="#c9d7d9" opacity=".18">
          <ellipse cx="320" cy="360" rx="55" ry="14"/><ellipse cx="480" cy="350" rx="45" ry="12"/>
        </g>
        <path d="M0 470 Q300 450 520 472 T800 456 L800 560 L0 560 Z" fill="#101516"/>
        ${mist(410, 26, '#d6e2e4')}`;
    },

    glacier(rnd, loc) {
      return `
        <rect width="800" height="560" fill="url(#sky${loc.uid})"/>
        ${stars(rnd, 12, 200)}
        ${sun(640, 100, 24, '#dbe6e8', .4)}
        ${ridge(rnd, 300, 160, 8, '#202a30', .9)}
        <path d="M0 390 Q200 330 360 380 Q520 420 800 360 L800 560 L0 560 Z" fill="#1a2226"/>
        <path d="M300 560 Q360 460 330 390 Q320 360 350 340 L390 340 Q370 400 400 470 L430 560 Z" fill="#93adb4" opacity=".28"/>
        <path d="M250 470 L540 470" stroke="#d6e4e6" stroke-width="1" opacity=".2"/>
        <g stroke="#b7c9cd" stroke-width="1" opacity=".35">
          <path d="M560 340 L620 300 M570 360 L630 320 M580 380 L640 340"/>
        </g>
        ${mist(400, 30, '#d4e2e4')}`;
    },

    karst(rnd, loc) {
      return `
        <rect width="800" height="560" fill="url(#sky${loc.uid})"/>
        ${mist(230, 45, '#cbd4c6')}
        <g fill="#1c251d" opacity=".85">
          <path d="M40 560 L70 280 Q90 250 110 300 L140 560 Z"/>
          <path d="M680 560 L700 250 Q720 220 745 280 L780 560 Z"/>
        </g>
        <g fill="#263328" opacity=".7">
          <path d="M180 560 L210 360 Q225 340 240 370 L270 560 Z"/>
          <path d="M540 560 L565 330 Q580 310 595 340 L620 560 Z"/>
        </g>
        <path d="M0 470 Q200 440 400 468 T800 450 L800 560 L0 560 Z" fill="#0c110c"/>
        ${trees(rnd, 500, 20, '#060906', 1, 130)}
        ${mist(390, 34, '#c4d0c2')}`;
    }
  };

  function render(loc, opts) {
    opts = opts || {};
    uid += 1;
    const id = uid;
    const rnd = rng(hash(loc.id + (opts.variant || '')));
    const cache = Object.assign({}, loc, { uid: id });

    let skyTop = '#0a1014', skyBottom = '#1c2622';
    if (loc.scene === 'desert') { skyTop = '#2b2416'; skyBottom = '#8a6c3e'; }
    else if (loc.scene === 'forest') { skyTop = '#111a14'; skyBottom = '#34402f'; }
    else if (loc.scene === 'gorge') { skyTop = '#101a18'; skyBottom = '#2e3f38'; }
    else if (loc.scene === 'caldera') { skyTop = '#0b1114'; skyBottom = '#2b3a40'; }
    else if (loc.scene === 'glacier') { skyTop = '#101820'; skyBottom = '#3b4d55'; }
    else if (loc.scene === 'karst') { skyTop = '#121a13'; skyBottom = '#384334'; }
    else if (loc.scene === 'plateau') { skyTop = '#0e1416'; skyBottom = '#37433c'; }
    else { skyTop = '#0a0e11'; skyBottom = '#283430'; }

    const defs = `<defs>${sky(id, skyTop, skyBottom)}
      <linearGradient id="fade${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#050706" stop-opacity="0"/>
        <stop offset="1" stop-color="#050706" stop-opacity=".92"/>
      </linearGradient></defs>`;

    const builder = builders[loc.scene] || builders.ridge;
    const body = builder(rnd, cache);

    return `<svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      ${defs}${body}
      <rect width="800" height="560" fill="url(#fade${id})" opacity="${opts.fade === false ? 0 : .55}"/>
    </svg>`;
  }

  return { render: render };
})();
