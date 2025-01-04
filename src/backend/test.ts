import * as mailer from "./handlers/mailer";

async function main() {
  await mailer.handle();
}

main();
