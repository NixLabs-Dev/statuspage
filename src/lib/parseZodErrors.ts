/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function parseZodErrors(errors: string) {
  const requiredFields = JSON.parse(errors)
    .filter(
      (error: any) =>
        error.code === "invalid_type" && error.received === "undefined",
    )
    .map((error: any) => error.path.join("."));

  return `${requiredFields.join(", ")} are required!`;
}
