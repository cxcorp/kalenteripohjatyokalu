import { calendar_v3, google } from "googleapis";
import { Config } from "./config";

export async function authorize(keyFile: string) {
  const auth = new google.auth.JWT({
    keyFile: keyFile,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  await auth.authorize();

  return google.calendar({ version: "v3", auth });
}

async function listAllCalendars(calendar: calendar_v3.Calendar) {
  let calendars = [];
  let nextPageToken = null;
  do {
    const { data } = await calendar.calendarList.list();
    calendars.push(...(data.items ?? []));

    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return calendars;
}

async function acceptCalendarInvites(
  calendar: calendar_v3.Calendar,
  calendarIds: string[]
) {
  for (const calendarId of calendarIds) {
    console.log(`Accepting shared calendar as service account: ${calendarId}`);
    // TODO: handle 404 when user hasn't invited service account yet
    await calendar.calendarList.insert({ requestBody: { id: calendarId } });
  }
}

export async function loadCalendars(
  config: Config,
  calendar: calendar_v3.Calendar
) {
  let accountCalendars = await listAllCalendars(calendar);

  // If you share a calendar with a user, the calendar doesn't appear in the
  // calendar list until the user accepts the calendar.
  // For Service Accounts, this is done by .insert()ing a calendar with
  // the ID of the calendar that was invited.
  const pendingCalendarIds = [
    config.CALENDAR_OUTPUT_ID,
    config.CALENDAR_INPUT_1_ID,
    config.CALENDAR_INPUT_2_ID,
  ].filter((calendarId) => !accountCalendars.some((c) => c.id === calendarId));

  if (pendingCalendarIds.length > 0) {
    await acceptCalendarInvites(calendar, pendingCalendarIds);
    accountCalendars = await listAllCalendars(calendar);
  }

  return {
    output: accountCalendars.find((c) => c.id === config.CALENDAR_OUTPUT_ID)!,
    input1: accountCalendars.find((c) => c.id === config.CALENDAR_INPUT_1_ID)!,
    input2: accountCalendars.find((c) => c.id === config.CALENDAR_INPUT_2_ID)!,
  };
}
