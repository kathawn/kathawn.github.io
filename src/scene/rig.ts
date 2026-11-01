/**
 * Trạng thái dùng chung giữa GSAP (DOM, scroll) và R3F (useFrame).
 * GSAP ghi, cảnh 3D đọc mỗi frame — không gây re-render React.
 */
export const rig = {
  /** chỉ số section liên tục (0..5) mà cảnh đang hiển thị (đã làm mượt) */
  p: 0,
  /** chỉ số section mục tiêu do scroll đặt */
  target: 0,
  /** tiến độ các bước BoardVerse (0..4) */
  step: 0,
  /** hiệu ứng mở màn 0 → 1 */
  intro: 0,
  /** con trỏ chuột chuẩn hoá -1..1 */
  px: 0,
  py: 0,
  reduced: false,
};

export const SECTION_COUNT = 6;
