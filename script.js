/* =====================================================================
   Cozy Twilight — birthday page behaviour
   Personalize the two lines below. That's all you need to change.
   ===================================================================== */
const CONFIG = {
  name: "Vanshika",                       // ← the birthday person's name / nickname
  sign: "with all my love, always 🤍",    // ← how you sign the note
};

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PALETTE = ["#FFC97A", "#FFB4A2", "#F7A9C4", "#A8E0D0", "#FFF4E9", "#B6A8E0"];
const $ = (sel) => document.querySelector(sel);

/* =====================================================================
   Ambient: stars + string lights
   ===================================================================== */
function buildStars() {
  const wrap = $("#stars");
  const count = reduced ? 26 : 60;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--dur", 3 + Math.random() * 4 + "s");
    s.style.setProperty("--delay", Math.random() * 4 + "s");
    const scale = 0.5 + Math.random() * 1.4;
    s.style.transform = `scale(${scale})`;
    wrap.appendChild(s);
  }
}

function buildLights() {
  const wrap = $("#stringLights");
  const count = Math.max(8, Math.floor(window.innerWidth / 90));
  const cols = ["#FFC97A", "#FFB4A2", "#F7A9C4", "#A8E0D0"];
  for (let i = 0; i < count; i++) {
    const b = document.createElement("span");
    b.className = "bulb";
    const t = i / (count - 1);
    b.style.left = t * 100 + "%";
    // gentle swag so the wire looks like it droops between pins
    b.style.setProperty("--top", 18 + Math.sin(t * Math.PI) * 34 + "px");
    b.style.setProperty("--bulb", cols[i % cols.length]);
    b.style.setProperty("--delay", (i % 5) * 0.35 + "s");
    wrap.appendChild(b);
  }
}

/* =====================================================================
   Hero: title letters pop, name glows, copy fades up
   ===================================================================== */
function buildTitle() {
  const el = $("#title");
  const text = "Happy Birthday";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    if (ch === " ") {
      span.className = "ch space";
      span.innerHTML = "&nbsp;";
    } else {
      span.className = "ch";
      span.textContent = ch;
    }
    span.style.setProperty("--d", 0.2 + i * 0.06 + "s");
    el.appendChild(span);
  });
}

function buildName() {
  const el = $("#nameScript");
  el.textContent = CONFIG.name + " ♥";
  el.classList.add("show");
}

function revealHeroCopy() {
  const items = document.querySelectorAll(".hero .reveal");
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("in"), reduced ? 0 : 900 + i * 220);
  });
}

/* =====================================================================
   Confetti — a tiny canvas particle system
   ===================================================================== */
const canvas = $("#confetti");
const ctx = canvas.getContext("2d");
let particles = [];
let rafId = null;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function sizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function makeParticle(x, y, opts = {}) {
  const angle = opts.angle ?? Math.random() * Math.PI * 2;
  const speed = opts.speed ?? 4 + Math.random() * 6;
  return {
    x, y,
    vx: Math.cos(angle) * speed * (opts.spread ?? 1),
    vy: (opts.vy ?? Math.sin(angle) * speed) - (opts.lift ?? 0),
    size: 6 + Math.random() * 7,
    color: PALETTE[(Math.random() * PALETTE.length) | 0],
    rot: Math.random() * Math.PI,
    vrot: (Math.random() - 0.5) * 0.3,
    shape: Math.random() > 0.5 ? "rect" : "circ",
    gravity: 0.16 + Math.random() * 0.08,
  };
}

