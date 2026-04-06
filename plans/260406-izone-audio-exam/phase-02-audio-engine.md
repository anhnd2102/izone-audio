# Phase 02: Audio Engine Core
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Xây dựng `player.js` — module dùng chung cho cả 6 bài test.
Logic: Preload blob → disable seek/pause → one-time play lock.

## Implementation Steps
1. [ ] Viết hàm `loadAudioBlob(url, onProgress, onReady)`
   - XHR download file về blob
   - Callback onProgress(percent, loadedMB, totalMB)
   - Callback onReady(objectUrl)

2. [ ] Viết hàm `createLockedPlayer(audioEl)`
   - Gắn `pause` event → auto resume nếu chưa ended
   - Gắn `seeking` event → reset về currentTime (chặn tua)
   - Không expose controls

3. [ ] Viết hàm `hasPlayed(testId)` → đọc localStorage
4. [ ] Viết hàm `markPlayed(testId)` → ghi localStorage
5. [ ] Viết hàm `initPlayer(config)` — entry point nhận config từ mỗi test page:
   ```js
   initPlayer({
     testId: 'test-1',
     audioUrl: 'https://github.com/.../audio.mp3',
     soundcheckUrl: 'https://github.com/.../soundcheck.mp3',
     timeStart: { h: 18, m: 45 },
     timeEnd:   { h: 19, m: 5  },
   })
   ```

6. [ ] Handle edge cases:
   - Audio load fail → hiện lỗi + nút retry
   - Browser không hỗ trợ Blob URL → fallback thông báo
   - Người dùng đã nghe → block toàn bộ UI, hiện thông báo

## Files to Create/Modify
- `assets/js/player.js` — toàn bộ engine
- `assets/js/config.js` — constants (URLs, time windows)

## Test Criteria
- [ ] Khi audio đang phát, nhấn pause trên keyboard → tự resume
- [ ] Không seek được (progress bar read-only)
- [ ] Sau khi nghe xong, F5 lại → hiện "Bạn đã nghe bài này rồi"
- [ ] Mở incognito → có thể nghe lại (expected behavior)

---
Next Phase: [phase-03-soundcheck.md](phase-03-soundcheck.md)
