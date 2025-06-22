import { toZonedTime, format } from "date-fns-tz";

export function formatUTCToLocal(utcString: string, fmt = "yyyy-LL-dd HH:mm") {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const d = toZonedTime(utcString, tz);
  return format(d, fmt, { timeZone: tz });
}
