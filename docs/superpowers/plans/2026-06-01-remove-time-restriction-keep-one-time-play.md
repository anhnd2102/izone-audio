# Remove Time Restriction, Keep One-Time Play Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove fixed time-window gating from the audio player so students can listen anytime, while preserving one-time play per browser/device per test.

**Architecture:** Keep the existing single-file runtime (`assets/js/player.js`) and remove only time-window branches/constants/helpers. Preserve current localStorage attempt lock (`izone_played_${CONFIG.testId}`), playback guardrails, and UI structure. Keep `?dev` support for bypassing already-played lock during testing.

**Tech Stack:** Static HTML/CSS/JavaScript, browser localStorage/sessionStorage, Python static server for manual verification.

---

## File Structure and Responsibilities

- **Modify:** `assets/js/player.js`
  - Remove time-window constants and helper functions.
  - Simplify `updateTimeNotice()` so it no longer enforces clock-based access.
  - Keep existing one-time lock flow (`storageKey`, `hasPlayed`, `markPlayed`, init lock gate).
- **Create:** `docs/superpowers/plans/2026-06-01-remove-time-restriction-keep-one-time-play.md` (this plan)
- **No code changes expected:** `index.html`, `assets/css/style.css`, per-test wrapper HTML files.

---

### Task 1: Capture Baseline and Define Failure/Success Checks

**Files:**
- Modify: _None_
- Test: Manual checks against `http://localhost:8000/<test-page>.html`

- [ ] **Step 1: Record current behavior checklist (failing criteria for target behavior)**

```text
Current expected baseline before code change:
1) If outside TIME_START/TIME_END window, Play is blocked.
2) If inside window and audio loaded, Play can be enabled.
3) If localStorage key izone_played_<testId> is 1 (and no ?dev), page locks.
```

- [ ] **Step 2: Start local static server**

Run: `python -m http.server 8000`
Expected: terminal shows `Serving HTTP on ... port 8000 ...`

- [ ] **Step 3: Verify baseline behavior manually (document quick notes)**

Run in browser:
- `http://localhost:8000/index.html`
- One test page URL (example): `http://localhost:8000/1xjm77.html`

Expected before change:
- Time notice controls availability by current time.
- One-time lock appears after first playback in same browser profile.

- [ ] **Step 4: Commit baseline notes (optional if no file changed)**

```bash
git status --short
```

Expected: no plan-related code changes yet.

---

### Task 2: Remove Time-Window Gating from Player Runtime (TDD-style red → green)

**Files:**
- Modify: `assets/js/player.js`
- Test: Manual browser verification on one test page

- [ ] **Step 1: Write the failing test (manual red state definition)**

```text
Failing condition (current code):
Outside configured clock window, user cannot start main playback even when audio is loaded.
Target behavior:
After load, playback readiness must no longer depend on clock time.
```

- [ ] **Step 2: Implement minimal code changes in `assets/js/player.js`**

Apply this exact edit strategy:

1) Keep:
```js
const DEV_MODE = new URLSearchParams(window.location.search).has('dev');
```

2) Delete these time-window constants:
```js
const TIME_START = { h: 18, m: 45 };
const TIME_END   = { h: 19, m: 5  };
```

3) Delete these time-window helpers entirely:
```js
function getMins(t) { ... }
function isInWindow() { ... }
function getSecondsUntilStart() { ... }
function formatCountdown(secs) { ... }
```

4) Replace `updateTimeNotice()` with this implementation:
```js
function updateTimeNotice() {
  if (isPlaying) return;

  const notice  = $('timeNotice');
  const text    = $('timeText');
  const cd      = $('countdown');
  const btnPlay = $('btnPlay');

  notice.className = 'time-notice open';

  if (DEV_MODE) {
    text.textContent = '🛠 DEV MODE — Played lock bypassed';
  } else {
    text.textContent = '✅ Có thể bắt đầu bài nghe ngay khi tải xong';
  }

  cd.textContent = '';

  if (isLoaded) {
    btnPlay.disabled = false;
  }
}
```

5) Keep one-time lock gate in `init()` unchanged:
```js
if (hasPlayed() && !DEV_MODE) {
  // locked UI branch (already-played)
  return;
}
```

