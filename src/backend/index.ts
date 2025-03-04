import cron from "node-cron";
import { logError, logInfo } from "./lib/log";

// Import handlers
import * as uptime from "./handlers/uptime";
import * as mailer from "./handlers/mailer";
import * as cleaner from "./handlers/cleaner";

logInfo("Manager application started");

cron.schedule("* * * * *", async () => {
  try {
    logInfo("Processing uptime items");
    await uptime.handle();
    logInfo("Processing mailer items");
    await mailer.handle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError(error.message);
  }
});

cron.schedule("*/20 * * * *", async () => {
  try {
    logInfo("Processing database cleanup");
    cleaner.cleanupUptimeEntries();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError(error.message);
  }
});
