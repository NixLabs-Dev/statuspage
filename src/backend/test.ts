import * as cleaner from "./handlers/cleaner";

async function main() {
  await cleaner.cleanupUptimeEntries();
}

main();
