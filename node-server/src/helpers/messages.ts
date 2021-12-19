export function errorMessage(message: string) {
  console.log("\x1b[31m", message);
  console.log("\x1b[0m", "");
}

export function successMessage(message: string) {
  console.log("\x1b[32m", message);
  console.log("\x1b[0m", "");
}
