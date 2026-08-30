/** Ã¡ÂºÂ¢nh gÃ¡Â»â€˜c Ã„â€˜Ã¡Â»Æ’ dÃƒÂ¡n quanh thÃƒ nh bÃƒÂ¡nh 3D */
let MEMORY_IMAGE_SRCS = [
  "./image/hinh1.jpg",
  "./image/hinh2.jpg",
  "./image/hinh3.jpg",
  "./image/hinh4.jpg",
  "./image/hinh5.jpg",
  "./image/hinh6.jpg",
  "./image/hinh7.jpg",
  "./image/hinh8.jpg",
  "./image/hinh9.jpg",
  "./image/hinh10.jpg",
  "./image/hinh11.jpg",
  "./image/hinh12.jpg",
  "./image/hinh13.jpg",
];

/**
 * DÃ¡Â»Â±ng bÃƒÂ¡nh sinh nhÃ¡ÂºÂ­t 3D (Three.js) 2 tÃ¡ÂºÂ§ng.
 * - TÃ¡ÂºÂ§ng dÃ†Â°Ã¡Â»â€ºi lÃ¡Â»â€ºn hÃ†Â¡n tÃ¡ÂºÂ§ng trÃƒÂªn
 * - MÃ¡Â»â€”i tÃ¡ÂºÂ§ng xoay quanh trÃ¡Â»Â¥c Y
 * - Ã¡ÂºÂ¢nh quanh thÃƒ nh + Ã¡ÂºÂ£nh trÃƒÂ²n trÃƒÂªn mÃ¡Â»â€”i tÃ¡ÂºÂ§ng + Ã¡ÂºÂ£nh trÃƒÂ²n Ã„â€˜ÃƒÂ¡y tÃ¡ÂºÂ§ng dÃ†Â°Ã¡Â»â€ºi + nÃ¡ÂºÂ¿n (trÃ¡Â»Â¥ Ã¡ÂºÂ£nh + ngÃ¡Â»Ân lÃ¡Â»Â­a) trÃƒÂªn Ã„â€˜Ã¡Â»â€°nh
 * - HiÃ¡Â»Æ’n thÃ¡Â»â€¹ khi mÃ¡Â»Å¸ hÃ¡Â»â„¢p quÃƒ  lÃ¡ÂºÂ§n Ã„â€˜Ã¡ÂºÂ§u (revealMemoryZoneOnGiftOpen), khÃƒÂ´ng Ã„â€˜Ã¡Â»Â£i nÃƒÂºt TiÃ¡ÂºÂ¿p tÃ¡Â»Â¥c thÃ†Â°
 * - ThÃ¡Â»â€¢i nÃ¡ÂºÂ¿n Ã¢â€ â€™ nhÃ¡ÂºÂ¯c cÃ¡ÂºÂ¯t. 3 nhÃƒÂ¡t Ã¢â€ â€™ bÃƒÂ¡nh tÃƒÂ¡ch Ã¢â€ â€™ memory:cake-cuts-complete Ã¢â€ â€™ mÃ¡Â»Å¸ thÃ†Â° trÃ†Â°Ã¡Â»â€ºc Ã¢â€ â€™ TiÃ¡ÂºÂ¿p tÃ¡Â»Â¥c Ã¢â€ â€™ tim Ã¡ÂºÂ£nh Ã¢â€ â€™ chÃ¡ÂºÂ¡m tim mÃ¡Â»Å¸ thÃ†Â° lÃ¡ÂºÂ§n 2
 */
function populateMemoryZone() {
  /* NÃ¡ÂºÂ¿u Ã„â€˜ang Ã¡Â»Å¸ chÃ¡ÂºÂ¿ Ã„â€˜Ã¡Â»â„¢ preview thÃƒÂ¬ chÃ¡Â»Â boot xong trÃ†Â°Ã¡Â»â€ºc rÃ¡Â»â€œi mÃ¡Â»â€ºi dÃ¡Â»Â±ng bÃƒÂ¡nh */
  if (window.__PREVIEW_READY__) {
    window.__PREVIEW_READY__.then(function (pd) {
      if (pd && pd.photoBlobUrls && pd.photoBlobUrls.length > 0) {
        MEMORY_IMAGE_SRCS = pd.photoBlobUrls;
      }
      _doPopulateMemoryZone();
    });
    return;
  }
  _doPopulateMemoryZone();
}

