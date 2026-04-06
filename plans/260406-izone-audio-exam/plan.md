# Plan: IZONE Audio Exam Player
Created: 2026-04-06
Status: 🟡 In Progress

## Overview
Hệ thống web tĩnh (GitHub Pages) cho phép học viên IZONE nghe audio bài thi.
- 6 bài test, mỗi bài 1 file audio riêng
- Chỉ phát trong khung giờ 18:45 - 19:05
- Không cho pause / tua lại
- Sound check bằng file nhạc riêng trước khi thi
- Host audio trên GitHub Releases

## Tech Stack
- Frontend: HTML5 / CSS3 / Vanilla JS (no framework — static site)
- Audio: Web Audio API + Blob preload (đã dùng ở term-test-1)
- Storage: localStorage (track đã nghe)
- Hosting: GitHub Pages (HTML) + GitHub Releases (audio files)
- Brand: IZONE Guidelines

## File Structure (Output)
```
/                          ← GitHub Pages root
├── index.html             ← Trang chủ / chọn bài test
├── test-1.html            ← Audio player cho Test 1
├── test-2.html
├── test-3.html
├── test-4.html
├── test-5.html
├── test-6.html
├── assets/
│   ├── css/style.css      ← IZONE brand styles
│   ├── js/player.js       ← Core audio engine (dùng lại cho 6 bài)
│   └── img/              ← Logo IZONE, bg
```

## Audio Files (GitHub Releases)
| File | URL Pattern |
|------|-------------|
| Sound check | `releases/download/assets/soundcheck.mp3` |
| Test 1 | `releases/download/test-1/audio.mp3` |
| Test 2-6 | Tương tự |

## Phases

| Phase | Tên | Status | Progress |
|-------|-----|--------|----------|
| 01 | Setup & Repo | ⬜ Pending | 0% |
| 02 | Audio Engine Core | ⬜ Pending | 0% |
| 03 | Sound Check Flow | ⬜ Pending | 0% |
| 04 | Time-Lock Logic | ⬜ Pending | 0% |
| 05 | IZONE UI / Brand | ⬜ Pending | 0% |
| 06 | Multi-test & Index Page | ⬜ Pending | 0% |
| 07 | Deploy & GitHub Releases | ⬜ Pending | 0% |

## Quick Commands
- Start: `/code phase-01`
- Check progress: `/next`