function loop() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((p) => {
    p.vy += p.gravity;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === "rect") {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  particles = particles.filter((p) => p.y < window.innerHeight + 40);
  if (particles.length > 0) {
    rafId = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(rafId);
    rafId = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function ensureLoop() {
  if (!rafId) rafId = requestAnimationFrame(loop);
}

function confettiBurst(x, y, count = reduced ? 24 : 70) {
  for (let i = 0; i < count; i++) {
    particles.push(makeParticle(x, y, { lift: 6 + Math.random() * 6, spread: 1.1 }));
  }
  ensureLoop();
}

function confettiRain(count = reduced ? 40 : 130) {
  for (let i = 0; i < count; i++) {
    particles.push(
      makeParticle(Math.random() * window.innerWidth, -20, {
        vy: 2 + Math.random() * 3,
        angle: Math.PI / 2,
        speed: 0,
        spread: 0,
      })
    );
    // give rain a little sideways drift
    particles[particles.length - 1].vx = (Math.random() - 0.5) * 3;
  }
  ensureLoop();
}

/* =====================================================================
   Floating sparkle-hearts on click
   ===================================================================== */
const HEARTS = ["🤍", "💛", "🩷", "🌟"];
let heartIdx = 0;
function floatHeart(x, y) {
  if (reduced) return;
  const el = document.createElement("span");
  el.textContent = HEARTS[heartIdx++ % HEARTS.length];
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:55;
    pointer-events:none;font-size:${18 + Math.random() * 14}px;
    transform:translate(-50%,-50%);will-change:transform,opacity;`;
  document.body.appendChild(el);
  const dx = (Math.random() - 0.5) * 80;
  el.animate(
    [
      { transform: "translate(-50%,-50%) scale(0.4)", opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), -130px) scale(1.2)`, opacity: 0 },
    ],
    { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(0.22,0.61,0.36,1)" }
  ).onfinish = () => el.remove();
}

/* =====================================================================
   Balloons in the hero — click to pop, then respawn
   ===================================================================== */
const balloonLayer = $("#balloons");
const BALLOON_COLORS = ["#F7A9C4", "#FFB4A2", "#FFC97A", "#A8E0D0", "#B6A8E0"];
// keep balloons in the top and bottom bands so they never cover the greeting
const SLOTS = [
  { left: "5%",  top: "13%" }, { left: "27%", top: "7%" },
  { left: "66%", top: "7%" },  { left: "91%", top: "15%" },
  { left: "12%", top: "86%" }, { left: "86%", top: "87%" },
];

function spawnBalloon(slot) {
  const b = document.createElement("button");
  b.className = "balloon";
  b.setAttribute("aria-hidden", "true");
  b.tabIndex = -1;
  b.style.left = slot.left;
  b.style.top = slot.top;
  b.style.setProperty("--bal", BALLOON_COLORS[(Math.random() * BALLOON_COLORS.length) | 0]);
  b.style.setProperty("--sway", 4 + Math.random() * 3 + "s");
  b.style.setProperty("--delay", Math.random() * 2 + "s");
  b.addEventListener("click", (e) => {
    const r = b.getBoundingClientRect();
    b.classList.add("pop");
    // playBalloonPop();
    confettiBurst(r.left + r.width / 2, r.top + r.height / 2, reduced ? 10 : 22);
    setTimeout(() => b.remove(), 260);
    setTimeout(() => spawnBalloon(slot), 2600 + Math.random() * 2200);
    e.stopPropagation();
  });
  balloonLayer.appendChild(b);
}

function buildBalloons() {
  const slots = window.innerWidth < 620 ? SLOTS.slice(0, 3) : SLOTS;
  slots.forEach((s, i) => setTimeout(() => spawnBalloon(s), 400 + i * 200));
}

/* =====================================================================
   Cake — flames flicker, get blown out, then a wish
   ===================================================================== */
const CANDLE_COUNT = 5;
const candlesEl = $("#candles");
const cakeSection = $("#cakeSection");
const blowBtn = $("#blowBtn");
const relightBtn = $("#relightBtn");
let wishDone = false;

function buildCandles() {
  candlesEl.innerHTML = "";
  for (let i = 0; i < CANDLE_COUNT; i++) {
    const c = document.createElement("div");
    c.className = "candle";
    c.innerHTML = `<span class="stick"></span><span class="smoke"></span><span class="flame" title="blow me out"></span>`;
    const flame = c.querySelector(".flame");
    flame.style.animationDelay = (i * 0.09).toFixed(2) + "s";
    flame.addEventListener("click", (e) => {
      extinguish(c);
      e.stopPropagation();
    });
    candlesEl.appendChild(c);
  }
}

function extinguish(candle) {
  if (candle.classList.contains("out")) return;
  candle.classList.add("out");
  checkAllOut();
}

function checkAllOut() {
  const left = candlesEl.querySelectorAll(".candle:not(.out)").length;
  if (left === 0 && !wishDone) {
    wishDone = true;
    onAllOut();
  }
}

function blowAll() {
  const candles = [...candlesEl.querySelectorAll(".candle:not(.out)")];
  candles.forEach((c, i) => setTimeout(() => extinguish(c), i * 180));
}

function onAllOut() {
  cakeSection.classList.add("dimmed");
  blowBtn.hidden = true;
  runWishSequence(["Close your eyes…", "Make a wish 🌟", `Happy Birthday, ${CONFIG.name} 🤍`]);
}

function relight() {
  wishDone = false;
  candlesEl.querySelectorAll(".candle").forEach((c) => c.classList.remove("out"));
  cakeSection.classList.remove("dimmed");
  relightBtn.hidden = true;
  blowBtn.hidden = false;
}

/* wish overlay ------------------------------------------------------- */
const overlay = $("#wishOverlay");
const wishLine = $("#wishLine");

function runWishSequence(lines) {
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("show"));
  wishLine.textContent = lines[0];
  wishLine.style.transition = "opacity 0.35s ease";

  let i = 0;
  const advance = () => {
    i++;
    if (i < lines.length) {
      wishLine.style.opacity = "0";
      setTimeout(() => {
        wishLine.textContent = lines[i];
        wishLine.style.opacity = "1";
      }, 350);
      setTimeout(advance, 1700);
    } else {
      finishWish();
    }
  };
  setTimeout(advance, 1700);
}

