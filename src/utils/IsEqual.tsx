import type { SearchParams } from "store/api.ts";

export function isEqual(searchParams: SearchParams, p: SearchParams) {
  return (
    searchParams === p ||
    Object.entries(searchParams).every(([k, v]) => {
      const v2 = p[k as keyof SearchParams];
      return (
        v === v2 ||
        (Array.isArray(v) &&
          Array.isArray(v2) &&
          v.length === v2?.length &&
          v.every((i, n) => i === v2[n]))
      );
    })
  );
}