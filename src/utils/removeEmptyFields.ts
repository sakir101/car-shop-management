export function removeEmptyFields(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
  );
}
