# Phase 06: Multi-Test & Index Page
Status: ⬜ Pending
Dependencies: Phase 02, 03, 04, 05

## Objective
Tạo 6 test pages + trang index chọn bài.
Mỗi test page chỉ là config wrapper gọi `initPlayer()`.

## Implementation Steps

### 6 Test Pages (test-1.html → test-6.html)
1. [ ] Mỗi file chỉ ~20 dòng — import player.js + gọi initPlayer với config:
   ```html
   <script src="assets/js/player.js"></script>
   <script>
     initPlayer({
       testId: 'test-1',
       testName: 'IELTS Listening - Term Test 1',
       audioUrl: 'https://github.com/USER/REPO/releases/download/test-1/audio.mp3',
       soundcheckUrl: 'https://github.com/USER/REPO/releases/download/assets/soundcheck.mp3',
       timeStart: { h: 18, m: 45 },
       timeEnd:   { h: 19, m: 5  },
     });
   </script>
   ```
2. [ ] Tạo 6 files (test-1 đến test-6) từ template trên

### Index Page (index.html)
3. [ ] Danh sách 6 bài test dạng card
4. [ ] Mỗi card hiện:
   - Tên bài test
   - Badge "Đã nghe" / "Chưa nghe" (đọc từ localStorage)
   - Link vào trang thi
5. [ ] Header IZONE branding
6. [ ] ⚠️ Không hiện link trực tiếp đến audio file trên page

## File Structure
```
test-1.html  ← initPlayer({ testId: 'test-1', ... })
test-2.html  ← initPlayer({ testId: 'test-2', ... })
...
test-6.html  ← initPlayer({ testId: 'test-6', ... })
index.html   ← Danh sách 6 bài + status localStorage
```

## Test Criteria
- [ ] Mở test-1.html → audio Test 1 load
- [ ] Mở test-2.html → audio Test 2 load (khác file)
- [ ] index.html hiện đúng badge "Đã nghe" sau khi nghe xong test-1
- [ ] 6 trang đều độc lập, không ảnh hưởng nhau

---
Next Phase: [phase-07-deploy.md](phase-07-deploy.md)
