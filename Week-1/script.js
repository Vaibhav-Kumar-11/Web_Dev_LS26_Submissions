// =====================================================
// VOLUME CONTROL — Arrow-Key Reflex Mechanic
//
// Core idea:
//   - A random arrow flashes briefly inside the arrow-zone
//   - Press the matching arrow key before it disappears -> volume up
//   - Miss the window or press the wrong key -> volume penalty
//   - A separate leak runs CONSTANTLY regardless of input
//   - As volume rises, both the flash duration shrinks AND leak
//     rate increases -> high volume becomes nearly unsustainable
// =====================================================

const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const SYMBOLS = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' };

// --- State ---
let volume = 50;
let currentKey = null;
let awaitingInput = false;
let flashTimeout = null;
let nextPromptTimeout = null;
let leakInterval = null;
let gameOver = false;

// --- DOM ---
const volNumber = document.getElementById('volNumber');
const volFill   = document.getElementById('volFill');
const arrowSlot = document.getElementById('arrowSlot');
const app       = document.querySelector('.app');
const gameOverEl = document.getElementById('gameOver');
const gameOverText = document.getElementById('gameOverText');
const resetBtn  = document.getElementById('resetBtn');

// --- Tuning ---
// Flash duration shrinks as volume rises: at vol 0 you get ~1100ms, at vol 100 you get ~250ms
function flashDuration() {
  return Math.max(250, 1100 - volume * 8.5);
}

// Gap between prompts also shrinks slightly at high volume (less breathing room)
function gapDuration() {
  return Math.max(350, 900 - volume * 4);
}

// Leak rate scales with volume — higher volume drains faster
function leakRate() {
  return 0.25 + (volume / 100) * 0.55;
}

const GAIN_CORRECT = 6;
const PENALTY_WRONG = 8;
const PENALTY_MISS  = 5;

// --- Render ---
function render() {
  volume = Math.max(0, Math.min(100, volume));
  const v = Math.round(volume);

  volNumber.textContent = v;
  volFill.style.width = v + '%';

  volNumber.classList.toggle('dropping', v < 40 && v > 0);
  volNumber.classList.toggle('critical', v <= 15);
  volFill.classList.toggle('dropping', v < 40);

  if (v <= 0 && !gameOver) {
    triggerGameOver();
  }
}

function triggerGameOver() {
  gameOver = true;
  clearTimeout(flashTimeout);
  clearTimeout(nextPromptTimeout);
  clearInterval(leakInterval);
  arrowSlot.classList.remove('show', 'correct', 'wrong');
  arrowSlot.textContent = '—';
  gameOverText.textContent = 'VOLUME 0 — SILENCE ACHIEVED';
  gameOverEl.classList.remove('hidden');
}

// --- Leak: always running, independent of game state ---
function startLeak() {
  leakInterval = setInterval(() => {
    if (gameOver) return;
    volume -= leakRate();
    render();
  }, 200);
}

// --- Prompt cycle ---
function scheduleNextPrompt() {
  if (gameOver) return;
  nextPromptTimeout = setTimeout(showPrompt, gapDuration());
}

function showPrompt() {
  if (gameOver) return;
  currentKey = KEYS[Math.floor(Math.random() * KEYS.length)];
  awaitingInput = true;

  arrowSlot.textContent = SYMBOLS[currentKey];
  arrowSlot.classList.remove('correct', 'wrong');
  arrowSlot.classList.add('show');

  flashTimeout = setTimeout(() => {
    if (awaitingInput) {
      // Missed it — too slow
      awaitingInput = false;
      volume -= PENALTY_MISS;
      render();
      flashOutcome('wrong');
    }
  }, flashDuration());
}

function flashOutcome(type) {
  arrowSlot.classList.remove('show');
  arrowSlot.classList.add(type);
  setTimeout(() => {
    arrowSlot.classList.remove(type);
    arrowSlot.textContent = '—';
    scheduleNextPrompt();
  }, 180);
}

// --- Input handling ---
document.addEventListener('keydown', (e) => {
  if (gameOver) return;
  if (!KEYS.includes(e.key)) return;
  e.preventDefault();

  if (!awaitingInput) return; // pressing outside the window does nothing

  awaitingInput = false;
  clearTimeout(flashTimeout);

  if (e.key === currentKey) {
    volume += GAIN_CORRECT;
    flashOutcome('correct');
  } else {
    volume -= PENALTY_WRONG;
    flashOutcome('wrong');
  }
  render();
});

// --- Reset ---
resetBtn.addEventListener('click', () => {
  clearTimeout(flashTimeout);
  clearTimeout(nextPromptTimeout);
  clearInterval(leakInterval);

  volume = 50;
  gameOver = false;
  awaitingInput = false;
  currentKey = null;

  arrowSlot.classList.remove('show', 'correct', 'wrong');
  arrowSlot.textContent = '—';
  gameOverEl.classList.add('hidden');

  render();
  startLeak();
  scheduleNextPrompt();
});

// --- Init ---
render();
startLeak();
scheduleNextPrompt();
