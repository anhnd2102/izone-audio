# Phase 05: IZONE UI / Brand
Status: ⬜ Pending
Dependencies: Phase 02, 03, 04

## Objective
Áp dụng IZONE brand guidelines vào giao diện player.
Cần mày cung cấp thêm: màu sắc chính, font, logo file.

## ✅ Brand Info Đã Xác Nhận
1. **Primary Red:** `#DB0829` → dùng cho action buttons (Phát audio, CTA)
2. **Navy Blue:** `#174266` → background UI, text chính, khu vực đọc lâu
3. **Light Gray:** `#F2F2F2` → background tổng thể
4. **Dark Gray:** `#44494D` → body text
5. **Font Primary:** Ubuntu (Google Fonts - free)
6. **Font Secondary:** Source Sans Pro (Google Fonts - free)
7. **Font Accent:** Lazy Spring Day → CHỈ dùng cho "Bài thi đã kết thúc" / motivational moments
8. **Slogan:** "IELTS CHIẾN LƯỢC"
9. **Logo file** (PNG/SVG): cần copy vào `assets/img/logo.png`

## Áp dụng vào UI Player
- **Navy (#174266):** Background container, header
- **Red (#DB0829):** Nút "PHÁT AUDIO THI THẬT", progress bar fill, trạng thái "Đang phát"
- **Orange (#FF9800):** Nút "Thử âm lượng" (warning/action phụ)
- **Gray (#F2F2F2):** Background trang, disabled states

## Design Components

### Player Page Layout
```
┌─────────────────────────────┐
│  [Logo IZONE]               │
│  IELTS Listening - Test 1   │
├─────────────────────────────┤
│  ⏳ Đang tải... [Progress]  │
│  ████████░░░░ 75% (18 MB)  │
├─────────────────────────────┤
│  [🔊 Thử âm lượng]         │
│  🔒 Phát lúc 18:45          │
│  Còn: 00:23:15              │
│  [🎧 PHÁT AUDIO THI THẬT]  │
└─────────────────────────────┘
```

### Sound Check Modal
```
┌──────────────────────────┐
│  🎵 Kiểm tra âm lượng   │
│  ────────────────────── │
│  [Waveform animation]   │
│  "Đang phát 30s đầu..." │
│                          │
│  [🔄 Nghe lại]          │
│  [✅ Xác nhận đã vừa]   │
└──────────────────────────┘
```

### Playing State
```
┌─────────────────────────────┐
│  [Logo IZONE]               │
│  🎧 ĐANG PHÁT BÀI THI      │
├─────────────────────────────┤
│  ⚠️ Không làm mới trang    │
│  Không thể tạm dừng        │
│  ████████████░░ 08:42/40:00│
└─────────────────────────────┘
```

## CSS Variables Structure
```css
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Source+Sans+3:wght@400;600&display=swap');

:root {
  --color-primary:   #DB0829;  /* IZONE Red */
  --color-navy:      #174266;  /* IZONE Navy */
  --color-gray-light:#F2F2F2;
  --color-gray-dark: #44494D;
  --color-success:   #2e7d32;
  --color-warning:   #FF9800;
  --color-disabled:  #cccccc;
  --font-main:   'Ubuntu', sans-serif;
  --font-body:   'Source Sans 3', sans-serif;
  --border-radius: 8px;
  --shadow: 0 4px 12px rgba(23,66,102,0.15);
}
```

## Implementation Steps
1. [ ] Nhận màu/font từ brand guideline → điền vào CSS variables
2. [ ] Tạo `assets/css/style.css` với full design system
3. [ ] Waveform animation (CSS thuần, không cần library)
4. [ ] Responsive: mobile-first (học sinh dùng điện thoại)
5. [ ] Loading screen với logo IZONE + progress bar
6. [ ] Favicon từ logo IZONE

## Test Criteria
- [ ] Hiển thị đúng trên mobile (375px width)
- [ ] Hiển thị đúng trên desktop
- [ ] Logo load được
- [ ] Font render đúng

---
Next Phase: [phase-06-multitest.md](phase-06-multitest.md)
