# Design Document – BrightEdge CRUX Dashboard

## 1. Problem Statement
The goal is to build a dashboard where a user can input one or multiple URLs and quickly visualize their Core Web Vitals metrics using Google CRUX API. The UI should show individual URL results + aggregated summary + comparison charts.

## 2. Goals
- Allow multiple URL inputs
- Fetch CRUX metrics per URL
- Display metrics in table + charts
- Enable sorting & filtering of columns
- Calculate averages & summary (good / need improvement / poor)

## 3. Non-Goals
(Not included due to assignment scope)
- No database persistence
- No authentication
- No historical trend storage
- No organization/user management

## 4. Technology Choices
| Part | Tech | Reason |
|---|---|---|
| Frontend | React + Vite + TypeScript | Fast setup + type safety |
| UI Components | Material UI | Quick table, progress, dropdown |
| Charts | Recharts | Simple for bar/area visualizations |
| Backend | Node + Express | Simple REST API proxy |
| API | Google CRUX (Chrome UX Report) | Required by assignment |

### Why separate backend?
- Hide API key from frontend
- Normalize response before UI
- Avoid CORS issues
- Prevent exposing key

## 5. Architecture
```
[ React App ]  →  POST /getCrux  → [ Express Server ] → Google CRUX API
```

## 6. Data Model
```ts
type CruxRow = {
  id: number;
  url: string;
  status: "ok" | "error";
  fcp?: number;
  lcp?: number;
  cls?: number | string;
  inp?: number;
  errorMessage?: string;
};
```

## 7. UX Decisions
- Single page UX for faster usage
- Progress bars per metric for intuitive rating
- Conditional column visibility to reduce noise
- Summary cards for overall health overview

## 8. Trade-offs
| decision | alternative | reason |
|---|---|---|
| client-side sorting | server-side sorting | dataset is small |
| no DB | DB store | assignment scope |
| inline CSS + few classes | CSS modules | faster initial coding |

## 9. Limitations / Known Issues
- Input is not validated fully as URL format → user must type `https://`
- Free CRUX API key has rate limit
- Large number of URL inputs can slow down chart rendering

## 10. Future Improvements
- Add API caching layer (Redis)
- Add user login & saved dashboards
- Add date range selection
- Export CSV / PDF
- Store historical performance trends
