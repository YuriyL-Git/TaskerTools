export function errorMessage(message: string) {
  console.log("\x1b[31m", message, "\x1b[0m");
  console.log("\x1b[0m", "");
}

export function successMessage(message: string) {
  console.log("\x1b[32m", message, "\x1b[0m");
  console.log("\x1b[0m", "");
}

export function taskerMessage(
  message: string,
  needNewEmptyLine: boolean = true
) {
  console.log("\x1b[34m", message, "\x1b[0m");
  if (needNewEmptyLine) {
    console.log("\x1b[0m", "");
  }
}

export function highlightMessage(
  message: string,
  needNewEmptyLine: boolean = true
) {
  console.log("\x1b[33m", message, "\x1b[0m");
  if (needNewEmptyLine) {
    console.log("\x1b[0m", "");
  }
}
