(function () {
  // ---- Event settings ----
  var EVENT_DATE = '2026-11-15T10:30:00+05:30'; // IST
  var TZ = 'Asia/Kolkata';
  var PETALS = true;

  var d = new Date(EVENT_DATE);
  var $ = function (id) { return document.getElementById(id); };

  // ---- Date / time labels ----
  var fmt = function (o) { return d.toLocaleDateString('en-IN', Object.assign({ timeZone: TZ }, o)); };
  $('date-label').textContent = fmt({ weekday: 'long', day: 'numeric', month: 'long' });
  $('short-day').textContent = fmt({ weekday: 'long' }) + ',\n' + fmt({ day: 'numeric', month: 'long' });
  $('time-label').textContent = d.toLocaleTimeString('en-IN', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();

  // ---- Countdown ----
  var pad = function (n) { return String(n).padStart(2, '0'); };
  function tick() {
    var diff = Math.max(0, d.getTime() - Date.now());
    $('cd-days').textContent = String(Math.floor(diff / 86400000));
    $('cd-hours').textContent = pad(Math.floor(diff / 3600000) % 24);
    $('cd-mins').textContent = pad(Math.floor(diff / 60000) % 60);
    $('cd-secs').textContent = pad(Math.floor(diff / 1000) % 60);
  }
  tick();
  setInterval(tick, 1000);

  // ---- Falling petals (seeded so layout is stable) ----
  var seed = 7;
  var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  var grads = ['petalRose', 'petalBlush', 'petalPale', 'petalBlush'];
  function make(tier) {
    var far = tier === 'far', big = tier === 'big';
    var w = far ? 7 + rnd() * 4 : big ? 24 + rnd() * 6 : 12 + rnd() * 7;
    var dur = far ? 16 + rnd() * 6 : big ? 7 + rnd() * 2 : 10 + rnd() * 4;
    return {
      x: (rnd() * 96).toFixed(1), w: Math.round(w), h: Math.round(w * 1.2),
      dur: dur.toFixed(1), delay: (-rnd() * dur).toFixed(1),
      sway: (2.2 + rnd() * 2.4).toFixed(1), swayDelay: (-rnd() * 3).toFixed(1),
      flut: (1.6 + rnd() * 1.8).toFixed(1), spin: (2.4 + rnd() * 3.5).toFixed(1),
      blur: far ? '0.8' : big ? '1.6' : '0', o: far ? '0.55' : big ? '0.8' : '0.95',
      g: grads[Math.floor(rnd() * grads.length)]
    };
  }
  function petalHTML(p) {
    return '<div class="petal-y" style="left:' + p.x + '%;animation-duration:' + p.dur + 's;animation-delay:' + p.delay + 's">' +
      '<div class="petal-x" style="animation-duration:' + p.sway + 's;animation-delay:' + p.swayDelay + 's">' +
      '<div class="petal-z" style="animation-duration:' + p.flut + 's">' +
      '<svg class="petal-3d" viewBox="0 0 30 36" style="width:' + p.w + 'px;height:' + p.h + 'px;animation-duration:' + p.spin + 's;filter:blur(' + p.blur + 'px);opacity:' + p.o + '">' +
      '<path d="M15 35 C5 31 0 20 2.5 10.5 C4.5 3 10.5 0.5 15 4.5 C19.5 0.5 25.5 3 27.5 10.5 C30 20 25 31 15 35 Z" fill="url(#' + p.g + ')"></path>' +
      '<path d="M15 33 C14 24 14.5 14 15 6" stroke="rgba(255,255,255,.35)" stroke-width=".7" fill="none"></path>' +
      '</svg></div></div></div>';
  }
  if (PETALS && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var back = '', front = '', i;
    for (i = 0; i < 12; i++) back += petalHTML(make('far'));
    for (i = 0; i < 10; i++) front += petalHTML(make('mid'));
    for (i = 0; i < 2; i++) front += petalHTML(make('big'));
    $('petals-back').innerHTML = back;
    $('petals-front').innerHTML = front;
  }

  // ---- Scale the 390x844 card to fit any screen ----
  var vp = $('viewport');
  function fit() {
    var s = Math.min(window.innerWidth / 390, window.innerHeight / 844);
    if (window.innerWidth > 700) s = Math.min(s, 1.25);
    vp.style.transform = 'scale(' + s + ')';
    vp.style.width = '390px';
    vp.style.height = '844px';
    vp.style.marginBottom = (844 * s - 844) + 'px';
    document.body.style.minHeight = (844 * s) + 'px';
  }
  fit();
  window.addEventListener('resize', fit);
})();
