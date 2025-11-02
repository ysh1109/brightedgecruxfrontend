export type CruxRow = {
  id: string;
  url?: string;
  fcp: number | null;
  lcp: number | null;
  cls: number | string | null;
  inp: number | null;
  status?: string;
  errorCode?: number;
  errorMessage?: string;
};

export type MetricKey = "fcp" | "lcp" | "cls" | "inp";

