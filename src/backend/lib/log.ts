function getCurrentTime() {
  return new Date().toISOString();
}

// Logging functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logDebug(identifier: string, message: any) {
  console.log(
    `${getCurrentTime()} [MANAGER] DEBUG: ${identifier} <${typeof message}> ${message}`,
  );
}

export function logInfo(message: string) {
  console.log(`${getCurrentTime()} [MANAGER] INFO: ${message}`);
}

export function logWarn(message: string) {
  console.warn(`${getCurrentTime()} [MANAGER] WARN: ${message}`);
}

export function logError(message: string) {
  console.log(`${getCurrentTime()} [MANAGER] ERROR: ${message}`);
}
