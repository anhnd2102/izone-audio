# Phase 01: Setup & Repo Structure
Status: ⬜ Pending
Dependencies: None

## Objective
Tạo cấu trúc thư mục, khởi tạo GitHub repo, cấu hình GitHub Pages.

## Implementation Steps
1. [ ] Tạo folder structure trên máy local
   ```
   /index.html
   /test-1.html ... test-6.html
   /assets/css/style.css
   /assets/js/player.js
   /assets/img/ (logo IZONE)
   ```
2. [ ] Init git repo + push lên GitHub
3. [ ] Bật GitHub Pages (Settings → Pages → Deploy from branch: main)
4. [ ] Tạo GitHub Release đầu tiên (tag: `assets`) để upload soundcheck.mp3
5. [ ] Upload soundcheck.mp3 lên Release `assets`
6. [ ] Test URL GitHub Releases có accessible không: `https://github.com/{user}/{repo}/releases/download/assets/soundcheck.mp3`

## Files to Create
- `index.html` — trang chủ placeholder
- `assets/css/style.css` — file rỗng
- `assets/js/player.js` — file rỗng
- `.gitignore` — bỏ qua files thừa
- `README.md` — ghi chú nội bộ

## Test Criteria
- [ ] GitHub Pages live tại `https://{username}.github.io/{repo}/`
- [ ] URL soundcheck.mp3 từ GitHub Releases download được

---
Next Phase: [phase-02-audio-engine.md](phase-02-audio-engine.md)
