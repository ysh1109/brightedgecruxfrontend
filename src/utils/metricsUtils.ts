import type { CruxRow, MetricKey } from "../types/crux";



const metrics: MetricKey[] = ["fcp", "lcp", "cls", "inp"];



export const RANGES = {
  fcp: { good: 1800, ni: 3000 },
  lcp: { good: 2500, ni: 4000 },
  cls: { good: 0.10, ni: 0.25 },
  inp: { good: 200, ni: 500 }
};


export const getSummaryCounts = (rows:CruxRow[]) => {
  let good = 0, ni = 0, poor = 0;

  rows.forEach(row => {
    const status = calculateQuality(row);
    if(status==="good") good++;
    else if(status==="ni") ni++;
    else if(status==="poor") poor++;
  });

  return { good, ni, poor };
}

export const calculateAverages = (rows: CruxRow[]) => {


  const avg: Record<MetricKey, number | null> = {
    fcp: null,
    lcp: null,
    cls: null,
    inp: null,
  };

  metrics.forEach(metric => {
    const values = rows
      .map(r => r[metric])
      .filter(v => v != null)
      .map(v => typeof v === "string" ? parseFloat(v) : v);

    if (values.length === 0) {
      avg[metric] = null;
    } else {
      avg[metric] = Number((values.reduce((a,b)=>a+b,0) / values.length).toFixed(2))
    }
  });

  return avg;
};



export const colorScale = (metric: MetricKey, value: number | string | null) => {
  if (value == null) return "grey";

  const num = typeof value === "string" ? parseFloat(value) : value;

  const { good, ni } = RANGES[metric];  // dynamic thresholds for that metric

  if (num > ni) return "red";    // poor
  if (num > good) return "gold"; // needs improvement
  return "green";                // good
};

export const percent = (metric: MetricKey, value: number | string | null) => {
  if (value == null) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;

  const { ni } = RANGES[metric];

  return Math.min(100, (num / ni) * 100);
};

export const ratingText = (metric: keyof typeof RANGES, value: number | string | null) => {
  if (value == null) return "no data";

  const num = typeof value === "string" ? parseFloat(value) : value;
  const { good, ni } = RANGES[metric];

  if (num > ni)   return "poor";
  if (num > good) return "needs improvement";
  return "good";
};


export const calculateQuality = (row: CruxRow) => {

  // if status === error → entire row is POOR
  if (row.status === "error") return "poor";

  // if any metric is null → unknown (cannot judge)
  for (const m of metrics) {
    if (row[m] == null) return "unknown";
  }

  // check each metric vs threshold
  let hasNI = false;
  let hasPoor = false;

  metrics.forEach((m) => {
    const v = typeof row[m] === "string" ? parseFloat(row[m] as string) : row[m]!;
    const { good, ni } = RANGES[m];

    if (v > ni) {
      hasPoor = true;
    } else if (v > good) {
      hasNI = true;
    }
  });

  if (hasPoor) return "poor";
  if (hasNI) return "ni";

  return "good";
};