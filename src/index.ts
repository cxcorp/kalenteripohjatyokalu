import loadConfig from "./config";
import { authorize, loadCalendars } from "./google-calendar";
import { fetchShiftSchedule } from "./work-shifts";

async function start() {
  const config = await loadConfig();

  const workSchedule = await fetchShiftSchedule(config.JOB_ICS_URL);
  console.log(workSchedule);

  console.log("Authorizing with Google...");
  const gcal = await authorize(config.GCP_SERVICE_ACCOUNT_KEY_FILE);
  console.log("Authorized.");

  console.log("Fetch calendars");
  const calendars = await loadCalendars(config, gcal);
  console.log(calendars);

  const { data: aamuEvents } = await gcal.events.list({
    calendarId: calendars.input1.id!,
    timeMin: "2022-12-26T00:00:00+02:00",
    timeMax: "2023-01-01T23:59:59+02:00",
    maxResults: 2500,
    singleEvents: true,
    orderBy: "startTime",
  });
  console.log(aamuEvents);
}

start();