function finishWish() {
  const rect = $("#cake").getBoundingClientRect();
  overlay.classList.remove("show");
  setTimeout(() => (overlay.hidden = true), 800);
  confettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, reduced ? 30 : 90);
  relightBtn.hidden = false;
}

/* =====================================================================
   Gift — tap to unwrap
   ===================================================================== */
const gift = $("#gift");
const giftMessage = $("#giftMessage");
function setupGift() {
  gift.addEventListener("click", () => {
    const opening = !gift.classList.contains("open");
    gift.classList.toggle("open");
    if (opening) {
      giftMessage.hidden = false;
      requestAnimationFrame(() => giftMessage.classList.add("show"));
      const r = gift.getBoundingClientRect();
      confettiBurst(r.left + r.width / 2, r.top, reduced ? 18 : 46);
    } else {
      giftMessage.classList.remove("show");
    }
  });
}

/* =====================================================================
   Gallery — click or activate a photo to flip to its description
   ===================================================================== */
function setupGallery() {
  document.querySelectorAll(".polaroid").forEach((p) => {
    const toggleFlip = () => p.classList.toggle("flipped");
    p.addEventListener("click", toggleFlip);
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
    });
  });
}

/* =====================================================================
   Letter — words rise in one by one
   ===================================================================== */
const letterBody = $("#letterBody");
const letterSign = $("#letterSign");
const letterBtn = $("#letterBtn");
let letterRevealed = false;

function buildLetter() {
  const text = letterBody.dataset.letter || "";
  const paragraphs = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  letterBody.innerHTML = paragraphs
    .map((paragraph) => {
      const words = paragraph
        .split(/\s+/)
        .map((word) => `<span class="word">${word}</span>`)
        .join(" ");
      return `<span class="letter-paragraph">${words}</span>`;
    })
    .join("");
}

function revealLetter() {
  if (letterRevealed) return;
  letterRevealed = true;
  const words = letterBody.querySelectorAll(".word");
  words.forEach((w, i) => setTimeout(() => w.classList.add("in"), reduced ? 0 : i * 85));
  const total = reduced ? 150 : words.length * 85 + 400;
  setTimeout(() => {
    letterSign.textContent = CONFIG.sign;
    letterSign.classList.add("show");
  }, total);
  letterBtn.style.display = "none";
}

/* =====================================================================
   Scroll-triggered reveals for section headings & cards
   ===================================================================== */
function setupScrollReveals() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll(".reveal-up").forEach((el) => io.observe(el));
}

const musicBtn = $("#musicBtn");
const birthdaySong = $("#birthdaySong");

function updateMusicButton() {
  const playing = !birthdaySong.paused;
  musicBtn.setAttribute("aria-pressed", String(playing));
  musicBtn.title = playing ? "Pause music" : "Play music";
}

function toggleMusic() {
  if (birthdaySong.paused) {
    birthdaySong.play().catch(() => {});
  } else {
    birthdaySong.pause();
  }
  updateMusicButton();
}

/* =====================================================================
   Wire everything up
   ===================================================================== */
function init() {
  sizeCanvas();
  buildStars();
  buildLights();
  buildTitle();
  buildName();
  buildBalloons();
  buildCandles();
  buildLetter();
  revealHeroCopy();
  setupGift();
  setupGallery();
  setupScrollReveals();

  // hero celebrate
  $("#celebrateBtn").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    confettiBurst(r.left + r.width / 2, r.top + r.height / 2);
    confettiRain();
  });

  // cake buttons
  blowBtn.addEventListener("click", blowAll);
  relightBtn.addEventListener("click", relight);

  // letter button
  letterBtn.addEventListener("click", revealLetter);

  // dock
  musicBtn.addEventListener("click", toggleMusic);
  birthdaySong.addEventListener("play", updateMusicButton);
  birthdaySong.addEventListener("pause", updateMusicButton);
  birthdaySong.play().catch(updateMusicButton);

  // footer finale
  $("#finaleBtn").addEventListener("click", () => {
    confettiRain(reduced ? 40 : 150);
    const r = $("#finaleBtn").getBoundingClientRect();
    confettiBurst(r.left + r.width / 2, r.top, reduced ? 20 : 60);
  });

  // sparkle-hearts on click, anywhere
  document.addEventListener("click", (e) => floatHeart(e.clientX, e.clientY));

  window.addEventListener("resize", sizeCanvas);

  // a soft welcome burst once the title has popped in
  if (!reduced) setTimeout(() => confettiBurst(window.innerWidth / 2, window.innerHeight * 0.32), 1500);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
