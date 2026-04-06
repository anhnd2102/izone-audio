# Phase 04: Time-Lock Logic
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Nút "Phát Audio Thi Thật" chỉ enable trong khung giờ 18:45 - 19:05.
Tham khảo logic `checkTimeWindow()` trong term-test-1-audio.md.

## Time Windows
| Bài | Giờ mở | Giờ đóng |
|-----|--------|----------|
| Test 1-6 | 18:45 | 19:05 |
| (Có thể config khác nhau mỗi bài) |

## Implementation Steps
1. [ ] Hàm `isInTimeWindow(start, end)` → trả về boolean
   - So sánh giờ LOCAL của thiết bị người dùng
   - ⚠️ Lưu ý: dùng giờ local, không phải UTC

2. [ ] `setInterval(checkTimeWindow, 5000)` — check mỗi 5 giây
   - Nếu chưa đến giờ: button disabled + hiện countdown "Còn X phút"
   - Nếu trong giờ: button enabled + hiện "Đã đến giờ thi"
   - Nếu qua giờ: button disabled + hiện "Đã hết giờ"

3. [ ] Countdown timer hiển thị trực quan:
   ```
   "Bài thi mở lúc 18:45 | Còn 00:23:15"
   ```

4. [ ] Config per-test (mỗi bài có thể có giờ khác nhau):
   ```js
   initPlayer({
     timeStart: { h: 18, m: 45 },
     timeEnd:   { h: 19, m: 5  },
   })
   ```

5. [ ] Edge case: người dùng đổi giờ máy → không có server-side protection (acceptable cho use case này)

## UI States
| State | Button | Notice |
|-------|--------|--------|
| Chưa đến giờ | Disabled 🔒 | "Còn XX:XX" (đỏ) |
| Trong giờ | Enabled ✅ | "Đã đến giờ thi" (xanh) |
| Qua giờ | Disabled 🔒 | "Đã hết giờ" (xám) |
| Đã nghe rồi | Disabled 🔒 | "Bạn đã nghe bài này" (xám) |

## Test Criteria
- [ ] Đổi giờ máy sang 18:44 → button disabled
- [ ] Đổi giờ máy sang 18:45 → button tự enable trong vòng 5s
- [ ] Đổi giờ máy sang 19:06 → button disabled lại
- [ ] Countdown hiển thị đúng

---
Next Phase: [phase-05-ui-brand.md](phase-05-ui-brand.md)
