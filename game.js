'use strict';
(() => {
  const R = window.MoleRules;
  const $ = id => document.getElementById(id);
  const moleArt = `<svg class="mole" viewBox="0 0 100 102" aria-hidden="true"><ellipse cx="50" cy="95" rx="40" ry="10" fill="#524432"/><circle cx="18" cy="31" r="12" fill="#997453"/><circle cx="82" cy="31" r="12" fill="#997453"/><circle cx="18" cy="31" r="7" fill="#d4aa86"/><circle cx="82" cy="31" r="7" fill="#d4aa86"/><path d="M12 100V52C12 0 88 0 88 52V100Z" fill="#aa815a"/><path d="M27 100V64C27 41 73 41 73 64V100Z" fill="#d8b18a"/><ellipse cx="32" cy="46" rx="4" ry="5" fill="#302d27"/><ellipse cx="68" cy="46" rx="4" ry="5" fill="#302d27"/><circle cx="33" cy="44" r="1.2" fill="white"/><circle cx="69" cy="44" r="1.2" fill="white"/><ellipse cx="22" cy="57" rx="7" ry="4" fill="#cc9274"/><ellipse cx="78" cy="57" rx="7" ry="4" fill="#cc9274"/><ellipse cx="50" cy="57" rx="9" ry="6" fill="#594031"/><path d="M50 62v6m-8 0q8 9 16 0" fill="none" stroke="#594031" stroke-width="2" stroke-linecap="round"/><path d="M46 70h8v8h-8z" fill="#fff6de"/><ellipse cx="17" cy="91" rx="14" ry="8" fill="#bc936c"/><ellipse cx="83" cy="91" rx="14" ry="8" fill="#bc936c"/><path d="M41 14q8-9 14 0" fill="none" stroke="#836244" stroke-width="3" stroke-linecap="round"/></svg>`;
  const holes = Array.from({ length: R.holes }, (_, i) => {
    const button = document.createElement('button');
    button.className = 'hole';
    button.setAttribute('aria-label', `${i + 1}번 구멍`);
    button.innerHTML = `<span class="pit"></span><span class="clip">${moleArt}</span><span class="key">${i + 1}</span>`;
    button.addEventListener('pointerdown', event => { event.preventDefault(); hit(i); });
    button.addEventListener('click', event => { if (event.detail === 0) hit(i); });
    $('field').append(button);
    return { button, active: false, expires: 0, hitUntil: 0 };
  });
  $('miss-dots').innerHTML = '<i></i>'.repeat(R.maxMisses);
  let level = 1, caught = 0, misses = 0, state = 'ready', deadline = 0, nextSpawn = 0;
  let pausedAt = 0, remaining = 60000, best = 1, sound = false, audio;
  try { best = Math.max(1, Number(localStorage.getItem('mole-garden-best')) || 1); } catch {}
  function beep(win) {
    if (!sound) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      audio.resume();
      const o = audio.createOscillator(), g = audio.createGain();
      o.connect(g); g.connect(audio.destination); o.type = 'sine';
      o.frequency.setValueAtTime(win ? 660 : 190, audio.currentTime);
      o.frequency.exponentialRampToValueAtTime(win ? 990 : 90, audio.currentTime + .09);
      g.gain.setValueAtTime(.08, audio.currentTime); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .12);
      o.start(); o.stop(audio.currentTime + .13);
    } catch {}
  }
  function render() {
    $('level').textContent = String(level).padStart(2, '0');
    $('difficulty').textContent = level < 4 ? '느긋한 산책' : level < 8 ? '바빠진 정원' : '번개 같은 손끝';
    $('caught').textContent = caught; $('target').textContent = R.target(level);
    $('misses').textContent = misses; $('time').textContent = Math.max(0, Math.ceil(remaining / 1000));
    $('goal-bar').style.width = `${Math.min(100, caught / R.target(level) * 100)}%`;
    $('time-bar').style.width = `${Math.max(0, remaining / 600)}%`;
    $('time-bar').style.background = remaining < 10000 ? '#d8896d' : '#93ac6c';
    Array.from($('miss-dots').children).forEach((dot, i) => dot.classList.toggle('used', i < misses));
    $('best').innerHTML = `${String(best).padStart(2, '0')} <small>LEVEL</small>`;
  }
  function clearHoles() { holes.forEach(h => { h.active = false; h.hitUntil = 0; h.button.classList.remove('up', 'hit'); h.button.querySelectorAll('.pop').forEach(p => p.remove()); }); }
  function show(label, title, copy, button, foot = '마우스 클릭 · 화면 터치 · 숫자키 1–7') {
    $('card-label').textContent = label; $('card-title').textContent = title;
    $('card-copy').textContent = copy; $('start').innerHTML = `${button} <span>↗</span>`;
    $('card-foot').textContent = foot; $('overlay').hidden = false;
  }
  function startLevel() {
    clearHoles(); caught = 0; remaining = R.levelSeconds * 1000;
    const now = performance.now(); deadline = now + remaining; nextSpawn = now + 250;
    state = 'playing'; $('overlay').hidden = true; $('pause').disabled = false; $('pause').textContent = '일시정지 Ⅱ';
    $('status').textContent = `레벨 ${level} · ${R.target(level)}마리를 잡아주세요`; render();
  }
  function finish(reason) {
    state = 'over'; clearHoles(); $('pause').disabled = true; $('status').textContent = '오늘도 정원을 지켜주셨네요';
    $('card-icon').textContent = '✿';
    show('NICE LITTLE BREAK', '수고했어요, 정원사님!', `${reason} 도달 레벨 ${level}, 이번 레벨 ${caught}/${R.target(level)}마리, 놓친 두더지 ${misses}/20회.`, '다시 도전하기'); render();
  }
  function hit(i) {
    if (state !== 'playing') return;
    const now = performance.now();
    if (now >= deadline) { remaining = 0; finish('시간이 다 되었어요.'); return; }
    expire(now); if (state !== 'playing') return;
    const h = holes[i]; if (!h.active) return;
    h.active = false; h.hitUntil = now + 230; h.button.classList.remove('up'); h.button.classList.add('hit');
    const pop = document.createElement('span'); pop.className = 'pop'; pop.textContent = '+1'; h.button.append(pop); setTimeout(() => pop.remove(), 500);
    caught++; beep(true);
    if (caught >= R.target(level)) {
      state = 'between'; clearHoles(); $('pause').disabled = true; level++;
      if (level > best) { best = level; try { localStorage.setItem('mole-garden-best', best); } catch {} }
      $('card-icon').textContent = '✦';
      show('LEVEL COMPLETE!', `레벨 ${level - 1} 성공!`, `다음 목표는 ${R.target(level)}마리. 두더지가 조금 더 빨라져요. 남은 실패 기회는 ${R.maxMisses - misses}회예요.`, `레벨 ${level} 시작`, '다음 레벨도 60초 · 실패 횟수는 누적됩니다');
      $('status').textContent = '다음 레벨을 준비하세요';
    }
    render();
  }
  function expire(now) {
    for (const h of holes) {
      if (h.active && now >= h.expires) {
        h.active = false; h.button.classList.remove('up'); misses++; beep(false);
        if (misses >= R.maxMisses) { finish('두더지를 20번 놓쳤어요.'); return; }
      }
      if (h.hitUntil && now >= h.hitUntil) { h.hitUntil = 0; h.button.classList.remove('hit'); }
    }
  }
  function tick(now) {
    if (state === 'playing') {
      remaining = Math.max(0, deadline - now);
      if (remaining === 0) finish('시간이 다 되었어요.');
      else {
        expire(now);
        if (state === 'playing' && now >= nextSpawn) {
          const available = holes.filter(h => !h.active && !h.hitUntil);
          if (available.length) {
            const h = available[Math.floor(Math.random() * available.length)];
            h.active = true; h.expires = now + R.hideMs(level); h.button.classList.add('up');
          }
          nextSpawn = now + R.spawnMs(level);
        }
        render();
      }
    }
    requestAnimationFrame(tick);
  }
  function pause() {
    if (state !== 'playing') return;
    pausedAt = performance.now(); remaining = Math.max(0, deadline - pausedAt); state = 'paused';
    $('pause').disabled = true; $('card-icon').textContent = 'Ⅱ';
    show('TAKE A BREATH', '잠깐 쉬어가요', '두더지도 잠시 쉬고 있어요. 준비되면 이어서 잡아주세요.', '이어서 하기', '쉬는 동안 시간과 실패 횟수는 멈춰요'); render();
  }
  $('start').addEventListener('click', () => {
    if (state === 'paused') {
      const delta = performance.now() - pausedAt; deadline += delta; nextSpawn += delta;
      holes.forEach(h => { if (h.active) h.expires += delta; if (h.hitUntil) h.hitUntil += delta; });
      state = 'playing'; $('overlay').hidden = true; $('pause').disabled = false;
    } else { if (state !== 'between') { level = 1; misses = 0; } startLevel(); }
  });
  $('pause').addEventListener('click', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  document.addEventListener('keydown', event => {
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    if (/^[1-7]$/.test(event.key)) { event.preventDefault(); hit(Number(event.key) - 1); }
    if (event.code === 'Escape') pause();
  });
  $('sound').addEventListener('click', () => { sound = !sound; $('sound').textContent = `소리 ${sound ? 'ON' : 'OFF'}`; $('sound').setAttribute('aria-pressed', sound); $('sound').setAttribute('aria-label', sound ? '효과음 끄기' : '효과음 켜기'); beep(true); });
  render(); requestAnimationFrame(tick);
})();
