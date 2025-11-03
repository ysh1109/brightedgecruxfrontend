# BrightEdge CRUX Vitals Dashboard

This project is a full-stack application that allows users to input multiple URLs and fetch Core Web Vitals data using the official CRUX (Chrome UX Report) API. Results are visualized in a responsive table with color-coded progress bars, detailed view modal, and summary charts.

---

## Repositories

| Layer | Repository |
|-------|------------|
| Frontend (React + TS + Vite) | https://github.com/ysh1109/brightedgecruxfrontend |
| Backend (Node + Express + TS) | https://github.com/ysh1109/brightedgecruxbackend |

---

## Features

| Feature | Status |
|--------|--------|
| Add multiple URLs at once (newline separated) | ✅ |
| CRUX API Integration | ✅ |
| Table with sorting + pagination | ✅ |
| Hide/show specific metrics (FCP/LCP/CLS/INP) | ✅ |
| Color-coded progress bars per metric | ✅ |
| View modal for each URL | ✅ |
| Summary (Averages + Good/NI/Poor counts) | ✅ |
| Charts for all metrics (Area + Bar charts) | ✅ |
| pagination will be enabled after row count greater than 5 | ✅ |
---

## Next Steps (Future Improvements)

- Auto-add https:// if user enters domain without protocol → reduce CRUX 400 errors
- Block duplicate URLs (or merge them) to avoid repeating rows
- Add slider based filtering for each metric to filter results between min-max values
- Multi-column sorting (current sorting is single column only)
- Export to CSV or Download results as Excel
- Persist data in localStorage → so results remain even after refresh

---

## Tech Stack

- **Frontend**: React + TypeScript + Vite + MUI + Recharts
- **Backend**: Node.js + Express.js + TypeScript
- **API**: Google CRUX (Chrome UX Report API)

---

## video description

https://www.loom.com/share/53f7343fcdb84097b805fe37ca7a5c09

---

## Known issues 

-CRUX API sometimes returns 400 for URLs without protocol.
 Example: youtube.com → must be https://youtube.com.

-Duplicate URL insertion is currently allowed (same URL can be added multiple times).

-Filtering + sorting currently works one column at a time (no multi-column sorting).

-Charts are rendered only for successful URLs (status = ok), failed ones are excluded.

## How to Run Locally

### Backend


cd backend
npm install
npm run dev

### Backend


cd frontend
npm install
npm run dev

```bash