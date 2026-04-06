# Phase 07: Deploy & GitHub Releases
Status: ⬜ Pending
Dependencies: All previous phases

## Objective
Deploy lên GitHub Pages. Upload audio files lên GitHub Releases.
URL cuối: `https://{username}.github.io/{repo}/`

## GitHub Releases Structure
```
Release: assets          ← soundcheck.mp3
Release: test-1          ← audio.mp3 (bài thi 1)
Release: test-2          ← audio.mp3 (bài thi 2)
Release: test-3          ← audio.mp3
Release: test-4          ← audio.mp3
Release: test-5          ← audio.mp3
Release: test-6          ← audio.mp3
```

URL format:
`https://github.com/{user}/{repo}/releases/download/{tag}/audio.mp3`

## Implementation Steps
1. [ ] Push toàn bộ code lên GitHub (main branch)
2. [ ] Enable GitHub Pages: Settings → Pages → Source: main / root
3. [ ] Tạo Release `assets` → upload soundcheck.mp3
4. [ ] Tạo Release `test-1` → upload audio Test 1
5. [ ] Repeat cho test-2 đến test-6
6. [ ] Điền URLs thật vào từng test-X.html
7. [ ] Test toàn bộ flow trên thiết bị thật:
   - PC Chrome / Firefox
   - Mobile Chrome / Safari

## Checklist trước khi live
- [ ] Audio load được từ GitHub Releases
- [ ] Không có CORS error
- [ ] Time lock hoạt động đúng giờ
- [ ] Sound check chạy được
- [ ] Sau khi nghe xong, F5 → block đúng
- [ ] Test trên 3G (simulate slow network)

## CORS Note
GitHub Releases files có thể gặp CORS khi fetch bằng XHR từ GitHub Pages.
Giải pháp: dùng `fetch()` với `mode: 'cors'` hoặc test trực tiếp.
Nếu bị CORS → fallback sang Cloudflare R2 (free tier).

---
Plan hoàn tất ✅
