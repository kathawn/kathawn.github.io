# Portfolio — Nguyen Minh Quan

React 19 + React Three Fiber + GSAP (ScrollTrigger) + Lenis.

## Chạy
```
npm install
npm run dev        # http://localhost:5173
npm run build      # xuất ra dist/ để deploy (Vercel, Netlify, GitHub Pages)
npm run build:single   # 1 file HTML tự chứa: dist/index.html
```

## Sửa nội dung
Toàn bộ chữ và số liệu nằm trong `src/content.ts`.

## Cấu trúc
- `src/App.tsx` — các section, hiệu ứng GSAP, cuộn mượt Lenis
- `src/scene/Scene.tsx` — cảnh 3D (24 thẻ instanced, đường nối, vé QR, bloom)
- `src/scene/layouts.ts` — 6 bố cục 3D tương ứng 6 section
- `src/scene/rig.ts` — trạng thái dùng chung giữa GSAP và R3F
- `src/styles.css` — giao diện
