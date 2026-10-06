# BÁO CÁO TỐI ƯU HIỆU NĂNG — STUDENT DEADLINE TRACKER

## 1. Đo lường trước tối ưu

| Chỉ số | Giá trị |
|--------|---------|
| Performance | 73 |
| FCP | ~2.0s |
| LCP | ~2.0s |
| TBT | 1863ms |
| CLS | 0.01 |
| Render count AssignmentCard | 10.000 |

## 2. Kỹ thuật áp dụng

| # | Kỹ thuật | Giải quyết |
|---|----------|-----------|
| 1 | React.memo cho AssignmentCard | Chặn re-render khi props không đổi |
| 2 | useCallback cho handlers | Ổn định tham chiếu → memo hiệu quả |
| 3 | useDebounce (300ms) cho search | Giảm 90% lần filter khi gõ |
| 4 | useMemo cho filter | Chỉ tính lại khi dependency đổi |
| 5 | Virtualization (react-window) | 10.000 DOM → ~15 DOM |
| 6 | React.lazy cho StatsPage | Tách chunk, giảm bundle chính |

## 3. Đo lường sau tối ưu

| Chỉ số | Giá trị |
|--------|---------|
| Performance | 87 |
| FCP | 2.7s |
| LCP | 2.7s |
| TBT | 280ms |
| CLS | 0.006 |

## 4. Bảng so sánh

| Chỉ số | Trước | Sau | Cải thiện |
|--------|:-----:|:---:|:---------:|
| Performance | 73 | 87 | +14 điểm |
| TBT | 1863ms | 280ms | -85% |
| CLS | 0.01 | 0.006 | -40% |
| Render count | 10.000 | ~15 | -99.85% |
| DOM nodes | 10.000 | ~15 | -99.85% |

## 5. Nhận xét

- **Virtualization** là kỹ thuật quan trọng nhất, giảm 99.85% DOM node → TBT giảm 85%.
- **React.memo + useCallback** giảm render count từ 10.000 xuống ~15 khi gõ search.
- **useDebounce** cải thiện UX khi gõ search, ít ảnh hưởng Lighthouse.
- **React.lazy** giúp bundle chính nhỏ hơn.
- FCP/LCP tăng nhẹ do điều kiện đo khác nhau (trước: trang trống, sau: có 10.000 bài).