function _doPopulateMemoryZone() {
  const zone = document.getElementById("memory-zone");
  const stage = document.getElementById("memory-cake-stage");
  const blowBtn = document.getElementById("memory-blow-candle-btn");
  const blowSlot = document.getElementById("memory-blow-slot");
  const cutReminder = document.getElementById("memory-cake-cut-reminder");
  const THREE = window.THREE;
  if (!zone || !stage || !THREE) return;

  if (stage.__memoryCleanup) {
    stage.__memoryCleanup();
    stage.__memoryCleanup = null;
  }

  stage.innerHTML = "";

  const vw = stage.clientWidth || window.innerWidth || 800;
  const vh = stage.clientHeight || window.innerHeight || 600;
  const IS_MOBILE_PORTRAIT = vh > vw && vw <= 920;
  const IS_TOUCH_DEVICE =
    ("ontouchstart" in window) || ((navigator && navigator.maxTouchPoints) || 0) > 0;
  const IS_MOBILE_OR_TABLET = IS_TOUCH_DEVICE && Math.min(vw, vh) <= 1024;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(vw, vh);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1.0;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  let candleBlown = false;
  let blowStartTime = -1;       /* timestamp lÃƒÂºc bÃ¡ÂºÂ¯t Ã„â€˜Ã¡ÂºÂ§u thÃ¡Â»â€¢i, dÃƒÂ¹ng cho anim tÃ¡ÂºÂ¯t nÃ¡ÂºÂ¿n */
  const BLOW_ANIM_MS = 1100;    /* tÃ¡Â»â€¢ng thÃ¡Â»Âi gian hiÃ¡Â»â€¡u Ã¡Â»Â©ng tÃ¡ÂºÂ¯t nÃ¡ÂºÂ¿n (ms) */

  const SLASH_MIN_PATH_LEN = 92;
  const SLASH_LOCK_PATH_LEN = 28;
  const SLASH_LOCK_SEG_VEL = 0.28;
  const SLASHES_FOR_LETTER = 3;

  let slashUiReadyTimer = 0;
  let slashUiReady = false;
  let slashLetterDone = false;
  let slashUiCleanup = null;
  let slashRaf = 0;

  ["#memory-cake-cut-ui", "#memory-cake-slash-ui"].forEach(function (sel) {
    const el = zone.querySelector(sel);
    if (el) el.remove();
  });

  const slashUi = document.createElement("div");
  slashUi.id = "memory-cake-slash-ui";
  slashUi.className = "memory-cake-slash-ui";
  slashUi.setAttribute("aria-hidden", "true");
  slashUi.innerHTML =
    '<canvas class="memory-cake-slash-canvas" id="memory-cake-slash-canvas" aria-hidden="true"></canvas>';
  zone.appendChild(slashUi);
  const slashCanvas = slashUi.querySelector("#memory-cake-slash-canvas");
  const slashCtx = slashCanvas ? slashCanvas.getContext("2d") : null;

  let slashStrokePts = [];
  let slashLastMoveT = 0;
  let slashGestureStartYaw = 0;
  let slashGestureStartPitch = 0;
  let slashPathLen = 0;
  let slashMaxSegVel = 0;
  let slashLocksRotation = false;
  let slashCommittedPaths = [];
  let slashCountValid = 0;

  function clientToStageLocal(clientX, clientY) {
    const r = stage.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  }

  function downsampleSlashPoints(pts) {
    if (pts.length <= 72) return pts.slice();
    const step = Math.ceil(pts.length / 72);
    const out = [];
    for (let i = 0; i < pts.length; i += step) out.push(pts[i]);
    if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
    return out;
  }

  function resizeSlashCanvas() {
    if (!slashCanvas || !slashCtx) return;
    const w = stage.clientWidth || window.innerWidth || 800;
    const h = stage.clientHeight || window.innerHeight || 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    slashCanvas.width = Math.floor(w * dpr);
    slashCanvas.height = Math.floor(h * dpr);
    slashCanvas.style.width = w + "px";
    slashCanvas.style.height = h + "px";
    slashCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redrawSlashCanvas();
  }

  function drawStrokeLine(ctx, pts, isLive) {
    if (!pts || pts.length < 2) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = isLive ? "rgba(255,255,255,0.85)" : "rgba(255,220,180,0.5)";
    ctx.shadowBlur = isLive ? 14 : 10;
    ctx.strokeStyle = isLive ? "rgba(255,255,255,0.95)" : "rgba(255,248,240,0.88)";
    ctx.lineWidth = isLive ? 5.2 : 4.2;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
    ctx.strokeStyle = isLive ? "rgba(255,215,120,0.9)" : "rgba(255,200,90,0.75)";
    ctx.lineWidth = isLive ? 2.1 : 1.7;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y);
    ctx.stroke();
    ctx.restore();
  }

  function redrawSlashCanvas() {
    if (!slashCtx || !slashCanvas) return;
    const w = stage.clientWidth || slashCanvas.width;
    const h = stage.clientHeight || slashCanvas.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    slashCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    slashCtx.clearRect(0, 0, w, h);
    for (let c = 0; c < slashCommittedPaths.length; c++) {
      drawStrokeLine(slashCtx, slashCommittedPaths[c].points, false);
    }
    if (slashStrokePts.length >= 2) {
      drawStrokeLine(slashCtx, slashStrokePts, true);
    }
  }

  function scheduleSlashRedraw() {
    if (slashRaf) return;
    slashRaf = requestAnimationFrame(function () {
      slashRaf = 0;
      redrawSlashCanvas();
    });
  }

  let blowBtnReady = false;
  let blowBtnDelayTimer = 0;
  function syncBlowButtonState() {
    if (!blowBtn) return;
    if (candleBlown) {
      blowBtn.style.display = "none";
      blowBtn.setAttribute("aria-hidden", "true");
      if (cutReminder) {
        cutReminder.hidden = false;
        cutReminder.setAttribute("aria-hidden", "false");
      }
      if (blowSlot) blowSlot.classList.add("memory-blow-slot--after-candle");
      return;
    }
    blowBtn.style.display = !blowBtnReady ? "none" : "";
    blowBtn.setAttribute("aria-hidden", !blowBtnReady ? "true" : "false");
    if (cutReminder) {
      cutReminder.hidden = true;
      cutReminder.setAttribute("aria-hidden", "true");
    }
    if (blowSlot) blowSlot.classList.remove("memory-blow-slot--after-candle");
  }
  function activateSlashMode() {
    if (slashLetterDone || slashUiReady) return;
    slashUiReady = true;
    slashCommittedPaths = [];
    slashCountValid = 0;
    slashUi.classList.add("memory-cake-slash-ui--ready");
    slashUi.setAttribute("aria-hidden", "false");
  }

  function onBlowButtonClick() {
    if (!blowBtnReady || candleBlown) return;
    candleBlown = true;
    blowStartTime = -1; /* flame vÃ¡ÂºÂ«n bÃƒÂ¬nh thÃ†Â°Ã¡Â»Âng Ã¢â‚¬â€ chÃ¡Â»Â giÃƒÂ³ Ã„â€˜Ã¡ÂºÂ¿n */
    syncBlowButtonState();

    /* HiÃ¡Â»â€¡u Ã¡Â»Â©ng cÃ†Â¡n giÃƒÂ³ Ã¢â‚¬â€ xong rÃ¡Â»â€œi mÃ¡Â»â€ºi bÃ¡ÂºÂ¯t Ã„â€˜Ã¡ÂºÂ§u anim tÃ¡ÂºÂ¯t nÃ¡ÂºÂ¿n */
    triggerWindEffect(function () {
      blowStartTime = performance.now();
    });

    window.dispatchEvent(
      new CustomEvent("memory:candle-blown", { detail: { phase: "blow" } })
    );
    activateSlashMode();
  }

  /*
   * VÃ¡ÂºÂ½ cÃƒÂ¡c vÃ¡Â»â€¡t giÃƒÂ³ xÃƒÂ¡m chÃƒÂ©o bay ngang qua stage.
   * onArrived() Ã„â€˜Ã†Â°Ã¡Â»Â£c gÃ¡Â»Âi khi giÃƒÂ³ chÃ¡ÂºÂ¡m Ã„â€˜Ã¡ÂºÂ¿n vÃƒÂ¹ng ngÃ¡Â»Ân nÃ¡ÂºÂ¿n (~60% thÃ¡Â»Âi gian).
   */
  function triggerWindEffect(onArrived) {
    /* DÃ¡Â»Ân overlay cÃ…Â© nÃ¡ÂºÂ¿u cÃƒÂ³ */
    var old = stage.querySelector('.cake-wind-overlay');
    if (old) old.remove();

    var overlay = document.createElement('div');
    overlay.className = 'cake-wind-overlay';

    /*
     * 6 vÃ¡Â»â€¡t giÃƒÂ³ vÃ¡Â»â€ºi vÃ¡Â»â€¹ trÃƒÂ­, kÃƒÂ­ch thÃ†Â°Ã¡Â»â€ºc, delay khÃƒÂ¡c nhau.
     * top: khoÃ¡ÂºÂ£ng giÃ¡Â»Â¯a mÃƒ n hÃƒÂ¬nh (nÃ†Â¡i ngÃ¡Â»Ân nÃ¡ÂºÂ¿n xuÃ¡ÂºÂ¥t hiÃ¡Â»â€¡n).
     */
    var streaks = [
      { top: 18, h: 4, w: 32, delay:   0, rot: -3, op: 0.60, dur: 520 },
      { top: 23, h: 3, w: 24, delay:  50, rot: -1, op: 0.45, dur: 490 },
      { top: 14, h: 2, w: 18, delay:  80, rot: -4, op: 0.35, dur: 540 },
      { top: 28, h: 3, w: 28, delay:  25, rot:  1, op: 0.50, dur: 505 },
      { top: 10, h: 2, w: 16, delay: 110, rot: -2, op: 0.28, dur: 560 },
      { top: 32, h: 2, w: 22, delay:  65, rot:  2, op: 0.38, dur: 480 },
    ];

    streaks.forEach(function (s) {
      var el = document.createElement('div');
      el.className = 'cake-wind-streak';
      el.style.cssText = [
        'top:'         + s.top + '%',
        'height:'      + s.h   + 'px',
        'width:'       + s.w   + '%',
        '--ws-rot:'    + s.rot + 'deg',
        '--ws-op:'     + s.op,
        '--ws-delay:'  + s.delay + 'ms',
        '--ws-dur:'    + s.dur + 'ms',
      ].join(';');
      overlay.appendChild(el);
    });

    stage.appendChild(overlay);

    /* GÃ¡Â»Âi callback khi giÃƒÂ³ Ã„â€˜Ã¡ÂºÂ¿n vÃƒÂ¹ng ngÃ¡Â»Ân nÃ¡ÂºÂ¿n (~300ms) */
    var arriveTimer = setTimeout(function () {
      if (onArrived) onArrived();
    }, 300);

    /* DÃ¡Â»Ân overlay sau khi animation kÃ¡ÂºÂ¿t thÃƒÂºc */
    setTimeout(function () {
      clearTimeout(arriveTimer);
      if (overlay.parentNode) overlay.remove();
    }, 750);
  }
  if (blowBtn) {
    blowBtn.addEventListener("click", onBlowButtonClick);
    blowBtnReady = false;
    syncBlowButtonState();
    blowBtnDelayTimer = window.setTimeout(function () {
      blowBtnDelayTimer = 0;
      blowBtnReady = true;
      syncBlowButtonState();
    }, 5000);
  }

  function tryAcceptSlashStroke() {
    if (slashLetterDone || !slashUiReady || !candleBlown) return;
    if (slashStrokePts.length < 5) return;
    const isSlashGesture = slashPathLen >= SLASH_MIN_PATH_LEN;
    if (!isSlashGesture || !strokeCrossesCake(slashStrokePts)) return;

    userDragYaw = slashGestureStartYaw;
    userDragPitch = slashGestureStartPitch;

    slashCommittedPaths.push({ points: downsampleSlashPoints(slashStrokePts) });
    slashCountValid++;
    slashStrokePts = [];
    slashPathLen = 0;
    slashMaxSegVel = 0;
    slashLocksRotation = false;
    redrawSlashCanvas();

    if (slashCountValid >= SLASHES_FOR_LETTER) {
      startCakeShatterSequence();
    }
  }

  slashUiCleanup = function () {
    if (shatterAnimId) { cancelAnimationFrame(shatterAnimId); shatterAnimId = 0; }
    shatterPieces.forEach(function (p) {
      scene.remove(p.group);
      p.group.traverse(function (obj) {
        if (!obj.isMesh) return;
        [].concat(obj.material).forEach(function (m) { if (m && m.dispose) m.dispose(); });
      });
    });
    shatterPieces = [];
    cakeShatterDone = false;
    cakeRoot.visible = true;
    renderer.localClippingEnabled = false;
    slashUiReady = false;
    slashLetterDone = false;
    slashCommittedPaths = [];
    slashCountValid = 0;
    if (zone) zone.classList.remove("memory-zone--faded");
    if (slashRaf) {
      cancelAnimationFrame(slashRaf);
      slashRaf = 0;
    }
    if (slashUiReadyTimer) {
      window.clearTimeout(slashUiReadyTimer);
      slashUiReadyTimer = 0;
    }
    window.removeEventListener("resize", onSlashResize);
    slashUi.classList.remove("memory-cake-slash-ui--ready", "memory-cake-slash-ui--done");
    const fly = zone.querySelector(".memory-cake-letter-fly");
    if (fly) fly.remove();
    if (slashUi.parentNode === zone) zone.removeChild(slashUi);
    if (blowBtn) {
      if (blowBtnDelayTimer) {
        window.clearTimeout(blowBtnDelayTimer);
        blowBtnDelayTimer = 0;
      }
      blowBtn.removeEventListener("click", onBlowButtonClick);
      blowBtn.disabled = false;
      blowBtn.style.display = "";
      blowBtn.setAttribute("aria-hidden", "false");
      blowBtn.textContent = "Ã°Å¸â€Â¥ ThÃ¡Â»â€¢i nÃ¡ÂºÂ¿n";
      blowBtnReady = false;
      if (cutReminder) {
        cutReminder.hidden = true;
        cutReminder.setAttribute("aria-hidden", "true");
      }
      if (blowSlot) {
        blowSlot.classList.remove(
          "memory-blow-slot--after-candle",
          "is-hidden-by-tilt"
        );
      }
    }
    slashUiCleanup = null;
  };

  function onSlashResize() {
    resizeSlashCanvas();
  }
  window.addEventListener("resize", onSlashResize);

  candleBlown = false;
  slashLetterDone = false;
  slashUiReady = false;
  window.__memoryCandleBlown = false;
  /* Canvas cÃ¡ÂºÂ¯t chÃ¡Â»â€° hiÃ¡Â»â€¡n SAU KHI thÃ¡Â»â€¢i nÃ¡ÂºÂ¿n Ã¢â‚¬â€ xem onBlowButtonClick */
  resizeSlashCanvas();
  const CAM_LOOK_Y = 2.6;
  const camera = new THREE.PerspectiveCamera(38, vw / vh, 0.1, 200);
  camera.position.set(0, 5.6, 15.8);
  camera.lookAt(0, CAM_LOOK_Y, 0);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x3c3240, 0.95);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 0.95);
  key.position.set(8, 12, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xfff1d8, 0.35);
  rim.position.set(-10, 4, -8);
  scene.add(rim);

  const cakeRoot = new THREE.Group();
  scene.add(cakeRoot);

  function createTier(radiusTop, radiusBottom, height, y) {
    const tierGroup = new THREE.Group();
    tierGroup.position.y = y;
    cakeRoot.add(tierGroup);

    return tierGroup;
  }

  const LOWER_TIER_H = 3.1;
  const UPPER_TIER_H = 2.35;
  const LOWER_TIER_Y = 1.65;
  const LOWER_TIER_RING_R = 5.18;
  const UPPER_TIER_RING_R = 3.5;
  const LOWER_RING_COUNT = 14;
  const UPPER_RING_COUNT = 10;
  /** arcFill >1 = hÃ†Â¡i chÃ¡Â»â€œng cung; 1.002/1.005 khÃƒÂ­t hÃ†Â¡n 0.998/1.001, vÃ¡ÂºÂ«n dÃ†Â°Ã¡Â»â€ºi mÃ¡Â»Â©c 1.02 tÃ¡Â»Â«ng Ã„â€˜ÃƒÂ¨ nhiÃ¡Â»Âu */
  const RING_PHOTO_ARC_FILL_LOWER = 1.002;
  const RING_PHOTO_ARC_FILL_UPPER = 1.005;

  function ringCardHeight(ringR, count, arcFill) {
    const circumference = 2 * Math.PI * ringR;
    const cardW = Math.max(1.1, (circumference / count) * arcFill);
    return cardW * 1.06;
  }

  const lowerRingCardH = ringCardHeight(
    LOWER_TIER_RING_R,
    LOWER_RING_COUNT,
    RING_PHOTO_ARC_FILL_LOWER
  );
  const upperRingCardH = ringCardHeight(
    UPPER_TIER_RING_R,
    UPPER_RING_COUNT,
    RING_PHOTO_ARC_FILL_UPPER
  );

  /**
   * TÃƒÂ¢m mÃ¡Â»â€”i tÃ¡ÂºÂ§ng = giÃ¡Â»Â¯a vÃƒÂ²ng Ã¡ÂºÂ£nh (cardH), Ã„â€˜Ã¡Â»Æ’ Ã„â€˜ÃƒÂ¡y Ã¡ÂºÂ£nh tÃ¡ÂºÂ§ng trÃƒÂªn khÃ¡Â»â€ºp Ã„â€˜Ã¡Â»â€°nh Ã¡ÂºÂ£nh tÃ¡ÂºÂ§ng dÃ†Â°Ã¡Â»â€ºi.
   */
  const UPPER_TIER_Y =
    LOWER_TIER_Y + lowerRingCardH * 0.5 + upperRingCardH * 0.5;
  let baseCakeRootY = 0;

  const lowerTier = createTier(4.8, 5.1, LOWER_TIER_H, LOWER_TIER_Y);
  const upperTier = createTier(3.25, 3.45, UPPER_TIER_H, UPPER_TIER_Y);
  const lowerTierSpin = new THREE.Group();
  const lowerTierTopStatic = new THREE.Group();
  lowerTier.add(lowerTierSpin);
  lowerTier.add(lowerTierTopStatic);

  const TOP_DISC_OVERHANG = 1.035;
  /** ChÃ¡Â»â€° Ã„â€˜Ã„Â©a Ã„â€˜Ã¡Â»â€°nh tÃ¡ÂºÂ§ng dÃ†Â°Ã¡Â»â€ºi Ã¢â‚¬â€ thu nhÃ¡Â»Â nhÃ¡ÂºÂ¹ so vÃ¡Â»â€ºi vÃƒÂ²ng Ã¡ÂºÂ£nh + overhang */
  const LOWER_TOP_DISC_SCALE = 0.978;
  /** Ã„ÂÃ„Â©a Ã¡ÂºÂ£nh mÃ¡ÂºÂ·t Ã„â€˜Ã¡Â»â€°nh tÃ¡ÂºÂ§ng trÃƒÂªn Ã¢â‚¬â€ thu nhÃ¡Â»Â nhÃ¡ÂºÂ¹ (nÃ¡ÂºÂ¿n vÃ¡ÂºÂ«n Ã„â€˜Ã¡ÂºÂ·t trÃƒÂªn Ã„â€˜Ã¡Â»â€°nh Ã„â€˜Ã„Â©a) */
  const UPPER_TOP_DISC_SCALE = 0.978;
  /** ChÃ¡Â»â€° Ã„â€˜Ã„Â©a Ã„â€˜ÃƒÂ¡y tÃ¡ÂºÂ§ng dÃ†Â°Ã¡Â»â€ºi Ã¢â‚¬â€ nhÃ¡Â»Â hÃ†Â¡n Ã„â€˜Ã¡Â»â€°nh cÃƒÂ¹ng tÃ¡ÂºÂ§ng mÃ¡Â»â„¢t chÃƒÂºt */
  const LOWER_BOTTOM_DISC_SCALE = 0.965;
  const LOWER_TOP_DISC_R =
    LOWER_TIER_RING_R * TOP_DISC_OVERHANG * LOWER_TOP_DISC_SCALE;
  const UPPER_TIER_FOOTPRINT_R = 3.45;
  /* KhÃƒÂ´ng inscription (null / rÃ¡Â»â€”ng) Ã¢â€ â€™ khÃƒÂ´ng vÃ¡ÂºÂ½ chÃ¡Â»Â¯ trÃƒÂªn vÃƒ nh; khÃƒÂ´ng dÃƒÂ¹ng text mÃ¡ÂºÂ«u */
  let LOWER_TOP_MESSAGE_LINES = [];
  const insRaw =
    window.__PREVIEW_DATA__ && window.__PREVIEW_DATA__.cakeInscription != null
      ? String(window.__PREVIEW_DATA__.cakeInscription).trim()
      : "";
  if (insRaw) {
    LOWER_TOP_MESSAGE_LINES = insRaw
      .split("\n")
      .map(function (s) { return s.trim(); })
      .filter(Boolean)
      .slice(0, 2);
  }

  /**
   * MÃ¡Â»â„¢t Ã¡ÂºÂ£nh trÃƒÂ²n trÃƒÂªn Ã„â€˜Ã¡Â»â€°nh vÃƒÂ²ng Ã¡ÂºÂ£nh (topLocalY = nÃ¡Â»Â­a chiÃ¡Â»Âu cao thÃ¡ÂºÂ» quanh thÃƒ nh).
   */
  function placeSinglePhotoOnTierTop(tierGroup, topLocalY, imageSrc, discRadius) {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    const topY = topLocalY + 0.02;

    const tex = loader.load(imageSrc);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;

    const geo = new THREE.CircleGeometry(discRadius, 80);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, topY, 0);
    tierGroup.add(mesh);
  }

  /**
   * MÃ¡Â»â„¢t Ã¡ÂºÂ£nh trÃƒÂ²n mÃ¡ÂºÂ·t Ã„â€˜ÃƒÂ¡y tÃ¡ÂºÂ§ng (Ã„â€˜Ã¡Â»â€˜i xÃ¡Â»Â©ng Ã„â€˜Ã¡Â»â€°nh), nhÃƒÂ¬n rÃƒÂµ tÃ¡Â»Â« phÃƒÂ­a dÃ†Â°Ã¡Â»â€ºi.
   * bottomLocalY = -nÃ¡Â»Â­a chiÃ¡Â»Âu cao vÃƒÂ²ng Ã¡ÂºÂ£nh quanh thÃƒ nh.
   */
  function placeSinglePhotoOnTierBottom(
    tierGroup,
    bottomLocalY,
    imageSrc,
    discRadius
  ) {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    const y = bottomLocalY - 0.02;

    const tex = loader.load(imageSrc);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;

    const geo = new THREE.CircleGeometry(discRadius, 80);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(0, y, 0);
    tierGroup.add(mesh);
  }

  function createTopArcTextGeometry(
    innerRadius,
    outerRadius,
    thetaStart,
    thetaLength,
    radialSegs,
    arcSegs,
    THREE
  ) {
    const positions = [];
    const uvs = [];
    const indices = [];

    for (let rStep = 0; rStep <= radialSegs; rStep++) {
      const v = rStep / radialSegs;
      const radius = innerRadius + (outerRadius - innerRadius) * v;
      for (let aStep = 0; aStep <= arcSegs; aStep++) {
        const u = aStep / arcSegs;
        const theta = thetaStart + thetaLength * u;
        positions.push(
          Math.cos(theta) * radius,
          0,
          Math.sin(theta) * radius
        );
        uvs.push(1 - u, 1 - v);
      }
    }

    for (let rStep = 0; rStep < radialSegs; rStep++) {
      for (let aStep = 0; aStep < arcSegs; aStep++) {
        const row = arcSegs + 1;
        const a = rStep * row + aStep;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geo.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(uvs, 2)
    );
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  /**
   * ChÃ¡Â»Â¯ "viÃ¡ÂºÂ¿t kem" trÃƒÂªn phÃ¡ÂºÂ§n vÃƒ nh lÃ¡Â»â„¢ ra cÃ¡Â»Â§a Ã„â€˜Ã¡Â»â€°nh tÃ¡ÂºÂ§ng dÃ†Â°Ã¡Â»â€ºi.
   * MÃ¡Â»â€”i dÃƒÂ²ng lÃƒ  mÃ¡Â»â„¢t dÃ¡ÂºÂ£i cung riÃƒÂªng Ã„â€˜Ã¡Â»Æ’ trÃƒÂ¡nh bÃ¡Â»â€¹ kÃƒÂ©o dÃƒÂ£n/mÃƒÂ©o khi map
   * mÃ¡Â»â„¢t canvas lÃ¡Â»â€ºn lÃƒÂªn cÃ¡ÂºÂ£ bÃ¡Â»Â rÃ¡Â»â„¢ng vÃƒ nh bÃƒÂ¡nh.
   */
  function placeLowerTierTopMessage(tierGroup, topLocalY, innerRadius, outerRadius, lines) {
    const drawLines = Array.isArray(lines) ? lines : [String(lines)];
    if (!drawLines.length) return;
    const ringBand = Math.max(outerRadius - innerRadius, 0.8);
    const usableInnerR = innerRadius + ringBand * 0.12;
    const usableOuterR = outerRadius - ringBand * 0.12;
    const usableBand = usableOuterR - usableInnerR;
    const lineCount = Math.max(1, drawLines.length);
    const lineBand = usableBand / lineCount;
    const thetaLength = Math.PI * 0.58;
    const thetaStart = Math.PI * 0.5 - thetaLength * 0.5;

    drawLines.forEach(function (line, idx) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const baseFontPx = IS_MOBILE_PORTRAIT ? 180 : 132;
      const minFontPx = IS_MOBILE_PORTRAIT ? 56 : 44;
      const padX = 140;
      const maxCanvasW = 4096;
      const minCanvasW = 1600;
      const canvasH = IS_MOBILE_OR_TABLET ? 300 : 220;
      const fontFamily = IS_MOBILE_OR_TABLET
        ? '"Satisfy", "Segoe Script", "Comic Sans MS", cursive'
        : '"Segoe Script", "Comic Sans MS", cursive';

      let fontPx = baseFontPx;
      function fontCss(px) {
        return "bold " + px + "px " + fontFamily;
      }
      function measureW() {
        ctx.font = fontCss(fontPx);
        return ctx.measureText(line).width;
      }
      let textW = measureW();
      while (textW + padX > maxCanvasW && fontPx > minFontPx) {
        fontPx -= 3;
        textW = measureW();
      }
      canvas.width = Math.min(maxCanvasW, Math.max(minCanvasW, Math.ceil(textW + padX)));
      canvas.height = canvasH;

      ctx.font = fontCss(fontPx);
      while (ctx.measureText(line).width + padX > canvas.width && fontPx > 28) {
        fontPx -= 2;
        ctx.font = fontCss(fontPx);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.font = fontCss(fontPx);

      const cx = canvas.width * 0.5;
      const t = fontPx / baseFontPx;
      const outerStrokeW = (IS_MOBILE_PORTRAIT ? 42 : 34) * t;
      const innerStrokeW = (IS_MOBILE_PORTRAIT ? 24 : 18) * t;
      const shadowBlur = (IS_MOBILE_PORTRAIT ? 22 : 18) * t;
      const metrics = ctx.measureText(line);
      const ascent = metrics.actualBoundingBoxAscent || fontPx * 0.76;
      const descent = metrics.actualBoundingBoxDescent || fontPx * 0.28;
      const verticalBleed = Math.max(8, outerStrokeW * 0.8 + shadowBlur * 0.45);
      /* Canh baseline theo glyph box thÃ¡Â»Â±c (ascent/descent), khÃƒÂ´ng nudge thÃƒÂªm.
         top clearance = bottom clearance = (canvas.height - ascent - descent) / 2
         Stroke/shadow bleed cÃ¡ÂºÂ§n nÃ¡ÂºÂ±m trong phÃ¡ÂºÂ§n clearance Ã„â€˜ÃƒÂ³ nÃƒÂªn canvasH Ã„â€˜ÃƒÂ£ Ã„â€˜Ã†Â°Ã¡Â»Â£c
         Ã„â€˜Ã¡Â»Æ’ Ã„â€˜Ã¡Â»Â§ rÃ¡Â»â„¢ng (300px mobile, 220px desktop). */
      const baselineY = (canvas.height - ascent - descent) * 0.5 + ascent;

      ctx.strokeStyle = "rgba(172, 69, 118, 0.98)";
      ctx.lineWidth = outerStrokeW;
      ctx.shadowColor = "rgba(140, 52, 95, 0.35)";
      ctx.shadowBlur = shadowBlur;
      ctx.strokeText(line, cx, baselineY);
      ctx.strokeStyle = "rgba(255, 248, 242, 1)";
      ctx.lineWidth = innerStrokeW;
      ctx.strokeText(line, cx, baselineY);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(210, 86, 140, 1)";
      ctx.fillText(line, cx, baselineY);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;

      const lineInnerR = usableInnerR + idx * lineBand + lineBand * 0.08;
      const lineOuterR = usableInnerR + (idx + 1) * lineBand - lineBand * 0.08;
      const geo = createTopArcTextGeometry(
        lineInnerR,
        Math.max(lineInnerR + 0.08, lineOuterR),
        thetaStart,
        thetaLength,
        3,
        120,
        THREE
      );
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.06,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, topLocalY + 0.06 + idx * 0.002, 0);
      mesh.renderOrder = 6 + idx;
      tierGroup.add(mesh);
    });
  }

  /**
   * NÃ¡ÂºÂ¿n trÃ¡Â»Â¥ nhÃ¡Â»Â: thÃƒÂ¢n CylinderGeometry bÃ¡Â»Âc texture Ã¡ÂºÂ£nh; nÃ¡ÂºÂ¯p trÃƒÂªn/dÃ†Â°Ã¡Â»â€ºi mÃƒ u kem.
   * NgÃ¡Â»Ân lÃ¡Â»Â­a: nhiÃ¡Â»Âu khÃ¡Â»â€˜i mÃ¡Â»Âm chÃ¡Â»â€œng lÃƒÂªn nhau, animate riÃƒÂªng (bÃ¡ÂºÂ­p bÃƒÂ¹ng, khÃƒÂ´ng cÃ¡Â»â€˜ Ã„â€˜Ã¡Â»â€¹nh hÃƒÂ¬nh nÃƒÂ³n).
   */
  function placeImageWrappedCandle(
    tierGroup,
    baseY,
    imageSrc,
    candleH,
    candleR
  ) {
    tierGroup.userData = tierGroup.userData || {};
    tierGroup.userData.candleFlames = [];
    tierGroup.userData.candleR = candleR;

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    const sideTex = loader.load(imageSrc);
    sideTex.colorSpace = THREE.SRGBColorSpace;
    sideTex.wrapS = THREE.RepeatWrapping;
    sideTex.wrapT = THREE.ClampToEdgeWrapping;
    sideTex.repeat.set(1, 1);

    const radialSeg = 28;
    const geo = new THREE.CylinderGeometry(
      candleR,
      candleR,
      candleH,
      radialSeg,
      1,
      false
    );

    const sideMat = new THREE.MeshBasicMaterial({
      map: sideTex,
      side: THREE.DoubleSide
    });
    const capMat = new THREE.MeshBasicMaterial({
      color: 0xfff5e8,
      side: THREE.DoubleSide
    });
    const candleMesh = new THREE.Mesh(geo, [sideMat, capMat, capMat]);
    candleMesh.position.set(0, baseY + candleH * 0.5, 0);
    tierGroup.add(candleMesh);

    const candleTopY = baseY + candleH;
    const br = candleR;
    const flameRoot = new THREE.Group();
    flameRoot.position.set(0, candleTopY + 0.01, 0);
    tierGroup.add(flameRoot);

    function addFlameBlob(color, baseOp, sx, sy, sz, ox, oy, oz, order) {
      const blobGeo = new THREE.IcosahedronGeometry(1, 1);
      const blobMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: baseOp,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(blobGeo, blobMat);
      mesh.position.set(ox, oy, oz);
      mesh.scale.set(sx * 0.5, sy * 0.5, sz * 0.5);
      mesh.renderOrder = order;
      mesh.userData.flame = {
        bx: ox,
        by: oy,
        bz: oz,
        sx: sx * 0.5,
        sy: sy * 0.5,
        sz: sz * 0.5,
        bop: baseOp,
        px: Math.random() * Math.PI * 2,
        py: Math.random() * Math.PI * 2,
        pz: Math.random() * Math.PI * 2,
        f1: 6.5 + Math.random() * 6,
        f2: 11 + Math.random() * 10,
        f3: 17 + Math.random() * 12,
        f4: 23 + Math.random() * 9,
        f5: 31 + Math.random() * 7
      };
      flameRoot.add(mesh);
      tierGroup.userData.candleFlames.push(mesh);
    }

    addFlameBlob(0xff2a00, 0.22, br * 2.2, br * 3.6, br * 2.0, 0, 0.1, 0, 0);
    addFlameBlob(0xff480f, 0.32, br * 1.15, br * 2.8, br * 1.05, br * 0.14, 0.09, br * 0.06, 1);
    addFlameBlob(0xff6518, 0.36, br * 1.0, br * 3.2, br * 0.92, -br * 0.12, 0.11, -br * 0.05, 2);
    addFlameBlob(0xff8530, 0.4, br * 0.78, br * 2.9, br * 0.72, br * 0.07, 0.13, br * 0.09, 3);
    addFlameBlob(0xffb04a, 0.44, br * 0.55, br * 2.2, br * 0.52, -br * 0.05, 0.15, br * 0.04, 4);
    addFlameBlob(0xffe8a8, 0.52, br * 0.34, br * 1.55, br * 0.32, 0, 0.17, 0, 5);
    addFlameBlob(0xfffcef, 0.38, br * 0.2, br * 1.05, br * 0.19, 0, 0.19, 0, 6);
  }

  const nImg = MEMORY_IMAGE_SRCS.length;
  /** CÃƒÂ¹ng mÃ¡Â»â„¢t Ã¡ÂºÂ£nh cho Ã„â€˜Ã¡Â»â€°nh tÃ¡ÂºÂ§ng dÃ†Â°Ã¡Â»â€ºi, Ã„â€˜ÃƒÂ¡y tÃ¡ÂºÂ§ng dÃ†Â°Ã¡Â»â€ºi vÃƒ  Ã„â€˜Ã¡Â»â€°nh tÃ¡ÂºÂ§ng trÃƒÂªn. */
  const discSharedSrc = nImg > 0 ? MEMORY_IMAGE_SRCS[0] : null;
  if (discSharedSrc) {
    placeSinglePhotoOnTierTop(
      lowerTierTopStatic,
      lowerRingCardH * 0.5,
      discSharedSrc,
      LOWER_TOP_DISC_R
    );
    placeSinglePhotoOnTierBottom(
      lowerTierSpin,
      -lowerRingCardH * 0.5,
      discSharedSrc,
      LOWER_TIER_RING_R * TOP_DISC_OVERHANG * LOWER_BOTTOM_DISC_SCALE
    );
    placeSinglePhotoOnTierTop(
      upperTier,
      upperRingCardH * 0.5,
      discSharedSrc,
      UPPER_TIER_RING_R * TOP_DISC_OVERHANG * UPPER_TOP_DISC_SCALE
    );
    if (LOWER_TOP_MESSAGE_LINES.length) {
      placeLowerTierTopMessage(
        lowerTierTopStatic,
        lowerRingCardH * 0.5,
        UPPER_TIER_FOOTPRINT_R + 0.04,
        LOWER_TOP_DISC_R,
        LOWER_TOP_MESSAGE_LINES
      );
    }
  }

  const upperDiscTopLocalY = upperRingCardH * 0.5 + 0.02;
  if (nImg > 0) {
    placeImageWrappedCandle(
      upperTier,
      upperDiscTopLocalY + 0.018,
      MEMORY_IMAGE_SRCS[Math.min(3, nImg - 1)],
      1.42,
      0.13
    );
  }

  /**
   * Ã¡ÂºÂ¢nh dÃƒÂ¡n trÃƒÂªn dÃ¡ÂºÂ£i mÃ¡ÂºÂ·t trÃ¡Â»Â¥ (cylinder) Ã¢â‚¬â€ cong theo chu vi thÃ¡ÂºÂ­t, khÃƒÂ´ng cÃƒÂ²n mÃ¡ÂºÂ·t phÃ¡ÂºÂ³ng gÃ¡ÂºÂ¥p khÃƒÂºc.
   * arcLen Ã¢â€°Ë† Ã„â€˜Ã¡Â»â„¢ dÃƒ i cung mÃ¡Â»â€”i tÃ¡ÂºÂ¥m; dTheta = arcLen/rr; trÃ¡Â»Â¥c Y trÃƒÂ¹ng trÃ¡Â»Â¥c tÃ¡ÂºÂ§ng.
   */
  function placePhotosAroundTier(tierGroup, radius, height, count, offset, arcFill) {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    const circumference = 2 * Math.PI * radius;
    const arcLen = Math.max(1.1, (circumference / count) * arcFill);
    const cardH = arcLen * 1.06;
    const rr = radius + 0.02;
    const segsAlongArc = Math.max(
      10,
      Math.min(28, Math.round(8 + arcLen * 2.2))
    );

    for (let i = 0; i < count; i++) {
      const photo = MEMORY_IMAGE_SRCS[Math.floor(Math.random() * MEMORY_IMAGE_SRCS.length)];
      const tex = loader.load(photo);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;

      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
      });

      const a = (Math.PI * 2 * i) / count + offset;
      const dTheta = arcLen / rr;
      const thetaStart = a - dTheta * 0.5;

      const geo = new THREE.CylinderGeometry(
        rr,
        rr,
        cardH,
        segsAlongArc,
        1,
        true,
        thetaStart,
        dTheta
      );
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = 0;
      tierGroup.add(mesh);
    }
  }

  placePhotosAroundTier(
    lowerTierSpin,
    LOWER_TIER_RING_R,
    LOWER_TIER_H,
    LOWER_RING_COUNT,
    0.08,
    RING_PHOTO_ARC_FILL_LOWER
  );
  placePhotosAroundTier(
    upperTier,
    UPPER_TIER_RING_R,
    UPPER_TIER_H,
    UPPER_RING_COUNT,
    0.21,
    RING_PHOTO_ARC_FILL_UPPER
  );

  /**
   * MÃƒ n dÃ¡Â»Âc: thu scale + dÃ¡Â»â€¹ch Y Ã„â€˜Ã¡Â»Æ’ tÃƒÂ¢m bÃƒÂ¡nh trÃƒÂ¹ng CAM_LOOK_Y (scale tÃ¡Â»Â« gÃ¡Â»â€˜c lÃƒ m lÃ¡Â»â€¡ch dÃ¡Â»Âc).
   * MÃƒ n ngang: scale 1, khÃƒÂ´ng offset.
   */
  function refreshStageViewport(w, h) {
    renderer.setSize(w, h);
    camera.aspect = w / h;
    const portrait = h > w;
    const ar = w / h;
    if (portrait) {
      const s = Math.max(0.42, Math.min(0.64, ar * 0.98));
      cakeRoot.scale.setScalar(s);
      const visualMidY = (LOWER_TIER_Y + UPPER_TIER_Y) * 0.5;
      baseCakeRootY = CAM_LOOK_Y - s * visualMidY;
    } else {
      const mobileLandscape = Math.min(w, h) <= 500;
      cakeRoot.scale.setScalar(mobileLandscape ? 0.68 : 0.85);
      baseCakeRootY = 0;
    }
    cakeRoot.position.y = baseCakeRootY;
    camera.updateProjectionMatrix();
  }

  refreshStageViewport(vw, vh);
  resizeSlashCanvas();

  /* NÃƒÂ©t cÃ¡ÂºÂ¯t: raycast vÃƒ o mesh bÃƒÂ¡nh (theo gÃƒÂ³c nhÃƒÂ¬n), khÃƒÂ´ng dÃƒÂ¹ng ellipse 2D Ã¢â‚¬â€ trÃƒÂ¡nh lÃ¡ÂºÂ­t bÃƒÂ¡nh rÃ¡Â»â€œi vÃ¡ÂºÂ«n Ã¢â‚¬Å“cÃ¡ÂºÂ¯tÃ¢â‚¬Â chÃ¡Â»â€” trÃ¡Â»â€˜ng. */
  const cakeSlashTargets = [];
  function refreshCakeSlashTargets() {
    cakeSlashTargets.length = 0;
    cakeRoot.traverse(function (obj) {
      if (!obj.isMesh || !obj.geometry) return;
      if (obj.userData && obj.userData.flame) return;
      cakeSlashTargets.push(obj);
    });
  }
  refreshCakeSlashTargets();

  const slashRaycaster = new THREE.Raycaster();
  const _slashNdc = new THREE.Vector2();

  function stageLocalToSlashNdc(p) {
    const w = stage.clientWidth || 1;
    const h = stage.clientHeight || 1;
    _slashNdc.set((p.x / w) * 2 - 1, -(p.y / h) * 2 + 1);
    return _slashNdc;
  }

  function strokeCrossesCake(pts) {
    if (!pts || pts.length < 2) return false;
    const w = stage.clientWidth || 1;
    const h = stage.clientHeight || 1;
    const minDim = Math.min(w, h);

    cakeRoot.updateWorldMatrix(true, true);
    const hits = new Array(pts.length);
    for (let i = 0; i < pts.length; i++) {
      slashRaycaster.setFromCamera(stageLocalToSlashNdc(pts[i]), camera);
      hits[i] = slashRaycaster.intersectObjects(cakeSlashTargets, false).length > 0;
    }

    let prev = hits[0];
    for (let j = 1; j < hits.length; j++) {
      if (hits[j] !== prev) return true;
      prev = hits[j];
    }
    let allHit = true;
    for (let k = 0; k < hits.length; k++) {
      if (!hits[k]) {
        allHit = false;
        break;
      }
    }
    if (!allHit) return false;

    const minSpan = minDim * 0.12;
    let maxSpan = 0;
    const n = pts.length;
    for (let a = 0; a < n && maxSpan < minSpan * 1.05; a++) {
      for (let b = a + 1; b < n; b++) {
        const d = Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y);
        if (d > maxSpan) maxSpan = d;
      }
    }
    return maxSpan >= minSpan;
  }

  /** Zoom camera: >1 = gÃ¡ÂºÂ§n hÃ†Â¡n (bÃƒÂ¡nh to). ChuÃ¡Â»â„¢t: wheel; cÃ¡ÂºÂ£m Ã¡Â»Â©ng: pinch 2 ngÃƒÂ³n. */
  const BASE_CAM_Z = 15.8;
  const BASE_CAM_Y = 5.6;
  let userZoom = 1;
  const ZOOM_MIN = 0.4;
  const ZOOM_MAX = 2.85;

  function applyUserCameraZoom() {
    userZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, userZoom));
    camera.position.z = BASE_CAM_Z / userZoom;
    camera.position.y = BASE_CAM_Y;
    camera.position.x = 0;
    camera.lookAt(0, CAM_LOOK_Y, 0);
  }

  // KÃƒÂ©o 1 ngÃƒÂ³n xoay; 2 ngÃƒÂ³n pinch zoom
  let dragActive = false;
  let rotatePointerId = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let baseRootRotY = 0;
  let baseRootRotX = 0;
  let userDragYaw = 0;
  let userDragPitch = 0;
  const dragScaleYaw = 0.0076;
  const dragScalePitch = 0.005;
  const PITCH_LIMIT = 0.87;

  const pointers = new Map();
  let pinchDist0 = 0;
  let zoomAtPinchStart = 1;

  function pinchDistance() {
    const arr = Array.from(pointers.values());
    if (arr.length < 2) return 0;
    return Math.hypot(arr[1].x - arr[0].x, arr[1].y - arr[0].y);
  }

  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      dragActive = false;
      pinchDist0 = pinchDistance();
      zoomAtPinchStart = userZoom;
      if (rotatePointerId != null) {
        try {
          stage.releasePointerCapture(rotatePointerId);
        } catch (err) {}
        rotatePointerId = null;
      }
      return;
    }

    if (pointers.size === 1) {
      dragActive = true;
      rotatePointerId = e.pointerId;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      baseRootRotY = userDragYaw;
      baseRootRotX = userDragPitch;
      /* ChÃ¡Â»â€° ghi nÃƒÂ©t khi Ã„â€˜ÃƒÂ£ thÃ¡Â»â€¢i nÃ¡ÂºÂ¿n (slashUiReady) */
      if (slashUiReady && !slashLetterDone) {
        slashGestureStartYaw = userDragYaw;
        slashGestureStartPitch = userDragPitch;
        slashStrokePts = [clientToStageLocal(e.clientX, e.clientY)];
        slashLastMoveT = performance.now();
        slashPathLen = 0;
        slashMaxSegVel = 0;
        slashLocksRotation = false;
      } else {
        slashStrokePts = [];
        slashPathLen = 0;
        slashMaxSegVel = 0;
        slashLocksRotation = false;
      }
      try {
        stage.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  }

  function onPointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    const pt = pointers.get(e.pointerId);
    pt.x = e.clientX;
    pt.y = e.clientY;

    if (pointers.size >= 2) {
      e.preventDefault();
      const dist = pinchDistance();
      if (pinchDist0 > 6 && dist > 0) {
        userZoom = zoomAtPinchStart * (dist / pinchDist0);
        applyUserCameraZoom();
      }
      return;
    }

    if (!dragActive) return;
    /* ChÃ¡Â»â€° thu Ã„â€˜iÃ¡Â»Æ’m vÃƒ  vÃ¡ÂºÂ½ nÃƒÂ©t khi chÃ¡ÂºÂ¿ Ã„â€˜Ã¡Â»â„¢ cÃ¡ÂºÂ¯t Ã„â€˜ÃƒÂ£ kÃƒÂ­ch hoÃ¡ÂºÂ¡t */
    if (slashUiReady && !slashLetterDone && slashStrokePts.length) {
      const loc = clientToStageLocal(e.clientX, e.clientY);
      const last = slashStrokePts[slashStrokePts.length - 1];
      const seg = Math.hypot(loc.x - last.x, loc.y - last.y);
      if (seg > 0.4) {
        slashPathLen += seg;
        slashStrokePts.push(loc);
        const now = performance.now();
        const dt = Math.max(1, now - slashLastMoveT);
        slashMaxSegVel = Math.max(slashMaxSegVel, seg / dt);
        slashLastMoveT = now;
        slashLocksRotation =
          slashPathLen > SLASH_LOCK_PATH_LEN &&
          slashMaxSegVel > SLASH_LOCK_SEG_VEL;
        scheduleSlashRedraw();
      }
    }
    if (slashLocksRotation) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    userDragYaw = baseRootRotY + dx * dragScaleYaw;
    userDragPitch = Math.max(
      -PITCH_LIMIT,
      Math.min(PITCH_LIMIT, baseRootRotX + dy * dragScalePitch)
    );
  }

  function onPointerUp(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) {
      pinchDist0 = 0;
    }

    if (e.pointerId === rotatePointerId) {
      tryAcceptSlashStroke();
      slashStrokePts = [];
      slashPathLen = 0;
      slashMaxSegVel = 0;
      slashLocksRotation = false;
      scheduleSlashRedraw();
      dragActive = false;
      rotatePointerId = null;
      try {
        if (e.pointerId != null) stage.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    if (pointers.size === 1) {
      const id = pointers.keys().next().value;
      const p = pointers.get(id);
      dragActive = true;
      rotatePointerId = id;
      dragStartX = p.x;
      dragStartY = p.y;
      baseRootRotY = userDragYaw;
      baseRootRotX = userDragPitch;
      if (slashUiReady && !slashLetterDone) {
        slashGestureStartYaw = userDragYaw;
        slashGestureStartPitch = userDragPitch;
        slashStrokePts = [clientToStageLocal(p.x, p.y)];
        slashLastMoveT = performance.now();
        slashPathLen = 0;
        slashMaxSegVel = 0;
        slashLocksRotation = false;
      } else {
        slashStrokePts = [];
        slashPathLen = 0;
        slashMaxSegVel = 0;
        slashLocksRotation = false;
      }
      try {
        stage.setPointerCapture(id);
      } catch (err) {}
    }
  }

  function onWheel(e) {
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 12 : e.deltaY;
    userZoom *= Math.exp(-dy * 0.0014);
    applyUserCameraZoom();
  }

  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", onPointerUp);
  stage.addEventListener("pointercancel", onPointerUp);
  stage.addEventListener("wheel", onWheel, { passive: false });

  let rafId = 0;
  const clock = new THREE.Clock();
  const SPIN_ROOT_Y = 0.2;
  const SPIN_LOWER_TIER_Y = 0.078;
  const SPIN_UPPER_TIER_Y = 0.085;

  let cakeShatterDone = false;
  let shatterPieces = [];
  let shatterAnimId = 0;

  /* Ã¢â€â‚¬Ã¢â€â‚¬ ChiÃ¡ÂºÂ¿u Ã„â€˜iÃ¡Â»Æ’m mÃƒ n hÃƒÂ¬nh Ã¢â€ â€™ giao vÃ¡Â»â€ºi mÃ¡ÂºÂ·t phÃ¡ÂºÂ³ng y=yPlane trong world space Ã¢â€â‚¬Ã¢â€â‚¬ */
  function screenToWorldXZ(sx, sy, yPlane) {
    const w = stage.clientWidth || 800;
    const h = stage.clientHeight || 600;
    const ndcX = (sx / w) * 2 - 1;
    const ndcY = -(sy / h) * 2 + 1;
    const vec = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
    const dir = vec.clone().sub(camera.position).normalize();
    if (Math.abs(dir.y) < 1e-6) return null;
    const t = (yPlane - camera.position.y) / dir.y;
    return new THREE.Vector3(
      camera.position.x + dir.x * t,
      yPlane,
      camera.position.z + dir.z * t
    );
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Normal cÃ¡Â»Â§a mÃ¡ÂºÂ·t phÃ¡ÂºÂ³ng cÃ¡ÂºÂ¯t (thÃ¡ÂºÂ³ng Ã„â€˜Ã¡Â»Â©ng qua trÃ¡Â»Â¥c Y) tÃ¡Â»Â« Ã„â€˜Ã†Â°Ã¡Â»Âng vuÃ¡Â»â€˜t Ã¢â€â‚¬Ã¢â€â‚¬ */
  function computeCutNormal(path) {
    if (!path || path.length < 2) return null;
    const yMid = (LOWER_TIER_Y + UPPER_TIER_Y) / 2;
    const w0 = screenToWorldXZ(path[0].x, path[0].y, yMid);
    const w1 = screenToWorldXZ(path[path.length - 1].x, path[path.length - 1].y, yMid);
    if (!w0 || !w1) return null;
    const dx = w1.x - w0.x;
    const dz = w1.z - w0.z;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 1e-4) return null;
    /* ChiÃ¡Â»Âu vuÃ¡Â»â€˜t lÃƒ  (dx,dz); normal cÃ¡Â»Â§a mÃ¡ÂºÂ·t cÃ¡ÂºÂ¯t vuÃƒÂ´ng gÃƒÂ³c vÃ¡Â»â€ºi chiÃ¡Â»Âu Ã„â€˜ÃƒÂ³ trong XZ */
    return new THREE.Vector3(-dz / len, 0, dx / len);
  }

  function startCakeShatterSequence() {
    if (slashLetterDone) return;
    slashLetterDone = true;
    cakeShatterDone = true;

    /* Ã¢â€â‚¬Ã¢â€â‚¬ 1. TÃƒÂ­nh gÃƒÂ³c vÃ¡ÂºÂ¿t cÃ¡ÂºÂ¯t (world space) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
    const TWO_PI = Math.PI * 2;
    const cutNormals = slashCommittedPaths.map(function (p) {
      return computeCutNormal(p.points || p);
    }).filter(Boolean);

    const rawAngles = [];
    cutNormals.forEach(function (n) {
      let a = Math.atan2(-n.z, n.x), b = a + Math.PI;
      if (a < 0) a += TWO_PI; if (b < 0) b += TWO_PI;
      if (b >= TWO_PI) b -= TWO_PI;
      rawAngles.push(a, b);
    });
    rawAngles.sort(function (a, b) { return a - b; });
    const cutAngles = rawAngles.length ? [rawAngles[0]] : [];
    for (let i = 1; i < rawAngles.length; i++) {
      if (rawAngles[i] - rawAngles[i - 1] > 0.15) cutAngles.push(rawAngles[i]);
    }
    if (cutAngles.length < 2) {
      cutAngles.length = 0;
      for (let i = 0; i < 6; i++) cutAngles.push(i * Math.PI / 3);
    }

    /* Ã¢â€â‚¬Ã¢â€â‚¬ 2. Thu thÃ¡ÂºÂ­p meshes cÃƒÂ¹ng gÃƒÂ³c world cÃ¡Â»Â§a chÃƒÂºng Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
    cakeRoot.updateWorldMatrix(true, true);
    const cakeWorldInv = cakeRoot.matrixWorld.clone().invert();
    const originPos = cakeRoot.position.clone();
    const originRot = cakeRoot.rotation.clone();
    const originRotY = originRot.y;

    function primaryMeshMaterial(mesh) {
      const m = mesh.material;
      if (!m) return null;
      return Array.isArray(m) ? m[0] || null : m;
    }

    const meshInfos = [];
    cakeRoot.traverse(function (obj) {
      if (!obj.isMesh) return;
      obj.updateWorldMatrix(true, false);

      let worldAngle = null;
      const geo = obj.geometry;
      const params = geo && geo.parameters;

      /*
       * Ring cards lÃƒ  CylinderGeometry cÃƒÂ³ thetaStart + thetaLength trong params.
       * Mesh pivot cÃ¡Â»Â§a chÃƒÂºng nÃ¡ÂºÂ±m tÃ¡ÂºÂ¡i (0,0,0) nÃƒÂªn khÃƒÂ´ng thÃ¡Â»Æ’ dÃƒÂ¹ng mesh.position Ã„â€˜Ã¡Â»Æ’
       * xÃƒÂ¡c Ã„â€˜Ã¡Â»â€¹nh gÃƒÂ³c. Thay vÃƒ o Ã„â€˜ÃƒÂ³: chiÃ¡ÂºÂ¿u Ã„â€˜iÃ¡Â»Æ’m tÃƒÂ¢m arc cÃ¡Â»Â§a geometry ra world space.
       */
      const ringMatProbe = primaryMeshMaterial(obj);
      if (params && params.thetaStart !== undefined && params.thetaLength !== undefined
          && ringMatProbe && ringMatProbe.map && ringMatProbe.map.isTexture) {
        const thetaCenter = params.thetaStart + params.thetaLength * 0.5;
        const r = params.radiusTop || params.radiusBottom || 1;
        const localPt = new THREE.Vector3(
          Math.sin(thetaCenter) * r, 0, Math.cos(thetaCenter) * r
        );
        const worldPt = localPt.applyMatrix4(obj.matrixWorld);
        const d = Math.sqrt(worldPt.x * worldPt.x + worldPt.z * worldPt.z);
        if (d > 0.8) {
          worldAngle = Math.atan2(worldPt.x, worldPt.z);
          if (worldAngle < 0) worldAngle += TWO_PI;
        }
      } else {
        /* VÃ¡Â»â€ºi mesh khÃƒÂ´ng phÃ¡ÂºÂ£i ring card: dÃƒÂ¹ng world position nhÃ†Â° cÃ…Â© */
        const wp = new THREE.Vector3();
        obj.getWorldPosition(wp);
        const dist = Math.sqrt(wp.x * wp.x + wp.z * wp.z);
        if (dist > 0.8) {
          worldAngle = Math.atan2(wp.x, wp.z);
          if (worldAngle < 0) worldAngle += TWO_PI;
        }
      }

      meshInfos.push({ mesh: obj, worldAngle: worldAngle, worldMat: obj.matrixWorld.clone() });
    });

    function inSector(angle, thetaStart, thetaLen) {
      if (angle === null) return false;
      const a = ((angle - thetaStart) % TWO_PI + TWO_PI) % TWO_PI;
      return a <= thetaLen + 0.02; /* nhÃ¡Â»Â tolerance cho card gÃ¡ÂºÂ§n biÃƒÂªn */
    }

    /* GÃƒÂ³c nÃ¡ÂºÂ±m trong phÃ¡ÂºÂ§n Ã¢â‚¬Å“lÃƒÂµiÃ¢â‚¬Â cÃ¡Â»Â§a sector (cÃƒÂ¡ch hai mÃƒÂ©p cÃ¡ÂºÂ¯t mÃ¡Â»â„¢t chÃƒÂºt) Ã¢â‚¬â€ dÃƒÂ¹ng lÃ¡Â»Âc cung Ã¡ÂºÂ£nh */
    function angleInSectorInterior(angle, thetaStart, thetaLen, insetMax) {
      if (angle === null) return false;
      const a = ((angle - thetaStart) % TWO_PI + TWO_PI) % TWO_PI;
      const ins = Math.min(insetMax, Math.max(0.006, thetaLen * 0.18));
      if (thetaLen <= ins * 2 + 0.02) return inSector(angle, thetaStart, thetaLen);
      return a >= ins && a <= thetaLen - ins + 1e-6;
    }

    /* CÃ¡ÂºÂ£ cung Ã¡ÂºÂ£nh phÃ¡ÂºÂ£i nÃ¡ÂºÂ±m trong wedge Ã¢â‚¬â€ trÃƒÂ¡nh clone card chÃ¡Â»â€° khÃ¡Â»â€ºp tÃƒÂ¢m mÃƒ  hai mÃƒÂ©p vÃ¡ÂºÂ«n nhÃƒÂ´ ra ngoÃƒ i khÃ¡Â»â€˜i */
    function ringArcFullyInSector(mesh, params, thetaStart, thetaLen) {
      if (!params || params.thetaStart === undefined || params.thetaLength === undefined) {
        return true;
      }
      const r0 = params.radiusTop || params.radiusBottom || 1;
      const inset = 0.055;
      const steps = 7;
      for (let s = 0; s < steps; s++) {
        const t = params.thetaStart + (params.thetaLength * s) / (steps - 1);
        const lv = new THREE.Vector3(
          Math.sin(t) * r0,
          0,
          Math.cos(t) * r0
        );
        lv.applyMatrix4(mesh.matrixWorld);
        const ang = Math.atan2(lv.x, lv.z);
        const un = ang < 0 ? ang + TWO_PI : ang;
        if (!angleInSectorInterior(un, thetaStart, thetaLen, inset)) return false;
      }
      return true;
    }

    /*
     * TÃƒÂ¬m material cÃ¡Â»Â§a top disc gÃ¡Â»â€˜c (disc Ã¡ÂºÂ£nh trÃƒÂªn Ã„â€˜Ã¡Â»â€°nh tÃ¡ÂºÂ§ng, cÃƒÂ³ map texture,
     * nÃ¡ÂºÂ±m gÃ¡ÂºÂ§n trÃ¡Â»Â¥c Y Ã¢â‚¬â€ dÃƒÂ¹ng cho mÃ¡ÂºÂ·t trÃƒÂªn/dÃ†Â°Ã¡Â»â€ºi cÃ¡Â»Â§a mÃ¡Â»â€”i miÃ¡ÂºÂ¿ng).
     */
    let lowerTopDiscMat = null;
    let upperTopDiscMat = null;
    meshInfos.forEach(function (info) {
      if (info.worldAngle !== null) return; /* chÃ¡Â»â€° lÃ¡ÂºÂ¥y mesh trung tÃƒÂ¢m */
      const mat = primaryMeshMaterial(info.mesh);
      if (!mat || !mat.map || !mat.map.isTexture) return; /* phÃ¡ÂºÂ£i cÃƒÂ³ texture thÃ¡ÂºÂ­t, khÃƒÂ´ng phÃ¡ÂºÂ£i material[] */
      const wp = new THREE.Vector3();
      info.mesh.getWorldPosition(wp);
      /* PhÃƒÂ¢n biÃ¡Â»â€¡t tÃ¡ÂºÂ§ng trÃƒÂªn/dÃ†Â°Ã¡Â»â€ºi theo Ã„â€˜Ã¡Â»â„¢ cao world */
      if (!lowerTopDiscMat && wp.y < originPos.y + LOWER_TIER_Y + LOWER_TIER_H) {
        lowerTopDiscMat = mat;
      } else if (!upperTopDiscMat) {
        upperTopDiscMat = mat;
      }
    });

    /* VÃ¡ÂºÂ­t liÃ¡Â»â€¡u phÃ¡ÂºÂ§n lÃƒÂµi Ã„â€˜Ã¡ÂºÂ·c */
    const matSolid = new THREE.MeshStandardMaterial({ color: 0xf0ddb0, roughness: 0.82, metalness: 0 });

    /*
     * Tra cÃ¡Â»Â©u ring card cÃƒÂ³ texture gÃ¡ÂºÂ§n nhÃ¡ÂºÂ¥t gÃƒÂ³c Ã¢â€ â€™ dÃƒÂ¹ng cho mÃ¡ÂºÂ·t cÃ¡ÂºÂ¯t.
     * Clone material + set DoubleSide Ã„â€˜Ã¡Â»Æ’ khÃƒÂ´ng Ã¡ÂºÂ£nh hÃ†Â°Ã¡Â»Å¸ng ring card gÃ¡Â»â€˜c.
     */
    const ringTexMeshes = [];
    meshInfos.forEach(function (info) {
      if (info.worldAngle === null) return;
      const mat = primaryMeshMaterial(info.mesh);
      if (mat && mat.map && mat.map.isTexture) ringTexMeshes.push({ angle: info.worldAngle, mat: mat });
    });

    /* TÃƒÂ¬m ring card material gÃ¡ÂºÂ§n nhÃ¡ÂºÂ¥t gÃƒÂ³c (khÃƒÂ´ng clone) */
    function findNearestRingMat(worldAngle) {
      if (!ringTexMeshes.length) return null;
      let best = null, bestD = Infinity;
      ringTexMeshes.forEach(function (item) {
        let d = Math.abs(item.angle - worldAngle) % TWO_PI;
        if (d > Math.PI) d = TWO_PI - d;
        if (d < bestD) { bestD = d; best = item.mat; }
      });
      return best;
    }

    /* Clone + tune material Ã„â€˜Ã¡Â»Æ’ dÃƒÂ¹ng lÃƒ m mÃ¡ÂºÂ·t Ã¡ÂºÂ£nh trÃƒÂªn khÃ¡Â»â€˜i bÃƒÂ¡nh */
    function makePhotoMat(srcMat, doubleSide) {
      let m0 = srcMat;
      if (Array.isArray(m0)) m0 = m0[0];
      if (!m0 || typeof m0.clone !== "function") return matSolid;
      const m = m0.clone();
      m.roughness = 0.55;
      m.metalness = 0.0;
      if (doubleSide) m.side = THREE.DoubleSide;
      return m;
    }

    /* Ã¢â€â‚¬Ã¢â€â‚¬ 3. TÃ¡ÂºÂ¡o tÃ¡Â»Â«ng miÃ¡ÂºÂ¿ng bÃƒÂ¡nh Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
    shatterPieces = [];
    const numSectors = cutAngles.length;

    for (let i = 0; i < numSectors; i++) {
      const thetaStart = cutAngles[i];
      let thetaEnd = cutAngles[(i + 1) % numSectors];
      if (thetaEnd <= thetaStart) thetaEnd += TWO_PI;
      const thetaLen = thetaEnd - thetaStart;
      if (thetaLen < 0.05) continue;

      const centertheta = thetaStart + thetaLen / 2;
      const flyDir = new THREE.Vector3(Math.sin(centertheta), 0, Math.cos(centertheta));
      /* GÃƒÂ³c local (trÃ¡Â»Â« Ã„â€˜i rotation cÃ¡Â»Â§a cakeRoot Ã„â€˜Ã¡Â»Æ’ Ã„â€˜Ã¡ÂºÂ·t vÃƒ o group local space) */
      const thetaSL = thetaStart - originRotY;
      const thetaEL = thetaEnd - originRotY;

      const grp = new THREE.Group();
      grp.position.copy(originPos);
      grp.rotation.copy(originRot);

      /* BÃƒÂ¡n kÃƒÂ­nh lÃƒÂµi kem sector vs vÃ¡Â»Â Ã¡ÂºÂ£nh quanh thÃƒ nh (rr = RING_R + 0.02) Ã¢â‚¬â€ cÃ¡ÂºÂ§n trÃ†Â°Ã¡Â»â€ºc khi clone ring */
      const lR = LOWER_TIER_RING_R * 0.93;
      const uR = UPPER_TIER_RING_R * 0.93;
      const lowerPhotoR = LOWER_TIER_RING_R + 0.02;
      const upperPhotoR = UPPER_TIER_RING_R + 0.02;

      /* a) Clone ring card Ã¢â‚¬â€ chÃ¡Â»â€° khi cÃ¡ÂºÂ£ cung nÃ¡ÂºÂ±m trong wedge; co XZ thÃƒÂªm Ã„â€˜Ã¡Â»Æ’ khÃƒÂ´ng lÃ¡Â»Ât ngoÃƒ i kem */
      meshInfos.forEach(function (info) {
        if (!inSector(info.worldAngle, thetaStart, thetaLen)) return;
        const rp0 = info.mesh.geometry && info.mesh.geometry.parameters;
        if (rp0 && rp0.thetaStart !== undefined && !ringArcFullyInSector(info.mesh, rp0, thetaStart, thetaLen)) {
          return;
        }
        const srcMat = Array.isArray(info.mesh.material)
          ? info.mesh.material[0]
          : info.mesh.material;
        const matClone = srcMat.clone();
        matClone.polygonOffset = true;
        matClone.polygonOffsetFactor = -0.35;
        matClone.polygonOffsetUnits = 0.35;
        const m = new THREE.Mesh(info.mesh.geometry, matClone);
        m.matrix.multiplyMatrices(cakeWorldInv, info.worldMat);
        const rp = info.mesh.geometry && info.mesh.geometry.parameters;
        const rMesh = rp && (rp.radiusTop || rp.radiusBottom);
        if (rp && rp.thetaStart !== undefined && rMesh) {
          let sXZ = 1;
          if (Math.abs(rMesh - lowerPhotoR) < 0.2) sXZ = (lR * 0.985) / lowerPhotoR;
          else if (Math.abs(rMesh - upperPhotoR) < 0.15) sXZ = (uR * 0.985) / upperPhotoR;
          if (sXZ < 0.999) {
            m.matrix.multiply(new THREE.Matrix4().makeScale(sXZ, 1, sXZ));
          }
        }
        m.matrixAutoUpdate = false;
        grp.add(m);
      });

      /*
       * b) LÃƒÂµi cylinder Ã„â€˜Ã¡ÂºÂ·c Ã¢â‚¬â€ tÃ¡ÂºÂ¥t cÃ¡ÂºÂ£ 5 mÃ¡ÂºÂ·t Ã„â€˜Ã¡Â»Âu cÃƒÂ³ Ã¡ÂºÂ£nh:
       *   group 0 = mÃ¡ÂºÂ·t ngoÃƒ i cong  Ã¢â€ â€™ Ã¡ÂºÂ£nh ring card tÃƒÂ¢m sector
       *   group 1 = mÃ¡ÂºÂ·t trÃƒÂªn (cap)  Ã¢â€ â€™ Ã¡ÂºÂ£nh top disc (nÃ¡ÂºÂ¿u cÃƒÂ³) hoÃ¡ÂºÂ·c ring card
       *   group 2 = mÃ¡ÂºÂ·t dÃ†Â°Ã¡Â»â€ºi (cap)  Ã¢â€ â€™ Ã¡ÂºÂ£nh ring card tÃƒÂ¢m sector
       * MÃ¡ÂºÂ·t cÃ¡ÂºÂ¯t (2 PlaneGeometry) Ã¢â€ â€™ Ã¡ÂºÂ£nh ring card gÃ¡ÂºÂ§n vÃ¡ÂºÂ¿t cÃ¡ÂºÂ¯t (phÃ¡ÂºÂ§n c)
       */
      /* Material Ã¡ÂºÂ£nh Ã„â€˜Ã¡ÂºÂ¡i diÃ¡Â»â€¡n cho sector nÃƒ y (tÃƒÂ¢m sector) */
      const sectorSrcMat = findNearestRingMat(centertheta);
      const outerMat  = makePhotoMat(sectorSrcMat, false);
      const bottomMat = makePhotoMat(sectorSrcMat, false);
      [
        [lR, LOWER_TIER_H, LOWER_TIER_Y, 40, lowerTopDiscMat, 'lower'],
        [uR, UPPER_TIER_H, UPPER_TIER_Y, 32, upperTopDiscMat, 'upper'],
      ].forEach(function (cfg) {
        const r = cfg[0], h = cfg[1], y = cfg[2], segs = cfg[3], discMat = cfg[4], tier = cfg[5];
        const geo = new THREE.CylinderGeometry(r, r, h, segs, 1, false, thetaSL, thetaLen);
        const topMat = makePhotoMat(discMat || sectorSrcMat, false);
    
        const mesh = new THREE.Mesh(geo, [outerMat, topMat, bottomMat]);
        mesh.position.y = y;
        grp.add(mesh);
      });

      /* c) MÃ¡ÂºÂ·t cÃ¡ÂºÂ¯t Ã¢â‚¬â€ gÃƒÂ¡n Ã¡ÂºÂ£nh ring card gÃ¡ÂºÂ§n nhÃ¡ÂºÂ¥t gÃƒÂ³c vÃ¡ÂºÂ¿t cÃ¡ÂºÂ¯t */
      [thetaSL, thetaEL].forEach(function (theta) {
        /*
         * Plane mÃ¡ÂºÂ·c Ã„â€˜Ã¡Â»â€¹nh nÃ¡ÂºÂ±m XY, cÃ¡ÂºÂ¡nh rÃ¡Â»â„¢ng theo +X. CÃ¡ÂºÂ§n +X local Ã¢â€ â€™ hÃ†Â°Ã¡Â»â€ºng bÃƒÂ¡n kÃƒÂ­nh (sin theta, 0, cos theta).
         * R_y(ÃŽÂ²).xAxis = (cos ÃŽÂ², 0, -sin ÃŽÂ²) = radial Ã¢â€¡â€™ ÃŽÂ² = atan2(-cos theta, sin theta).
         * (Ãâ‚¬/2 - theta chÃ¡Â»â€° Ã„â€˜ÃƒÂºng mÃ¡Â»â„¢t phÃ¡ÂºÂ§n gÃƒÂ³c Ã¢â‚¬â€ dÃ¡Â»â€¦ lÃ¡Â»â€¡ch 180Ã‚Â° / xÃƒÂ¬a texture ra ngoÃƒ i mÃƒÂ©p cÃ¡ÂºÂ¯t.)
         */
        const capRotY = Math.atan2(-Math.cos(theta), Math.sin(theta));
        const cutSrc = findNearestRingMat(theta + originRotY);
        const faceMat = makePhotoMat(cutSrc, false);
        faceMat.side = THREE.FrontSide;
        faceMat.polygonOffset = true;
        faceMat.polygonOffsetFactor = 0.6;
        faceMat.polygonOffsetUnits = 0.5;

        [
          [lR, LOWER_TIER_H, LOWER_TIER_Y],
          [uR, UPPER_TIER_H, UPPER_TIER_Y],
        ].forEach(function (cfg, tierIdx) {
          const r = cfg[0], h = cfg[1], y = cfg[2];
          const pw = r * 0.94;
          const ph = h * 0.982;
          const radialMid = r * 0.5 - 0.08;
          const cx = Math.sin(theta) * radialMid;
          const cz = Math.cos(theta) * radialMid;
          const face = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), faceMat);
          face.position.set(cx, y, cz);
          face.rotation.y = capRotY;
          grp.add(face);
        });
      });

      scene.add(grp);
      /* TrÃ¡Â»Â¥c tiÃ¡ÂºÂ¿p tuyÃ¡ÂºÂ¿n mÃ¡ÂºÂ·t trÃƒÂ²n (vuÃƒÂ´ng gÃƒÂ³c bÃƒÂ¡n kÃƒÂ­nh trong XZ): mÃ¡Â»â€”i sector ngÃ¡ÂºÂ£ theo hÃ†Â°Ã¡Â»â€ºng riÃƒÂªng */
      const tiltAxis = new THREE.Vector3(flyDir.z, 0, -flyDir.x);
      if (tiltAxis.lengthSq() < 1e-10) tiltAxis.set(1, 0, 0);
      else tiltAxis.normalize();

      shatterPieces.push({
        group: grp,
        planes: [],
        flyDir: flyDir,
        tiltAxis: tiltAxis.clone(),
        ox: originPos.x,
        oz: originPos.z,
        spinX: (Math.random() - 0.5) * 0.2,
        spinZ: (Math.random() - 0.5) * 0.17,
        spinY: (Math.random() - 0.5) * 0.07,
      });
    }

    cakeRoot.visible = false;
    renderer.localClippingEnabled = false;

    /* Ã¢â€â‚¬Ã¢â€â‚¬ 3. MÃ¡Â»Â UI Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
    window.setTimeout(function () {
      if (slashUi) slashUi.classList.add("memory-cake-slash-ui--done");
    }, 250);
    if (blowSlot) { blowSlot.style.transition = "opacity 0.4s"; blowSlot.style.opacity = "0"; }

    /* Ã¢â€â‚¬Ã¢â€â‚¬ 4. Animation tÃƒÂ¡ch miÃ¡ÂºÂ¿ng: nÃ¡Â»Â©t / tÃƒÂ¡ch rÃ¡ÂºÂ¥t nhÃ¡ÂºÂ¹, chÃ¡ÂºÂ­m hÃ†Â¡n mÃ¡Â»â„¢t chÃƒÂºt Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
    const SHATTER_MS = 2900;
    const shatterStart = performance.now();
    function shatterFrame() {
      const elapsed = performance.now() - shatterStart;
      const u = Math.min(1, elapsed / SHATTER_MS);
      const easeOut = 1 - Math.pow(1 - u, 2.65);
      const gravity = u * u * 0.18;
      const leanAngle = easeOut * 0.34;

      shatterPieces.forEach(function (piece) {
        const dist = easeOut * 0.72;
        const newX = piece.ox + piece.flyDir.x * dist;
        const newZ = piece.oz + piece.flyDir.z * dist;
        const newY = originPos.y + easeOut * 0.12 - gravity;
        piece.group.position.set(newX, newY, newZ);
        const qBase = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(originRot.x, originRot.y, originRot.z, 'XYZ')
        );
        const qLean = new THREE.Quaternion().setFromAxisAngle(piece.tiltAxis, leanAngle);
        const qSpin = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            easeOut * piece.spinX,
            easeOut * piece.spinY,
            easeOut * piece.spinZ,
            'XYZ'
          )
        );
        piece.group.quaternion.copy(qBase).premultiply(qLean).multiply(qSpin);
      });

      if (u < 1) {
        shatterAnimId = requestAnimationFrame(shatterFrame);
      } else {
        /* ChiÃ¡ÂºÂ¿u vÃ¡Â»â€¹ trÃƒÂ­ 3D Ã¢â€ â€™ viewport % Ã„â€˜Ã¡Â»Æ’ gift-box.js lÃƒ m Ã„â€˜iÃ¡Â»Æ’m xuÃ¡ÂºÂ¥t phÃƒÂ¡t Ã¡ÂºÂ£nh */
        var rect = stage.getBoundingClientRect();
        var vw = window.innerWidth || rect.width;
        var vh = window.innerHeight || rect.height;
        window.__cakePieceScreenPositions = shatterPieces.map(function (piece) {
          var wp = piece.group.position.clone().project(camera);
          var sx = (wp.x * 0.5 + 0.5) * rect.width + rect.left;
          var sy = (-wp.y * 0.5 + 0.5) * rect.height + rect.top;
          return {
            x: Math.max(5, Math.min(95, (sx / vw) * 100)),
            y: Math.max(5, Math.min(95, (sy / vh) * 100))
          };
        });

        if (zone) zone.classList.add("memory-zone--faded");
        window.setTimeout(function () {
          shatterPieces.forEach(function (p) {
            scene.remove(p.group);
            p.group.traverse(function (obj) {
              if (!obj.isMesh) return;
              if (obj.geometry) obj.geometry.dispose();
              [].concat(obj.material).forEach(function (m) { if (m && m.dispose) m.dispose(); });
            });
          });
          shatterPieces = [];
        }, 2000);
        window.dispatchEvent(new CustomEvent("memory:cake-cuts-complete"));
      }
    }
    shatterAnimId = requestAnimationFrame(shatterFrame);
  }

  function animate() {
    const t = clock.getElapsedTime();
    const undersideLiftT = Math.abs(userDragPitch) / PITCH_LIMIT;
    const undersideLift = undersideLiftT * undersideLiftT * 1.15;

    if (!cakeShatterDone) {
      cakeRoot.rotation.y = t * SPIN_ROOT_Y + userDragYaw;
      cakeRoot.rotation.x = userDragPitch;
      cakeRoot.position.y = baseCakeRootY + undersideLift;
      lowerTier.position.set(0, LOWER_TIER_Y, 0);
      lowerTier.rotation.set(0, 0, 0);
      upperTier.position.set(0, UPPER_TIER_Y, 0);
      upperTier.rotation.set(0, 0, 0);
      lowerTierSpin.rotation.y = t * SPIN_LOWER_TIER_Y;
      lowerTierTopStatic.rotation.y = -cakeRoot.rotation.y;
      upperTier.rotation.y = -t * SPIN_UPPER_TIER_Y;
    }

    if (blowSlot) {
      blowSlot.classList.toggle(
        "is-hidden-by-tilt",
        !candleBlown && (pointers.size > 0 || dragActive || slashLocksRotation)
      );
    }
    const flames = upperTier.userData && upperTier.userData.candleFlames;
    const flameR =
      (upperTier.userData && upperTier.userData.candleR) || 0.13;
    if (flames && flames.length) {
      flames.forEach(function (mesh) {
        const u = mesh.userData.flame;
        if (!u) return;
        /* Ã¢â€â‚¬Ã¢â€â‚¬ HiÃ¡Â»â€¡u Ã¡Â»Â©ng thÃ¡Â»â€¢i tÃ¡ÂºÂ¯t nÃ¡ÂºÂ¿n Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
        if (candleBlown) {
          const elapsed = performance.now() - blowStartTime;
          if (blowStartTime < 0 || elapsed >= BLOW_ANIM_MS) {
            mesh.visible = false;
            return;
          }
          mesh.visible = true;
          const prog = elapsed / BLOW_ANIM_MS; /* 0 Ã¢â€ â€™ 1 */

          if (prog < 0.38) {
            /* Pha 1 (0Ã¢â‚¬â€œ38%): lung lay dÃ¡Â»Â¯ dÃ¡Â»â„¢i nhÃ†Â° Ã„â€˜ang bÃ¡Â»â€¹ thÃ¡Â»â€¢i */
            const p1 = prog / 0.38;
            const leanX = u.bx + flameR * 1.2 * p1 * Math.sin(t * 38 + u.px);
            const leanY = u.by + flameR * 0.3 * Math.sin(t * 26 + u.py);
            mesh.position.set(leanX, leanY, u.bz);
            mesh.scale.set(
              u.sx * (1 + 0.4 * Math.abs(Math.sin(t * 35))),
              u.sy * (1.25 - 0.35 * p1),
              u.sz
            );
            mesh.material.opacity = Math.min(0.92, u.bop * (1.1 - 0.15 * p1));
          } else {
            /* Pha 2 (38Ã¢â‚¬â€œ100%): teo nhÃ¡Â»Â + mÃ¡Â»Â dÃ¡ÂºÂ§n Ã¢â‚¬â€ ngÃ¡Â»Ân lÃ¡Â»Â­a tÃ¡ÂºÂ¯t */
            const p2 = (prog - 0.38) / 0.62;
            const ease = 1 - Math.pow(1 - p2, 1.8);
            const sc = Math.max(0, 1 - ease);
            mesh.position.set(u.bx, u.by + flameR * 0.15 * (1 - p2), u.bz);
            mesh.scale.set(u.sx * sc, u.sy * sc, u.sz * sc);
            mesh.material.opacity = Math.max(0, u.bop * (1 - ease));
          }
          return;
        }
        /* Ã¢â€â‚¬Ã¢â€â‚¬ NgÃ¡Â»Ân lÃ¡Â»Â­a bÃƒÂ¬nh thÃ†Â°Ã¡Â»Âng Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
        mesh.visible = true;
        const wobbleY =
          flameR * 0.2 * Math.sin(t * u.f5 + u.py) +
          flameR * 0.13 * Math.sin(t * 27 + u.pz) +
          flameR * 0.11 * Math.sin(t * u.f1 + u.px) +
          flameR * 0.08 * Math.sin(t * u.f3 * 1.2 + u.py);
        const stretchY =
          1 +
          0.26 * Math.sin(t * u.f2 + u.pz) +
          0.17 * Math.sin(t * u.f4 * 1.3 + u.px) +
          0.12 * Math.sin(t * u.f5 * 0.6 + u.py) +
          0.08 * Math.sin(t * u.f1 * 1.8 + u.pz);
        mesh.position.set(u.bx, u.by + wobbleY, u.bz);
        mesh.scale.set(u.sx, u.sy * stretchY, u.sz);
        mesh.rotation.set(0, 0, 0);
        const flicker =
          0.58 +
          0.22 * (0.5 + 0.5 * Math.sin(t * 14.2 + u.px)) +
          0.18 * (0.5 + 0.5 * Math.sin(t * 21.7 + u.pz)) +
          0.12 * (0.5 + 0.5 * Math.sin(t * 33 + u.py));
        mesh.material.opacity = Math.max(
          0.12,
          Math.min(0.92, u.bop * flicker)
        );
      });
    }
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  function onResize() {
    const nw = stage.clientWidth || window.innerWidth || 800;
    const nh = stage.clientHeight || window.innerHeight || 600;
    refreshStageViewport(nw, nh);
    resizeSlashCanvas();
  }

  function onOrientationChange() {
    setTimeout(onResize, 200);
  }

  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onOrientationChange);

  stage.__memoryCleanup = function () {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onOrientationChange);
    stage.removeEventListener("pointerdown", onPointerDown);
    stage.removeEventListener("pointermove", onPointerMove);
    stage.removeEventListener("pointerup", onPointerUp);
    stage.removeEventListener("pointercancel", onPointerUp);
    stage.removeEventListener("wheel", onWheel, { passive: false });
    if (typeof slashUiCleanup === "function") {
      slashUiCleanup();
    }
    renderer.dispose();
    scene.traverse(function (obj) {
      if (!obj) return;
      if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(function (m) {
            if (m.map) m.map.dispose();
            if (m.dispose) m.dispose();
          });
        } else {
          if (obj.material.map) obj.material.map.dispose();
          if (obj.material.dispose) obj.material.dispose();
        }
      }
    });
    if (renderer.domElement && renderer.domElement.parentNode === stage) {
      stage.removeChild(renderer.domElement);
    }
  };
}

/**
 * TÃ¡Â»Â«ng chÃ¡Â»Â¯ cÃƒÂ¡i "Happy Birthday!" bay thÃ¡ÂºÂ­t sÃ¡Â»Â± qua mÃƒ n hÃƒÂ¬nh tÃ¡Â»Â« hÃ¡Â»â„¢p quÃƒ  tÃ¡Â»â€ºi vÃ¡Â»â€¹ trÃƒÂ­ cÃƒÂ¢u chÃ¡Â»Â¯.
 * KÃ¡Â»Â¹ thuÃ¡ÂºÂ­t:
 *  1. TÃ¡ÂºÂ¡m show heading (invisible) Ã„â€˜Ã¡Â»Æ’ Ã„â€˜o rect cÃ¡Â»Â§a tÃ¡Â»Â«ng chÃ¡Â»Â¯
 *  2. TÃ¡ÂºÂ¡o clone fixed-position cho tÃ¡Â»Â«ng chÃ¡Â»Â¯, Ã„â€˜Ã¡ÂºÂ·t tÃ¡ÂºÂ¡i tÃƒÂ¢m hÃ¡Â»â„¢p quÃƒ 
 *  3. Animate clone bay tÃ¡Â»â€ºi rect Ã„â€˜ÃƒÂ­ch theo stagger
 *  4. Sau khi tÃ¡ÂºÂ¥t cÃ¡ÂºÂ£ Ã„â€˜Ã¡ÂºÂ¿n nÃ†Â¡i: hiÃ¡Â»â€¡n heading thÃ¡ÂºÂ­t, xoÃƒÂ¡ clones
 */
(function setupBirthdayHeadingLaunch() {
  var heading = document.querySelector(".page-birthday-heading");
  if (!heading) return;

  var letters = Array.from(
    heading.querySelectorAll(".page-birthday-heading__letter")
  );
  if (!letters.length) return;

  var launched = false;

  function getGiftCenter() {
    var gift = document.getElementById("gift-cube");
    if (gift) {
      var r = gift.getBoundingClientRect();
      if (r.width > 0)
        return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.38 };
    }
    return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.52 };
  }

  window.launchBirthdayHeadingFromGift = function () {
    if (launched) return;
    launched = true;

    /* Ã¢â€â‚¬Ã¢â€â‚¬ 1. Ã„Âo vÃ¡Â»â€¹ trÃƒÂ­ Ã„â€˜ÃƒÂ­ch cÃ¡Â»Â§a tÃ¡Â»Â«ng chÃ¡Â»Â¯ Ã¢â€â‚¬Ã¢â€â‚¬ */
    heading.classList.add("is-measuring");
    void heading.offsetHeight; // force layout

    var rects = letters.map(function (l) {
      return l.getBoundingClientRect();
    });

    heading.classList.remove("is-measuring");

    /* Ã¢â€â‚¬Ã¢â€â‚¬ 2. TÃ¡ÂºÂ¡o flying clones Ã¢â‚¬â€ bÃ¡ÂºÂ¯t Ã„â€˜Ã¡ÂºÂ§u phÃƒÂ­a trÃƒÂªn viewport Ã¢â€â‚¬Ã¢â€â‚¬ */
    var clones = [];

    letters.forEach(function (letter, i) {
      var rect = rects[i];
      var cs = window.getComputedStyle(letter);
      var rDeg = letter.style.getPropertyValue("--r") || "0deg";

      var clone = letter.cloneNode(true);
      clone.className = "bday-flying-letter";
      clone.setAttribute("data-ch", letter.getAttribute("data-ch") || "");
      /* Ã„â€˜Ã¡ÂºÂ·t ngay trÃƒÂªn Ã„â€˜Ã¡Â»â€°nh viewport, cÃƒÂ¹ng x vÃ¡Â»â€ºi Ã„â€˜ÃƒÂ­ch */
      clone.style.cssText = [
        "left:" + rect.left.toFixed(1) + "px",
        "top:" + (-rect.height - 16) + "px",
        "width:" + rect.width.toFixed(1) + "px",
        "height:" + rect.height.toFixed(1) + "px",
        "padding:" + cs.padding,
        "font-size:" + cs.fontSize,
        "opacity:0",
        "transform:rotate(" + rDeg + ") scale(1)",
        "transition:none",
      ].join(";");

      /* sao chÃƒÂ©p cÃƒÂ¡c CSS custom vars cho mÃƒ u sÃ¡ÂºÂ¯c 3D lÃ¡Â»â€ºp trÃ†Â°Ã¡Â»â€ºc/sau */
      var glyph = clone.querySelector(".page-birthday-heading__glyph");
      if (glyph) {
        var origGlyph = letter.querySelector(".page-birthday-heading__glyph");
        if (origGlyph) {
          var gcs = window.getComputedStyle(origGlyph);
          glyph.style.color = gcs.color;
          glyph.style.webkitTextStroke = gcs.webkitTextStroke || gcs["-webkit-text-stroke"];
        }
      }

      document.body.appendChild(clone);
      clones.push({ clone: clone, rect: rect, rDeg: rDeg });
    });

    /* Ã¢â€â‚¬Ã¢â€â‚¬ 3. Stagger: tÃ¡Â»Â«ng clone xuÃ¡ÂºÂ¥t hiÃ¡Â»â€¡n rÃ¡Â»â€œi bay tÃ¡Â»â€ºi Ã„â€˜ÃƒÂ­ch Ã¢â€â‚¬Ã¢â€â‚¬ */
    var FLY_DUR = 260;  /* ms mÃ¡Â»â€”i chÃ¡Â»Â¯ rÃ†Â¡i xuÃ¡Â»â€˜ng */
    var STAGGER = 295;  /* ms giÃ¡Â»Â¯a cÃƒÂ¡c chÃ¡Â»Â¯ Ã¢â‚¬â€ sequential (> FLY_DUR) */

    clones.forEach(function (item, i) {
      var clone = item.clone;
      var rect = item.rect;
      var rDeg = item.rDeg;

      /* Ã„â€˜Ã¡ÂºÂ·t clone ngay trÃƒÂªn Ã„â€˜Ã¡Â»â€°nh viewport (cÃƒÂ¹ng x vÃ¡Â»â€ºi Ã„â€˜ÃƒÂ­ch, nhÃ†Â°ng y ÃƒÂ¢m) */
      clone.style.left = rect.left.toFixed(1) + "px";
      clone.style.top = (-rect.height - 16) + "px";
      clone.style.transform = "rotate(" + rDeg + ") scale(1)";

      setTimeout(function () {
        /* hiÃ¡Â»â€¡n clone */
        void clone.offsetWidth;
        clone.style.transition = "opacity 80ms ease";
        clone.style.opacity = "1";

        /* rÃ†Â¡i xuÃ¡Â»â€˜ng Ã„â€˜ÃƒÂ­ch Ã¢â‚¬â€ cubic-bezier spring: ease-in rÃ¡Â»â€œi overshoot nhÃƒÂºn lÃƒÂªn chÃƒÂºt */
        setTimeout(function () {
          clone.style.transition = [
            "top " + FLY_DUR + "ms cubic-bezier(0.34, 1.52, 0.58, 1)",
            "transform " + FLY_DUR + "ms cubic-bezier(0.34, 1.52, 0.58, 1)",
          ].join(",");
          clone.style.top = rect.top.toFixed(1) + "px";
          clone.style.transform = "rotate(" + rDeg + ") scale(1)";
        }, 30);
      }, i * STAGGER);
    });

    /* Ã¢â€â‚¬Ã¢â€â‚¬ 4. Sau khi tÃ¡ÂºÂ¥t cÃ¡ÂºÂ£ Ã„â€˜Ã¡ÂºÂ¿n nÃ†Â¡i: hiÃ¡Â»â€¡n heading thÃ¡ÂºÂ­t, xoÃƒÂ¡ clones Ã¢â€â‚¬Ã¢â€â‚¬ */
    var totalMs = (letters.length - 1) * STAGGER + FLY_DUR + 80;
    setTimeout(function () {
      heading.classList.add("is-visible");
      clones.forEach(function (item) {
        if (item.clone.parentNode) item.clone.parentNode.removeChild(item.clone);
      });
    }, totalMs);
  };
})();
