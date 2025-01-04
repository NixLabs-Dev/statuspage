import cron from "node-cron";
import { logError, logInfo } from "./lib/log";

// Import handlers
import * as uptime from "./handlers/uptime";
import * as mailer from "./handlers/mailer";

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
