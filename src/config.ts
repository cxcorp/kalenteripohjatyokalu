require("dotenv").config();

export default function loadConfig() {
  const {
    JOB_ICS_URL,
    GCP_SERVICE_ACCOUNT_KEY_FILE,
    CALENDAR_OUTPUT_ID,
    CALENDAR_INPUT_1_ID,
    CALENDAR_INPUT_2_ID,
  } = process.env;

  if (!JOB_ICS_URL) throw new Error("JOB_ICS_URL missing");
  if (!GCP_SERVICE_ACCOUNT_KEY_FILE)
    throw new Error("GCP_SERVICE_ACCOUNT_KEY_FILE missing");
  if (!CALENDAR_OUTPUT_ID) throw new Error("CALENDAR_OUTPUT_ID missing");
  if (!CALENDAR_INPUT_1_ID) throw new Error("CALENDAR_INPUT_1_ID missing");
  if (!CALENDAR_INPUT_2_ID) throw new Error("CALENDAR_INPUT_2_ID missing");

  return {
    JOB_ICS_URL,
    GCP_SERVICE_ACCOUNT_KEY_FILE,
    CALENDAR_OUTPUT_ID,
    CALENDAR_INPUT_1_ID,
    CALENDAR_INPUT_2_ID,
  };
}

export type Config = ReturnType<typeof loadConfig>;
