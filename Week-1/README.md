# 🎮 Volume Control — Arrow Key Reflex Game

**Week 1 Assignment — WnCC Web Dev LS 2026**

---

## The Concept

A normal volume control lets you drag a slider. This one makes you play a reflex game against a constant leak — inspired by the arrow-matching minigames in GTA San Andreas.

A random arrow (↑ ↓ ← →) flashes briefly on screen. Press the matching key before it disappears to gain volume. Miss the window or press the wrong key and you lose volume instead. Meanwhile, a separate leak drains your volume continuously, no matter what you do.

The twist: **as your volume increases, the flash window shrinks and the leak accelerates.** At low volume you have nearly a full second to react. By volume 90+, you have roughly 300 milliseconds — close to the limit of human reaction time — while the leak is draining faster than ever. One mistake near the top costs you more than a successful press gains you. Reaching and holding high volume requires near-flawless reflexes.

---

## Why This Is Frustrating (By Design)

| Mechanic | Why it's irritating |
|---|---|
| Constant leak | Volume drops the moment you're not actively succeeding — there's no "set and forget" |
| Shrinking reaction window | The better you do, the harder the game gets — success is punished with less time |
| Wrong key penalty | Guessing carelessly costs you, not just missing |
| Leak scales with volume | High volume isn't a safe state — it actively works against you |
| No safety net | One slip near 90+ volume can undo several successful presses |

---

## How to Run

Open `index.html` in any browser. No server needed.

- Watch the arrow box.
- Press the matching arrow key (↑ ↓ ← →) before it disappears.
- Correct = volume up. Wrong or too slow = volume down.
- The leak never stops. Reaching 0 ends the run.

---

## Files

```
├── index.html    ← Structure
├── style.css     ← Minimal styling, flash/shake feedback
├── script.js     ← Game logic: reflex timing, scaling difficulty, leak system
└── README.md     ← This file
```

---

## Technical Notes

- Two independent timers drive the system: a `setInterval` leak (always running) and a `setTimeout`-based prompt cycle (flash → outcome → gap → next flash).
- Difficulty scaling is formulaic, not random: `flashDuration = max(250, 1100 - volume * 8.5)` ms, `leakRate = 0.25 + (volume/100) * 0.55` per 200ms tick. Both were tuned so volume 90+ requires near-perfect input — verified by simulating net gain per cycle assuming flawless play.
- Input is handled via a single `keydown` listener on `document` checking against the four arrow key values, only acting while a prompt is actively awaiting input — presses outside that window are ignored.
- Pure HTML/CSS/JS — no frameworks, no libraries, no build tools.
