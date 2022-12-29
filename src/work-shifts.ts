import fetch from "node-fetch";
import ical from "ical";

export async function fetchShiftSchedule(icsUrl: string) {
  const res = await fetch(icsUrl);
  if (res.status !== 200) {
    console.error(res);
    throw new Error(`Job Schedule fetch failed with status ${res.status}`);
  }

  const icsText = await res.text();
  return ical.parseICS(icsText);
}
