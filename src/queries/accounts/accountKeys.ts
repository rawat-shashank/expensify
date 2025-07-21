// ---- Query Keys ----
export const accountKeys = {
  all: ["accounts"] as const,
  summaryList: () => [...accountKeys.all, "summaryList"] as const,
  details: (id: number) => [...accountKeys.all, "details", id] as const,
};
