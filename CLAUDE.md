# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Type
Static, client-only audio exam player (no build step, no backend, no package manager config).

## Development Commands
Because this repo has no `package.json`, lint config, or test runner, development is done by serving static files and manually testing flows.

- Start local static server (Python):
  - `python -m http.server 8000`
- Open app:
  - `http://localhost:8000/index.html`
- Open one test page directly (single-page/manual "single test" run):
  - `http://localhost:8000/1xjm77.html`

Notes:
- No build command is configured.
- No lint command is configured.
- No automated test command is configured.

## High-Level Architecture

### 1) Entry and teacher gate (`index.html`)
- `index.html` is the teacher-facing entry page.
- It contains:
  - Hardcoded gate password (`GV_PASSWORD`).
  - Session auth flag in `sessionStorage` (`izone_gv_auth`).
  - `TESTS` array mapping visible test labels to page filenames (currently randomized names like `1xjm77.html`, `666w9y.html`, etc.).
- After successful gate login, it renders links to test pages from `TESTS`.

### 2) Per-test wrappers (`*.html` except `index.html`)
- Each test page is intentionally thin and only does two things:
  1. Defines global `CONFIG` object.
  2. Loads shared runtime script `assets/js/player.js`.
- Expected `CONFIG` fields:
  - `testId`
  - `testName`
  - `audioUrl`
  - `soundcheckUrl`

### 3) Shared runtime (`assets/js/player.js`)
`player.js` is the core application engine. It dynamically builds the full UI and owns all playback/state rules.

Key responsibilities:
- Blob-based preload for both soundcheck and main audio (`XMLHttpRequest` + `blob` object URL).
- Time-lock enforcement via fixed `TIME_START` / `TIME_END` constants.
- One-time play rule per test using `localStorage` key prefix `izone_played_` + `testId`.
- Playback restrictions:
  - Blocks pausing (auto-resume when paused before end).
  - Blocks seeking/fast-forward via `timeupdate` checks.
  - Adds `onbeforeunload` warning while active playback is in progress.
- UI state machine inside a single script:
  - loading → soundcheck confirmation → play-ready → playing → ended.

### 4) Styling (`assets/css/style.css`)
- Single global stylesheet for both index gate and player runtime UI.
- Includes brand typography/colors and component styles used by HTML and DOM generated in `player.js`.

## Behavior Modes and Important Constraints
- Dev bypass mode is query-param based: `?dev`
  - Bypasses already-played lock.
  - Bypasses time-window lock.
- Keep filename mapping synchronized:
  - If renaming any test HTML file, update corresponding `href` in `index.html` `TESTS` array.
- Keep `CONFIG.testId` stable when possible:
  - Changing `testId` changes localStorage key, which resets "already played" tracking for that page.
- `player.js` depends on global `CONFIG` existing before script execution.

## Audio Hosting Assumptions
- Test pages currently point to externally hosted MP3 URLs (Cloudflare R2 public URLs).
- App assumes those URLs support direct browser fetch for blob loading.

## Project Skills (`.claude/skills`)
When working in this repo, prefer existing local slash-skills before inventing ad-hoc flow:
- `/Code` for implementation workflow.
- `/Debug` for issue investigation.
- `/test` for manual quality checks.
- `/run` for launch/run workflow.
- `/Deploy` for release/deployment flow.
- `/Audit` before deployment/security-sensitive changes.
- `/next` to recover progress when context is unclear.
- `/save_brain` to persist important project learnings.

Use these as first-class workflows for consistency with this repository’s established process.