6) Keep mark-on-start behavior unchanged in `startMainAudio()`:
```js
markPlayed();
```

- [ ] **Step 3: Run manual verification to confirm green state**

Run in browser:
- Normal mode: `http://localhost:8000/1xjm77.html`
- Dev mode: `http://localhost:8000/1xjm77.html?dev`

Expected after change:
- No clock-based block message/state.
- Once audio preload completes, Play can be started regardless of current time.
- Already-played users (without `?dev`) still see lock screen.

- [ ] **Step 4: Quick static sanity review of modified file**

Checklist:
```text
- No remaining references to TIME_START/TIME_END.
- No calls to deleted helpers.
- updateTimeNotice still safe when isPlaying = true.
- load completion path still calls updateTimeNotice().
```

- [ ] **Step 5: Commit**

```bash
git add assets/js/player.js
git commit -m "feat(player): remove time window gating and keep one-time lock"
```

Expected: one commit containing only `assets/js/player.js` change for this feature.

---

### Task 3: Validate One-Time Lock Integrity and Regression Surface

**Files:**
- Modify: _None expected_ (unless bug found)
- Test: Browser + localStorage behavior checks

- [ ] **Step 1: Validate one-time lock in same browser profile**

Manual flow:
1. Open test page without `?dev`.
2. Start playback once.
3. Refresh page.

Expected:
- Already-played panel appears (`Bạn đã nghe bài này rồi`).
- Play and soundcheck controls remain hidden.

- [ ] **Step 2: Validate per-device/profile scope**

Manual flow:
- Open same URL in a different browser profile (or another device).

Expected:
- One play is available there (fresh localStorage scope).

- [ ] **Step 3: Validate `?dev` behavior remains for testing**

Manual flow:
- Open locked page with `?dev` suffix.

Expected:
- Already-played lock is bypassed for test/debug.
- Playback can be started after load.

- [ ] **Step 4: Validate unchanged playback restrictions**

Checklist during playback:
```text
- Pause attempt auto-resumes.
- Seek-forward/backward prevention still active.
- beforeunload warning appears during active playback.
- End-state screen still appears when audio ends.
```

- [ ] **Step 5: Commit regression/fix follow-up (only if needed)**

```bash
git add assets/js/player.js
git commit -m "fix(player): preserve playback guardrails after time-lock removal"
```

Expected: skip this commit if no follow-up changes are needed.

---

### Task 4: Final Verification and Handoff

**Files:**
- Modify: _None_
- Test: End-to-end manual exam flow

- [ ] **Step 1: Run end-to-end flow from teacher gate**

Manual flow:
1. Open `http://localhost:8000/index.html`
2. Login teacher gate.
3. Open one mapped test page.

Expected:
- Test page loads normally.
- No dependency on clock time for playback availability.

- [ ] **Step 2: Confirm no unintended file changes**

```bash
git status --short
```

Expected:
- Only intended files are modified/committed.

- [ ] **Step 3: Document release note (in PR/commit description)**

```text
Removed fixed time-window gating from player runtime.
One-time listen lock per browser/device/testId remains unchanged.
Dev mode (?dev) remains available for testing.
```

- [ ] **Step 4: Final commit if documentation change exists**

```bash
git add <doc-files-if-any>
git commit -m "docs: note always-open playback with one-time lock"
```

Expected: skip if no documentation file is updated.

---

## Self-Review Against Spec

1. **Spec coverage:**
- Remove time-window restrictions: covered in Task 2.
- Preserve one-time lock with same key pattern: covered in Task 2 + Task 3.
- Preserve playback guardrails and `onbeforeunload`: covered in Task 3.
- Keep teacher gate/index mapping unchanged: covered in Task 4 verification.
- Keep `?dev` bypass for testing: covered in Task 2 + Task 3.

2. **Placeholder scan:**
- No `TBD`, `TODO`, or “implement later” placeholders.
- Commands and code snippets are concrete.

3. **Type/signature consistency:**
- Uses existing function names consistently: `updateTimeNotice`, `hasPlayed`, `markPlayed`, `startMainAudio`, `storageKey`.
- localStorage key format consistently referenced as `izone_played_${CONFIG.testId}`.
