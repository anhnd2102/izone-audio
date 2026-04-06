# Phase 03: Sound Check Flow
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Popup kiểm tra âm lượng trước khi thi. Dùng file nhạc riêng (soundcheck.mp3).
Tham khảo logic đã có trong term-test-1-audio.md.

## Flow
```
Trang load xong → Blob loaded → Enable nút "Thử âm lượng"
User click → Popup mở → Phát soundcheck.mp3 từ 0s
  → Tự dừng sau 30s
  → Nút "Nghe lại" → phát lại từ 0s
  → Nút "Xác nhận đã vừa tai" → đóng popup
```

## Implementation Steps
1. [ ] Preload soundcheck.mp3 riêng (blob) — song song với audio chính
2. [ ] UI Popup (modal) với 3 trạng thái:
   - `playing`: "Đang phát... điều chỉnh âm lượng"
   - `paused`: "Đã dừng. Nghe lại hoặc xác nhận."
   - `confirmed`: modal đóng
3. [ ] Nút "Nghe lại" có thể click nhiều lần (không giới hạn)
4. [ ] Sau khi confirm → set flag `soundcheckDone = true` (in-memory, không cần persist)
5. [ ] Soundcheck audio phải DỪNG hoàn toàn khi bắt đầu bài thi thật

## UI Components
- Modal overlay
- Waveform animation đơn giản khi đang phát (CSS animation)
- Volume icon indicator

## Test Criteria
- [ ] Popup tự mở khi click "Thử âm lượng"
- [ ] Audio dừng đúng ở giây thứ 30
- [ ] Nghe lại được nhiều lần
- [ ] Sau confirm, soundcheck audio hoàn toàn dừng
- [ ] Không ảnh hưởng đến audio chính

---
Next Phase: [phase-04-timelock.md](phase-04-timelock.md)
