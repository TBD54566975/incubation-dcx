export function isEmptyString(obj: unknown): obj is string {
  return typeof obj !== 'string' || obj.trim().length === 0;
}
