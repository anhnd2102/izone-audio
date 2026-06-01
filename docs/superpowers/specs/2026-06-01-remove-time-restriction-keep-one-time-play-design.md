# Design: Remove Time Restriction, Keep One-Time Play

Date: 2026-06-01
Project: IZONE Audio Exam Player
Status: Approved for planning

## Goal
Allow students to open/listen to each test audio at any time (no fixed time window), while preserving exactly one play per browser/device per test.

## Current Behavior Summary
- Time restriction is enforced in `assets/js/player.js` via `TIME_START` / `TIME_END` and time-check logic.
- One-time play is enforced via localStorage key pattern: `izone_played_${CONFIG.testId}`.
- Dev mode (`?dev`) currently bypasses both time lock and already-played lock.

## Approved Behavior
1. Remove all time-window restrictions for normal usage.
2. Keep one-time play lock unchanged:
   - If `izone_played_${CONFIG.testId}` is set to `1`, page is locked for that browser/device.
   - When the user starts main test playback for the first time, set `izone_played_${CONFIG.testId}` to `1` immediately (same trigger point currently used in `startMainPlayback()`).
3. Keep existing playback guardrails unchanged (no pause/seek bypass behavior changes).
4. Keep teacher gate and test mapping in `index.html` unchanged.
5. Keep `?dev` as testing bypass for already-played lock.

## Design Scope (Code Changes)
Primary file: `assets/js/player.js`

### A. Remove time-lock definitions and checks
- Remove/disable constants and helper paths used only for time-window gating:
  - `TIME_START`, `TIME_END`
  - minute/second countdown helpers for opening window
  - branch logic in notice updater that blocks play before/after window

### B. Simplify readiness and notice behavior
- Replace time-dependent notice state transitions with load/ready messaging.
- Ensure play button enablement is driven by:
  - audio load readiness
  - one-time lock state (`hasPlayed()`), unless `?dev` is enabled

### C. Preserve one-time lock flow
- Keep storage key and helpers intact:
  - `storageKey() => izone_played_${CONFIG.testId}`
  - `hasPlayed()` check at initialization
  - `markPlayed()` at the existing trigger inside `startMainPlayback()`
- Keep already-played UI state as-is.

### D. Preserve existing runtime constraints
- Do not modify pause/seek restrictions.
- Do not modify `onbeforeunload` warning logic. Remove only direct references that depend on deleted time-window branches.

## Risks / Trade-offs
- By removing time windows, access control becomes entirely one-time per browser/device. This is intended and accepted.
- localStorage is user-environment scoped (clearing site data resets lock). This remains unchanged from current architecture.

## Validation Plan (Manual)
1. Open a test page at any time of day: play becomes available once preload completes.
2. Complete one listen attempt, then reload page: already-played lock appears.
3. Open same test in different browser profile/device: one play available there (expected).
4. Open with `?dev`: already-played lock is bypassed for testing.

## Out of Scope
- Server-side identity-based attempt tracking.
- Changing randomized file mapping in `index.html`.
- Altering `CONFIG.testId` values.

## Implementation Notes
- Keep edits minimal and localized to `assets/js/player.js`.
- Avoid CSS or HTML structure changes unless required by removed time-notice state classes.
